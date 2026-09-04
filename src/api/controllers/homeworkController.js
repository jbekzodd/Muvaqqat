const Homework = require('../../models/Homework');
const logger = require('../../utils/logger');

// Vazifa yaratish
exports.createHomework = async (req, res) => {
  try {
    const { studentId, title, type, dueDate, tasks, description } = req.body;
    
    if (!studentId || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'O\'quvchi ID, nomi va muddat majburiy'
      });
    }
    
    const homework = new Homework({
      studentId,
      title,
      type,
      dueDate,
      tasks: tasks || [],
      description
    });
    
    await homework.save();
    logger.success(`✅ Vazifa yaratildi: ${homework._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Vazifa yaratildi',
      data: homework
    });
  } catch (error) {
    logger.error(`Vazifa yaratishda xatolik: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Barcha vazifalar
exports.getAllHomework = async (req, res) => {
  try {
    const { studentId, status } = req.query;
    let query = {};
    
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    
    const homework = await Homework.find(query)
      .populate('studentId', 'name email currentRating')
      .populate('lessonId', 'title')
      .sort({ dueDate: 1 });
    
    res.json({
      success: true,
      count: homework.length,
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Bitta vazifa
exports.getHomework = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('lessonId', 'title scheduledTime');
    
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vazifani o'zgartirish
exports.updateHomework = async (req, res) => {
  try {
    const { title, description, type, dueDate, tasks, status } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (dueDate) updateData.dueDate = dueDate;
    if (tasks) updateData.tasks = tasks;
    if (status) updateData.status = status;
    
    const homework = await Homework.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }
    
    logger.success(`✅ Vazifa yangilandi: ${homework._id}`);
    
    res.json({
      success: true,
      message: 'Vazifa yangilandi',
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vazifani o'chirish
exports.deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndDelete(req.params.id);
    
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }
    
    logger.success(`✅ Vazifa o'chirildi: ${homework._id}`);
    
    res.json({
      success: true,
      message: 'Vazifa o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// O'quvchining vazifalar
exports.getStudentHomework = async (req, res) => {
  try {
    const homework = await Homework.find({ studentId: req.params.studentId })
      .sort({ dueDate: 1 });
    
    // Status bo'yicha guruhlash
    const stats = {
      total: homework.length,
      assigned: homework.filter(h => h.status === 'assigned').length,
      inProgress: homework.filter(h => h.status === 'in_progress').length,
      completed: homework.filter(h => h.status === 'completed').length,
      overdue: homework.filter(h => h.status === 'overdue').length
    };
    
    res.json({
      success: true,
      stats,
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vazifani tugallash
exports.completeHomework = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedDate: new Date()
      },
      { new: true }
    );
    
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }
    
    logger.success(`✅ Vazifa yakunlandi: ${homework._id}`);
    
    res.json({
      success: true,
      message: 'Vazifa yakunlandi',
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vazifani submit qilish (o'quvchi tomonidan)
exports.submitHomework = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const homework = await Homework.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedDate: new Date(),
        score: score,
        feedback: feedback
      },
      { new: true }
    );
    
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }
    
    logger.success(`✅ Vazifa submit qilindi: ${homework._id}`);
    
    res.json({
      success: true,
      message: 'Vazifa submit qilindi',
      data: homework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vazifa statistikasi
exports.getHomeworkStats = async (req, res) => {
  try {
    const homework = await Homework.find({ studentId: req.params.studentId });
    
    const stats = {
      total: homework.length,
      completed: homework.filter(h => h.status === 'completed').length,
      pending: homework.filter(h => h.status === 'assigned' || h.status === 'in_progress').length,
      overdue: homework.filter(h => h.status === 'overdue').length,
      averageScore: homework.length > 0
        ? Math.round(
            homework.filter(h => h.score).reduce((sum, h) => sum + h.score, 0) / 
            homework.filter(h => h.score).length
          )
        : 0,
      completionRate: homework.length > 0
        ? Math.round((homework.filter(h => h.status === 'completed').length / homework.length) * 100)
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
