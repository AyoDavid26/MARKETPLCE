console.log('Background script loaded.');

// List of marketplaces to monitor
const marketplaces = [
    "amazon.com",
    "ebay.com",
    "walmart.com",
    "google.com",
    "alibaba.com",
    "shopify.com"
];

// Listen for when the navigation is completed on any URL
chrome.webNavigation.onCompleted.addListener(function(details) {
    const url = new URL(details.url);
    const hostname = url.hostname;
  
    if (marketplaces.some(marketplace => hostname.includes(marketplace))) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ["content.js"]
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Script injection failed: ", chrome.runtime.lastError);
            }
        });
    }
}, { url: [{ urlMatches: 'https?://*/*' }] });

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "searchTerm") {
        console.log("User searched for:", message.term);
        // Handle the search term (e.g., store it, use it for API calls, etc.)
    }
});

// Handle installation of the extension
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

// Listen for updates to any tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        if (marketplaces.some(marketplace => hostname.includes(marketplace))) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Script injection failed: ", chrome.runtime.lastError);
                }
            });
        }
    }
});

// Original background.js content for message listening
chrome.runtime.onInstalled.addListener(() => {
  console.log("Background script loaded.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPrices") {
    // Dummy data for fetched prices
    const fetchedPrices = [
      { marketplace: 'Amazon', price: '$100' },
      { marketplace: 'eBay', price: '$90' },
      { marketplace: 'Alibaba', price: '$80' }
    ];
    sendResponse({ status: "success", prices: fetchedPrices });
  }
});
