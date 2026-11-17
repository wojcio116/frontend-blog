import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as articlesApi from "../../../services/api/client/articlesApi";
import { AboutMePage } from "./AboutMePage";

describe("AboutMePage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Given a visitor opens the home page", () => {
    describe("When the page renders", () => {
      it("Then displays the author's name, about sections, and articles from the API", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValueOnce([
          {
            id: "1",
            title: "My First Blog Post",
            text: "Hello world from the API.",
            publishedAt: "2026-11-17T10:00:00.000Z",
          },
        ]);

        render(<AboutMePage />);

        const mainHeading = screen.getByRole("heading", { level: 1 });
        expect(mainHeading).toHaveTextContent("Wojciech Nizborski");
        expect(
          screen.getByText("Interests & Technologies"),
        ).toBeInTheDocument();
        expect(screen.getByText("What I Have Built")).toBeInTheDocument();
        expect(screen.getByText("Latest Articles")).toBeInTheDocument();

        expect(
          await screen.findByRole("heading", {
            level: 3,
            name: "My First Blog Post",
          }),
        ).toBeInTheDocument();
      });

      it("Then keeps the rest of the page working normally even when the blog fails to load", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockRejectedValueOnce(
          new Error("API offline"),
        );

        render(<AboutMePage />);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "Wojciech Nizborski",
        );
        expect(
          screen.getByText("Interests & Technologies"),
        ).toBeInTheDocument();
        expect(
          await screen.findByRole("button", { name: "Try again" }),
        ).toBeInTheDocument();
      });
    });
  });
});
