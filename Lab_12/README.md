# TechKart - Simple Online Shopping Website
> **Academic Project for 3rd-Year B.Tech Computer Science & Engineering (Web Technologies Lab)**

## 📌 Project Overview
TechKart is a clean, student-friendly e-commerce web application developed using only fundamental web technologies: **HTML5, CSS3, Vanilla JavaScript, and XML**.

It is specifically designed for college lab evaluations, practical exams, and viva voce. The project avoids external frameworks (no React, no Bootstrap, no jQuery, no PHP, no external databases) to keep the codebase pure, transparent, and easy to explain.

---

## 🚀 Key Features

1. **Home Page (`index.html`)**:
   - Clean navigation bar and hero introduction.
   - Highlights key student benefits.
   - Dynamically loads and presents 4 "Featured Products" parsed from `products.xml`.

2. **Products Catalog (`products.html`)**:
   - Displays all products stored in the XML database.
   - Live category filter (All, Electronics, Accessories, Wearables, Bags).
   - Live instant keyword search.
   - Each card displays product image, category, name, price, "Details" link, and "Add to Cart" button.

3. **Product Details Page (`product-details.html`)**:
   - Dynamically reads the URL query parameter (`?id=X`).
   - Fetches and renders detailed product info (high-resolution illustration, rating, stock status, full description).
   - Quantity selector with direct "Add to Cart" capability.

4. **Shopping Cart Page (`cart.html`)**:
   - Complete cart management backed by browser `localStorage`.
   - Displays items in a clean table: Item Image, Name, Price, Quantity increment/decrement buttons, Subtotal, and Remove action.
   - Automatically computes item subtotal, shipping cost (Free), and grand total.
   - "Clear Cart" and "Place Order (Checkout)" functions.

5. **Login Page (`login.html`)**:
   - Clean, student-friendly login form.
   - JavaScript validation for empty fields and password length (&ge; 6 characters).
   - Dynamic error prompts and mock session storage upon successful sign-in.

6. **Registration Page (`register.html`)**:
   - Registration form with fields: Full Name, Email, 10-digit Mobile Number, Password, Confirm Password, and Campus Address.
   - Rigorous client-side JavaScript validation (regex pattern for email, 10-digit number validation, password match check).
   - Success redirect to the Login page.

7. **XML Product Database (`products.xml`)**:
   - Clean XML document storing structured product tags (`<id>`, `<name>`, `<category>`, `<price>`, `<rating>`, `<stock>`, `<image>`, `<description>`).

---

## 📂 File Structure

```text
online-shopping-website/
│
├── index.html              # Home page with introduction & featured products
├── products.html           # Full product catalog with filter & search
├── product-details.html    # Detailed view of a selected product
├── cart.html               # Shopping cart & order total calculation
├── login.html              # User login page with JS validation
├── register.html           # Registration page with comprehensive JS validation
├── products.xml            # XML database holding all product details
├── style.css               # Clean styling (No Bootstrap, pure CSS)
├── script.js               # XML parsing, cart logic, and form validation
├── README.md               # Documentation & viva Q&A guide
└── images/                 # Local standalone SVG illustrations
    ├── headphones.svg
    ├── smartwatch.svg
    ├── mouse.svg
    ├── keyboard.svg
    ├── charger.svg
    ├── backpack.svg
    ├── speaker.svg
    └── webcam.svg
```

---

## 🛠️ How to Run the Project in VS Code Live Server

Because browsers restrict local XML file fetching (`file:///` protocol) for security reasons (CORS policy), the project should be run through a local HTTP server such as **VS Code Live Server**.

### Method 1: Using VS Code Live Server (Recommended)
1. Open Visual Studio Code.
2. Click **File > Open Folder...** and select the `online-shopping-website` directory.
3. Install the **Live Server** extension (by Ritwick Dey) from the VS Code Extensions tab (`Ctrl+Shift+X`) if not already installed.
4. Right-click on `index.html` and click **"Open with Live Server"** (or click **"Go Live"** in the bottom status bar).
5. The website will open in your browser at `http://127.0.0.1:5500/index.html`.

### Method 2: Using Python Simple HTTP Server
If you prefer running from the command terminal:
```bash
# Navigate to project directory
cd online-shopping-website

# Run Python HTTP Server
python -m http.server 8000
```
Then open `http://localhost:8000` in any web browser.

---

## 🎓 Viva Voce Questions & Answers

**Q1: How is the product data loaded from `products.xml`?**
> **Answer:** We use the native `XMLHttpRequest` object in JavaScript (`xhr.open("GET", "products.xml", true)`). When `xhr.readyState === 4` and `xhr.status === 200`, the XML document is parsed using `getElementsByTagName("product")` to extract tags like `<name>`, `<price>`, `<image>`, and `<description>`.

**Q2: How does the shopping cart persist when navigating across different pages?**
> **Answer:** We store the cart items in the browser's HTML5 `localStorage` under the key `"techkart_cart"`. JavaScript serializes the cart array using `JSON.stringify()` on save, and reconstructs it using `JSON.parse()` on load.

**Q3: How is client-side form validation implemented?**
> **Answer:** In `script.js`, we hook into the form `submit` event using `e.preventDefault()`. We read field values and validate them:
> - Regular expression `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` validates email format.
> - Regular expression `/^[0-9]{10}$/` verifies a 10-digit mobile number.
> - Conditional statements ensure password length &ge; 6 characters and password matching.
> - Error messages are conditionally revealed using `display: block` on dedicated `.error-msg` spans.

**Q4: How does `product-details.html` know which product to display?**
> **Answer:** When clicking "Details" on a product card, the link appends the product ID as a query parameter (e.g. `product-details.html?id=2`). On page load, `new URLSearchParams(window.location.search).get("id")` retrieves the ID, and JavaScript searches `products.xml` for the matching `<id>`.
