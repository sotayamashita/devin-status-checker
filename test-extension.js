const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Run in non-headless mode
    args: [
      `--disable-extensions-except=${__dirname}/dist`, // Disable all extensions except the one being tested
      `--load-extension=${__dirname}/dist` // Load the extension
    ]
  });

  try {
    // Wait for the service worker to be registered by the extension
    const serviceWorkerTarget = await browser.waitForTarget(target => target.type() === 'service_worker', { timeout: 10000 });

    // Access the service worker of the extension
    const serviceWorker = await serviceWorkerTarget.worker();

    if (serviceWorker) {
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
