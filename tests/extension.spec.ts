const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true, // Run in headless mode for CI environment
    args: [
      `--disable-extensions-except=${__dirname}/dist`,
      `--load-extension=${__dirname}/dist`,
    ],
  });

  try {
    // Creating a new browser context and page
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();

    // The extension ID can be retrieved by checking the background page URL
    const backgroundPage = context.backgroundPages()[0];
    const extensionID = backgroundPage.url().split("/")[2];

    // Navigate to the extension popup page
    await page.goto(`chrome-extension://${extensionID}/popup.html`);

    // Check for the presence of "Chrome Extension Popup" text in popup.html
    const popupText = await page.textContent("body");
    if (popupText.includes("Chrome Extension Popup")) {
      console.log('Popup text "Chrome Extension Popup" is present.');
    } else {
      throw new Error('Popup text "Chrome Extension Popup" is not found.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close(); // Close the browser when done
  }
})();
