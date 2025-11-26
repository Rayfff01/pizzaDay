import { db } from "./firebaseConfig.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addItemForm");
  const statusMsg = document.getElementById("statusMsg");

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

      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data).map(k => parseInt(k));
        const maxId = Math.max(...keys);
        newId = maxId + 1;
      }

      await set(ref(db, `Menu/${newId}`), item);

      statusMsg.textContent = `Позиция добавлена под ID ${newId}`;
      statusMsg.className = "text-green-600 font-bold";

      form.reset();

    } catch (err) {
      statusMsg.textContent = "Ошибка добавления!";
      statusMsg.className = "text-red-600 font-bold";
      console.error("Ошибка добавления:", err);
    }
  });
});
