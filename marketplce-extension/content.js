chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSearchTerm") {
        extractAndSendSearchTerm(sendResponse);
        return true; // Indicates you wish to send a response asynchronously
    }
});

function extractAndSendSearchTerm(sendResponse) {
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
            sendResponse({ status: "success", data: data });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ status: "error", message: error.message });
        });
    } else {
        console.error('Search input not found on the page.');
        sendResponse({ status: "error", message: 'Search input not found on the page.' });
    }
}
