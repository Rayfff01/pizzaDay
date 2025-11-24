import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Слушаем изменения авторизации
onAuthStateChanged(auth, (user) => {
  const desktop = document.getElementById("accountButtonDesktop");
  const mobile = document.getElementById("accountButtonMobile");

  if (!desktop || !mobile) return;

  if (user) {
    // Пользователь авторизован
    desktop.textContent = "Аккаунт";
    desktop.href = "account.html"; // страница аккаунта

    mobile.textContent = "Аккаунт";
    mobile.href = "account.html"; // страница аккаунта

  } else {
    // Пользователь не авторизован
    desktop.textContent = "Войти";
    desktop.href = "auth.html";

    mobile.textContent = "Войти";
    mobile.href = "auth.html";
  }
});

// Если хочешь добавить выход из аккаунта по клику (опционально)
// Например, на странице account.html:
export function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log("Пользователь вышел");
      // Можно обновить страницу или редирект
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Ошибка выхода:", error);
    });
}
