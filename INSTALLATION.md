# MOVAQQAT — Installation Guide

## 📋 Talablar

- Node.js (v14 yoki undan yuqori)
- MongoDB (Local yoki Atlas)
- Telegram Bot Token

## 🚀 Installation Steps

### 1. Repository Klonlash

```bash
git clone https://github.com/jbekzodd/Muvaqqat.git
cd Muvaqqat
```

### 2. Dependencies O'rnatish

```bash
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

`.env` faylni to'ldirish:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/movaqqat

# Telegram
BOT_TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
TELEGRAM_ADMIN=YOUR_TELEGRAM_USERNAME

# JWT
JWT_SECRET=generate_random_string_here
```

### 4. MongoDB Connection

**Local MongoDB (Agar o'rnatilgan bo'lsa):**

```bash
mongod
```

**Yoki MongoDB Atlas (Cloud):**

1. atlas.mongodb.com-ga kiring
2. Cluster yarating
3. Connection string olish
4. `.env`-ga qo'shish:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/movaqqat
```

### 5. Telegram Bot Token Olish

1. @BotFather-ga Telegram-da xabar yubor
2. `/newbot` buyrug'ini yuborish
3. Bot nomini kiritish
4. Token olish va `.env`-ga qo'shish

```env
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

### 6. Ishga Tushirish

**Development (Nodemon bilan):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server `http://localhost:3000` da ishga tushadi

### 7. Bot Test Qilish

Telegram-da @YOUR_BOT_USERNAME-ni topib:

```
/start
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Linting
npm run lint

# Code formatting
npm run format
```

---

## 📊 Database Setup

MongoDB database-ga collections avtomatik yaratiladi. Agar manual yaratish kerak bo'lsa:

```javascript
// MongoDB CLI
use movaqqat

db.createCollection('users')
db.createCollection('students')
db.createCollection('lessons')
db.createCollection('attendance')
db.createCollection('homework')
```

---

## 🔧 Troubleshooting

### "Bot token invalid"

✅ `.env` fayldagi `BOT_TOKEN` to'g'riligini tekshiring

### "Cannot connect to MongoDB"

✅ MongoDB ishga tushganini tekshiring:

```bash
# Local
mongod

# Atlas: Connection string to'g'riligini tekshiring
```

### "Port already in use"

✅ `.env`-da boshqa port o'rnatish:

```env
PORT=3001
```

### "Module not found"

✅ Dependencies reinstall qilish:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 API Documentation

### Health Check

```bash
GET http://localhost:3000/health
```

### Students API

```bash
# Barcha o'quvchilar
GET /api/students

# Yangi o'quvchi
POST /api/students

# O'quvchi profili
GET /api/students/:id

# Update
PUT /api/students/:id

# Delete
DELETE /api/students/:id

# Progress
GET /api/students/:id/progress

# Rating update
POST /api/students/:id/rate
```

### Lessons API

```bash
# Barcha darslar
GET /api/lessons

# Yangi dars
POST /api/lessons

# Bitta dars
GET /api/lessons/:id

# Update
PUT /api/lessons/:id

# Delete
DELETE /api/lessons/:id

# Complete lesson
POST /api/lessons/:id/complete

# Upcoming lessons
GET /api/lessons/teacher/:teacherId/upcoming
```

### Attendance API

```bash
# Davomat qo'shish
POST /api/attendance

# Dars davomati
GET /api/attendance/lesson/:lessonId

# O'quvchi davomati
GET /api/attendance/student/:studentId

# Update
PUT /api/attendance/:id

# Delete
DELETE /api/attendance/:id

# Stats
GET /api/attendance/stats/student/:studentId
```

### Homework API

```bash
# Barcha vazifalar
GET /api/homework

# Yangi vazifa
POST /api/homework

# Bitta vazifa
GET /api/homework/:id

# Update
PUT /api/homework/:id

# Delete
DELETE /api/homework/:id

# O'quvchining vazifalar
GET /api/homework/student/:studentId

# Complete homework
POST /api/homework/:id/complete

# Submit homework
POST /api/homework/:id/submit

# Stats
GET /api/homework/stats/student/:studentId
```

---

## 📱 Telegram Bot Commands

```
/start              — Bot ishga tushirish
/admin              — Admin panel (Admin uchun)
```

### Bot Buttons

- 📚 Darslar — Kelasi darslarni ko'rish
- 📝 Uy Vazifalar — Vazifalarni ko'rish
- 📊 Statistika — Progress va reyting
- ℹ️ Yordam — Bot qo'llanma
- 👑 Admin Panel — Admin dashboard

---

## 🚀 Deployment

### Render.com-ga Deploy

1. GitHub repositoriyasini Render-ga ulash
2. Environment variables qo'shish
3. Deploy qilish

### Environment Variables (Render)

```
BOT_TOKEN=...
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=production
```

---

## 📞 Support

Muammolar uchun: @jovliyev_bekzod

---

**Happy Coding! 🚀**
