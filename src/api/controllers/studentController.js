const Student = require('../../models/Student');
const logger = require('../../utils/logger');

// O'quvchi yaratish
exports.createStudent = async (req, res) => {
  try {
    const { name, email, teacherId, chessComId, lichessId } = req.body;
    
    if (!name || !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Ism va ustoz ID majburiy'
      });
    }
    
    const student = new Student({
      name,
      email,
      teacherId,
      chessComId,
      lichessId
    });
    
    await student.save();
    logger.success(`✅ O'quvchi yaratildi: ${student._id}`);
    
    res.status(201).json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli yaratildi',
      data: student
    });
  } catch (error) {
    logger.error(`O'quvchi yaratishda xatolik: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Barcha o'quvchilar
exports.getAllStudents = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = {};
    
    if (teacherId) {
      query.teacherId = teacherId;
    }
    
    const students = await Student.find(query)
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    logger.error(`O'quvchi olishda xatolik: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Bitta o'quvchi
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('teacherId', 'name email');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// O'quvchi profili + Statistika
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('teacherId', 'name email phone');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    // Oxirgi 10 ta progress
    const recentProgress = student.progressHistory.slice(-10);
    
    // Reyting o'zgarishi
    const ratingChange = student.ratingHistory.length > 1
      ? student.currentRating - student.ratingHistory[student.ratingHistory.length - 2].rating
      : 0;
    
    res.json({
      success: true,
      data: {
        ...student.toObject(),
        stats: {
          currentRating: student.currentRating,
          ratingChange: ratingChange,
          weakAreas: student.weakAreas,
          recentProgress: recentProgress
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// O'quvchini o'zgartirish
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, chessComId, lichessId, weakAreas } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (chessComId) updateData.chessComId = chessComId;
    if (lichessId) updateData.lichessId = lichessId;
    if (weakAreas) updateData.weakAreas = weakAreas;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    logger.success(`✅ O'quvchi yangilandi: ${student._id}`);
    
    res.json({
      success: true,
      message: 'O\'quvchi yangilandi',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// O'quvchini o'chirish
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    logger.success(`✅ O'quvchi o'chirildi: ${student._id}`);
    
    res.json({
      success: true,
      message: 'O\'quvchi o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Progress grafigi
exports.getProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('currentRating ratingHistory progressHistory weakAreas');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: {
        currentRating: student.currentRating,
        ratingHistory: student.ratingHistory,
        progressHistory: student.progressHistory,
        weakAreas: student.weakAreas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reyting yangilash
exports.updateRating = async (req, res) => {
  try {
    const { rating, weakAreas } = req.body;
    
    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Reyting majburiy'
      });
    }
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi'
      });
    }
    
    // Reyting tarixiga qo'shish
    student.ratingHistory.push({
      date: new Date(),
      rating: student.currentRating
    });
    
    // Yangi reyting o'rnatish
    student.currentRating = rating;
    
    // Zaif tomonlarni yangilash
    if (weakAreas) {
      student.weakAreas = weakAreas;
    }
    
    // Progress tarixiga qo'shish
    student.progressHistory.push({
      date: new Date(),
      rating: rating,
      weakAreas: weakAreas || student.weakAreas
    });
    
    await student.save();
    
    logger.success(`✅ Reyting yangilandi: ${student._id}`);
    
    res.json({
      success: true,
      message: 'Reyting yangilandi',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
