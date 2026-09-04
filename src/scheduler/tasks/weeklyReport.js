const Lesson = require('../../models/Lesson');
const Student = require('../../models/Student');
const Attendance = require('../../models/Attendance');
const Homework = require('../../models/Homework');
const { bot } = require('../../bot');
const logger = require('../../utils/logger');

const weeklyReport = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Haftaning statistikasi
    const lessons = await Lesson.find({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const completedLessons = lessons.filter(l => l.status === 'completed').length;
    
    const attendance = await Attendance.find({
      createdAt: { $gte: sevenDaysAgo },
      isPresent: true
    });
    
    const homework = await Homework.find({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const completedHomework = homework.filter(h => h.status === 'completed').length;
    
    const students = await Student.find();
    const avgRating = students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.currentRating, 0) / students.length)
      : 0;
    
    const text = `📊 *HAFTALIK HISOBOT*\n\n` +
      
      `*📚 DARSLAR:*\n` +
      `├─ Jami: ${lessons.length}\n` +
      `├─ Tugallangan: ${completedLessons}\n` +
      `└─ Davomatlar: ${attendance.length}\n\n` +
      
      `*📝 VAZIFALAR:*\n` +
      `├─ Jami: ${homework.length}\n` +
      `├─ Tugallangan: ${completedHomework}\n` +
      `└─ Foiz: ${homework.length > 0 ? Math.round((completedHomework/homework.length)*100) : 0}%\n\n` +
      
      `*👥 O'QUVCHILAR:*\n` +
      `├─ Jami: ${students.length}\n` +
      `├─ Avg Reyting: ${avgRating}\n` +
      `└─ Status: ✅ Yaxshi\n\n` +
      
      `*📈 JARAYON:*\n` +
      `Tizim normal ishlayotgan holda. Barcha ko\'rsatkichlar yaxshi!`;
    
    // Admin-ga yuborish
    try {
      await bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN, text, {
        parse_mode: 'Markdown'
      });
      logger.success('✅ Haftalik hisobot admin-ga yuborildi');
    } catch (err) {
      logger.warn(`Admin-ga yuborish xatosi: ${err.message}`);
    }
  } catch (error) {
    logger.error(`Weekly report xatosi: ${error.message}`);
  }
};

module.exports = weeklyReport;
