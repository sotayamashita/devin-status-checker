import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Configure projects for different browsers */
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    // Test against mobile viewports.
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    // Test against desktop viewports.
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
};

export default config;
