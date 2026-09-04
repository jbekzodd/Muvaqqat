# MOVAQQAT — Chess Progress Platform 🎯♟️

**Shaxmatda Rivojlanishning Yo'li**

MOVAQQAT — o'quvchining shaxmatdagi rivojlanishini o'lchaydigan va ustozga keyingi qadamni ko'rsatadigan tizim.

## 🌟 Nima?

MOVAQQAT — shaxmat ustozlari va o'quvchilari uchun platform:

- ✅ **O'quvchi Profili** — Reyting, Progress, Statistika
- ✅ **Zaif Tomonlar Aniqlash** — Avtomatik analiz (Taktika, Endshpil, Ochilish, vaqt boshqaruvi)
- ✅ **Telegram Bot** — Daily reminders va vazifalar
- ✅ **Admin Dashboard** — Hammaning rivojlanishini monitoring
- ✅ **Scheduler** — Avtomatik xabarlar va statistika yangilash
- ✅ **REST API** — Web va Mobile uchun

## 📦 Installation

### 1. Repository klonlash
```bash
git clone https://github.com/jbekzodd/Muvaqqat.git
cd Muvaqqat
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. .env fayl yaratish
```bash
cp .env.example .env
```

### 4. .env-ni to'ldirish
```
BOT_TOKEN=your_telegram_bot_token_here
MONGO_URI=mongodb://localhost:27017/movaqqat
```

### 5. Ishga tushirish
```bash
npm start
```

## 🛠️ Development

```bash
npm run dev      # Nodemon bilan (auto-restart)
npm run test     # Tests
npm run lint     # Code quality
npm run format   # Prettier formatting
```

## 📁 Project Structure

```
Muvaqqat/
├── .env.example
├── package.json
├── server.js
├── README.md
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── telegram.js
│   │   └── scheduler.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Lesson.js
│   │   ├── Attendance.js
│   │   └── Homework.js
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── students.js
│   │   │   ├── lessons.js
│   │   │   ├── attendance.js
│   │   │   └── homework.js
│   │   └── controllers/
│   │       ├── studentController.js
│   │       ├── lessonController.js
│   │       ├── attendanceController.js
│   │       └── homeworkController.js
│   │
│   ├── bot/
│   │   ├── handlers/
│   │   │   ├── startHandler.js
│   │   │   ├── lessonHandler.js
│   │   │   ├── homeworkHandler.js
│   │   │   ├── progressHandler.js
│   │   │   └── adminHandler.js
│   │   └── index.js
│   │
│   ├── scheduler/
│   │   ├── tasks/
│   │   │   ├── sendReminders.js
│   │   │   ├── updateStats.js
│   │   │   └── weeklyReport.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── app.js
```

## 🤖 Telegram Bot

Bot commands:
- `/start` — Bot ishga tushirish va menu
- `/lesson` — Bugungi darslar
- `/homework` — Uy vazifalar
- `/progress` — Reyting va statistika
- `/admin` — Admin panel

## 📊 API Endpoints

### Students
```
GET    /api/students              — Barcha o'quvchilar
POST   /api/students              — Yangi o'quvchi
GET    /api/students/:id          — O'quvchi profili
PUT    /api/students/:id          — O'quvchini o'zgartirish
GET    /api/students/:id/progress — Progress grafigi
```

### Lessons
```
POST   /api/lessons               — Dars yaratish
GET    /api/lessons               — Barcha darslar
GET    /api/lessons/:id           — Bitta dars
PUT    /api/lessons/:id           — Darsni o'zgartirish
DELETE /api/lessons/:id           — Darsni o'chirish
POST   /api/lessons/:id/complete  — Dars yakunlash
```

### Attendance
```
POST   /api/attendance            — Davomat qo'shish
GET    /api/attendance/lesson/:id — Dars davomati
PUT    /api/attendance/:id        — Davomat o'zgartirish
GET    /api/attendance/student/:id— O'quvchining davomati
```

### Homework
```
POST   /api/homework              — Vazifa berish
GET    /api/homework/:id          — Bitta vazifa
PUT    /api/homework/:id          — Vazifani o'zgartirish
GET    /api/homework/student/:id  — O'quvchining vazifalar
POST   /api/homework/:id/complete — Vazifani tugallash
```

## 🗄️ Database Schema

### MongoDB Collections

**users** (Ustozlar)
```javascript
{
  _id, name, email, phone, telegramId, password,
  isTeacher, isAdmin, studentCount, averageRating,
  isPremium, premiumExpires, createdAt, updatedAt
}
```

**students** (O'quvchilar)
```javascript
{
  _id, name, email, telegramId, teacherId,
  chessComId, lichessId, currentRating,
  ratingHistory[], weakAreas{}, progressHistory[],
  createdAt, updatedAt
}
```

**lessons** (Darslar)
```javascript
{
  _id, teacherId, studentIds[], title, description,
  scheduledTime, durationMinutes, type, status,
  notes, createdAt, updatedAt
}
```

**attendance** (Davomat)
```javascript
{
  _id, lessonId, studentId, isPresent,
  arrivalTime, departureTime, notes, rating,
  createdAt
}
```

**homework** (Uy vazifasi)
```javascript
{
  _id, studentId, title, description, type,
  tasks[], status, dueDate, completedDate,
  score, feedback, createdAt, updatedAt
}
```

## 🔐 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/movaqqat
DB_NAME=movaqqat

# Telegram
BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN=jovliyev_bekzod

# JWT
JWT_SECRET=your_secret_key

# Server URL
SERVER_URL=http://localhost:3000
RENDER_EXTERNAL_URL=https://movaqqat.onrender.com
```

## 🚀 Deployment

### Render.com-ga Deploy

1. GitHub-dan repository ulash
2. Environment variables qo'shish
3. Deploy qilish

### Local Development

```bash
# MongoDB ishga tushirish (agar o'rnatilgan bo'lsa)
mongod

# Server ishga tushirish
npm run dev
```

## 📝 License

MIT

---

**Created by:** @jbekzodd  
**Project:** MOVAQQAT v2.0  
**Description:** Chess Progress Platform — Shaxmatda Rivojlanishning Yo'li
