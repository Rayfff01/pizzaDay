// Элементы корзины
const cartButton = document.getElementById("cartButton");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartContainer = document.getElementById("cart-container");

// Получаем корзину из localStorage или создаём пустую
let cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];

// Функция отрисовки корзины
function renderCart() {
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="text-gray-500">Корзина пуста 😔</p>';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";
    div.innerHTML = `
      <span>${item.name} (${item.size} см) — ${item.price} ₽</span>
      <button class="text-red-500" data-index="${index}">&times;</button>
    `;
    cartContainer.appendChild(div);
  });

  // Удаление элемента
  cartContainer.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });
}

// Сохранение в localStorage
function saveCart() {
  localStorage.setItem("pizzaCart", JSON.stringify(cart));
}

// Открытие корзины
cartButton?.addEventListener("click", () => {
  renderCart();
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

// Закрытие корзины
closeCart?.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
});

// Закрытие при клике вне окна
cartModal?.addEventListener("click", e => {
  if (e.target === cartModal) {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
  }
});

// Функция добавления пиццы в корзину
export function addToCart(pizza) {
  cart.push(pizza);
  saveCart();
}
