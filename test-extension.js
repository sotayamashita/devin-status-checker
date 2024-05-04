const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false, // Extensions only work in non-headless mode
    args: [
      `--disable-extensions-except=${__dirname}/dist`,
      `--load-extension=${__dirname}/dist`
    ]
  });

  try {
    // Creating a new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to a test page (this should be a page where the extension is expected to run)
    await page.goto('https://example.com');

    // Here you would perform actions that the extension should respond to,
    // and check for the expected outcomes. This could include checking for
    // DOM changes made by the extension's content scripts, or any other
    // observable effects of the extension's functionality.

    // For example, if the extension injects a specific element into the page,
    // you could wait for that element to appear as a confirmation that the
    // extension's content scripts are running:
    await page.waitForSelector('#injected-element-id', { timeout: 10000 });

    // If the element is found, log success
    console.log('Extension content scripts are running.');
    // Perform additional checks here

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close(); // Close the browser when done
  }
})();
