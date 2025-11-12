const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Public
const createSubject = async (req, res) => {
  try {
    const { title, description, tags, colorCode, icon, shortCode } = req.body;

    // Ensure shortCode is provided
    if (!shortCode) {
      return res.status(400).json({ message: 'Short code is required' });
    }

    // Check if shortCode already exists
    const existingSubject = await Subject.findOne({ shortCode });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this short code already exists' });
    }

    const subject = await Subject.create({
      title,
      description,
      tags,
      colorCode,
      icon,
      shortCode: shortCode.toUpperCase()
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Public
const updateSubject = async (req, res) => {
  try {
    const { title, description, tags, colorCode, icon, shortCode } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
      // If shortCode is being changed, check if the new one already exists
      if (shortCode && shortCode !== subject.shortCode) {
        const existingSubject = await Subject.findOne({ shortCode: shortCode.toUpperCase() });
        if (existingSubject && existingSubject._id.toString() !== req.params.id) {
          return res.status(400).json({ message: 'Subject with this short code already exists' });
        }
      }

      subject.title = title || subject.title;
      subject.description = description || subject.description;
      subject.tags = tags || subject.tags;
      subject.colorCode = colorCode || subject.colorCode;
      subject.icon = icon || subject.icon;
      subject.shortCode = shortCode ? shortCode.toUpperCase() : subject.shortCode;
      
      const updatedSubject = await subject.save();
      res.json(updatedSubject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Public
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
      await subject.deleteOne();
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};