import { test, expect } from "@playwright/test";

test.describe("DrawDB custom features", () => {
  test("stats box updates when tables and relationships change", async ({ page }) => {
    await page.goto("/editor");

    // Wait for main canvas to load
    await page.getByRole("button", { name: /add table/i }).waitFor();

    // Initially there may be zero or more tables depending on saved state; create two new ones
    await page.getByRole("button", { name: /add table/i }).click();
    await page.getByRole("button", { name: /add table/i }).click();

    // Stats box should show at least 2 tables
    const statsBox = page.getByText("stats_box");
    await expect(statsBox).toBeVisible();
    await expect(page.getByText(/tables:\s*[2-9]/i)).toBeVisible();
  });

  test("delete all fields option clears a table's fields", async ({ page }) => {
    await page.goto("/editor");

    // Ensure at least one table exists
    await page.getByRole("button", { name: /add table/i }).click();

    // Open the table editor from toolbar so we can add an extra field (for a visible change)
    await page.keyboard.press("Ctrl+E");

    // Click "Add field" in the side panel
    await page.getByText("add_field").first().click();

    // Close the editor
    await page.keyboard.press("Escape");

    // Open the table's popover menu ("..." icon); use icon button inside the table header
    const moreButtons = page.locator("button").filter({
      has: page.locator("i.fa-ellipsis-h, svg"),
    });
    await moreButtons.first().click();

    // Click Delete all fields
    await page.getByText("delete_all_fields").click();

    // Re-open the editor and verify no fields remain except possibly the primary id
    await page.keyboard.press("Ctrl+E");
    const fieldRows = page.locator("[data-field-row]");
    await expect(fieldRows).toHaveCount(0);
  });
});

