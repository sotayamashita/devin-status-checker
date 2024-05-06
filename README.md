# Devin Status Checker

![Build with Devin](https://img.shields.io/badge/Build%20with%20Devin-8A2BE2) ![CI](https://github.com/sotayamashita/devin-status-checker/actions/workflows/ci.yml/badge.svg)

This Chrome extension is designed to check the status of Devin sessions and notify the user accordingly.

## Motivation

Before the Devin Status Checker extension, users had to manually monitor their Devin AI sessions, often switching back and forth between tasks to check if Devin was waiting for input. This was a bit inefficient.

To address this, the Devin Status Checker Chrome extension was developed. It automates the monitoring process by checking the status of Devin sessions in the background. When Devin's status changes to 'Devin is awaiting', the extension sends an immediate notification. This allows users to focus on other tasks with the assurance that they won't miss the moment Devin requires their attention. By streamlining this process, the extension enhances productivity and integrates AI assistance into the user's multitasking routine seamlessly.

## Features

- Automatic checking of Devin status at regular intervals.
- Notifications to alert the user when Devin is awaiting their input.

## Installation

Since there are no releases available for download, you can install the Devin Status Checker extension by cloning the repository and building the extension manually. Follow these steps:

1. Clone the repository
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable 'Developer mode' by toggling the switch in the top right corner.
4. Click on 'Load unpacked' and select the `dist` directory from the cloned repository.
5. The extension should now be installed and will appear in your list of extensions.

## Troubleshooting

If you encounter issues with the Devin Status Checker extension, such as notifications not being sent, try the following troubleshooting steps:

1. **Check Devin Session Status**:
   - Ensure that you are in a Devin session and that the Devin start message begins with "Devin is awaiting".

2. **Check Browser Notification Settings**:
   - In Chrome, go to `chrome://settings/content/siteDetails?site=https%3A%2F%2Fpreview.devin.ai`.
   - Ensure that the site `https://preview.devin.ai` is allowed to send notifications.

3. **Check macOS Notification Settings** (if applicable):
   - Go to 'System Preferences' > 'Notifications'.
   - Find the browser you are using in the list and make sure notifications are allowed.

If you have followed these steps and are still experiencing issues, please file an issue on the [GitHub repository](https://github.com/sotayamashita/devin-status-checker/issues) with detailed information about the problem.
