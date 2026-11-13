import type { Meta, StoryObj } from "@storybook/react-vite";
import reactLogo from "../../../assets/vectors/react.svg";
import { AuthorHero } from "./AuthorHero";

const meta = {
  title: "about-me/AuthorHero",
  component: AuthorHero,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthorHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Wojciech Nizborski",
    role: "Frontend Developer Intern",
    bio: "I enjoy building clean, accessible, and responsive web applications with React, TypeScript, and Tailwind CSS.",
    links: [
      { label: "GitHub Profile", href: "https://github.com/wojcio116" },
      {
        label: "Frontend Blog",
        href: "https://github.com/wojcio116/frontend-blog",
      },
    ],
  },
};

export const WithAvatarImage: Story = {
  args: {
    ...Default.args,
    avatarUrl: reactLogo,
    avatarAlt: "Wojciech Nizborski avatar",
  },
};

export const LongNameAndWords: Story = {
  args: {
    name: "WojciechVeryLongUnbrokenSurnameNizborskiTestingOverflowBehavior",
    role: "Frontend Engineer",
    bio: "TestingSuperLongContinuousWordInBioParagraphToEnsureCleanLineWrappingOnNarrowScreens.",
    links: [{ label: "GitHub", href: "https://github.com/wojcio116" }],
  },
};

export const WithoutLinks: Story = {
  args: {
    name: "Wojciech Nizborski",
    role: "Software Developer",
    bio: "Focused on frontend architecture, testing, and accessible UI components.",
  },
};
