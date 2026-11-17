import { AxiosError } from "axios";
import { describe, expect, it, vi } from "vitest";
import {
  ARTICLES_ENDPOINT,
  ArticleNotFoundError,
  fetchArticleById,
  fetchArticles,
  sortArticlesNewestFirst,
} from "./articlesApi";
import { httpClient } from "./httpClient";

describe("articlesApi", () => {
  describe("Given articles in arbitrary order", () => {
    describe("When sortArticlesNewestFirst is called", () => {
      it("Then returns articles sorted from newest to oldest", () => {
        const older = {
          id: "1",
          title: "Older",
          text: "Older text",
          publishedAt: "2026-11-01T10:00:00.000Z",
        };
        const newer = {
          id: "2",
          title: "Newer",
          text: "Newer text",
          publishedAt: "2026-11-15T10:00:00.000Z",
        };

        const sorted = sortArticlesNewestFirst([older, newer]);
        expect(sorted.map((item) => item.id)).toEqual(["2", "1"]);
      });
    });
  });

  describe("Given the API returns valid articles", () => {
    describe("When fetchArticles is called", () => {
      it("Then fetches from /api/v1/articles and returns them newest first", async () => {
        const getSpy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({
          data: [
            {
              id: "1",
              title: "First",
              text: "Body 1",
              publishedAt: "2026-11-01T10:00:00.000Z",
            },
            {
              id: "2",
              title: "Second",
              text: "Body 2",
              publishedAt: "2026-11-10T10:00:00.000Z",
            },
          ],
        });

        const controller = new AbortController();
        const result = await fetchArticles(controller.signal);

        expect(getSpy).toHaveBeenCalledWith(ARTICLES_ENDPOINT, {
          signal: controller.signal,
        });
        expect(result.map((a) => a.title)).toEqual(["Second", "First"]);

        getSpy.mockRestore();
      });
    });
  });

  describe("Given the API returns data in the wrong shape", () => {
    describe("When fetchArticles is called", () => {
      it("Then throws a validation error and never returns broken data", async () => {
        const getSpy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({
          data: [{ id: "1", title: "Missing text and publishedAt" }],
        });

        await expect(fetchArticles()).rejects.toThrow(
          "Received invalid articles payload from API",
        );

        getSpy.mockRestore();
      });
    });
  });

  describe("Given single article requests", () => {
    describe("When fetchArticleById is called with a valid ID", () => {
      it("Then fetches and validates the single article", async () => {
        const article = {
          id: "article-42",
          title: "Single Article",
          text: "Full article body",
          publishedAt: "2026-11-17T10:00:00.000Z",
        };
        const getSpy = vi
          .spyOn(httpClient, "get")
          .mockResolvedValueOnce({ data: article });

        const controller = new AbortController();
        const result = await fetchArticleById("article-42", controller.signal);

        expect(getSpy).toHaveBeenCalledWith(`${ARTICLES_ENDPOINT}/article-42`, {
          signal: controller.signal,
        });
        expect(result).toEqual(article);

        getSpy.mockRestore();
      });
    });

    describe("When fetchArticleById receives an invalid ID format", () => {
      it("Then throws ArticleNotFoundError without calling HTTP client", async () => {
        const getSpy = vi.spyOn(httpClient, "get");

        await expect(fetchArticleById("bad/id!")).rejects.toBeInstanceOf(
          ArticleNotFoundError,
        );
        expect(getSpy).not.toHaveBeenCalled();

        getSpy.mockRestore();
      });
    });

    describe("When the API returns 404 or 400", () => {
      it("Then throws ArticleNotFoundError", async () => {
        const axios404 = new AxiosError(
          "Not Found",
          "ERR_BAD_REQUEST",
          undefined,
          undefined,
          {
            status: 404,
            statusText: "Not Found",
            headers: {},
            config: {} as never,
            data: {},
          },
        );
        const getSpy = vi
          .spyOn(httpClient, "get")
          .mockRejectedValueOnce(axios404);

        await expect(fetchArticleById("missing")).rejects.toBeInstanceOf(
          ArticleNotFoundError,
        );

        getSpy.mockRestore();
      });
    });

    describe("When the API returns an invalid shape or network error", () => {
      it("Then throws an error for invalid shape", async () => {
        const getSpy = vi
          .spyOn(httpClient, "get")
          .mockResolvedValueOnce({ data: { id: "1" } });

        await expect(fetchArticleById("1")).rejects.toThrow(
          "Received invalid article payload from API",
        );

        getSpy.mockRestore();
      });

      it("Then rethrows unexpected errors", async () => {
        const getSpy = vi
          .spyOn(httpClient, "get")
          .mockRejectedValueOnce(new Error("Connection reset"));

        await expect(fetchArticleById("1")).rejects.toThrow("Connection reset");

        getSpy.mockRestore();
      });
    });
  });
});
