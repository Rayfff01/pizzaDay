import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header .flex.space-x-4");
  const loginLink = header.querySelector('a[href="auth.html"]');

  // Создаем кнопку "Выйти", но пока скрываем
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Выйти";
  logoutBtn.className = "bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600";
  logoutBtn.style.display = "none"; 
  header.appendChild(logoutBtn);

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      // После выхода кнопка "Аккаунт" снова "Войти"
      loginLink.textContent = "Войти";
      loginLink.href = "auth.html";
      logoutBtn.style.display = "none";
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  });

  // Отслеживаем изменения авторизации
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginLink.textContent = "Аккаунт";
      loginLink.href = "account.html";
      logoutBtn.style.display = "inline-block";
    } else {
      loginLink.textContent = "Войти";
      loginLink.href = "auth.html";
      logoutBtn.style.display = "none";
    }
  });
});
