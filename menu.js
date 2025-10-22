// menu.js
import { addToCart } from "./cart.js"; // универсальный скрипт корзины
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Firebase конфиг
const firebaseConfig = {
  apiKey: "AIzaSyDSkajRSnMwdzr8XOgjmOA_gseA1tsVVYw",
  authDomain: "pizza-dbe68.firebaseapp.com",
  databaseURL: "https://pizza-dbe68-default-rtdb.firebaseio.com",
  projectId: "pizza-dbe68",
  storageBucket: "pizza-dbe68.firebasestorage.app",
  messagingSenderId: "559820954556",
  appId: "1:559820954556:web:2107090d8da535c12129b9",
  measurementId: "G-LPQ2HQVEX9"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const menuContainer = document.getElementById("menu-container");

// Модальное окно
const modal = document.getElementById("pizzaModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const addToCartBtn = document.getElementById("addToCartBtn");
const pizzaSize = document.getElementById("pizzaSize");

let selectedPizza = null;

// Загрузка меню из Firebase
async function loadMenu() {
  try {
    const snapshot = await get(ref(db, "Menu"));
    if (snapshot.exists()) {
      renderMenu(snapshot.val());
    } else {
      menuContainer.innerHTML = `<p class="text-center text-gray-500">Меню пока недоступно 😔</p>`;
    }
  } catch (error) {
    console.error("Ошибка при получении меню:", error);
  }
}

// Отрисовка карточек меню
function renderMenu(menuData) {
  menuContainer.innerHTML = "";
  Object.entries(menuData).forEach(([key, item]) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between transition transform hover:-translate-y-1 hover:shadow-lg w-64 flex-shrink-0";

    card.innerHTML = `
      <div class="w-full h-48 mb-4 overflow-hidden rounded-xl flex items-center justify-center bg-gray-100">
        <img src="${item.Image}" alt="${item.Name}" class="w-full h-full object-contain">
      </div>
      <div class="flex flex-col flex-grow">
        <h4 class="text-lg font-semibold mb-2">${item.Name}</h4>
        <p class="text-gray-600 text-sm mb-4 flex-grow">${item.Compound}</p>
        <div class="flex justify-between items-center mt-auto">
          <p class="font-bold text-md">${item.Price} ₽</p>
          <button 
            class="bg-yellow-600 text-white px-3 py-2 rounded-xl hover:bg-yellow-700 text-sm openModalBtn"
            data-name="${item.Name}"
            data-img="${item.Image}"
            data-compound="${item.Compound}"
            data-price="${item.Price}">
            Добавить в корзину
          </button>
        </div>
      </div>
    `;
    menuContainer.appendChild(card);
  });

  // Назначаем обработчики кнопкам открытия модалки
  document.querySelectorAll(".openModalBtn").forEach(button => {
    button.addEventListener("click", () => openModal(button));
  });
}

// Открытие модального окна
function openModal(button) {
  selectedPizza = {
    name: button.dataset.name,
    img: button.dataset.img,
    compound: button.dataset.compound,
    price: parseInt(button.dataset.price)
  };

  modalTitle.textContent = selectedPizza.name;
  modalImage.src = selectedPizza.img;
  modalDesc.textContent = selectedPizza.compound;
  modalPrice.textContent = `Цена: ${selectedPizza.price} ₽`;
  pizzaSize.value = "30"; // стандартный размер в см
  modal.classList.remove("hidden");
  modal.classList.add("flex"); // центрируем через flex
}

// Закрытие модалки
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

// Добавление пиццы в корзину с выбранным размером
addToCartBtn.addEventListener("click", () => {
  const size = pizzaSize.value;
  let priceMultiplier = 1;

  // Пример изменения цены в зависимости от размера
  if (size === "35") priceMultiplier = 1.3;
  if (size === "40") priceMultiplier = 1.6;

  const finalPrice = Math.round(selectedPizza.price * priceMultiplier);

  addToCart({
    name: selectedPizza.name,
    size: size,
    price: finalPrice
  });

  alert(`Добавлена пицца "${selectedPizza.name}" (${size} см) в корзину!`);
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Запуск
loadMenu();
