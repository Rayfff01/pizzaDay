import { db } from "./firebaseConfig.js";
import { ref, get, set, remove } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addItemForm");
  const statusMsg = document.getElementById("statusMsg");
  const menuList = document.getElementById("menuList");
  const editIdInput = document.getElementById("editId");

  async function loadMenu() {
    menuList.innerHTML = "";
    const snapshot = await get(ref(db, "Menu"));
    if (!snapshot.exists()) return;

    const data = snapshot.val();
    Object.entries(data).forEach(([id, item]) => {
      const div = document.createElement("div");
      div.className = "p-3 border rounded flex justify-between items-center bg-gray-50";

      div.innerHTML = `
        <div>
          <p class="font-bold">${item.Name} (${item.Price} ₽)</p>
          <p class="text-sm">Состав: ${item.Compound}</p>
          <p class="text-sm">Категория: ${item.ID_Category}</p>
        </div>
        <div class="space-x-2">
          <button class="editBtn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" data-id="${id}">Редактировать</button>
          <button class="deleteBtn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" data-id="${id}">Удалить</button>
        </div>
      `;

      menuList.appendChild(div);
    });

    // Вешаем события на кнопки
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => editItem(btn.dataset.id));
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => deleteItem(btn.dataset.id));
    });
  }

  async function editItem(id) {
    const snapshot = await get(ref(db, `Menu/${id}`));
    if (!snapshot.exists()) return;
    const item = snapshot.val();

    editIdInput.value = id;
    document.getElementById("name").value = item.Name;
    document.getElementById("image").value = item.Image;
    document.getElementById("compound").value = item.Compound;
    document.getElementById("price").value = item.Price;
    document.getElementById("category").value = item.ID_Category;
    statusMsg.textContent = `Редактирование позиции ID ${id}`;
    statusMsg.className = "text-blue-600 font-bold";
  }

  async function deleteItem(id) {
    if (!confirm("Вы точно хотите удалить эту позицию?")) return;
    try {
      await remove(ref(db, `Menu/${id}`));
      statusMsg.textContent = `Позиция ID ${id} удалена`;
      statusMsg.className = "text-red-600 font-bold";
      loadMenu();
    } catch (err) {
      statusMsg.textContent = "Ошибка удаления!";
      statusMsg.className = "text-red-600 font-bold";
      console.error(err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = {
      Name: document.getElementById("name").value.trim(),
      Image: document.getElementById("image").value.trim(),
      Compound: document.getElementById("compound").value.trim(),
      Price: parseInt(document.getElementById("price").value),
      ID_Category: parseInt(document.getElementById("category").value)
    };

    try {
      const menuRef = ref(db, "Menu");
      const snapshot = await get(menuRef);

      let newId = 1;
      const editingId = editIdInput.value;

      if (editingId) {
        // Сохраняем изменения для существующей позиции
        await set(ref(db, `Menu/${editingId}`), item);
        statusMsg.textContent = `Позиция ID ${editingId} обновлена`;
        statusMsg.className = "text-blue-600 font-bold";
        editIdInput.value = "";
      } else {
        // Добавляем новую позицию
        if (snapshot.exists()) {
          const data = snapshot.val();
          const keys = Object.keys(data).map(k => parseInt(k));
          const maxId = Math.max(...keys);
          newId = maxId + 1;
        }
        await set(ref(db, `Menu/${newId}`), item);
        statusMsg.textContent = `Позиция добавлена под ID ${newId}`;
        statusMsg.className = "text-green-600 font-bold";
      }

      form.reset();
      loadMenu();

    } catch (err) {
      statusMsg.textContent = "Ошибка добавления / редактирования!";
      statusMsg.className = "text-red-600 font-bold";
      console.error(err);
    }
  });

  loadMenu();
});
