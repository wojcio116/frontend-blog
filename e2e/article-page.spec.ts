import { expect, test } from "@playwright/test";

test.describe("Article page happy path", () => {
  test("visitor opens an article from the blog section, reads it whole, and goes back", async ({
    page,
  }) => {
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "101",
            title: "My Internship Architecture Notes",
            text: "First paragraph of the article.\n\nSecond paragraph with full details.",
            publishedAt: "2026-11-17T10:00:00.000Z",
          },
        ]),
      });
    });

    await page.route("**/api/v1/articles/101", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "101",
          title: "My Internship Architecture Notes",
          text: "First paragraph of the article.\n\nSecond paragraph with full details.",
          publishedAt: "2026-11-17T10:00:00.000Z",
        }),
      });
    });

    // 1. Open About Me page
    await page.goto("/");

    // 2. Click the article from the blog section
    const articleLink = page.getByRole("link", {
      name: "My Internship Architecture Notes",
    });
    await expect(articleLink).toBeVisible();
    await articleLink.click();

    // 3. Verify client-side navigation, scroll position, and full article content
    await expect(page).toHaveURL(/\/articles\/101$/);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);

    await expect(
      page.getByRole("heading", { name: "My Internship Architecture Notes" }),
    ).toBeVisible();
    await expect(
      page.getByText("First paragraph of the article."),
    ).toBeVisible();
    await expect(
      page.getByText("Second paragraph with full details."),
    ).toBeVisible();

    // 4. Use browser Back button to return to About Me
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(articleLink).toBeVisible();
  });
});
