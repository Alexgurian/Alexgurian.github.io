# Alexgurian.github.io

Домашняя работа: статический сайт на GitHub Pages с подключённым Firebase.

- Сайт: https://alexgurian.github.io
- Студент: Гурьянов Александр, группа 9/3-КБ-24/1

## Что внутри

| Файл | Назначение |
| --- | --- |
| `index.html` | разметка страницы |
| `style.css` | стили |
| `app.js` | логика: дата, счётчик кликов, инициализация Firebase |
| `firebase-config.js` | конфиг веб-приложения из Firebase Console |

## Firebase

`firebase-config.js` содержит публичные ключи веб-приложения Firebase
(их видит браузер любого посетителя). Здесь нет приватных данных:
серверные ключи и service account в репозиторий не попадают.

Конфиг получен в Firebase Console → Project settings → General → Your apps → Web app.

## Локальный запуск

```bash
python3 -m http.server 8000
# открыть http://localhost:8000
```

## Проверка

Откройте https://alexgurian.github.io — карточка «Firebase» должна показать
статус «Подключён» и `projectId`.
