import { test, expect } from "@playwright/test";

test("Extension UI should load correctly", async ({ page }) => {
  // The extension ID can be retrieved by checking the background page URL
  // Wait for the background page to be available
  await page.context().waitForEvent("backgroundpage");
  const backgroundPages = page.context().backgroundPages();
  if (backgroundPages.length === 0) {
    throw new Error("No background page found for the extension");
  }
  const backgroundPage = backgroundPages[0];
  const extensionID = backgroundPage.url().split("/")[2];

  // Navigate to the extension popup page
  await page.goto(`chrome-extension://${extensionID}/popup.html`);

  // Check for the presence of "Chrome Extension Popup" text in popup.html
  const popupText = await page.textContent("body");
  expect(popupText).toContain("Chrome Extension Popup");
});
