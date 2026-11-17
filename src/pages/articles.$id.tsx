import { useParams } from "react-router";
import { ArticlePage } from "../components/article/ArticlePage/ArticlePage";

export default function ArticleRoutePage() {
  const { id = "" } = useParams<{ id: string }>();

  return <ArticlePage articleId={id} />;
}
