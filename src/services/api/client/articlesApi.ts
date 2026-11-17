import { type Article, articlesListSchema } from "../schemas/article.schema";
import { httpClient } from "./httpClient";

export const ARTICLES_ENDPOINT = "/api/v1/articles";

export const sortArticlesNewestFirst = (articles: Article[]): Article[] => {
  return [...articles].sort(
    (first, second) =>
      Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );
};

export const fetchArticles = async (
  signal?: AbortSignal,
): Promise<Article[]> => {
  const response = await httpClient.get<unknown>(ARTICLES_ENDPOINT, {
    signal,
  });

  const parsed = articlesListSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error("Received invalid articles payload from API");
  }

  return sortArticlesNewestFirst(parsed.data);
};
