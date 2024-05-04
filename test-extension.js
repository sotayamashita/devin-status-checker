const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: [
      `--disable-extensions-except=${__dirname}/dist`, // Disable all extensions except the one being tested
      `--load-extension=${__dirname}/dist` // Load the extension
    ]
  });

  try {
    // Wait for the background page to be created by the extension
    const backgroundPageTarget = await browser.waitForTarget(target => target.type() === 'background_page', { timeout: 10000 });

    // Access the background page of the extension
    const backgroundPage = await backgroundPageTarget.page();

    if (backgroundPage) {
      console.log('Extension loaded successfully.');
      // Perform additional checks here
    } else {
      throw new Error('Failed to load the extension.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close(); // Close the browser when done
  }
})();
