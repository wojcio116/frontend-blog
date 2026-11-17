import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArticleRoutePage from "../../../pages/articles.$id";
import * as articlesApi from "../../../services/api/client/articlesApi";
import { httpClient } from "../../../services/api/client/httpClient";
import { ArticlePageView } from "./ArticlePage";

vi.mock("../../../services/api/client/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const renderArticleRoute = (initialEntries: string[]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <div>About Me Home</div>,
      },
      {
        path: "/articles/:id",
        element: <ArticleRoutePage />,
      },
    ],
    { initialEntries },
  );

  return {
    router,
    ...render(<RouterProvider router={router} />),
  };
};

describe("ArticlePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  describe("Given the article is currently loading", () => {
    describe("When a visitor opens the article page", () => {
      it("Then shows a visible loading state and scrolls to the top", () => {
        vi.mocked(httpClient.get).mockImplementation(
          () => new Promise(() => {}),
        );

        renderArticleRoute(["/articles/42"]);

        expect(screen.getByRole("status")).toHaveTextContent(
          /loading article/i,
        );
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });
  });

  describe("Given the API answers with the article", () => {
    describe("When a visitor opens the article address directly from a bookmark", () => {
      it("Then loads and displays the full article with its paragraphs kept", async () => {
        vi.mocked(httpClient.get).mockResolvedValueOnce({
          data: {
            id: "42",
            title: "Deep Dive into React Router 7",
            text: "Opening paragraph.\n\nSecond paragraph with details.\n\nClosing paragraph.",
            publishedAt: "2026-11-17T08:00:00.000Z",
          },
        });

        renderArticleRoute(["/articles/42"]);

        expect(
          await screen.findByRole("heading", {
            name: "Deep Dive into React Router 7",
          }),
        ).toBeInTheDocument();
        expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
        expect(
          screen.getByText("Second paragraph with details."),
        ).toBeInTheDocument();
        expect(screen.getByText("Closing paragraph.")).toBeInTheDocument();
      });
    });

    describe("When the content contains HTML such as <script> or <b>", () => {
      it("Then renders the text literally and never executes a script", async () => {
        const maliciousText =
          "<script>window.__xssTriggered = true;</script><b>Bold markup</b>";
        vi.mocked(httpClient.get).mockResolvedValueOnce({
          data: {
            id: "xss-1",
            title: "XSS Safety Check",
            text: maliciousText,
            publishedAt: "2026-11-17T08:00:00.000Z",
          },
        });

        renderArticleRoute(["/articles/xss-1"]);

        expect(await screen.findByText(maliciousText)).toBeInTheDocument();
        expect(document.querySelector("article script")).toBeNull();
        expect(
          (window as unknown as Record<string, unknown>).__xssTriggered,
        ).toBeUndefined();
      });
    });
  });

  describe("Given the article does not exist or the address has an invalid ID", () => {
    describe("When the API returns 404", () => {
      it("Then displays a not-found message and a way back", async () => {
        vi.mocked(httpClient.get).mockRejectedValueOnce({
          isAxiosError: true,
          response: { status: 404 },
        });

        renderArticleRoute(["/articles/missing-id"]);

        expect(
          await screen.findByText(/does not exist or the link is invalid/i),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: /return to about me/i }),
        ).toHaveAttribute("href", "/");
      });
    });

    describe("When the URL has an invalid ID format", () => {
      it("Then displays a not-found message immediately without calling API", async () => {
        renderArticleRoute(["/articles/invalid$id!"]);

        expect(
          await screen.findByText(/does not exist or the link is invalid/i),
        ).toBeInTheDocument();
        expect(httpClient.get).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given the API is down, errors, or returns a wrong shape", () => {
    describe("When the visitor opens the page and clicks Try again", () => {
      it("Then shows an error message and recovers when retry succeeds", async () => {
        const user = userEvent.setup();

        vi.mocked(httpClient.get)
          .mockResolvedValueOnce({ data: { wrongShape: true } })
          .mockResolvedValueOnce({
            data: {
              id: "42",
              title: "Recovered Article",
              text: "Loaded after retry.",
              publishedAt: "2026-11-17T08:00:00.000Z",
            },
          });

        renderArticleRoute(["/articles/42"]);

        expect(
          await screen.findByText(/could not load this article right now/i),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /try again/i }));

        expect(
          await screen.findByRole("heading", { name: "Recovered Article" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Given the visitor goes from one article to another", () => {
    describe("When navigating to a new article ID", () => {
      it("Then never shows the old article under the new address", async () => {
        vi.mocked(httpClient.get).mockResolvedValueOnce({
          data: {
            id: "1",
            title: "First Article Title",
            text: "First article body",
            publishedAt: "2026-11-16T08:00:00.000Z",
          },
        });

        const { router } = renderArticleRoute(["/articles/1"]);
        expect(
          await screen.findByRole("heading", { name: "First Article Title" }),
        ).toBeInTheDocument();

        vi.mocked(httpClient.get).mockImplementationOnce(
          () => new Promise(() => {}),
        );
        await router.navigate("/articles/2");

        await waitFor(() => {
          expect(
            screen.queryByText("First Article Title"),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText("First article body"),
          ).not.toBeInTheDocument();
          expect(screen.getByRole("status")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Given the visitor leaves the page while a request is in flight", () => {
    describe("When ArticlePage unmounts", () => {
      it("Then aborts the request and ignores late responses or cancellations", async () => {
        let capturedSignal: AbortSignal | undefined;
        let rejectRequest: ((reason?: unknown) => void) | undefined;

        const fetchSpy = vi
          .spyOn(articlesApi, "fetchArticleById")
          .mockImplementationOnce((_id, signal) => {
            capturedSignal = signal;
            return new Promise((_, reject) => {
              rejectRequest = reject;
            });
          });

        const firstMount = renderArticleRoute(["/articles/55"]);
        expect(capturedSignal?.aborted).toBe(false);

        firstMount.unmount();
        expect(capturedSignal?.aborted).toBe(true);
        rejectRequest?.({ code: "ERR_CANCELED" });

        let resolveLate:
          | ((article: {
              id: string;
              title: string;
              text: string;
              publishedAt: string;
            }) => void)
          | undefined;
        fetchSpy.mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveLate = resolve;
            }),
        );

        const secondMount = renderArticleRoute(["/articles/56"]);
        secondMount.unmount();
        resolveLate?.({
          id: "56",
          title: "Late",
          text: "Body",
          publishedAt: "2026-11-17T08:00:00.000Z",
        });

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(2);
        });
        fetchSpy.mockRestore();
      });
    });
  });

  describe("Given an article has a non-ISO fallback date", () => {
    describe("When ArticlePageView renders", () => {
      it("Then displays the raw date string safely", () => {
        const router = createMemoryRouter([
          {
            path: "/",
            element: (
              <ArticlePageView
                onRetry={() => {}}
                state={{
                  status: "success",
                  article: {
                    id: "fallback-1",
                    title: "Fallback Date Article",
                    text: "Single paragraph.",
                    publishedAt: "invalid-date-fallback",
                  },
                }}
              />
            ),
          },
        ]);

        render(<RouterProvider router={router} />);
        expect(screen.getByText("invalid-date-fallback")).toBeInTheDocument();
      });
    });
  });
});
