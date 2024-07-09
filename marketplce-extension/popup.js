document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchQuery').value;
    if (query) {
      chrome.tabs.create({ url: `https://www.marketplace.com/search?q=${query}` });
    }
  });
  