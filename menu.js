// Подключение Firebase SDK через CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// 🔑 Конфигурация Firebase
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

// 🚀 Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 📥 Функция загрузки меню
async function loadMenu() {
  try {
    const snapshot = await get(ref(db, "Menu"));
    if (snapshot.exists()) {
      renderMenu(snapshot.val());
    } else {
      console.log("Меню пустое!");
      document.getElementById("menu-container").innerHTML =
        `<p class="text-center text-gray-500">Меню пока недоступно 😔</p>`;
    }
  } catch (error) {
    console.error("Ошибка при получении меню:", error);
  }
}

// 🎨 Функция отрисовки меню
function renderMenu(menuData) {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = ""; // очистим перед отрисовкой

  Object.entries(menuData).forEach(([key, item]) => {
    const card = document.createElement("div");
    card.className =
      "bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between transition transform hover:-translate-y-1 hover:shadow-lg w-64 flex-shrink-0";

    card.innerHTML = `
      <div class="w-full h-48 mb-4 overflow-hidden rounded-xl flex items-center justify-center bg-gray-100">
        <img src="${item.Image}" alt="${item.Name}" class="w-full h-full object-contain">
      </div>
      <div class="flex flex-col flex-grow">
        <h4 class="text-lg font-semibold mb-2">${item.Name}</h4>
        <p class="text-gray-600 text-sm mb-4 flex-grow">${item.Compound}</p>
        <div class="flex justify-between items-center mt-auto">
          <p class="font-bold text-md">${item.Price} ₽</p>
          <button class="bg-yellow-600 text-white px-3 py-2 rounded-xl hover:bg-yellow-700 text-sm">
            Заказать
          </button>
        </div>
      </div>
    `;

    menuContainer.appendChild(card);
  });
}

// 🔄 Загружаем меню при старте
loadMenu();
