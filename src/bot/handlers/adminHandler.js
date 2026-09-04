const { Markup } = require('telegraf');
const logger = require('../../utils/logger');
const Student = require('../../models/Student');
const Lesson = require('../../models/Lesson');
const Homework = require('../../models/Homework');

const adminHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    const username = ctx.from?.username;
    
    // Faqat admin uchun
    if (username !== 'jovliyev_bekzod') {
      return ctx.reply('❌ Siz admin emassiz!');
    }
    
    logger.info(`Admin panel ochildi: ${username}`);
    
    // Statistika yig'ish
    const studentCount = await Student.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    const homeworkCount = await Homework.countDocuments();
    const completedHomework = await Homework.countDocuments({ status: 'completed' });
    
    const text = `👑 *ADMIN BOSHQARUV PANELI*\n\n` +
      
      `*📊 Jami Statistika:*\n` +
      `👥 O'quvchilar: ${studentCount}\n` +
      `📚 Darslar: ${lessonCount}\n` +
      `📝 Vazifalar: ${homeworkCount}\n` +
      `✅ Tugallangan vazifalar: ${completedHomework}\n\n` +
      
      `*Kerakli bo'limni tanlang:*`;
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('👥 O\'quvchilar', 'admin_students')],
        [Markup.button.callback('📚 Darslar', 'admin_lessons')],
        [Markup.button.callback('📝 Vazifalar', 'admin_homework')],
        [Markup.button.callback('📊 Statistika', 'admin_stats')],
        [Markup.button.callback('◀️ Orqaga', 'btn_back')]
      ])
    });
  } catch (error) {
    logger.error(`Admin handler xatosi: ${error.message}`);
    ctx.reply('❌ Xatolik yuz berdi');
  }
};

const adminStudentsHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    const students = await Student.find()
      .populate('teacherId', 'name')
      .limit(10)
      .sort({ createdAt: -1 });
    
    if (students.length === 0) {
      return ctx.reply('❌ O\'quvchi topilmadi');
    }
    
    let text = `👥 *O'QUVCHILAR* (Eng yangilari)\n\n`;
    students.forEach((s, i) => {
      text += `${i + 1}. *${s.name}*\n`;
      text += `   Ustoz: ${s.teacherId.name}\n`;
      text += `   Reyting: ${s.currentRating}\n`;
      text += `   Yaratilgan: ${new Date(s.createdAt).toLocaleDateString('uz-UZ')}\n\n`;
    });
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Admin Panel', 'btn_admin_panel')]
      ])
    });
  } catch (error) {
    logger.error(`Admin students xatosi: ${error.message}`);
    ctx.reply('❌ Xatolik yuz berdi');
  }
};

const adminStatsHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    const students = await Student.find();
    const lessons = await Lesson.find();
    const homework = await Homework.find();
    
    // Reyting statistikasi
    const avgRating = students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.currentRating, 0) / students.length)
      : 0;
    
    // Dars statistikasi
    const completedLessons = lessons.filter(l => l.status === 'completed').length;
    const upcomingLessons = lessons.filter(l => l.status === 'scheduled').length;
    
    // Vazifa statistikasi
    const completedHw = homework.filter(h => h.status === 'completed').length;
    const completionRate = homework.length > 0
      ? Math.round((completedHw / homework.length) * 100)
      : 0;
    
    const text = `📊 *STATISTIKA*\n\n` +
      
      `*O'quvchilar:*\n` +
      `Jami: ${students.length}\n` +
      `Avg Reyting: ${avgRating}\n\n` +
      
      `*Darslar:*\n` +
      `Tugallangan: ${completedLessons}\n` +
      `Kelasi: ${upcomingLessons}\n` +
      `Jami: ${lessons.length}\n\n` +
      
      `*Vazifalar:*\n` +
      `Tugallangan: ${completedHw}/${homework.length}\n` +
      `Foiz: ${completionRate}%\n\n` +
      
      `*📈 Sistem sog'lom!*`;
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Admin Panel', 'btn_admin_panel')]
      ])
    });
  } catch (error) {
    logger.error(`Admin stats xatosi: ${error.message}`);
    ctx.reply('❌ Xatolik yuz berdi');
  }
};

module.exports = {
  adminHandler,
  adminStudentsHandler,
  adminStatsHandler
};
