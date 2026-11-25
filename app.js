import { firebaseConfig } from "./firebase-config.js";

const FB_SDK = "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const logEl = document.getElementById("log");
const statusEl = document.getElementById("fb-status");

function log(message) {
  const time = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  logEl.textContent += `[${time}] ${message}\n`;
}

function setStatus(text, state) {
  statusEl.textContent = text;
  statusEl.dataset.state = state;
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

async function initFirebase() {
  log(`Страница открыта: ${location.href}`);

  if (isPlaceholder(firebaseConfig.apiKey) || isPlaceholder(firebaseConfig.projectId)) {
    setStatus("Конфиг не заполнен", "wait");
    log("firebase-config.js содержит заглушки — заполните данные из Firebase Console.");
    return;
  }

  try {
    const { initializeApp } = await import(FB_SDK);
    const app = initializeApp(firebaseConfig);
    setStatus("Подключён", "ok");
    log(`Firebase SDK загружен (${FB_SDK.split("/").pop()})`);
    log(`initializeApp() выполнен, projectId = ${app.options.projectId}`);
  } catch (error) {
    setStatus("Ошибка подключения", "bad");
    log(`Ошибка Firebase: ${error.message}`);
  }
}

showDate();
showConfigValues();
initCounter();
initFirebase();
