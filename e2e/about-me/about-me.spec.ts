import { expect, test } from "@playwright/test";

test.describe("Personal Page (About Me)", () => {
  test("displays the personal page with author name as the main heading", async ({
    page,
  }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Wojciech Nizborski");
  });

  test("renders without horizontal scrolling on a 360px phone screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

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
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await page.keyboard.press("Tab");
      const currentLink = links.nth(i);
      await expect(currentLink).toBeFocused();
    }
  });
});
