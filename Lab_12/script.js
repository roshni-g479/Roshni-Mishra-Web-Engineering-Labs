/*
 * TechKart - Online Shopping Website
 * JavaScript logic for XML Loading, Shopping Cart, and Form Validation
 * Developed for 3rd-year B.Tech Computer Science Lab Project
 */

// ==========================================
// 1. XML LOADING & PARSING FUNCTION
// ==========================================

/**
 * Loads products from 'products.xml' using XMLHttpRequest
 * @param {Function} callback - Function that receives an array of product objects
 */
function loadProductsXML(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "products.xml", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
                try {
                    var xmlDoc = xhr.responseXML;

                    // Fallback for browsers that don't auto-parse responseXML
                    if (!xmlDoc || !xmlDoc.documentElement) {
                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                    }

                    var productNodes = xmlDoc.getElementsByTagName("product");
                    var productsList = [];

                    for (var i = 0; i < productNodes.length; i++) {
                        var node = productNodes[i];

                        // Helper to safely get tag text value
                        function getTagValue(tag) {
                            var el = node.getElementsByTagName(tag)[0];
                            return el ? el.textContent.trim() : "";
                        }

                        var product = {
                            id: parseInt(getTagValue("id")),
                            name: getTagValue("name"),
                            category: getTagValue("category"),
                            price: parseFloat(getTagValue("price")),
                            rating: getTagValue("rating"),
                            stock: getTagValue("stock"),
                            image: getTagValue("image"),
                            description: getTagValue("description")
                        };

                        productsList.push(product);
                    }

                    if (productsList.length > 0) {
                        callback(productsList);
                        return;
                    }
                } catch (e) {
                    console.warn("XML parsing exception, falling back:", e);
                }
            }
            
            // Fallback if opened via file:// without Live Server
            console.warn("Unable to read products.xml directly (Live Server recommended). Using fallback dataset.");
            callback(getFallbackProducts());
        }
    };

    xhr.onerror = function () {
        console.warn("Network / CORS error (Live Server recommended). Using fallback dataset.");
        callback(getFallbackProducts());
    };

    xhr.send();
}

/**
 * Fallback product data in case browser blocks file:// protocol XML loading
 */
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            category: "Electronics",
            price: 1499,
            rating: "4.5",
            stock: "In Stock",
            image: "images/headphones.svg",
            description: "High quality wireless over-ear headphones with deep bass, active noise reduction, built-in HD microphone, and up to 20 hours of battery life. Suitable for online classes, coding sessions, and music."
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            category: "Wearables",
            price: 2199,
            rating: "4.3",
            stock: "In Stock",
            image: "images/smartwatch.svg",
            description: "Full touch HD display smartwatch with 24/7 heart rate monitoring, step counter, sleep tracker, multiple sports modes, IP68 water resistance, and 7 days battery standby time."
        },
        {
            id: 3,
            name: "Ergonomic Gaming Mouse",
            category: "Accessories",
            price: 799,
            rating: "4.6",
            stock: "In Stock",
            image: "images/mouse.svg",
            description: "High-precision optical gaming mouse with customizable RGB lighting, 6 programmable buttons, 4 adjustable DPI levels (up to 3200 DPI), and an anti-slip ergonomic grip."
        },
        {
            id: 4,
            name: "Mechanical Gaming Keyboard",
            category: "Accessories",
            price: 2499,
            rating: "4.7",
            stock: "In Stock",
            image: "images/keyboard.svg",
            description: "Mechanical keyboard with tactile blue switches, multi-color LED backlighting, full anti-ghosting keys, and durable aluminum top plate. Great for fast programming and gaming."
        },
        {
            id: 5,
            name: "USB-C Fast Charger 65W",
            category: "Accessories",
            price: 899,
            rating: "4.4",
            stock: "In Stock",
            image: "images/charger.svg",
            description: "Compact GaN wall charger with dual USB-C power delivery ports. Supports fast charging for laptops, smartphones, power banks, and tablets with over-voltage protection."
        },
        {
            id: 6,
            name: "Waterproof Laptop Backpack",
            category: "Bags",
            price: 1199,
            rating: "4.5",
            stock: "In Stock",
            image: "images/backpack.svg",
            description: "Spacious 25-liter durable backpack featuring a dedicated padded compartment for up to 15.6 inch laptops, external USB charging port, water-resistant fabric, and anti-theft pocket."
        },
        {
            id: 7,
            name: "Portable Bluetooth Speaker",
            category: "Electronics",
            price: 1299,
            rating: "4.3",
            stock: "In Stock",
            image: "images/speaker.svg",
            description: "Portable cylinder wireless speaker delivering clear 360-degree sound and punchy bass. Features IPX6 splash resistance, FM radio support, and 12-hour continuous playtime."
        },
        {
            id: 8,
            name: "1080p Full HD Web Camera",
            category: "Electronics",
            price: 1699,
            rating: "4.2",
            stock: "In Stock",
            image: "images/webcam.svg",
            description: "Full HD 1080p plug-and-play USB webcam with dual noise-reduction microphones, wide-angle lens, auto low-light correction, and built-in privacy physical cover."
        }
    ];
}

