import { auth, database } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

document.getElementById("registerButton").addEventListener("click", async () => {
  const firstname = document.getElementById("firstname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  // Проверка полей
  if (!firstname || !email || !password || !passwordConfirm) {
    Swal.fire("Ошибка", "Заполните все поля!", "error");
    return;
  }

  if (password !== passwordConfirm) {
    Swal.fire("Ошибка", "Пароли не совпадают!", "error");
    return;
  }

  try {
    // Создание аккаунта
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Установка имени в Firebase Auth
    await updateProfile(user, {
      displayName: firstname
    });

    // Создание записи в Realtime Database
    await set(ref(database, "Users/" + user.uid), {
      displayName: firstname,
      email: email,
      role: "user"
    });

    Swal.fire("Успех!", "Регистрация прошла успешно!", "success").then(() => {
      window.location.href = "auth.html";
    });

  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});
