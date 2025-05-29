// script.js

/* === Demo Data === */
// Users (demo accounts)
const users = [
  { email: "player1@example.com", password: "abc123", name: "PlayerOne" }
];
// Badges definitions
const badges = [
  { id: 1, name: "Welcome", desc: "Logged in", icon: "fa-handshake" },
  { id: 2, name: "First Purchase", desc: "Completed checkout", icon: "fa-shopping-cart" },
  { id: 3, name: "Reviewer", desc: "Left a review", icon: "fa-comment" }
];
// Products list
const products = [
  { id: 1, title: "Cyber Strike", price: 59.99, img: "https://via.placeholder.com/300x150", category: "FPS" },
  { id: 2, title: "Mystic Quest", price: 39.99, img: "https://via.placeholder.com/300x150", category: "RPG" },
  { id: 3, title: "Racing Pro", price: 29.99, img: "https://via.placeholder.com/300x150", category: "Racing" },
  { id: 4, title: "Battle Arena", price: 49.99, img: "https://via.placeholder.com/300x150", category: "MOBA" },
  { id: 5, title: "Soccer Stars", price: 19.99, img: "https://via.placeholder.com/300x150", category: "Sports" },
  { id: 6, title: "Fantasy Land", price: 44.99, img: "https://via.placeholder.com/300x150", category: "Adventure" }
];

// State and Storage
let currentUser = localStorage.getItem("currentUser") || null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let earnedBadges = JSON.parse(localStorage.getItem("badges")) || [];

// Helper: Update LocalStorage on cart and badges
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }
function saveBadges() { localStorage.setItem("badges", JSON.stringify(earnedBadges)); }

// Load Products into Page
function displayProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  list.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}">
      <h3>${prod.title}</h3>
      <p>$${prod.price.toFixed(2)}</p>
      <button class="addCartBtn" data-id="${prod.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Filter products based on search input
document.getElementById("searchInput").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(term));
  displayProducts(filtered);
});

// Cart UI Updates
function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.length;
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      ${item.title} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${idx})">&times;</button>
    `;
    list.appendChild(li);
  });
  document.getElementById("cartTotal").innerText = `Total: $${total.toFixed(2)}`;
}

// Add product to cart
document.body.addEventListener("click", e => {
  if (e.target.classList.contains("addCartBtn")) {
    const id = parseInt(e.target.dataset.id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      cart.push(prod);
      saveCart();
      updateCartUI();
      alert(`Added "${prod.title}" to cart.`);
    }
  }
});

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

// Show/Hide Cart Overlay
document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartOverlay").style.display = "flex";
  updateCartUI();
});
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartOverlay").style.display = "none";
});

// Checkout button from cart overlay
document.getElementById("checkoutBtn").addEventListener("click", () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
});

// Dark/Light Mode Toggle (with localStorage)
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});
// On page load, set theme from storage or OS preference
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.body.classList.toggle("dark", saved === "dark");
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("dark");
  }
});

// Display badges earned
function displayBadges() {
  const container = document.getElementById("badgeSection");
  if (!currentUser) { container.style.display = "none"; return; }
  container.style.display = "block";
  container.querySelector("h2").innerText = `${currentUser}'s Badges`;
  container.innerHTML = "<h2>Your Badges</h2>";
  earnedBadges.forEach(id => {
    const b = badges.find(x => x.id === id);
    if (b) {
      const span = document.createElement("span");
      span.className = "badge";
      span.innerHTML = `<i class="fas ${b.icon}"></i>${b.name}`;
      container.appendChild(span);
    }
  });
}

// Award a badge if not already earned
function earnBadge(id) {
  if (!earnedBadges.includes(id)) {
    earnedBadges.push(id);
    saveBadges();
    alert(`Congratulations! You earned the "${badges.find(b => b.id===id).name}" badge!`);
    displayBadges();
  }
}

// Login Form Handling (front-end simulation)
document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "flex";
});
document.querySelectorAll(".closeModal").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});
document.getElementById("showSignup").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "flex";
});
document.getElementById("loginFormElem").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  const user = users.find(u => u.email===email && u.password===pass);
  if (user) {
    currentUser = user.name;
    localStorage.setItem("currentUser", currentUser);
    document.getElementById("loginForm").style.display = "none";
    alert(`Welcome back, ${currentUser}!`);
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
    earnBadge(1); // Welcome badge
    displayBadges();
  } else {
    alert("Invalid credentials.");
  }
});
// Signup Form
document.getElementById("signupFormElem").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPassword").value;
  // (In real app, check duplicates; here we just add)
  users.push({ name, email, password: pass });
  alert("Sign-up successful! Please log in.");
  document.getElementById("signupForm").style.display = "none";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("badgeSection").style.display = "none";
  alert("Logged out.");
});

// Checkout Page Logic
if (window.location.pathname.endsWith("checkout.html")) {
  const checkoutItemsDiv = document.getElementById("checkoutItems");
  const checkoutTotalDiv = document.getElementById("checkoutTotal");
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  storedCart.forEach(item => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `${item.title} - $${item.price.toFixed(2)}`;
    checkoutItemsDiv.appendChild(div);
  });
  checkoutTotalDiv.innerText = `Total: $${total.toFixed(2)}`;
  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (storedCart.length > 0) earnBadge(2); // First Purchase badge
    alert("Order placed! Thank you for shopping.");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  });
  document.getElementById("backToShop").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// Initial Setup on Page Load
window.addEventListener("DOMContentLoaded", () => {
  displayProducts(products);         // Show all products initially
  updateCartUI();                    // Update cart count/contents
  if (currentUser) {
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
    displayBadges();                 // Show user's badges
  }
  // Awarding reviewer badge example (not tied to form here, but placeholder)
  // (If a review feature existed, we could call earnBadge(3) when user submits a review)
});
