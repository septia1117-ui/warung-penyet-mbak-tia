// Data Menu
const menuData = [
  {
    id: 1,
    name: "Ayam Penyet Sambal Matah",
    category: "ayam",
    price: 18000,
    image: "images/ayam-sambal-matah.jpeg",
    description: "Ayam goreng crispy dengan sambal matah pedas khas Bali",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Ayam Penyet Original",
    category: "ayam",
    price: 15000,
    image: "images/ayam-penyet-original.jpeg",
    description: "Ayam goreng penyet dengan sambal terasi pedas mantap",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Lele Penyet Jumbo",
    category: "lele",
    price: 17000,
    image: "images/lele-penyet-jumbo.jpeg",
    description: "Lele goreng crispy ukuran jumbo dengan sambal khas",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Ati Ampela Penyet",
    category: "ayam",
    price: 12000,
    image: "images/ati-ampela-pedas.webp",
    description: "Ati Ampela dengan tempe penyet pedas",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Bebek Penyet Pedas",
    category: "bebek",
    price: 25000,
    image: "images/bebek-penyet-pedas.jpeg",
    description: "Bebek goreng empuk dengan sambal extra pedas",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Nila Penyet Bakar",
    category: "nila",
    price: 16000,
    image: "images/nila-bakar-penyet.webp",
    description: "Ikan nila bakar dengan bumbu kecap manis",
    rating: 4.5,
  },
  {
    id: 7,
    name: "Es Teh Manis",
    category: "minuman",
    price: 3000,
    image: "images/es-teh.jpg",
    description: "Teh manis dingin segar",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Es Jeruk",
    category: "minuman",
    price: 5000,
    image: "images/es-jeruk.webp",
    description: "Jeruk peras segar dengan es batu",
    rating: 4.7,
  },
  {
    id: 9,
    name: "Jus Alpukat",
    category: "minuman",
    price: 8000,
    image: "images/jus-alpukat.jpeg",
    description: "Jus alpukat creamy dengan susu coklat",
    rating: 4.9,
  },
];

// Global state
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentCategory = localStorage.getItem("currentCategory") || "all";
let searchQuery = localStorage.getItem("searchQuery") || "";

// Format Rupiah
function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// Get cart item quantity
function getCartQuantity(itemId) {
  const cartItem = cart.find((item) => item.id === itemId);
  return cartItem ? cartItem.quantity : 0;
}

// Update cart badge
function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartBadge").textContent = totalItems;
}

// Add to cart
function addToCart(itemId) {
  const menuItem = menuData.find((item) => item.id === itemId);
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: 1,
    });
  }

  saveCart();
  renderMenu();
  renderCart();
}

// Remove from cart
function removeFromCart(itemId) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity === 0) {
      cart = cart.filter((item) => item.id !== itemId);
    }
  }

  saveCart();
  renderMenu();
  renderCart();
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += change;
    if (existingItem.quantity <= 0) {
      cart = cart.filter((item) => item.id !== itemId);
    }
  }

  saveCart();
  renderCart();
  renderMenu();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Render Menu
function renderMenu() {
  const container = document.getElementById("menuContainer");
  const filteredMenu = menuData.filter((item) => {
    const matchCategory =
      currentCategory === "all" || item.category === currentCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filteredMenu.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i data-lucide="search-x" style="width: 64px; height: 64px; opacity: 0.3;"></i>
        <p class="mt-3">Menu tidak ditemukan</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filteredMenu
    .map((item) => {
      const quantity = getCartQuantity(item.id);
      const buttonHtml =
        quantity > 0
          ? `
        <div class="quantity-controls w-100">
          <button class="quantity-btn" onclick="removeFromCart(${item.id})">
            <i data-lucide="minus" style="width: 16px; height: 16px;"></i>
          </button>
          <span class="quantity-display">${quantity}</span>
          <button class="quantity-btn" onclick="addToCart(${item.id})">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      `
          : `
        <button class="btn btn-order w-100" onclick="addToCart(${item.id})">
          <i data-lucide="shopping-cart" style="width: 16px; height: 16px;"></i>
          Pesan
        </button>
      `;

      return `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="card menu-card">
            <div style="position: relative;">
              <img src="${item.image}" class="menu-img" alt="${item.name}">
              <span class="category-badge">${item.category.toUpperCase()}</span>
            </div>
            <div class="card-body">
              <h6 class="card-title">${item.name}</h6>
              <div class="rating mb-2">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: currentColor;"></i>
                ${item.rating}
              </div>
              <p class="card-text small text-muted">${item.description}</p>
              <div class="price mb-3">${formatRupiah(item.price)}</div>
              ${buttonHtml}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  lucide.createIcons();
}

// Render Cart
function renderCart() {
  const cartBody = document.getElementById("cartBody");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-cart" style="width: 64px; height: 64px; opacity: 0.3;"></i>
        <p class="mt-3">Keranjang belanja kosong</p>
      </div>
    `;
    cartTotal.textContent = "Rp 0";
    lucide.createIcons();
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartBody.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRupiah(item.price)}</div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateCartItemQuantity(${
          item.id
        }, -1)">
          <i data-lucide="minus" style="width: 16px; height: 16px;"></i>
        </button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateCartItemQuantity(${
          item.id
        }, 1)">
          <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  cartTotal.textContent = formatRupiah(total);
  lucide.createIcons();
}

// Checkout via WhatsApp
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang belanja kosong!");
    return;
  }

  const phoneNumber = "6282297978885";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = "Halo Mbak Tia, saya mau pesan:\n\n";

  cart.forEach((item) => {
    message += `📦 ${item.name}\n`;
    message += `   Qty: ${item.quantity} x ${formatRupiah(
      item.price
    )} = ${formatRupiah(item.price * item.quantity)}\n\n`;
  });

  message += `💰 *Total: ${formatRupiah(total)}*\n\n`;
  message += "Mohon info ketersediaan ya!";

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

// Category Filter
document.getElementById("categoryFilter").addEventListener("click", (e) => {
  if (e.target.classList.contains("category-btn")) {
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentCategory = e.target.dataset.category;
    localStorage.setItem("currentCategory", currentCategory);
    renderMenu();
  }
});

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  localStorage.setItem("searchQuery", searchQuery);
  renderMenu();
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  darkModeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
  lucide.createIcons();
}

darkModeToggle.addEventListener("click", toggleDarkMode);

// Load Dark Mode Preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  darkModeIcon.setAttribute("data-lucide", "sun");
}

// Load saved search and category
document.getElementById("searchInput").value = searchQuery;
document.querySelectorAll(".category-btn").forEach((btn) => {
  if (btn.dataset.category === currentCategory) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
});

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered"))
    .catch((err) => console.log("Service Worker registration failed:", err));
}

// Initialize
renderMenu();
renderCart();
updateCartBadge();
lucide.createIcons();
