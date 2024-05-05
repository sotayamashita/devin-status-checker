import { test, expect } from "@playwright/test";
import { readdirSync } from "fs";
import { join } from "path";

test("Extension UI should load correctly", async ({ page, context }) => {
  // Find the background script in the dist directory
  const distFiles = readdirSync(join(__dirname, "..", "dist"));
  const backgroundScript = distFiles.find(
    (file) => file.startsWith("background") && file.endsWith(".js"),
  );
  if (!backgroundScript) {
    throw new Error("Background script not found in dist directory");
  }

  console.log("Background script found:", backgroundScript);

  // Load the extension
  await context.addInitScript({
    path: join(__dirname, "..", "dist", backgroundScript),
  });

  // The extension ID can be retrieved by checking the background page URL
  // Wait for the background page to be available
  try {
    const backgroundPage = await context.waitForEvent("backgroundpage");
    const extensionID = backgroundPage.url().split("/")[2];

    console.log("Extension ID retrieved:", extensionID);

    // Navigate to the extension popup page
    await page.goto(`chrome-extension://${extensionID}/popup.html`);

    // Check for the presence of "Chrome Extension Popup" text in popup.html
    const popupText = await page.textContent("body");
    expect(popupText).toContain("Chrome Extension Popup");
  } catch (error) {
    console.error("Error waiting for background page:", error);
    throw error; // Rethrow the error to fail the test
  }
});
