import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"; // если используешь RTDB

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

// Если приложение уже инициализировано — возвращаем его, иначе создаем новое
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Экспорт auth, db и т.д.
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
