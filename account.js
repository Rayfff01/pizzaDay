import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Элементы
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");

// Проверяем авторизацию
onAuthStateChanged(auth, (user) => {
  if (user) {
    userName.textContent = user.displayName || "Не указано";
    userEmail.textContent = user.email;
  } else {
    // Если пользователь не авторизован → редирект на вход
    window.location.href = "auth.html";
  }
});

// Кнопка выхода
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    Swal.fire("Успех!", "Вы вышли из аккаунта.", "success").then(() => {
      window.location.href = "index.html";
    });
  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});
