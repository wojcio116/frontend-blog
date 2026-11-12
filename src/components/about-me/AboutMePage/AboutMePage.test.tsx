import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutMePage } from "./AboutMePage";

describe("AboutMePage", () => {
  describe("Given a visitor opens the home page", () => {
    describe("When the page renders", () => {
      it("Then displays the author's name as the main h1 heading and all sections", () => {
        render(<AboutMePage />);

        const mainHeading = screen.getByRole("heading", { level: 1 });
        expect(mainHeading).toHaveTextContent("Wojciech Nizborski");
        expect(
          screen.getByText("Interests & Technologies"),
        ).toBeInTheDocument();
        expect(screen.getByText("What I Have Built")).toBeInTheDocument();
      });
    });
  });
});
