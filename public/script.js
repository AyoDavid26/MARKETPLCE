document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);

    // Display initial products (if any)
    fetchProducts()
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Function to handle search form submission
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        fetchProducts(query)
            .then(products => {
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }
}

// Function to simulate fetching products from backend API
function fetchProducts(query = '') {
    return new Promise((resolve, reject) => {
        // Simulate network latency
        setTimeout(() => {
            // Sample products data
            const products = [
                {
                    id: 1,
                    name: "Product 1",
                    price: 10,
                    image: "images/product1.jpg"
                },
                {
                    id: 2,
                    name: "Product 2",
                    price: 20,
                    image: "images/product2.jpg"
                },
                {
                    id: 3,
                    name: "Product 3",
                    price: 30,
                    image: "images/product3.jpg"
                }
            ];
            
            // Filter products based on search query
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            
            resolve(filteredProducts);
        }, 1000); // 1 second delay
    });
}

// Function to display products on the web page
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.image}" alt="${product.name}">
                <p>Price: $${product.price}</p>
            `;

            productsContainer.appendChild(productElement);
        });
    }
}
