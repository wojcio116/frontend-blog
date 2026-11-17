import { useCallback, useEffect, useState } from "react";
import { fetchArticles } from "../../../services/api/client/articlesApi";
import type { Article } from "../../../services/api/schemas/article.schema";

export type ArticlesState =
  | { status: "loading" }
  | { status: "success"; articles: Article[] }
  | { status: "error"; message: string };

const ERROR_MESSAGE =
  "Could not load articles right now. Please check your connection and try again.";

export const useArticles = () => {
  const [state, setState] = useState<ArticlesState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    setState({ status: "loading" });

    fetchArticles(controller.signal)
      .then((articles) => {
        if (!isActive) {
          return;
        }
        setState({ status: "success", articles });
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
        setState({ status: "error", message: ERROR_MESSAGE });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [attempt]);

  return {
    state,
    retry,
  };
};
