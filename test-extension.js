const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: [
      `--disable-extensions-except=${__dirname}/dist`, // Disable all extensions except the one being tested
      `--load-extension=${__dirname}/dist` // Load the extension
    ]
  });

  const backgroundPage = await browser.extensionBackgroundPage(); // Access the background page of the extension

  if (backgroundPage) {
    console.log('Extension loaded successfully.');
    // Perform additional checks here
  } else {
    console.error('Failed to load the extension.');
    process.exit(1); // Exit with an error code
  }

  await browser.close(); // Close the browser when done
})();
