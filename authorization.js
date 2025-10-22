import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

document.getElementById("loginbutton").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    Swal.fire("Ошибка", "Введите email и пароль!", "error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});

// Смена кнопки входа на "Аккаунт" при авторизованном пользователе
onAuthStateChanged(auth, (user) => {
  const loginLink = document.querySelector('header a[href="auth.html"]');
  if (user && loginLink) {
    loginLink.textContent = "Аккаунт";
    loginLink.href = "account.html";
  }
});