// ==========================================
// 2. SHOPPING CART MANAGEMENT (localStorage)
// ==========================================

/**
 * Retrieves the current cart array from localStorage
 */
function getCart() {
    var cartData = localStorage.getItem("techkart_cart");
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Saves the cart array to localStorage and updates badge count
 */
function saveCart(cart) {
    localStorage.setItem("techkart_cart", JSON.stringify(cart));
    updateCartBadge();
}

/**
 * Updates the item counter badge shown in navigation bar
 */
function updateCartBadge() {
    var cart = getCart();
    var totalCount = 0;
    for (var i = 0; i < cart.length; i++) {
        totalCount += cart[i].quantity;
    }

    var badges = document.querySelectorAll(".cart-badge");
    badges.forEach(function (badge) {
        badge.textContent = totalCount;
    });
}

/**
 * Adds an item to the shopping cart
 */
function addToCart(productId, quantity) {
    quantity = quantity ? parseInt(quantity) : 1;

    loadProductsXML(function (products) {
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                product = products[i];
                break;
            }
        }

        if (!product) {
            alert("Product not found!");
            return;
        }

        var cart = getCart();
        var existingIndex = -1;

        for (var j = 0; j < cart.length; j++) {
            if (cart[j].id === productId) {
                existingIndex = j;
                break;
            }
        }

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }

        saveCart(cart);
        alert('"' + product.name + '" added to cart successfully!');
    });
}

/**
 * Removes an item from the cart by its product ID
 */
function removeFromCart(productId) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        var cart = getCart();
        var updatedCart = cart.filter(function (item) {
            return item.id !== productId;
        });

        saveCart(updatedCart);
        renderCartPage();
    }
}

/**
 * Updates the quantity of an item directly
 */
function changeQuantity(productId, delta) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity += delta;
            if (cart[i].quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            break;
        }
    }
    saveCart(cart);
    renderCartPage();
}

/**
 * Empties the entire cart
 */
function clearCart() {
    if (confirm("Are you sure you want to clear your entire cart?")) {
        localStorage.removeItem("techkart_cart");
        updateCartBadge();
        renderCartPage();
    }
}

/**
 * Mock Checkout function
 */
function checkoutCart() {
    var cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty. Add products before checking out!");
        return;
    }

    var grandTotal = 0;
    for (var i = 0; i < cart.length; i++) {
        grandTotal += cart[i].price * cart[i].quantity;
    }

    var confirmCheckout = confirm("Confirm placing order for ₹" + grandTotal.toLocaleString('en-IN') + "?");
    if (confirmCheckout) {
        alert("🎉 Order Placed Successfully!\n\nThank you for shopping with TechKart. Your order has been recorded.");
        localStorage.removeItem("techkart_cart");
        updateCartBadge();
        renderCartPage();
    }
}

// ==========================================
// 3. PAGE INITIALIZATION ROUTINES
// ==========================================

/**
 * 3.1 HOME PAGE: Load and display featured products (first 4 items)
 */
function initHomePage() {
    var featuredContainer = document.getElementById("featured-products");
    if (!featuredContainer) return;

    loadProductsXML(function (products) {
        featuredContainer.innerHTML = "";
        // Show first 4 products as featured
        var featured = products.slice(0, 4);

        featured.forEach(function (product) {
            var card = createProductCardHTML(product);
            featuredContainer.appendChild(card);
        });
    });
}

/**
 * 3.2 PRODUCTS PAGE: Display all products with category filter and search
 */
function initProductsPage() {
    var productsGrid = document.getElementById("products-grid");
    var categorySelect = document.getElementById("category-filter");
    var searchInput = document.getElementById("search-input");

    if (!productsGrid) return;

    loadProductsXML(function (products) {
        // Render helper
        function displayProducts(filteredList) {
            productsGrid.innerHTML = "";
            if (filteredList.length === 0) {
                productsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #777; padding: 30px;'>No products found matching your criteria.</p>";
                return;
            }
            filteredList.forEach(function (product) {
                productsGrid.appendChild(createProductCardHTML(product));
            });
        }

        // Initial display
        displayProducts(products);

        // Filter event listener
        function applyFilters() {
            var selectedCategory = categorySelect ? categorySelect.value : "All";
            var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

            var result = products.filter(function (item) {
                var matchesCategory = (selectedCategory === "All") || (item.category === selectedCategory);
                var matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
                return matchesCategory && matchesSearch;
            });

            displayProducts(result);
        }

        if (categorySelect) categorySelect.addEventListener("change", applyFilters);
        if (searchInput) searchInput.addEventListener("input", applyFilters);
    });
}

