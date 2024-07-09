const marketplaces = [
    "amazon.com",
    "ebay.com",
    "walmart.com",
    "google.com",
    "alibaba.com",
    "shopify.com"
  ];
  
  chrome.webNavigation.onCompleted.addListener(function(details) {
    const url = new URL(details.url);
    const hostname = url.hostname;
  
    if (marketplaces.some(marketplace => hostname.includes(marketplace))) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content.js"]
      });
    }
  }, { url: [{ urlMatches: 'https?://*/*' }] });
  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "searchTerm") {
      console.log("User searched for:", message.term);
      // Handle the search term (e.g., store it, use it for API calls, etc.)
    }
  });
  chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlMatches: '.*' }  // Adjust this to target specific sites if needed
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});
