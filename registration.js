import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

document.getElementById("registerButton").addEventListener("click", async () => {
  const firstname = document.getElementById("firstname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  if (!firstname || !email || !password || !passwordConfirm) {
    Swal.fire("Ошибка", "Заполните все поля!", "error");
    return;
  }

  if (password !== passwordConfirm) {
    Swal.fire("Ошибка", "Пароли не совпадают!", "error");
    return;
  }

  try {
    // Создаём аккаунт (Firebase автоматически авторизует пользователя)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Устанавливаем имя
    await updateProfile(user, {
      displayName: firstname
    });

    // Добавляем пользователя в БД
    await set(ref(db, "Users/" + user.uid), {
      displayName: firstname,
      email: email,
      roleID: 1
    });

    // Редирект на главную страницу
    Swal.fire("Успех!", "Регистрация прошла успешно!", "success").then(() => {
      window.location.href = "index.html"; // пользователь уже авторизован
    });

  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});
