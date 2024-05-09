chrome.runtime.onInstalled.addListener(function () {
  console.log("The extension has been installed.");
});

// Set up an alarm to check Devin's status periodically
chrome.alarms.create("checkDevinStatus", { periodInMinutes: 1 });

// Initialize the storage for the last notification time and URL
chrome.storage.local.set({
  lastNotificationTime: null,
  lastNotificationUrl: null,
});

// Listener for the alarm to check Devin's status
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "checkDevinStatus") {
    chrome.tabs.query({ url: "https://preview.devin.ai/devin/*" }, (tabs) => {
      tabs.forEach(function (tab) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            function: checkDevinStatus,
          },
          (injectionResults) => {
            for (const frameResult of injectionResults) {
              if (frameResult.result === "Devin is waiting") {
                // Retrieve the last notification time and URL from storage
                chrome.storage.local.get(
                  ["lastNotificationTime", "lastNotificationUrl"],
                  function (data) {
                    const currentTime = new Date().getTime();
                    const currentUrl = tab.url;
                    // Check if the current URL and time are different from the last stored values
                    if (
                      data.lastNotificationUrl !== currentUrl ||
                      currentTime - data.lastNotificationTime > 60000
                    ) {
                      // Update the storage with the current time and URL
                      chrome.storage.local.set({
                        lastNotificationTime: currentTime,
                        lastNotificationUrl: currentUrl,
                      });
                      // Create the notification
                      chrome.notifications.create({
                        type: "basic",
                        iconUrl: "icon.png",
                        title: "Devin Status",
                        message: "Devin is awaiting your response.",
                      });
                    }
                  },
                );
              }
            }
          },
        );
      });
    });
  }
});

// Listener for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "notify") {
    // Define the notification options
    let options = {
      type: "basic",
      iconUrl: "icon.png",
      title: "Notification from Devin",
      message: request.message || "Notification triggered manually",
      buttons: [{ title: "Check" }],
    };
    // Create the notification
    chrome.notifications.create(options);
  }
});

// Listener for notification button click
chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      // 'Check' button index
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        // Extract the session ID from the current tab URL
        const sessionIdMatch = currentTab.url.match(/devin\/([a-zA-Z0-9?&=]+)/);
        if (sessionIdMatch && sessionIdMatch.length > 1) {
          const sessionId = sessionIdMatch[1];
          // Open the Devin session URL in a new tab
          chrome.tabs.create({
            url: `https://preview.devin.ai/devin/${sessionId}`,
          });
        }
      });
    }
  },
);

// Function to be injected into the current tab to check Devin status
function checkDevinStatus() {
  const statusBarMessage = document.querySelector(".status-bar--message");
  if (statusBarMessage) {
    const messageText =
      statusBarMessage.textContent || statusBarMessage.innerText;
    if (messageText.startsWith("Devin is awaiting")) {
      return "Devin is waiting";
    }
  }
  return "Devin is not awaiting";
}
