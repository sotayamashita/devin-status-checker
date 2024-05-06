# Devin Status Checker

![Build with Devin](https://img.shields.io/badge/Build%20with%20Devin-8A2BE2) ![CI](https://github.com/sotayamashita/devin-status-checker/actions/workflows/ci.yml/badge.svg)

This Chrome extension automates the monitoring of Devin AI sessions, notifying users when Devin awaits their input, thus enhancing productivity by integrating seamlessly into multitasking routines.

## Motivation

Monitoring Devin AI sessions manually can be a tedious task, often requiring users to switch back and forth between their work and the Devin page to check for updates. The Devin Status Checker extension addresses this inefficiency by providing real-time notifications, allowing users to focus on other tasks without missing important updates from Devin.

## Features

- Monitors Devin status at set intervals.
- Sends notifications when Devin is awaiting user input.

## Installation

To install the Devin Status Checker extension, follow these steps:

1. Clone the repository to your local machine.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable 'Developer mode' by toggling the switch in the top right corner.
4. Click on 'Load unpacked' and select the `dist` directory from the cloned repository.
5. The extension is now installed and should appear in your list of extensions.

## Troubleshooting

If you encounter any issues, such as not receiving notifications, try the following:

1. **Verify Devin Session Status**:
   - Confirm that you are in a Devin session and that it is awaiting input.

2. **Browser Notification Settings**:
   - In Chrome, navigate to `chrome://settings/content/siteDetails?site=https%3A%2F%2Fpreview.devin.ai` and allow notifications for `https://preview.devin.ai`.

3. **macOS Notification Settings** (if applicable):
   - Access 'System Preferences' > 'Notifications' and ensure your browser is permitted to send notifications.

For further assistance, please file an issue on the [GitHub repository](https://github.com/sotayamashita/devin-status-checker/issues) with a detailed description of the problem.
