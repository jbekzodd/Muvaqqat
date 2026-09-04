const Student = require('../../models/Student');
const Homework = require('../../models/Homework');
const logger = require('../../utils/logger');

const updateWeakAreas = async () => {
  try {
    const students = await Student.find();
    
    if (students.length === 0) {
      logger.info('Zaif tomonlarni yangilash uchun o\'quvchi yo\'q');
      return;
    }
    
    let updatedCount = 0;
    
    for (const student of students) {
      try {
        // O'quvchining vazifalarini topish
        const homeworks = await Homework.find({
          studentId: student._id,
          status: 'completed'
        }).sort({ completedDate: -1 }).limit(20);
        
        if (homeworks.length === 0) continue;
        
        // Tur bo'yicha muvaffaqiyat foizini hisoblash
        const stats = {};
        const types = ['tactics', 'endgame', 'opening', 'analysis'];
        
        for (const type of types) {
          const typeHomeworks = homeworks.filter(h => h.type === type);
          if (typeHomeworks.length === 0) continue;
          
          const solved = typeHomeworks.filter(h => h.score >= 70).length;
          const percentage = Math.round((solved / typeHomeworks.length) * 100);
          stats[type] = percentage;
        }
        
        // Zaif tomonlarni yangilash (teskari mantiq - past foiz = zaif)
        student.weakAreas.tactics = 100 - (stats.tactics || 50);
        student.weakAreas.endgame = 100 - (stats.endgame || 50);
        student.weakAreas.openings = 100 - (stats.opening || 50);
        
        // Progress tarixiga qo'shish
        student.progressHistory.push({
          date: new Date(),
          rating: student.currentRating,
          weakAreas: { ...student.weakAreas }
        });
        
        await student.save();
        updatedCount++;
        
        logger.success(`✅ ${student.name} zaif tomonlari yangilandi`);
      } catch (error) {
        logger.warn(`O'quvchi yangilashda xatolik (${student._id}): ${error.message}`);
      }
    }
    
    logger.info(`✅ ${updatedCount} ta o'quvchining zaif tomonlari yangilandi`);
  } catch (error) {
    logger.error(`Update weak areas xatosi: ${error.message}`);
  }
};

module.exports = updateWeakAreas;
