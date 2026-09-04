const Attendance = require('../../models/Attendance');
const Lesson = require('../../models/Lesson');
const logger = require('../../utils/logger');

// Davomat qo'shish
exports.createAttendance = async (req, res) => {
  try {
    const { lessonId, studentId, isPresent } = req.body;
    
    if (!lessonId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Dars ID va o\'quvchi ID majburiy'
      });
    }
    
    // Allaqachon davomat qo'shilganmi?
    const existing = await Attendance.findOne({ lessonId, studentId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bu o\'quvchi uchun davomat allaqachon qo\'shilgan'
      });
    }
    
    const attendance = new Attendance({
      lessonId,
      studentId,
      isPresent,
      arrivalTime: isPresent ? new Date() : null
    });
    
    await attendance.save();
    logger.success(`✅ Davomat qo'shildi: ${attendance._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Davomat qo\'shildi',
      data: attendance
    });
  } catch (error) {
    logger.error(`Davomat qo'shishda xatolik: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Darsning davomati
exports.getLessonAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ lessonId: req.params.lessonId })
      .populate('studentId', 'name email currentRating');
    
    const presentCount = attendance.filter(a => a.isPresent).length;
    
    res.json({
      success: true,
      count: attendance.length,
      presentCount: presentCount,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// O'quvchining davomati
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
      .populate('lessonId', 'title scheduledTime type')
      .sort({ createdAt: -1 });
    
    // Statistika
    const total = attendance.length;
    const present = attendance.filter(a => a.isPresent).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    res.json({
      success: true,
      stats: {
        total,
        present,
        absent,
        percentage
      },
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Davomat o'zgartirish
exports.updateAttendance = async (req, res) => {
  try {
    const { isPresent, notes, rating } = req.body;
    
    const updateData = {};
    if (typeof isPresent !== 'undefined') updateData.isPresent = isPresent;
    if (notes) updateData.notes = notes;
    if (rating) updateData.rating = rating;
    
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Davomat topilmadi'
      });
    }
    
    logger.success(`✅ Davomat yangilandi: ${attendance._id}`);
    
    res.json({
      success: true,
      message: 'Davomat yangilandi',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Davomat o'chirish
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Davomat topilmadi'
      });
    }
    
    logger.success(`✅ Davomat o'chirildi: ${attendance._id}`);
    
    res.json({
      success: true,
      message: 'Davomat o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Davomat statistikasi
exports.getAttendanceStats = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId });
    
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.isPresent).length,
      absent: attendance.filter(a => !a.isPresent).length,
      percentage: attendance.length > 0 
        ? Math.round((attendance.filter(a => a.isPresent).length / attendance.length) * 100)
        : 0,
      averageRating: attendance.length > 0
        ? Math.round(
            attendance.reduce((sum, a) => sum + (a.rating || 0), 0) / attendance.length
          )
        : 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
