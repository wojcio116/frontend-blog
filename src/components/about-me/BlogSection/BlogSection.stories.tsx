import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { BlogSectionView } from "./BlogSection";

const SAMPLE_ARTICLES = [
  {
    id: "5e1f0a2b-0002-4000-8000-000000000002",
    title: "Validating API Responses with Zod and TypeScript",
    text: "Runtime schema validation ensures broken payloads never reach your UI components.",
    publishedAt: "2026-11-15T10:00:00.000Z",
  },
  {
    id: "5e1f0a2b-0001-4000-8000-000000000001",
    title: "Building a Clean NestJS API",
    text: "Structuring modules, repositories, and functional tests for maintainable backend services.",
    publishedAt: "2026-11-10T12:00:00.000Z",
  },
];

const meta = {
  title: "about-me/BlogSection",
  component: BlogSectionView,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onRetry: () => {},
  },
} satisfies Meta<typeof BlogSectionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithArticles: Story = {
  args: {
    state: {
      status: "success",
      articles: SAMPLE_ARTICLES,
    },
  },
};

export const Loading: Story = {
  args: {
    state: {
      status: "loading",
    },
  },
};

export const Empty: Story = {
  args: {
    state: {
      status: "success",
      articles: [],
    },
  },
};

export const ErrorState: Story = {
  args: {
    state: {
      status: "error",
      message:
        "Could not load articles right now. Please check your connection and try again.",
    },
  },
};

export const InvalidSchemaError: Story = {
  args: {
    state: {
      status: "error",
      message:
        "Could not load articles right now. Please check your connection and try again.",
    },
  },
};

export const VeryLongTitle: Story = {
  args: {
    state: {
      status: "success",
      articles: [
        {
          id: "5e1f0a2b-0003-4000-8000-000000000003",
          title:
            "SupercalifragilisticexpialidociousExtremelyLongUnbrokenArticleTitleWithoutSpacesThatMustWrapProperlyWithoutHorizontalScrolling",
          text: "Testing layout resilience when an article title contains long unbroken strings.",
          publishedAt: "2026-11-17T08:30:00.000Z",
        },
      ],
    },
  },
};