/**
 * Creates a DOM node for a single product card
 */
function createProductCardHTML(product) {
    var card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
            <div class="category-tag">${product.category}</div>
            <h3>${product.name}</h3>
        </div>
        <div>
            <div class="price">₹${product.price.toLocaleString('en-IN')}</div>
            <div class="card-actions">
                <a href="product-details.html?id=${product.id}" class="btn-details">Details</a>
                <button onclick="addToCart(${product.id}, 1)" class="btn-add-cart">Add to Cart</button>
            </div>
        </div>
    `;

    return card;
}

/**
 * 3.3 PRODUCT DETAILS PAGE: Load and display single product based on URL parameter
 */
function initProductDetailsPage() {
    var container = document.getElementById("product-detail-container");
    if (!container) return;

    var urlParams = new URLSearchParams(window.location.search);
    var productId = parseInt(urlParams.get("id"));

    if (isNaN(productId)) {
        container.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px;">
                <p>No product specified.</p>
                <a href="products.html" class="btn-primary" style="margin-top: 15px;">Back to Products</a>
            </div>
        `;
        return;
    }

    loadProductsXML(function (products) {
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                product = products[i];
                break;
            }
        }

        if (!product) {
            container.innerHTML = `
                <div style="text-align: center; width: 100%; padding: 40px;">
                    <p>Product not found.</p>
                    <a href="products.html" class="btn-primary" style="margin-top: 15px;">Back to Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="details-image-box">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="details-info-box">
                <h2>${product.name}</h2>
                <div class="details-meta">
                    Category: <strong>${product.category}</strong> | 
                    Rating: <strong>★ ${product.rating} / 5</strong>
                    <span class="badge-stock">${product.stock}</span>
                </div>
                <div class="details-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="details-desc">
                    <p><strong>Product Description:</strong></p>
                    <p>${product.description}</p>
                </div>
                <div class="details-action-row">
                    <label for="detail-qty"><strong>Quantity:</strong></label>
                    <input type="number" id="detail-qty" class="qty-input" value="1" min="1" max="10">
                    <button id="detail-add-btn" class="btn-primary btn-large">Add to Cart</button>
                    <a href="products.html" class="btn-secondary">Back to Products</a>
                </div>
            </div>
        `;

        document.getElementById("detail-add-btn").addEventListener("click", function () {
            var qty = parseInt(document.getElementById("detail-qty").value);
            if (isNaN(qty) || qty < 1) qty = 1;
            addToCart(product.id, qty);
        });
    });
}

/**
 * 3.4 SHOPPING CART PAGE: Renders the cart table and calculates totals
 */
function renderCartPage() {
    var cartContent = document.getElementById("cart-content");
    if (!cartContent) return;

    var cart = getCart();

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart-box">
                <p>Your shopping cart is currently empty.</p>
                <a href="products.html" class="btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    var subtotal = 0;
    var rowsHTML = "";

    cart.forEach(function (item) {
        var itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        rowsHTML += `
            <tr>
                <td>
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                </td>
                <td>
                    <strong>${item.name}</strong><br>
                    <small style="color: #777;">${item.category}</small>
                </td>
                <td>₹${item.price.toLocaleString('en-IN')}</td>
                <td>
                    <button onclick="changeQuantity(${item.id}, -1)" class="cart-qty-btn">-</button>
                    <span style="display: inline-block; width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="cart-qty-btn">+</button>
                </td>
                <td><strong>₹${itemTotal.toLocaleString('en-IN')}</strong></td>
                <td>
                    <button onclick="removeFromCart(${item.id})" class="btn-danger">Remove</button>
                </td>
            </tr>
        `;
    });

    var shipping = 0; // Free delivery for students!
    var total = subtotal + shipping;

    cartContent.innerHTML = `
        <div class="cart-table-wrapper">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Product Details</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>
        </div>

        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Items Subtotal:</span>
                <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
                <span>Shipping / Delivery:</span>
                <span style="color: #27ae60; font-weight: bold;">FREE</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total Amount:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-bottom-actions">
                <button onclick="clearCart()" class="btn-secondary">Clear Cart</button>
                <button onclick="checkoutCart()" class="btn-success">Place Order (Checkout)</button>
            </div>
        </div>
    `;
}

// ==========================================
// 4. FORM VALIDATION (LOGIN & REGISTRATION)
// ==========================================

/**
 * 4.1 Login Form Validation
 */
