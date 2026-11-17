import { InfoMessage, Section } from "@gi-org-pl/athena";
import { Link } from "react-router";
import {
  ARTICLE_CONTENT_TEST_ID,
  ARTICLE_ERROR_TEST_ID,
  ARTICLE_LOADING_TEST_ID,
  ARTICLE_NOT_FOUND_TEST_ID,
  ARTICLE_PAGE_TEST_ID,
} from "./ArticlePage.constants";
import { type ArticleState, useArticle } from "./useArticle";

export interface ArticlePageViewProps {
  state: ArticleState;
  onRetry: () => void;
}

const formatArticleDate = (isoDate: string): string => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
};

const splitParagraphs = (text: string): string[] => {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
};

export const ArticlePageView = ({ state, onRetry }: ArticlePageViewProps) => {
  return (
    <main
      data-testid={ARTICLE_PAGE_TEST_ID}
      className="min-h-screen w-full overflow-x-hidden bg-gi-light-gray px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-6">
        <nav aria-label="Article navigation">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-gi-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gi-primary"
          >
            ← Back to About Me
          </Link>
        </nav>

        {state.status === "loading" && (
          <Section title="Article">
            <div
              data-testid={ARTICLE_LOADING_TEST_ID}
              role="status"
              aria-live="polite"
              className="flex flex-col gap-3"
            >
              <p className="text-sm font-medium text-gi-dark-gray">
                Loading article...
              </p>
              <div
                aria-hidden="true"
                className="h-8 w-2/3 animate-pulse rounded bg-gi-dark-ash/40"
              />
              <div
                aria-hidden="true"
                className="h-32 w-full animate-pulse rounded bg-gi-dark-ash/40"
              />
            </div>
          </Section>
        )}

        {state.status === "not-found" && (
          <Section title="Article not found">
            <div
              data-testid={ARTICLE_NOT_FOUND_TEST_ID}
              role="alert"
              className="flex flex-col items-start gap-4"
            >
              <InfoMessage variant="warning">
                The article you are looking for does not exist or the link is
                invalid.
              </InfoMessage>
              <Link
                to="/"
                className="inline-flex items-center rounded-md bg-gi-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gi-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gi-primary"
              >
                Return to About Me
              </Link>
            </div>
          </Section>
        )}

        {state.status === "error" && (
          <Section title="Unable to load article">
            <div
              data-testid={ARTICLE_ERROR_TEST_ID}
              role="alert"
              className="flex flex-col items-start gap-3"
            >
              <InfoMessage variant="error">{state.message}</InfoMessage>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex cursor-pointer items-center rounded-md bg-gi-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gi-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gi-primary"
              >
                Try again
              </button>
            </div>
          </Section>
        )}

        {state.status === "success" && (
          <article
            data-testid={ARTICLE_CONTENT_TEST_ID}
            className="min-w-0 rounded-lg border border-gi-dark-ash bg-white p-6 shadow-xs sm:p-8"
          >
            <header className="border-b border-gi-dark-ash pb-4">
              <time
                dateTime={state.article.publishedAt}
                className="block text-xs font-medium text-gi-dark-gray"
              >
                {formatArticleDate(state.article.publishedAt)}
              </time>
              <h1 className="mt-2 break-words wrap-anywhere text-2xl font-bold text-gi-dark-primary sm:text-3xl">
                {state.article.title}
              </h1>
            </header>

            <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-gi-dark-gray">
              {splitParagraphs(state.article.text).map((paragraph, index) => (
                <p
                  key={`${state.article.id}-paragraph-${index}`}
                  className="break-words wrap-anywhere whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export interface ArticlePageProps {
  articleId: string;
}

export const ArticlePage = ({ articleId }: ArticlePageProps) => {
  const { state, retry } = useArticle(articleId);
  return <ArticlePageView state={state} onRetry={retry} />;
};
