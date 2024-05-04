const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: [
      `--disable-extensions-except=${__dirname}/dist`, // Disable all extensions except the one being tested
      `--load-extension=${__dirname}/dist`, // Load the extension
      '--no-sandbox' // Added no-sandbox flag for headless execution
    ]
  });

  try {
    // Open a new page
    const page = await browser.newPage();
    // Navigate to a test page (this should be a page where the extension is expected to run)
    await page.goto('https://example.com');

    // Here you would perform actions that the extension should respond to,
    // and check for the expected outcomes. This could include checking for
    // DOM changes made by the extension's content scripts, or any other
    // observable effects of the extension's functionality.

    // For example, if the extension injects a specific element into the page,
    // you could wait for that element to appear as a confirmation that the
    // extension's content scripts are running:
    // await page.waitForSelector('#injected-element-id');

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
