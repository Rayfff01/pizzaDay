import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Конфигурация Firebase
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

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function registerUser() {
  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  if (!firstname || !lastname || !address || !email || !password || !passwordConfirm) {
    Swal.fire("Ошибка", "Заполните все поля!", "error");
    return;
  }
  if (password !== passwordConfirm) {
    Swal.fire("Ошибка", "Пароли не совпадают!", "error");
    return;
  }

  try {
    // Получаем все Authorization
    const snapshotAuth = await get(ref(database, "Authorization"));
    const usersAuth = snapshotAuth.val() || {};

    // Проверка на существующий Email
    const exists = Object.values(usersAuth).some(u => u.Login.toLowerCase() === email.toLowerCase());
    if (exists) {
      Swal.fire("Ошибка", "Пользователь с таким Email уже существует!", "error");
      return;
    }

    // Создаём ID как следующий числовой
    const newId = Object.keys(usersAuth).length + 1; // 1,2,3...

    // Запись в Authorization
    await set(ref(database, `Authorization/${newId}`), {
      Login: email,
      Password: password,
      ID_Post: 2 // обычный пользователь
    });

    // Получаем Users
    const snapshotUsers = await get(ref(database, "Users"));
    const usersData = snapshotUsers.val() || {};
    const newUserId = Object.keys(usersData).length + 1; // ID 1,2,3...

    // Запись в Users
    await set(ref(database, `Users/${newUserId}`), {
      ID_Authorization: newId,
      ID_Post: 2,
      Name: firstname,
      SurName: lastname,
      Email: email,
      Address: address
    });

    Swal.fire("Успех!", "Регистрация прошла успешно!", "success").then(() => {
      window.location.href = "index.html";
    });

  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    Swal.fire("Ошибка", "Не удалось зарегистрироваться. Попробуйте позже.", "error");
  }
}

document.getElementById("registerButton").addEventListener("click", registerUser);
