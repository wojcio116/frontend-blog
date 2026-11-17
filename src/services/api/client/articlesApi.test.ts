import { describe, expect, it, vi } from "vitest";
import {
  ARTICLES_ENDPOINT,
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
});
