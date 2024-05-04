chrome.runtime.onInstalled.addListener(function() {
    console.log('The extension has been installed.');
});

// Set up an alarm to check Devin's status periodically
chrome.alarms.create('checkDevinStatusBackground', { periodInMinutes: 1 });

// Listener for the alarm to check Devin's status
// This alarm triggers every minute to check if Devin's status is 'waiting'
chrome.alarms.onAlarm.addListener(function(alarm: chrome.alarms.Alarm) {
    if (alarm.name === 'checkDevinStatusBackground') {
        // Query all tabs that match Devin's URL pattern
        chrome.tabs.query({url: "https://preview.devin.ai/devin/*"}, function(tabs: chrome.tabs.Tab[]) {
            // For each tab, execute the checkDevinStatusBackground script
            tabs.forEach(function(tab: chrome.tabs.Tab) {
                if (tab.id !== undefined) { // Ensure tab.id is defined
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: checkDevinStatusBackground
                    }, (injectionResults: chrome.scripting.InjectionResult[]) => {
                        // Process the results of the script execution
                        for (const frameResult of injectionResults) {
                            // If Devin is waiting, create a notification
                            if (frameResult.result === 'Devin is waiting') {
                                chrome.notifications.create({
                                    type: 'basic',
                                    iconUrl: chrome.runtime.getURL('icon.png') as string,
                                    title: 'Devin Status',
                                    message: 'Devin is awaiting your response.',
                                    requireInteraction: false
                                });
                            }
                        }
                    });
                }
            });
        });
    }
});

// Listener for messages from the popup script
// This allows the popup to send notifications on demand
chrome.runtime.onMessage.addListener(
    function(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
        if (request.action == "notify") {
            // Define the notification options
            let options: chrome.notifications.NotificationOptions<true> = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icon.png') as string, // Ensure iconUrl is always a string
                title: 'Notification from Devin',
                message: request.message || "Notification triggered",
                buttons: [
                    {title: "Check"}
                ],
                requireInteraction: false // Explicitly set requireInteraction to match NotificationOptions<false>
            };
            // Create the notification with the defined options
            chrome.notifications.create(options);
        }
    }
);

// Listener for notification button click
// This provides a quick way for the user to navigate to the Devin session
chrome.notifications.onButtonClicked.addListener(function(notificationId: string, buttonIndex: number) {
    if (buttonIndex === 0) { // 'Check' button index
        // Query the active tab in the current window
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs: chrome.tabs.Tab[]) {
            var currentTab = tabs[0];
            if (currentTab && currentTab.url) { // Ensure currentTab and currentTab.url are defined
                // Extract the session ID from the current tab URL
                var sessionIdMatch = currentTab.url.match(/devin\/([a-zA-Z0-9?&=]+)/);
                if (sessionIdMatch && sessionIdMatch.length > 1) {
                    var sessionId = sessionIdMatch[1];
                    // Open the Devin session URL in a new tab
                    chrome.tabs.create({url: `https://preview.devin.ai/devin/${sessionId}`});
                }
            }
        });
    }
});

// Function to be injected into the current tab to check Devin status
// This function checks the status bar message for the text 'Devin is awaiting'
function checkDevinStatusBackground() {
    const statusBarMessage = document.querySelector('.status-bar--message');
    if (statusBarMessage) {
        // Retrieve the text content of the status bar message
        const messageText = statusBarMessage.textContent; // Removed innerText
        // If the message indicates Devin is awaiting, return 'Devin is waiting'
        if (messageText && messageText.startsWith('Devin is awaiting')) {
            return 'Devin is waiting';
        }
    }
    // If Devin is not awaiting, return 'Devin is not awaiting'
    return 'Devin is not awaiting';
}
