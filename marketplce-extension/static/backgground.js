chrome.runtime.onInstalled.addListener(() => {
    console.log('Price Comparator Extension Installed');
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
  