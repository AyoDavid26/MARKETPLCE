document.getElementById('compare-prices').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://yourmarketplcewebsite.com' });
});
