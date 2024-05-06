document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Event listener for the send notification button
    const notifyButton = document.getElementById("send-notification");
    notifyButton.addEventListener(
      "click",
      () => {
        // Send a message to the background script to create a notification
        chrome.runtime.sendMessage({ action: "notify" });
      },
      false,
    );

    // Event listener for the check Devin status button
    const checkDevinStatusButton =
      document.getElementById("check-devin-status");
    checkDevinStatusButton.addEventListener(
      "click",
      () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          chrome.scripting.executeScript(
            {
              target: { tabId: currentTab.id },
              function: checkDevinStatus,
            },
            (injectionResults) => {
              for (const frameResult of injectionResults) {
                // Update the popup's content based on the Devin status
                document.getElementById("devin-check-result").textContent =
                  frameResult.result;
                // If Devin is awaiting, send a notification
                if (frameResult.result === "Devin is waiting") {
                  chrome.runtime.sendMessage({
                    action: "notify",
                    message: "Devin is awaiting your response.",
                  });
                }
              }
            },
          );
        });
      },
      false,
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

    // Retrieve the current state of the notification toggle from storage
    const notificationToggle = document.getElementById("toggle");
    chrome.storage.sync.get(["notificationsEnabled"], function (result) {
      notificationToggle.checked = result.notificationsEnabled !== false;
    });

    // Event listener for the notification toggle
    notificationToggle.addEventListener("change", function () {
      // Update the stored state when the toggle is clicked
      chrome.storage.sync.set({
        notificationsEnabled: notificationToggle.checked,
      });
    });
  },
  false,
);
