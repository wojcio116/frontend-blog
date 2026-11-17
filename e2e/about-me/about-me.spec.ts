import { expect, test } from "@playwright/test";

const MOCK_ARTICLES = [
  {
    id: "5e1f0a2b-0001-4000-8000-000000000001",
    title: "Older Article About NestJS",
    text: "Building clean REST APIs with NestJS and Prisma.",
    publishedAt: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "5e1f0a2b-0002-4000-8000-000000000002",
    title: "Newest Article About React and Zod",
    text: "Validating API responses safely on the frontend.",
    publishedAt: "2026-11-16T14:00:00.000Z",
  },
];

test.describe("Personal Page (About Me)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_ARTICLES),
      });
    });
  });

  test("displays the personal page with author name as the main heading", async ({
    page,
  }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Wojciech Nizborski");
  });

  test("displays articles from the API newest first with title and date", async ({
    page,
  }) => {
    await page.goto("/");

    const blogSection = page.getByTestId("blog-section");
    await expect(blogSection).toBeVisible();

    const articleHeadings = blogSection.locator("article h3");
    await expect(articleHeadings).toHaveCount(2);
    await expect(articleHeadings.nth(0)).toHaveText(
      "Newest Article About React and Zod",
    );
    await expect(articleHeadings.nth(1)).toHaveText(
      "Older Article About NestJS",
    );

    await expect(blogSection.getByText("Nov 16, 2026")).toBeVisible();
    await expect(blogSection.getByText("Nov 10, 2026")).toBeVisible();
  });

  test("renders without horizontal scrolling on a 360px phone screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByText("Newest Article About React and Zod"),
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("keeps content at a comfortable reading width on a 1440px wide screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const container = page.locator("main > div").first();
    const box = await container.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.width).toBeLessThanOrEqual(960);
  });

  test("allows keyboard Tab navigation through all links in reading order with visible focus", async ({
    page,
  }) => {
    await page.goto("/");

    const links = page.locator("main a");
    await expect(links.first()).toBeVisible();

    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await page.keyboard.press("Tab");
      const currentLink = links.nth(i);
      await expect(currentLink).toBeFocused();
    }
  });
});
