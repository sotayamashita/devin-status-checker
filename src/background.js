chrome.runtime.onInstalled.addListener(function () {
  console.log("The extension has been installed.");
});

// Set up an alarm to check Devin's status periodically
chrome.alarms.create("checkDevinStatus", { periodInMinutes: 1 });

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
              if (frameResult.result.status === "Devin is waiting") {
                // Retrieve the last notification time for the current tab from storage
                chrome.storage.local.get(
                  `lastNotificationTime_${tab.id}`,
                  function (data) {
                    // Parse the last message time from the result
                    const lastMessageTime = Date.parse(
                      frameResult.result.lastMessageTime,
                    );
                    // Check if the last message time is different from the last notification time for this tab
                    if (
                      !data[`lastNotificationTime_${tab.id}`] ||
                      lastMessageTime.toString() !==
                        data[`lastNotificationTime_${tab.id}`]
                    ) {
                      // Update the storage with the last message time for this tab
                      let tabData = {};
                      tabData[`lastNotificationTime_${tab.id}`] =
                        lastMessageTime.toString();
                      chrome.storage.local.set(tabData);
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
      // Extract the last message time from the status bar
      const lastMessageElements = document.querySelectorAll(
        ".message-history .message-history--item",
      );
      const lastMessageElement =
        lastMessageElements[lastMessageElements.length - 1];
      const lastMessageTime = lastMessageElement.querySelector(
        "[data-state='closed']",
      ).textContent;
      // Format the last message time as "Mon 11:34 PM"
      const formattedLastMessageTime = new Date(
        lastMessageTime,
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        weekday: "short",
      });
      return {
        status: "Devin is waiting",
        lastMessageTime: formattedLastMessageTime,
      };
    }
  }
  return { status: "Devin is not awaiting" };
}
