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
| `app.js` | логика: дата, счётчик кликов, загрузка Firebase SDK и `initializeApp()` |
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

## Если позже понадобится Authentication / Firestore

Добавьте домен `alexgurian.github.io` в Firebase Console → Authentication → Settings →
Authorized domains, иначе вход через OAuth с этого адреса будет отклонён.
