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
    // Get all active service workers
    const workers = await browser.serviceWorkers();
    // Find our extension's service worker
    const extensionWorker = workers.find(worker => worker.url.includes('dist'));

    if (extensionWorker) {
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
