// Menyu Məlumatları
const menuData = [
  { id: 1, name: "Espresso", category: "hot", price: 3.00, icon: "☕", desc: "Tünd və klassik tək shot espresso." },
  { id: 2, name: "Americano", category: "hot", price: 3.50, icon: "🫖", desc: "İsti su ilə yumşaldılmış zəngin espresso." },
  { id: 3, name: "Cappuccino", category: "hot", price: 4.50, icon: "🥛", desc: "Qalın süd köpüyü və klassik kofe dadı." },
  { id: 4, name: "Caramel Latte", category: "hot", price: 5.00, icon: "🍯", desc: "İsti süd, espresso və karamel şərbəti." },
  { id: 5, name: "Iced Americano", category: "cold", price: 4.00, icon: "🧊", desc: "Buzlu və təravətləndirici klassik seçim." },
  { id: 6, name: "Ice Spanish Latte", category: "cold", price: 5.50, icon: "🥤", desc: "Qatılaşdırılmış süd və buzla şirin soyuq latte." },
  { id: 7, name: "Espresso Tonic", category: "cold", price: 5.50, icon: "🍋", desc: "Tonik, buz və limon dilimi ilə fərqli dad." },
  { id: 8, name: "Şokoladlı Kruassan", category: "dessert", price: 3.50, icon: "🥐", desc: "Xırtıldayan xəmir və isti şokolad içliyi." },
  { id: 9, name: "San Sebastian Cheesecake", category: "dessert", price: 6.00, icon: "🍰", desc: "Krem pendirli və karamelli məşhur desert." }
];

let cart = [];

const menuGrid = document.getElementById("menuGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const cartModal = document.getElementById("cartModal");
const toast = document.getElementById("toast");

// Menyunu ekrana çıxar
function renderMenu(category = "all") {
  menuGrid.innerHTML = "";
  const filtered = category === "all"
    ? menuData
    : menuData.filter(item => item.category === category);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <div>
        <div class="menu-icon">${item.icon}</div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div class="menu-bottom">
        <span class="menu-price">${item.price.toFixed(2)} ₼</span>
        <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">+ Səbətə at</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Kateqoriya filtrləri
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.category);
  });
});

// Bildiriş göstər
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// Səbətə əlavə et
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`"${name}" səbətə əlavə olundu!`);
}

// Sayı dəyiş
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Səbəti yenilə
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-msg">Səbətin hələ boşdur.</p>`;
    totalPriceEl.textContent = "0.00 ₼";
    return;
  }

  let total = 0;
  cartItemsEl.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price.toFixed(2)} ₼</small>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  totalPriceEl.textContent = `${total.toFixed(2)} ₼`;
}

// Modal aç/bağla
document.getElementById("openCartBtn").addEventListener("click", () => {
  cartModal.classList.add("show");
});

document.getElementById("closeCartBtn").addEventListener("click", () => {
  cartModal.classList.remove("show");
});

// Sifarişi təsdiqlə
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Səbət boşdur! Əvvəlcə məhsul seçin.");
    return;
  }
  const name = document.getElementById("customerName").value.trim() || "Müştəri";
  const time = document.getElementById("pickupTime").value.trim() || "10 dəqiqəyə";

  alert(`Təşəkkürlər, ${name}! ☕\nSifarişiniz qəbul olundu və ${time} hazır olacaq.\nÜnvan: Coffee Passengers (103 Mir Cəlal küç.)`);
  cart = [];
  updateCartUI();
  cartModal.classList.remove("show");
});

// Öz Kofeni Yarat (Custom Builder)
const baseCoffee = document.getElementById("baseCoffee");
const milkType = document.getElementById("milkType");
const syrupType = document.getElementById("syrupType");
const sizeRadios = document.querySelectorAll('input[name="size"]');
const customTitle = document.getElementById("customTitle");
const customDesc = document.getElementById("customDesc");
const customPriceEl = document.getElementById("customPrice");
const cupVisual = document.getElementById("cupVisual");

let currentCustom = {
  fullName: "Latte (S)",
  totalPrice: 4.50
};

function updateCustomCoffee() {
  const baseOption = baseCoffee.options[baseCoffee.selectedIndex];
  const milkOption = milkType.options[milkType.selectedIndex];
  const syrupOption = syrupType.options[syrupType.selectedIndex];

  let sizePrice = 0;
  let sizeLabel = "S";
  sizeRadios.forEach(r => {
    if (r.checked) {
      sizePrice = parseFloat(r.value);
      sizeLabel = r.parentElement.textContent.trim().split(" ")[0];
    }
  });

  const total =
    parseFloat(baseCoffee.value) +
    sizePrice +
    parseFloat(milkType.value) +
    parseFloat(syrupType.value);

  const title = `${baseOption.dataset.name} (${sizeLabel})`;
  const desc = `${milkOption.dataset.name} • ${syrupOption.dataset.name}`;

  customTitle.textContent = title;
  customDesc.textContent = desc;
  customPriceEl.textContent = `${total.toFixed(2)} ₼`;

  // Stəkan ölçüsünə görə animasiya
  const scale = sizeLabel === "S" ? 1 : sizeLabel === "M" ? 1.15 : 1.3;
  cupVisual.style.transform = `scale(${scale})`;

  currentCustom = {
    fullName: `${title} [${desc}]`,
    totalPrice: total
  };
}

[baseCoffee, milkType, syrupType].forEach(el => el.addEventListener("change", updateCustomCoffee));
sizeRadios.forEach(r => r.addEventListener("change", updateCustomCoffee));

document.getElementById("addCustomBtn").addEventListener("click", () => {
  addToCart(currentCustom.fullName, currentCustom.totalPrice);
});

// İlk açılışda menyunu yüklə
renderMenu();
updateCustomCoffee();