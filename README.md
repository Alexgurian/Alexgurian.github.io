# Alexgurian.github.io

Домашняя работа: статический сайт на GitHub Pages с подключённым Firebase.

- Сайт: **https://alexgurian.github.io**
- Репозиторий: https://github.com/Alexgurian/Alexgurian.github.io
- Студент: Гурьянов Александр, группа 9/3-КБ-24/1

## Что внутри

| Файл | Назначение |
| --- | --- |
| `index.html` | разметка страницы |
| `style.css` | стили |
| `app.js` | логика: дата, счётчик кликов, `initializeApp()`, вход через Firebase Auth |
| `firebase-config.js` | конфиг веб-приложения из Firebase Console |

## Firebase

Проект: `gurianov-hw`
Web app: `gurianov-hw-web`

Конфиг получен в Firebase Console → Project settings → General → Your apps → Web app
и лежит в `firebase-config.js`.

Данные в `firebase-config.js` — публичные идентификаторы, а не секреты: их получает
браузер каждого посетителя. Доступ к данным защищают правила Firestore/Storage и
App Check, а не сокрытие этих ключей. Приватные ключи (service account JSON) в
репозиторий не попадают.

## Локальный запуск

```bash
python3 -m http.server 8000
# открыть http://localhost:8000
```

## Проверка

Откройте https://alexgurian.github.io — карточка «Firebase» показывает статус
«Подключён» и `projectId = gurianov-hw`, в журнале подключения видны строки
`Firebase SDK загружен` и `initializeApp() выполнен`.

## Authentication

- Провайдер: **Google** (Firebase Console → Authentication → Sign-in method).
- Код: `signInWithPopup` + `GoogleAuthProvider` в `app.js`, состояние сессии через
  `onAuthStateChanged`, выход через `signOut`.
- Authorized domains: `localhost`, `gurianov-hw.firebaseapp.com`, `gurianov-hw.web.app`,
  `alexgurian.github.io` (без последнего OAuth с домена GitHub Pages отклоняется).
- Пользователи после входа видны в Firebase Console → Authentication → Users.

## Если позже понадобится вход через GitHub

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   Callback URL: `https://gurianov-hw.firebaseapp.com/__/auth/handler`.
2. Firebase Console → Authentication → Sign-in method → GitHub: вставить Client ID и
   Client Secret, сохранить.
3. В `app.js` добавить `GithubAuthProvider` — структура кода уже готова, меняется
   только провайдер.

