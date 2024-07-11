const simulateNotificationLogic = () => {
  // Simulate retrieval of last notification time for a tab
  const lastNotificationTime = new Date().getTime() - 60000; // 1 minute ago

  // Simulate current time
  const currentTime = new Date().getTime();

  // Simulate the notification creation logic
  if (currentTime - lastNotificationTime > 60000) {
    console.log("Notification would be created now.");
  } else {
    console.log("Notification would not be created now.");
  }
};

simulateNotificationLogic();
