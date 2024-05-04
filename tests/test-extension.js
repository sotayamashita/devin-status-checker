const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true, // Run in headless mode for CI environment
    args: [
      `--disable-extensions-except=${__dirname}/dist`,
      `--load-extension=${__dirname}/dist`
    ]
  });

  try {
    // Creating a new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the extension popup page
    await page.goto('chrome-extension://[EXTENSION_ID]/popup.html');

    // Check for the presence of "Chrome Extension Popup" text in popup.html
    const popupText = await page.textContent('body');
    if (popupText.includes('Chrome Extension Popup')) {
      console.log('Popup text "Chrome Extension Popup" is present.');
    } else {
      throw new Error('Popup text "Chrome Extension Popup" is not found.');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close(); // Close the browser when done
  }
})();
