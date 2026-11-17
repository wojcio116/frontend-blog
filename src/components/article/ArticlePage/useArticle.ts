import { useCallback, useEffect, useState } from "react";
import {
  ArticleNotFoundError,
  fetchArticleById,
} from "../../../services/api/client/articlesApi";
import type { Article } from "../../../services/api/schemas/article.schema";

export type ArticleState =
  | { status: "loading" }
  | { status: "success"; article: Article }
  | { status: "not-found" }
  | { status: "error"; message: string };

const ERROR_MESSAGE =
  "Could not load this article right now. Please check your connection and try again.";

export const useArticle = (articleId: string) => {
  const [state, setState] = useState<ArticleState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    window.scrollTo(0, 0);
    setState({ status: "loading" });

    fetchArticleById(articleId, controller.signal)
      .then((article) => {
        if (!isActive) {
          return;
        }
        setState({ status: "success", article });
      })
      .catch((error: unknown) => {
        if (!isActive || controller.signal.aborted) {
          return;
        }
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "ERR_CANCELED"
        ) {
          return;
        }
        if (error instanceof ArticleNotFoundError) {
          setState({ status: "not-found" });
          return;
        }
        setState({ status: "error", message: ERROR_MESSAGE });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [articleId, attempt]);

  return {
    state,
    retry,
  };
};
