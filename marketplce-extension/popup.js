document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.search-button').addEventListener('click', function() {
      searchProducts();
  });

  function searchProducts() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getSearchTerm" }, function(response) {
              if (response && response.status === "success") {
                  const searchTerm = response.data.searchTerm;
                  fetchPrices(searchTerm);
              } else {
                  console.error(response.message);
              }
          });
      });
  }

  function fetchPrices(searchTerm) {
      chrome.runtime.sendMessage({ action: "fetchPrices", searchTerm }, function(response) {
          if (response && response.status === "success") {
              displayPrices(response.prices);
          }
      });
  }

  function displayPrices(prices) {
      const content = document.getElementById('content');
      content.innerHTML = '';
      prices.forEach(price => {
          const div = document.createElement('div');
          div.textContent = `${price.marketplace}: ${price.price}`;
          content.appendChild(div);
      });
  }
});
