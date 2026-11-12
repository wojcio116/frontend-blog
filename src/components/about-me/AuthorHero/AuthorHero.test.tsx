import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthorHero } from "./AuthorHero";
import {
  AUTHOR_AVATAR_IMAGE_TEST_ID,
  AUTHOR_DECORATIVE_BADGE_TEST_ID,
  AUTHOR_HERO_TEST_ID,
} from "./AuthorHero.constants";

describe("AuthorHero", () => {
  describe("Given default author props with links", () => {
    const defaultProps = {
      name: "Wojciech Nizborski",
      role: "Frontend Intern",
      bio: "Building accessible interfaces with React and Tailwind CSS.",
      links: [
        { label: "GitHub", href: "https://github.com/wojcio116" },
        {
          label: "Frontend Repo",
          href: "https://github.com/wojcio116/frontend-blog",
        },
      ],
    };

    describe("When the component is rendered", () => {
      it("Then displays the author name as the main h1 heading", () => {
        render(<AuthorHero {...defaultProps} />);

        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent("Wojciech Nizborski");
        expect(screen.getByTestId(AUTHOR_HERO_TEST_ID)).toBeInTheDocument();
      });

      it("Then renders the role badge, bio, and decorative element", () => {
        render(<AuthorHero {...defaultProps} />);

        expect(screen.getByText("Frontend Intern")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Building accessible interfaces with React and Tailwind CSS.",
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(AUTHOR_DECORATIVE_BADGE_TEST_ID),
        ).toHaveAttribute("aria-hidden", "true");
      });

      it("Then renders all links in reading order and allows keyboard focus", () => {
        render(<AuthorHero {...defaultProps} />);

        const renderedLinks = screen.getAllByRole("link");
        expect(renderedLinks).toHaveLength(2);
        expect(renderedLinks[0]).toHaveTextContent("GitHub");
        expect(renderedLinks[1]).toHaveTextContent("Frontend Repo");

        renderedLinks[0].focus();
        expect(renderedLinks[0]).toHaveFocus();

        renderedLinks[1].focus();
        expect(renderedLinks[1]).toHaveFocus();
      });
    });
  });

  describe("Given an avatarUrl is provided", () => {
    describe("When custom avatarAlt is passed", () => {
      it("Then renders an image with the provided alt text", () => {
        render(
          <AuthorHero
            name="Wojciech Nizborski"
            role="Developer"
            bio="Bio text"
            avatarUrl="/avatar.png"
            avatarAlt="Custom portrait alt"
          />,
        );

        const image = screen.getByTestId(AUTHOR_AVATAR_IMAGE_TEST_ID);
        expect(image).toHaveAttribute("alt", "Custom portrait alt");
      });
    });

    describe("When avatarAlt is omitted", () => {
      it("Then falls back to a descriptive default alt text", () => {
        render(
          <AuthorHero
            name="Wojciech Nizborski"
            role="Developer"
            bio="Bio text"
            avatarUrl="/avatar.png"
          />,
        );

        const image = screen.getByTestId(AUTHOR_AVATAR_IMAGE_TEST_ID);
        expect(image).toHaveAttribute("alt", "Wojciech Nizborski portrait");
      });
    });
  });

  describe("Given an extremely long unbroken name", () => {
    describe("When rendered", () => {
      it("Then applies word-wrapping classes so text does not overflow", () => {
        const veryLongName =
          "SupercalifragilisticexpialidociousDeveloperNameWithoutSpaces";
        render(
          <AuthorHero
            name={veryLongName}
            role="Intern"
            bio="LongWordWithoutSpacesInDescriptionToVerifyWrappingBehavior"
          />,
        );

        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent(veryLongName);
        expect(heading.className).toContain("break-words");
      });
    });
  });
});
