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
    // and update the toggle button's appearance based on the stored value
    const notificationToggleButton = document.querySelector("[role='switch']");
    chrome.storage.sync.get(["notificationsEnabled"], function (result) {
      const isEnabled = result.notificationsEnabled !== false;
      notificationToggleButton.setAttribute("aria-checked", isEnabled);
      if (isEnabled) {
        notificationToggleButton.classList.replace(
          "bg-gray-200",
          "bg-indigo-600",
        );
        notificationToggleButton
          .querySelector(".translate-x-0")
          .classList.replace("translate-x-0", "translate-x-5");
        notificationToggleButton
          .querySelector(".opacity-100")
          .classList.replace("opacity-100", "opacity-0");
        notificationToggleButton
          .querySelector(".opacity-0")
          .classList.replace("opacity-0", "opacity-100");
      } else {
        notificationToggleButton.classList.replace(
          "bg-indigo-600",
          "bg-gray-200",
        );
        notificationToggleButton
          .querySelector(".translate-x-5")
          .classList.replace("translate-x-5", "translate-x-0");
        notificationToggleButton
          .querySelector(".opacity-0")
          .classList.replace("opacity-0", "opacity-100");
        notificationToggleButton
          .querySelector(".opacity-100")
          .classList.replace("opacity-100", "opacity-0");
      }
    });

    // Event listener for the notification toggle button
    notificationToggleButton.addEventListener("click", function () {
      const currentState =
        notificationToggleButton.getAttribute("aria-checked") === "true";
      // Toggle the state
      const newState = !currentState;
      notificationToggleButton.setAttribute("aria-checked", newState);
      if (newState) {
        notificationToggleButton.classList.replace(
          "bg-gray-200",
          "bg-indigo-600",
        );
        notificationToggleButton
          .querySelector(".translate-x-0")
          .classList.replace("translate-x-0", "translate-x-5");
        notificationToggleButton
          .querySelector(".opacity-100")
          .classList.replace("opacity-100", "opacity-0");
        notificationToggleButton
          .querySelector(".opacity-0")
          .classList.replace("opacity-0", "opacity-100");
      } else {
        notificationToggleButton.classList.replace(
          "bg-indigo-600",
          "bg-gray-200",
        );
        notificationToggleButton
          .querySelector(".translate-x-5")
          .classList.replace("translate-x-5", "translate-x-0");
        notificationToggleButton
          .querySelector(".opacity-0")
          .classList.replace("opacity-0", "opacity-100");
        notificationToggleButton
          .querySelector(".opacity-100")
          .classList.replace("opacity-100", "opacity-0");
      }
      // Update the stored state when the toggle is clicked
      chrome.storage.sync.set({
        notificationsEnabled: newState,
      });
    });
  },
  false,
);
