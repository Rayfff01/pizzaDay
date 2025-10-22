import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

document.getElementById("registerButton").addEventListener("click", async () => {
  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  if (!firstname || !lastname || !email || !password || !passwordConfirm) {
    Swal.fire("Ошибка", "Заполните все поля!", "error");
    return;
  }

  if (password !== passwordConfirm) {
    Swal.fire("Ошибка", "Пароли не совпадают!", "error");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: `${firstname} ${lastname}`
    });

    Swal.fire("Успех!", "Регистрация прошла успешно!", "success").then(() => {
      window.location.href = "auth.html";
    });
  } catch (error) {
    Swal.fire("Ошибка", error.message, "error");
  }
});
