const Lesson = require('../../models/Lesson');
const logger = require('../../utils/logger');

// Dars yaratish
exports.createLesson = async (req, res) => {
  try {
    const { teacherId, studentIds, title, scheduledTime, type, durationMinutes } = req.body;
    
    if (!teacherId || !title || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Ustoz ID, nomi va vaqti majburiy'
      });
    }
    
    const lesson = new Lesson({
      teacherId,
      studentIds: studentIds || [],
      title,
      scheduledTime,
      type,
      durationMinutes
    });
    
    await lesson.save();
    logger.success(`✅ Dars yaratildi: ${lesson._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Dars muvaffaqiyatli yaratildi',
      data: lesson
    });
  } catch (error) {
    logger.error(`Dars yaratishda xatolik: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Barcha darslar
exports.getLessons = async (req, res) => {
  try {
    const { teacherId, status } = req.query;
    let query = {};
    
    if (teacherId) query.teacherId = teacherId;
    if (status) query.status = status;
    
    const lessons = await Lesson.find(query)
      .populate('teacherId', 'name email')
      .populate('studentIds', 'name email')
      .sort({ scheduledTime: -1 });
    
    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Bitta dars
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('teacherId', 'name email phone')
      .populate('studentIds', 'name email currentRating');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Darsni o'zgartirish
exports.updateLesson = async (req, res) => {
  try {
    const { title, description, scheduledTime, type, studentIds } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (scheduledTime) updateData.scheduledTime = scheduledTime;
    if (type) updateData.type = type;
    if (studentIds) updateData.studentIds = studentIds;
    
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi'
      });
    }
    
    logger.success(`✅ Dars yangilandi: ${lesson._id}`);
    
    res.json({
      success: true,
      message: 'Dars yangilandi',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Darsni o'chirish
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi'
      });
    }
    
    logger.success(`✅ Dars o'chirildi: ${lesson._id}`);
    
    res.json({
      success: true,
      message: 'Dars o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Darsni yakunlash
exports.completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi'
      });
    }
    
    logger.success(`✅ Dars yakunlandi: ${lesson._id}`);
    
    res.json({
      success: true,
      message: 'Dars yakunlandi',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Kelasi darslar
exports.getUpcomingLessons = async (req, res) => {
  try {
    const now = new Date();
    const lessons = await Lesson.find({
      teacherId: req.params.teacherId,
      scheduledTime: { $gte: now },
      status: 'scheduled'
    })
    .populate('studentIds', 'name email')
    .sort({ scheduledTime: 1 })
    .limit(5);
    
    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
