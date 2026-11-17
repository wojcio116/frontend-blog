import axios from "axios";
import {
  type Article,
  articleSchema,
  articlesListSchema,
} from "../schemas/article.schema";
import { httpClient } from "./httpClient";

export const ARTICLES_ENDPOINT = "/api/v1/articles";

export class ArticleNotFoundError extends Error {
  constructor(id: string) {
    super(`Article with id "${id}" was not found`);
    this.name = "ArticleNotFoundError";
  }
}

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

export const fetchArticleById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Article> => {
  const trimmedId = id.trim();
  if (trimmedId.length === 0 || !/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
    throw new ArticleNotFoundError(id);
  }

  try {
    const response = await httpClient.get<unknown>(
      `${ARTICLES_ENDPOINT}/${encodeURIComponent(trimmedId)}`,
      { signal },
    );

    const parsed = articleSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error("Received invalid article payload from API");
    }

    return parsed.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 400)
    ) {
      throw new ArticleNotFoundError(trimmedId);
    }
    throw error;
  }
};
