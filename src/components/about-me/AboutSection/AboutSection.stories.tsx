import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutSection } from "./AboutSection";

const meta = {
  title: "about-me/AboutSection",
  component: AboutSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AboutSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    interests: [
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Web Accessibility",
      "Automated Testing",
    ],
    projects: [
      {
        name: "Frontend Blog",
        description:
          "Responsive personal website and blog built with React Router, Tailwind CSS, and Athena.",
        href: "https://github.com/wojcio116/frontend-blog",
      },
      {
        name: "Backend Blog API",
        description:
          "RESTful backend service powering article storage and retrieval.",
        href: "https://github.com/wojcio116/backend-blog",
      },
    ],
    note: "Reach out via GitHub if you would like to connect or collaborate on open-source projects.",
  },
};

export const WithoutNote: Story = {
  args: {
    interests: Default.args.interests,
    projects: Default.args.projects,
  },
};

export const LongTextWrapping: Story = {
  args: {
    interests: ["VeryLongContinuousInterestTagWithoutAnySpacesToTestWrapping"],
    projects: [
      {
        name: "SuperLongProjectNameWithoutSpacesToVerifyNoHorizontalOverflow",
        description:
          "SuperLongProjectDescriptionWordWithoutSpacesToTestResponsiveCardBoundariesOnSmallScreens.",
        href: "https://github.com/wojcio116/frontend-blog",
      },
    ],
  },
};
