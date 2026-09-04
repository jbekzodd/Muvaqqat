const Student = require('../../models/Student');
const logger = require('../../utils/logger');
const axios = require('axios');

const updateStats = async () => {
  try {
    const students = await Student.find()
      .select('lichessId chessComId currentRating');
    
    if (students.length === 0) {
      logger.info('Statistika yangilash uchun o\'quvchi yo\'q');
      return;
    }
    
    let updatedCount = 0;
    
    for (const student of students) {
      try {
        // Lichess API orqali reyting olish
        if (student.lichessId) {
          const response = await axios.get(
            `https://lichess.org/api/user/${student.lichessId}`,
            { 
              headers: { 'Accept': 'application/json' },
              timeout: 5000
            }
          );
          
          // Rapid o'yin reyting (yoki mavjud bo'lsagi barchasi)
          const ratings = response.data.perfs || {};
          const newRating = ratings.rapid?.rating || 
                           ratings.bullet?.rating || 
                           ratings.blitz?.rating || 
                           student.currentRating;
          
          // Reyting o'zgargan bo'lsa
          if (newRating !== student.currentRating) {
            const studentDoc = await Student.findById(student._id);
            
            // Reyting tarixiga qo'shish
            studentDoc.ratingHistory.push({
              date: new Date(),
              rating: student.currentRating
            });
            
            // Yangi reyting o'rnatish
            studentDoc.currentRating = newRating;
            
            await studentDoc.save();
            updatedCount++;
            
            logger.success(`✅ ${studentDoc.name} reytingi yangilandi: ${newRating}`);
          }
        }
      } catch (error) {
        logger.warn(`Stats update xatosi (${student._id}): ${error.message}`);
      }
    }
    
    logger.info(`✅ ${updatedCount} ta o'quvchining statistikasi yangilandi`);
  } catch (error) {
    logger.error(`Update stats xatosi: ${error.message}`);
  }
};

module.exports = updateStats;
