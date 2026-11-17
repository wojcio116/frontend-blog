import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { ArticlePageView } from "./ArticlePage";

const meta = {
  title: "Article/ArticlePage",
  component: ArticlePageView,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    onRetry: () => {},
  },
} satisfies Meta<typeof ArticlePageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    state: { status: "loading" },
  },
};

export const Success: Story = {
  args: {
    state: {
      status: "success",
      article: {
        id: "article-1",
        title: "Building Accessible Interfaces with React 19",
        text: "First paragraph explaining why semantic HTML and keyboard navigation are essential for every web application.\n\nSecond paragraph demonstrating how multiple paragraphs are preserved cleanly on the article page.\n\nThird paragraph wrapping up the key takeaways.",
        publishedAt: "2026-11-17T10:00:00.000Z",
      },
    },
  },
};

export const WithEscapedHtmlContent: Story = {
  args: {
    state: {
      status: "success",
      article: {
        id: "article-xss",
        title: "Safe Rendering of Untrusted Text",
        text: 'Any HTML tags inside the article text must render literally:\n\n<script>alert("XSS")</script>\n\n<b>Bold tag rendered as plain text</b>',
        publishedAt: "2026-11-17T12:00:00.000Z",
      },
    },
  },
};

export const NotFound: Story = {
  args: {
    state: { status: "not-found" },
  },
};

export const ErrorState: Story = {
  args: {
    state: {
      status: "error",
      message:
        "Could not load this article right now. Please check your connection and try again.",
    },
  },
};
