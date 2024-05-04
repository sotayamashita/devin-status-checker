// Declare the chrome namespace to inform TypeScript about the Chrome extension APIs
declare const chrome: any;

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the send notification button
    var notifyButton = document.getElementById('send-notification');
    if (notifyButton) {
        notifyButton.addEventListener('click', function() {
            // Send a message to the background script to create a notification
            chrome.runtime.sendMessage({action: "notify"});
        }, false);
    }

    // Event listener for the check Devin status button
    var checkDevinStatusButton = document.getElementById('check-devin-status');
    if (checkDevinStatusButton) {
        checkDevinStatusButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var currentTab = tabs[0];
                chrome.scripting.executeScript({
                    target: {tabId: currentTab.id},
                    function: checkDevinStatus
                }, (injectionResults) => {
                    for (const frameResult of injectionResults) {
                        // Update the popup's content based on the Devin status
                        const checkResultElement = document.getElementById('devin-check-result');
                        if (checkResultElement) {
                            checkResultElement.textContent = frameResult.result;
                        }
                        // If Devin is awaiting, send a notification
                        if (frameResult.result === 'Devin is waiting') {
                            chrome.runtime.sendMessage({action: "notify", message: "Devin is awaiting your response."});
                        }
                    }
                });
            });
        }, false);
    }

    // Function to be injected into the current tab to check Devin status
    function checkDevinStatus() {
        const statusBarMessage = document.querySelector('.status-bar--message');
        if (statusBarMessage) {
            const messageText = statusBarMessage.textContent || '';
            if (messageText.startsWith('Devin is awaiting')) {
                return 'Devin is waiting';
            }
        }
        return 'Devin is not awaiting';
    }
}, false);
