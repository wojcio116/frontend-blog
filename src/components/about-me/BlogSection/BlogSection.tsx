import { InfoMessage, Section } from "@gi-org-pl/athena";
import type { Article } from "../../../services/api/schemas/article.schema";
import {
  BLOG_EMPTY_TEST_ID,
  BLOG_ERROR_TEST_ID,
  BLOG_LOADING_TEST_ID,
  BLOG_SECTION_TEST_ID,
} from "./BlogSection.constants";
import { type ArticlesState, useArticles } from "./useArticles";

export interface BlogSectionViewProps {
  state: ArticlesState;
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

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="flex min-w-0 flex-col justify-between rounded-lg border border-gi-dark-ash bg-gi-light-gray p-4">
      <div className="min-w-0">
        <time
          dateTime={article.publishedAt}
          className="block text-xs font-medium text-gi-dark-gray"
        >
          {formatArticleDate(article.publishedAt)}
        </time>
        <h3 className="mt-1 break-words wrap-anywhere text-lg font-semibold text-gi-dark-primary">
          {article.title}
        </h3>
        {article.text && (
          <p className="mt-2 line-clamp-3 break-words wrap-anywhere text-sm leading-relaxed text-gi-dark-gray">
            {article.text}
          </p>
        )}
      </div>
    </article>
  );
};

export const BlogSectionView = ({ state, onRetry }: BlogSectionViewProps) => {
  return (
    <div data-testid={BLOG_SECTION_TEST_ID} className="w-full min-w-0">
      <Section title="Latest Articles">
        {state.status === "loading" && (
          <div
            data-testid={BLOG_LOADING_TEST_ID}
            role="status"
            aria-live="polite"
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-medium text-gi-dark-gray">
              Loading articles...
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                aria-hidden="true"
                className="h-28 animate-pulse rounded-lg border border-gi-dark-ash bg-gi-light-gray/70"
              />
              <div
                aria-hidden="true"
                className="h-28 animate-pulse rounded-lg border border-gi-dark-ash bg-gi-light-gray/70"
              />
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div
            data-testid={BLOG_ERROR_TEST_ID}
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
        )}

        {state.status === "success" && state.articles.length === 0 && (
          <div data-testid={BLOG_EMPTY_TEST_ID}>
            <InfoMessage variant="info">
              There are no articles yet. Check back soon!
            </InfoMessage>
          </div>
        )}

        {state.status === "success" && state.articles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {state.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export const BlogSection = () => {
  const { state, retry } = useArticles();
  return <BlogSectionView state={state} onRetry={retry} />;
};
