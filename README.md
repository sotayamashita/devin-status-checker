# Devin Status Checker

![Build with Devin](https://img.shields.io/badge/Build%20with%20Devin-8A2BE2) ![CI](https://github.com/sotayamashita/devin-status-checker/actions/workflows/ci.yml/badge.svg)

This Chrome extension is designed to check the status of Devin sessions and notify the user accordingly.

## Motivation

Before the Devin Status Checker extension, users had to manually monitor their Devin AI sessions, often switching back and forth between tasks to check if Devin was waiting for input. This was a bit inefficient.

To address this, the Devin Status Checker Chrome extension was developed. It automates the monitoring process by checking the status of Devin sessions in the background. When Devin's status changes to 'Devin is awaiting', the extension sends an immediate notification. This allows users to focus on other tasks with the assurance that they won't miss the moment Devin requires their attention. By streamlining this process, the extension enhances productivity and integrates AI assistance into the user's multitasking routine seamlessly.

## Features

- Automatic checking of Devin status at regular intervals.
- Notifications to alert the user when Devin is awaiting their input.
- A toggle switch in the popup to enable or disable notifications. This setting is saved and will persist across browser sessions.

## Installation

Since there are no releases available for download, you can install the Devin Status Checker extension by cloning the repository and building the extension manually. Follow these steps:

1. Clone the repository
2. Navigate to the cloned directory and run `pnpm install` to install dependencies.
3. Build the extension by running `pnpm run build`.
4. Open the Chrome browser and navigate to `chrome://extensions/`.
5. Enable 'Developer mode' by toggling the switch in the top right corner.
6. Click on 'Load unpacked' and select the `dist` directory from the cloned repository.
7. The extension should now be installed and will appear in your list of extensions.
