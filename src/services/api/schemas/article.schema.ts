import { z } from "zod";

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string(),
  publishedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid article publication date",
  }),
});

export const articlesListSchema = z.array(articleSchema);

export type Article = z.infer<typeof articleSchema>;
export type ArticlesList = z.infer<typeof articlesListSchema>;
