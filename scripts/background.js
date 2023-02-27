// This code listens to the `chrome.runtime.onInstalled` event and registers a `chrome.declarativeContent` rule for the current user's browser session.
// This disables the extension when we are not the required page
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  // Remove any existing rules, then add a new rule to enable the extension's page action for a specific domain.
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    let exampleRule = {
      // Define a condition for the `linkedin.com` domain using the `chrome.declarativeContent.PageStateMatcher` class.
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostSuffix: '.linkedin.com', pathPrefix: '/search/results/people',  schemes: ['https']},
        })
      ],
      // When the condition is met, execute the action to `chrome.declarativeContent.ShowAction()`, which enables the extension's page action for that domain.
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

// registers a listener to receive messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'createNotification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../assets/logo-48.png',
      title: request.title,
      message: request.message,
      priority: 0
    });
    sendResponse('notified');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com/search/results/people')) {
    
  }
});