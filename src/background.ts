import * as browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(function () {
  console.log("The extension has been installed.");
});

// Set up an alarm to check Devin's status periodically
browser.alarms.create("checkDevinStatusBackground", { periodInMinutes: 1 });

// Listener for the alarm to check Devin's status
// This alarm triggers every minute to check if Devin's status is 'waiting'
browser.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "checkDevinStatusBackground") {
    // Query all tabs that match Devin's URL pattern
    browser.tabs.query(
      { url: "https://preview.devin.ai/devin/*" },
      function (tabs) {
        // For each tab, execute the checkDevinStatusBackground script
        tabs.forEach(function (tab) {
          if (tab.id !== undefined) {
            // Ensure tab.id is defined
            browser.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: checkDevinStatusBackground,
              },
              (injectionResults) => {
                // Process the results of the script execution
                for (const frameResult of injectionResults) {
                  // If Devin is waiting, create a notification
                  if (frameResult.result === "Devin is waiting") {
                    browser.notifications.create({
                      type: "basic",
                      iconUrl: "icon.png",
                      title: "Devin Status",
                      message: "Devin is awaiting your response.",
                    });
                  }
                }
              },
            );
          }
        });
      },
    );
  }
});

// Listener for messages from the popup script
// This allows the popup to send notifications on demand
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "notify") {
    // Define the notification options
    let options: chrome.notifications.NotificationOptions = {
      type: "basic",
      iconUrl: "icon.png",
      title: "Notification from Devin",
      message: request.message || "Notification triggered",
      buttons: [{ title: "Check" }],
    };
    // Create the notification with the defined options
    browser.notifications.create(options);
  }
});

// Listener for notification button click
// This provides a quick way for the user to navigate to the Devin session
browser.notifications.onButtonClicked.addListener(
  function (notificationId, buttonIndex) {
    if (buttonIndex === 0) {
      // 'Check' button index
      // Query the active tab in the current window
      browser.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          var currentTab = tabs[0];
          if (currentTab && currentTab.url) {
            // Ensure currentTab and currentTab.url are defined
            // Extract the session ID from the current tab URL
            var sessionIdMatch = currentTab.url.match(
              /devin\/([a-zA-Z0-9?&=]+)/,
            );
            if (sessionIdMatch && sessionIdMatch.length > 1) {
              var sessionId = sessionIdMatch[1];
              // Open the Devin session URL in a new tab
              browser.tabs.create({
                url: `https://preview.devin.ai/devin/${sessionId}`,
              });
            }
          }
        },
      );
    }
  },
);

// Function to be injected into the current tab to check Devin status
// This function checks the status bar message for the text 'Devin is awaiting'
function checkDevinStatusBackground() {
  const statusBarMessage = document.querySelector(".status-bar--message");
  if (statusBarMessage) {
    // Retrieve the text content of the status bar message
    const messageText = statusBarMessage.textContent; // Removed innerText
    // If the message indicates Devin is awaiting, return 'Devin is waiting'
    if (messageText && messageText.startsWith("Devin is awaiting")) {
      return "Devin is waiting";
    }
  }
  // If Devin is not awaiting, return 'Devin is not awaiting'
  return "Devin is not awaiting";
}
