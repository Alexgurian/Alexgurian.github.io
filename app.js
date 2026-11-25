import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const logEl = document.getElementById("log");
const fbStatusEl = document.getElementById("fb-status");
const authStatusEl = document.getElementById("auth-status");
const authGuestEl = document.getElementById("auth-guest");
const authUserEl = document.getElementById("auth-user");
const signInBtn = document.getElementById("signin-btn");
const signOutBtn = document.getElementById("signout-btn");

function log(message) {
  const time = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  logEl.textContent += `[${time}] ${message}\n`;
}

function setStatus(el, text, state) {
  el.textContent = text;
  el.dataset.state = state;
}

function showDate() {
  const now = new Date();
  document.getElementById("today").textContent = now.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("year").textContent = now.getFullYear();
}

function initCounter() {
  const key = "hw-clicks";
  const countEl = document.getElementById("count");
  let clicks = Number(localStorage.getItem(key) || 0);
  const render = () => {
    countEl.textContent = clicks;
  };
  render();
  document.getElementById("count-btn").addEventListener("click", () => {
    clicks += 1;
    localStorage.setItem(key, String(clicks));
    render();
  });
}

function isPlaceholder(value) {
  return !value || value.startsWith("PASTE_");
}

function showConfigValues() {
  document.getElementById("fb-project").textContent = isPlaceholder(firebaseConfig.projectId)
    ? "конфиг ещё не заполнен"
    : firebaseConfig.projectId;
  document.getElementById("fb-appid").textContent = firebaseConfig.appId || "—";
  document.getElementById("fb-auth").textContent = firebaseConfig.authDomain || "—";
}

const ERROR_TEXT = {
  "auth/popup-closed-by-user": "окно входа закрыто",
  "auth/cancelled-popup-request": "вход отменён",
  "auth/popup-blocked": "браузер заблокировал всплывающее окно",
  "auth/unauthorized-domain": "домен не добавлен в Authorized domains",
  "auth/operation-not-allowed": "провайдер Google не включён в Firebase",
  "auth/network-request-failed": "нет связи с Firebase",
};

function describeError(error) {
  return ERROR_TEXT[error.code] || `${error.code || "ошибка"}: ${error.message}`;
}

function renderUser(user) {
  if (user) {
    authGuestEl.hidden = true;
    authUserEl.hidden = false;
    document.getElementById("user-name").textContent = user.displayName || "без имени";
    document.getElementById("user-email").textContent = user.email || "—";
    document.getElementById("user-uid").textContent = user.uid;
    const avatar = document.getElementById("user-avatar");
    if (user.photoURL) {
      avatar.src = user.photoURL;
      avatar.alt = `Фото профиля ${user.displayName || ""}`.trim();
      avatar.hidden = false;
    } else {
      avatar.hidden = true;
    }
    setStatus(authStatusEl, "Вы вошли", "ok");
  } else {
    authGuestEl.hidden = false;
    authUserEl.hidden = true;
    setStatus(authStatusEl, "Не выполнен", "wait");
  }
}

async function initFirebase() {
  log(`Страница открыта: ${location.href}`);

  if (isPlaceholder(firebaseConfig.apiKey) || isPlaceholder(firebaseConfig.projectId)) {
    setStatus(fbStatusEl, "Конфиг не заполнен", "wait");
    setStatus(authStatusEl, "Недоступен", "bad");
    log("firebase-config.js содержит заглушки — заполните данные из Firebase Console.");
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    setStatus(fbStatusEl, "Подключён", "ok");
    log(`initializeApp() выполнен, projectId = ${app.options.projectId}`);

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    log(`Auth готов, authDomain = ${firebaseConfig.authDomain}`);

    onAuthStateChanged(auth, (user) => {
      renderUser(user);
      log(user ? `Вход выполнен: ${user.email}` : "Пользователь не авторизован");
    });

    signInBtn.addEventListener("click", async () => {
      signInBtn.disabled = true;
      log("Открываю окно входа Google…");
      try {
        const result = await signInWithPopup(auth, provider);
        log(`signInWithPopup → ${result.user.email}`);
      } catch (error) {
        log(`Ошибка входа: ${describeError(error)}`);
        setStatus(authStatusEl, "Ошибка входа", "bad");
        document.getElementById("auth-error").textContent = describeError(error);
      } finally {
        signInBtn.disabled = false;
      }
    });

    signOutBtn.addEventListener("click", async () => {
      await signOut(auth);
      document.getElementById("auth-error").textContent = "";
      log("Выход выполнен");
    });
  } catch (error) {
    setStatus(fbStatusEl, "Ошибка подключения", "bad");
    log(`Ошибка Firebase: ${error.message}`);
  }
}

showDate();
showConfigValues();
initCounter();
initFirebase();
