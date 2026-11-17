import { describe, expect, it } from "vitest";
import { articleSchema, articlesListSchema } from "./article.schema";

describe("articleSchema and articlesListSchema", () => {
  describe("Given a valid list of articles from the API", () => {
    describe("When parsed with articlesListSchema", () => {
      it("Then succeeds and returns typed articles", () => {
        const payload = [
          {
            id: "5e1f0a2b-0001-4000-8000-000000000001",
            title: "First Article",
            text: "Full article body.",
            publishedAt: "2026-11-12T10:00:00.000Z",
          },
        ];

        const result = articlesListSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(payload);
        }
      });
    });
  });

  describe("Given an article with missing fields or invalid date", () => {
    describe("When parsed with articleSchema", () => {
      it("Then fails validation", () => {
        const missingTitle = articleSchema.safeParse({
          id: "1",
          text: "No title",
          publishedAt: "2026-11-12T10:00:00.000Z",
        });
        expect(missingTitle.success).toBe(false);

        const invalidDate = articleSchema.safeParse({
          id: "1",
          title: "Title",
          text: "Body",
          publishedAt: "not-a-valid-date",
        });
        expect(invalidDate.success).toBe(false);
      });
    });
  });
});
