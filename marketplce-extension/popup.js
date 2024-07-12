document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchQuery');
  const resultsDiv = document.getElementById('results');

  if (searchButton && searchInput) {
      searchButton.addEventListener('click', function () {
          const searchTerm = searchInput.value.trim();
          if (searchTerm) {
              fetch('http://127.0.0.1:5000/scrape', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ searchTerm: searchTerm })
              })
              .then(response => response.json())
              .then(data => {
                  resultsDiv.innerHTML = '';  // Clear previous results
                  if (data.prices && data.prices.length > 0) {
                      data.prices.forEach(price => {
                          const resultItem = document.createElement('div');
                          resultItem.textContent = `${price.marketplace}: ${price.price}`;
                          resultsDiv.appendChild(resultItem);
                      });
                  } else {
                      resultsDiv.textContent = 'No prices found.';
                  }
              })
              .catch(error => {
                  console.error('Error:', error);
                  resultsDiv.textContent = 'Error fetching prices.';
              });
          } else {
              console.error('Search input is empty.');
              resultsDiv.textContent = 'Please enter a search term.';
          }
      });
  } else {
      console.error('Search button or input not found on the page.');
  }
});
