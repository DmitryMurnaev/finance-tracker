# 💰 Finance Tracker — Многопользовательский учёт финансов

**Finance Tracker** — это полнофункциональное веб-приложение для учёта личных доходов и расходов.  
Проект разработан в рамках дипломной работы и реализует **полный цикл**: от проектирования базы данных до деплоя в облаке.

🔗 **Демо‑версии:**
- 🚀 **Production** (основная): [https://finance-tracker-frontend-nxmx.onrender.com](https://finance-tracker-frontend-nxmx.onrender.com)
- 🧪 **Development** (тестовая): [https://finance-tracker-frontend-dev-jjcg.onrender.com](https://finance-tracker-frontend-dev-jjcg.onrender.com)

---

## 🧱 Стек технологий

### Backend
- Node.js + Express
- PostgreSQL (Render Managed DB)
- JWT + bcrypt (аутентификация)
- Nodemailer (интеграция с SMTP — подготовлено, отключено)
- Хостинг: Render Web Service

### Frontend
- React + Vite
- React Router v6
- Tailwind CSS
- Axios (с перехватчиками)
- Lucide React (иконки)
- Хостинг: Render Static Site

---

## ✅ Реализованный функционал

### 👤 Пользователи
- Регистрация / Вход / Выход
- Защищённые маршруты (неавторизованный пользователь перенаправляется на `/login`)
- Просмотр профиля (email, имя, дата регистрации)
- Смена пароля (с проверкой текущего)

### 💸 Транзакции
- Добавление дохода/расхода
- Удаление операции
- Просмотр списка последних операций
- Фильтрация по периоду (месяц/всё время)
- Автоматический пересчёт баланса и статистики

### 📊 Статистика
- Круговая диаграмма доходов/расходов
- График динамики (планируется)

### 🎨 Интерфейс
- Адаптивная вёрстка (Mobile First, Desktop)
- Выпадающее меню пользователя с аватаром-заглушкой
- Поля пароля с кнопкой «глазик»
- Плавные анимации

### 🛡 Безопасность
- Пароли хэшируются bcrypt
- JWT‑токен (7 дней) хранится в localStorage
- Все запросы к API требуют токена (кроме `/login`, `/register`)
- Данные изолированы по `user_id` — каждый пользователь видит только свои транзакции

---

## 🏗 Архитектура проекта

finance-tracker-full/
├── client/ # React‑фронтенд
│ ├── public/
│ ├── src/
│ │ ├── components/ # UI‑компоненты

│ │ ├── context/ # AuthContext (глобальное состояние)
│ │ ├── pages/ # Login, Register, Home, Profile
│ │ ├── services/ # api.js (axios, перехватчики)
│ │ └── App.jsx # маршрутизация
│ └── package.json
│
├── server/ # Node.js‑бэкенд
│ ├── middleware/ # authMiddleware, JWT_SECRET
│ ├── routes/ # auth.js (регистрация, логин, смена пароля)
│ ├── db.js # единый пул подключения к PostgreSQL
│ ├── index.js # точка входа, CORS, защищённые маршруты
│ └── package.json
│
└── README.md