function initLoginForm() {
    var loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var usernameInput = document.getElementById("login-username");
        var passwordInput = document.getElementById("login-password");
        var userError = document.getElementById("login-user-error");
        var passError = document.getElementById("login-pass-error");
        var statusBox = document.getElementById("login-status");

        var isValid = true;

        // Reset errors
        userError.style.display = "none";
        passError.style.display = "none";
        statusBox.className = "form-status";
        statusBox.style.display = "none";

        // Validate Username
        if (usernameInput.value.trim() === "") {
            userError.textContent = "Please enter your username or email address.";
            userError.style.display = "block";
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === "") {
            passError.textContent = "Please enter your password.";
            passError.style.display = "block";
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passError.textContent = "Password must be at least 6 characters long.";
            passError.style.display = "block";
            isValid = false;
        }

        if (isValid) {
            statusBox.textContent = "Login Successful! Redirecting to home page...";
            statusBox.className = "form-status success";
            statusBox.style.display = "block";

            // Save active session user
            sessionStorage.setItem("currentUser", usernameInput.value.trim());

            setTimeout(function () {
                window.location.href = "index.html";
            }, 1200);
        }
    });
}

/**
 * 4.2 Registration Form Validation
 */
function initRegisterForm() {
    var registerForm = document.getElementById("register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = document.getElementById("reg-name").value.trim();
        var email = document.getElementById("reg-email").value.trim();
        var phone = document.getElementById("reg-phone").value.trim();
        var password = document.getElementById("reg-password").value;
        var confirmPass = document.getElementById("reg-confirm-password").value;
        var address = document.getElementById("reg-address").value.trim();

        var nameErr = document.getElementById("reg-name-error");
        var emailErr = document.getElementById("reg-email-error");
        var phoneErr = document.getElementById("reg-phone-error");
        var passErr = document.getElementById("reg-pass-error");
        var confirmErr = document.getElementById("reg-confirm-error");
        var addressErr = document.getElementById("reg-address-error");
        var statusBox = document.getElementById("reg-status");

        var isValid = true;

        // Reset error messages
        [nameErr, emailErr, phoneErr, passErr, confirmErr, addressErr].forEach(function (el) {
            if (el) el.style.display = "none";
        });
        statusBox.className = "form-status";
        statusBox.style.display = "none";

        // 1. Name validation
        if (name === "") {
            nameErr.textContent = "Full name is required.";
            nameErr.style.display = "block";
            isValid = false;
        } else if (name.length < 3) {
            nameErr.textContent = "Full name must be at least 3 characters.";
            nameErr.style.display = "block";
            isValid = false;
        }

        // 2. Email validation (standard email pattern)
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            emailErr.textContent = "Email address is required.";
            emailErr.style.display = "block";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            emailErr.textContent = "Please enter a valid email address (e.g. student@college.edu).";
            emailErr.style.display = "block";
            isValid = false;
        }

        // 3. Phone validation (10 digits)
        var phonePattern = /^[0-9]{10}$/;
        if (phone === "") {
            phoneErr.textContent = "Phone number is required.";
            phoneErr.style.display = "block";
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            phoneErr.textContent = "Please enter a valid 10-digit mobile number.";
            phoneErr.style.display = "block";
            isValid = false;
        }

        // 4. Password validation (min 6 characters)
        if (password === "") {
            passErr.textContent = "Password is required.";
            passErr.style.display = "block";
            isValid = false;
        } else if (password.length < 6) {
            passErr.textContent = "Password must be at least 6 characters long.";
            passErr.style.display = "block";
            isValid = false;
        }

        // 5. Confirm password validation
        if (confirmPass === "") {
            confirmErr.textContent = "Please confirm your password.";
            confirmErr.style.display = "block";
            isValid = false;
        } else if (password !== confirmPass) {
            confirmErr.textContent = "Passwords do not match.";
            confirmErr.style.display = "block";
            isValid = false;
        }

        // 6. Address validation
        if (address === "") {
            addressErr.textContent = "Delivery address is required.";
            addressErr.style.display = "block";
            isValid = false;
        }

        if (isValid) {
            statusBox.textContent = "Registration Successful! Redirecting to Login page...";
            statusBox.className = "form-status success";
            statusBox.style.display = "block";

            // Save user details to localStorage (mock user database)
            var users = JSON.parse(localStorage.getItem("techkart_users") || "[]");
            users.push({ name: name, email: email, phone: phone, address: address });
            localStorage.setItem("techkart_users", JSON.stringify(users));

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);
        }
    });
}

// ==========================================
// 5. GLOBAL INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // Update cart badge across any page
    updateCartBadge();

    // Check which page we are on and call the appropriate initializer
    if (document.getElementById("featured-products")) {
        initHomePage();
    }

    if (document.getElementById("products-grid")) {
        initProductsPage();
    }

    if (document.getElementById("product-detail-container")) {
        initProductDetailsPage();
    }

    if (document.getElementById("cart-content")) {
        renderCartPage();
    }

    if (document.getElementById("login-form")) {
        initLoginForm();
    }

    if (document.getElementById("register-form")) {
        initRegisterForm();
    }
});
