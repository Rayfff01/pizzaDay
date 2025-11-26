import { auth, db } from "./firebaseConfig.js"; // используем db из конфига
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Элементы
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");

const editNameButton = document.getElementById("editNameButton");
const editNameContainer = document.getElementById("editNameContainer");
const newNameInput = document.getElementById("newNameInput");
const saveNameButton = document.getElementById("saveNameButton");

let currentUser = null;

// Авторизация и загрузка имени
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userEmail.textContent = user.email;

    try {
      const snapshot = await get(ref(db, `Users/${user.uid}/displayName`));
      console.log("Имя из базы:", snapshot.val());
      userName.textContent = snapshot.exists() ? snapshot.val() : "Не указано";
    } catch (error) {
      console.error("Ошибка при получении имени:", error);
      userName.textContent = "Не указано";
    }

  } else {
    window.location.href = "auth.html";
  }
});

// Показать/скрыть поле изменения имени
editNameButton.addEventListener("click", () => {
  editNameContainer.classList.toggle("hidden");
});

// Сохранение нового имени
saveNameButton.addEventListener("click", async () => {
  const newName = newNameInput.value.trim();
  if (newName.length < 2) return Swal.fire("Ошибка", "Имя должно быть длиннее 2 символов.", "error");

  try {
    await set(ref(db, `Users/${auth.currentUser.uid}/displayName`), newName);
    userName.textContent = newName;
    newNameInput.value = "";
    editNameContainer.classList.add("hidden");
    Swal.fire("Готово!", "Имя успешно обновлено.", "success");
  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});

// Выход
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    Swal.fire("Успех!", "Вы вышли из аккаунта.", "success")
      .then(() => window.location.href = "index.html");
  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});
