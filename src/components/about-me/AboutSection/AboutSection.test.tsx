import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "./AboutSection";
import { ABOUT_SECTION_TEST_ID } from "./AboutSection.constants";

describe("AboutSection", () => {
  const defaultProps = {
    interests: ["React 19", "TypeScript", "Tailwind CSS"],
    projects: [
      {
        name: "Frontend Blog",
        description: "Personal blog and portfolio UI.",
        href: "https://github.com/wojcio116/frontend-blog",
      },
      {
        name: "Backend Blog API",
        description: "REST API serving blog articles.",
        href: "https://github.com/wojcio116/backend-blog",
      },
    ],
    note: "Always learning new frontend patterns.",
  };

  describe("Given interests, projects, and an optional note", () => {
    describe("When rendered", () => {
      it("Then displays all interest badges, project cards, and the info note", () => {
        render(<AboutSection {...defaultProps} />);

        expect(screen.getByTestId(ABOUT_SECTION_TEST_ID)).toBeInTheDocument();
        expect(screen.getByText("React 19")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();

        expect(
          screen.getByRole("heading", { level: 3, name: "Frontend Blog" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("heading", { level: 3, name: "Backend Blog API" }),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Always learning new frontend patterns."),
        ).toBeInTheDocument();
      });

      it("Then allows keyboard focus on every project repository link in order", () => {
        render(<AboutSection {...defaultProps} />);

        const repoLinks = screen.getAllByRole("link", {
          name: /view repository/i,
        });
        expect(repoLinks).toHaveLength(2);

        repoLinks[0].focus();
        expect(repoLinks[0]).toHaveFocus();

        repoLinks[1].focus();
        expect(repoLinks[1]).toHaveFocus();
      });
    });
  });

  describe("Given the optional note is omitted", () => {
    describe("When rendered", () => {
      it("Then renders sections without the note banner", () => {
        render(
          <AboutSection
            interests={defaultProps.interests}
            projects={defaultProps.projects}
          />,
        );

        expect(
          screen.queryByText("Always learning new frontend patterns."),
        ).not.toBeInTheDocument();
      });
    });
  });
});
