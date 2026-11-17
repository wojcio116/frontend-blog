import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as articlesApi from "../../../services/api/client/articlesApi";
import { BlogSection, BlogSectionView } from "./BlogSection";
import {
  BLOG_EMPTY_TEST_ID,
  BLOG_ERROR_TEST_ID,
  BLOG_LOADING_TEST_ID,
  BLOG_SECTION_TEST_ID,
} from "./BlogSection.constants";

describe("BlogSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Given the articles are currently loading", () => {
    describe("When BlogSection renders", () => {
      it("Then shows a visible loading state", () => {
        vi.spyOn(articlesApi, "fetchArticles").mockImplementation(
          () => new Promise(() => {}),
        );

        render(<BlogSection />);

        expect(screen.getByTestId(BLOG_SECTION_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(BLOG_LOADING_TEST_ID)).toBeInTheDocument();
        expect(screen.getByText("Loading articles...")).toBeInTheDocument();
      });
    });
  });

  describe("Given the API answers with articles", () => {
    describe("When BlogSection finishes loading", () => {
      it("Then displays every article newest first with its title and formatted date", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValueOnce([
          {
            id: "2",
            title: "Newest Article",
            text: "Latest content",
            publishedAt: "2026-11-16T09:00:00.000Z",
          },
          {
            id: "1",
            title: "Older Article",
            text: "Earlier content",
            publishedAt: "2026-11-05T09:00:00.000Z",
          },
        ]);

        render(<BlogSection />);

        const headings = await screen.findAllByRole("heading", { level: 3 });
        expect(headings.map((h) => h.textContent)).toEqual([
          "Newest Article",
          "Older Article",
        ]);
        expect(screen.getByText("Nov 16, 2026")).toBeInTheDocument();
        expect(screen.getByText("Nov 5, 2026")).toBeInTheDocument();
      });
    });
  });

  describe("Given the API answers with an empty list", () => {
    describe("When BlogSection finishes loading", () => {
      it("Then displays a message that there are no articles yet", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValueOnce([]);

        render(<BlogSection />);

        expect(
          await screen.findByTestId(BLOG_EMPTY_TEST_ID),
        ).toBeInTheDocument();
        expect(
          screen.getByText("There are no articles yet. Check back soon!"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Given the API is down, errors, times out, or returns an invalid schema", () => {
    describe("When BlogSection fails to load articles", () => {
      it("Then displays an error message and a Try again button", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockRejectedValueOnce(
          new Error("Network Error"),
        );

        render(<BlogSection />);

        expect(
          await screen.findByTestId(BLOG_ERROR_TEST_ID),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Could not load articles right now/i),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Try again" }),
        ).toBeInTheDocument();
      });

      it("Then shows the same error state when response does not match the schema", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockRejectedValueOnce(
          new Error("Received invalid articles payload from API"),
        );

        render(<BlogSection />);

        expect(
          await screen.findByTestId(BLOG_ERROR_TEST_ID),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Try again" }),
        ).toBeInTheDocument();
      });
    });

    describe("When the visitor clicks Try again", () => {
      it("Then reloads articles and renders them on success", async () => {
        const fetchSpy = vi
          .spyOn(articlesApi, "fetchArticles")
          .mockRejectedValueOnce(new Error("Timeout"))
          .mockResolvedValueOnce([
            {
              id: "10",
              title: "Recovered Article",
              text: "Loaded after retry",
              publishedAt: "2026-11-17T10:00:00.000Z",
            },
          ]);

        render(<BlogSection />);

        const retryButton = await screen.findByRole("button", {
          name: "Try again",
        });
        fireEvent.click(retryButton);

        expect(
          await screen.findByRole("heading", {
            level: 3,
            name: "Recovered Article",
          }),
        ).toBeInTheDocument();
        expect(fetchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Given the visitor leaves the page before the API responds", () => {
    describe("When BlogSection unmounts while a request is in flight", () => {
      it("Then aborts the request and logs no console errors or warnings", async () => {
        const errorSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

        let capturedSignal: AbortSignal | undefined;
        let rejectRequest: ((reason?: unknown) => void) | undefined;

        vi.spyOn(articlesApi, "fetchArticles").mockImplementationOnce(
          (signal) => {
            capturedSignal = signal;
            return new Promise((_, reject) => {
              rejectRequest = reject;
            });
          },
        );

        const { unmount } = render(<BlogSection />);
        expect(capturedSignal?.aborted).toBe(false);

        unmount();
        expect(capturedSignal?.aborted).toBe(true);

        rejectRequest?.({ code: "ERR_CANCELED" });
        const secondMount = render(<BlogSection />);
        let resolveLate: ((value: articlesApi.Article[]) => void) | undefined;
        vi.spyOn(articlesApi, "fetchArticles").mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveLate = resolve;
            }),
        );
        secondMount.unmount();

        const thirdMount = render(<BlogSection />);
        thirdMount.unmount();
        resolveLate?.([]);
        await waitFor(() => {
          expect(errorSpy).not.toHaveBeenCalled();
          expect(warnSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("Given an article has a very long title or non-ISO fallback date", () => {
    describe("When BlogSectionView renders", () => {
      it("Then applies wrapping classes so long titles wrap without horizontal overflow", () => {
        const longTitle =
          "VeryLongUnbrokenTitleWithoutSpacesThatShouldWrapCleanlyInsideTheCardContainer";

        render(
          <BlogSectionView
            onRetry={() => {}}
            state={{
              status: "success",
              articles: [
                {
                  id: "long-1",
                  title: longTitle,
                  text: "Content",
                  publishedAt: "invalid-date-fallback",
                },
              ],
            }}
          />,
        );

        const heading = screen.getByRole("heading", {
          level: 3,
          name: longTitle,
        });
        expect(heading).toHaveClass("break-words");
        expect(screen.getByText("invalid-date-fallback")).toBeInTheDocument();
      });
    });
  });
});
