import * as browser from "webextension-polyfill";

document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Event listener for the send notification button
    const notifyButton = document.getElementById("send-notification");
    if (notifyButton) {
      notifyButton.addEventListener(
        "click",
        function () {
          // Send a message to the background script to create a notification
          browser.runtime.sendMessage({ action: "notify" });
        },
        false,
      );
    }

    // Event listener for the check Devin status button
    const checkDevinStatusButton =
      document.getElementById("check-devin-status");
    if (checkDevinStatusButton) {
      checkDevinStatusButton.addEventListener(
        "click",
        function () {
          browser.tabs
            .query({ active: true, currentWindow: true })
            .then(function (tabs) {
              const currentTab = tabs[0];
              if (currentTab.id !== undefined) {
                browser.scripting
                  .executeScript({
                    target: { tabId: currentTab.id },
                    func: checkDevinStatus,
                  })
                  .then((injectionResults) => {
                    for (const frameResult of injectionResults) {
                      // Update the popup's content based on the Devin status
                      const checkResultElement =
                        document.getElementById("devin-check-result");
                      if (checkResultElement) {
                        checkResultElement.textContent = frameResult.result;
                      }
                      // If Devin is awaiting, send a notification
                      if (frameResult.result === "Devin is waiting") {
                        browser.runtime.sendMessage({
                          action: "notify",
                          message: "Devin is awaiting your response.",
                        });
                      }
                    }
                  });
              }
            });
        },
        false,
      );
    }

    // Function to be injected into the current tab to check Devin status
    function checkDevinStatus() {
      const statusBarMessage = document.querySelector(".status-bar--message");
      if (statusBarMessage) {
        const messageText = statusBarMessage.textContent || "";
        if (messageText.startsWith("Devin is awaiting")) {
          return "Devin is waiting";
        }
      }
      return "Devin is not awaiting";
    }
  },
  false,
);
