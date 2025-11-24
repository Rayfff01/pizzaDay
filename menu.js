import { addToCart } from "./cart.js";
import { db } from "./firebaseConfig.js"; // <- импорт готового db
import { ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const pizzasContainer = document.getElementById("pizzas-container");
  const snacksContainer = document.getElementById("snacks-container");
  const dessertsContainer = document.getElementById("desserts-container");

  const modal = document.getElementById("pizzaModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDesc = document.getElementById("modalDesc");
  const modalPrice = document.getElementById("modalPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const pizzaSize = document.getElementById("pizzaSize");
  const modalSizeContainer = document.getElementById("modalSizeContainer");

  let selectedItem = null;
  let isSmallItem = false;

  // --- Загружаем меню из Firebase ---
  async function loadMenu() {
    try {
      const snapshot = await get(ref(db, "Menu"));
      if (snapshot.exists()) {
        renderMenu(snapshot.val());
      } else {
        pizzasContainer.innerHTML = `<p class="text-gray-500">Меню пока недоступно 😔</p>`;
      }
    } catch (error) {
      console.error("Ошибка при получении меню:", error);
    }
  }

  // --- Отрисовка карточек ---
  function renderMenu(menuData) {
    pizzasContainer.innerHTML = "";
    snacksContainer.innerHTML = "";
    dessertsContainer.innerHTML = "";

    Object.entries(menuData).forEach(([key, item]) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow-md rounded-2xl p-4 w-64 flex flex-col justify-between hover:shadow-lg transition";

      card.innerHTML = `
        <div class="w-full h-48 mb-4 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          <img src="${item.Image}" alt="${item.Name}" class="w-full h-full object-contain">
        </div>
        <h4 class="text-lg font-semibold mb-2">${item.Name}</h4>
        <p class="text-gray-600 text-sm mb-4">${item.Compound}</p>
        <div class="flex justify-between items-center mt-auto">
          <p class="font-bold">${item.Price} ₽</p>
          <button class="bg-yellow-600 text-white px-3 py-2 rounded-xl hover:bg-yellow-700 text-sm openModalBtn"
            data-name="${item.Name}"
            data-img="${item.Image}"
            data-compound="${item.Compound}"
            data-price="${item.Price}"
            data-category="${item.ID_Category}">
            Добавить
          </button>
        </div>
      `;

      if (item.ID_Category === 3) snacksContainer.appendChild(card);
      else if (item.ID_Category === 2) dessertsContainer.appendChild(card);
      else pizzasContainer.appendChild(card);
    });

    document.querySelectorAll(".openModalBtn").forEach(btn => {
      btn.addEventListener("click", () => openModal(btn));
    });
  }

  // --- Открытие модального окна ---
  function openModal(button) {
    selectedItem = {
      name: button.dataset.name,
      img: button.dataset.img,
      compound: button.dataset.compound,
      price: parseInt(button.dataset.price)
    };

    const category = button.dataset.category;
    isSmallItem = category === "2" || category === "3";

    modalTitle.textContent = selectedItem.name;
    modalImage.src = selectedItem.img;
    modalDesc.textContent = selectedItem.compound;

    modalSizeContainer.style.display = isSmallItem ? "none" : "block";
    updateModalPrice();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  pizzaSize.addEventListener("change", updateModalPrice);

  function updateModalPrice() {
    if (!selectedItem) return;

    let finalPrice = selectedItem.price;

    if (!isSmallItem) {
      const size = pizzaSize.value;
      if (size === "30") finalPrice = Math.round(selectedItem.price * 1.3);
      if (size === "35") finalPrice = Math.round(selectedItem.price * 1.6);
    }

    modalPrice.textContent = `Цена: ${finalPrice} ₽`;
  }

  addToCartBtn.addEventListener("click", () => {
    if (!selectedItem) return;

    let size = isSmallItem ? "-" : pizzaSize.value;
    let finalPrice = selectedItem.price;

    if (!isSmallItem) {
      if (size === "30") finalPrice = Math.round(selectedItem.price * 1.3);
      if (size === "35") finalPrice = Math.round(selectedItem.price * 1.6);
    }

    addToCart({
      name: selectedItem.name,
      size,
      price: finalPrice
    });

    alert(`Добавлено: ${selectedItem.name} ${isSmallItem ? "" : `(${size} см)`}`);
    closePizzaModal();
  });

  closeModal.addEventListener("click", closePizzaModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closePizzaModal();
  });

  function closePizzaModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  loadMenu();
});
