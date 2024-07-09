// Function to extract search term from the page and send it to the Flask server
function extractAndSendSearchTerm() {
    // Example: Change the selector to match the search input field on your target site
    const searchInput = document.querySelector('input[name="field-keywords"]');
    
    if (searchInput) {
        const searchTerm = searchInput.value;
        
        fetch('http://127.0.0.1:5000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm: searchTerm })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Handle the received data here
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('Search input not found on the page.');
    }
}

// Run the function when the content script is loaded
extractAndSendSearchTerm();
