
const QuestionPaper = require('../models/QuestionPaper');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const generatePaperCode = require('../utils/generatePaperCode');

// @desc    Get all question papers
// @route   GET /api/question-papers
// @access  Public
const getQuestionPapers = async (req, res) => {
  try {
    const questionPapers = await QuestionPaper.find({})
      .populate('subject', 'title shortCode')
      .populate('topic', 'title shortCode')
      .sort({ createdAt: -1 });
    res.json(questionPapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get question papers by topic ID
// @route   GET /api/topics/:topicId/question-papers
// @access  Public
const getQuestionPapersByTopic = async (req, res) => {
  try {
    const questionPapers = await QuestionPaper.find({ topic: req.params.topicId })
      .populate('subject', 'title shortCode')
      .populate('topic', 'title shortCode')
      .sort({ createdAt: -1 });
    res.json(questionPapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single question paper
// @route   GET /api/question-papers/:id
// @access  Public
const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id)
      .populate('subject', 'title shortCode')
      .populate('topic', 'title shortCode');
    
    if (questionPaper) {
      res.json(questionPaper);
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get question paper by paper code
// @route   GET /api/question-papers/code/:paperCode
// @access  Public
const getQuestionPaperByCode = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findOne({ paperCode: req.params.paperCode })
      .populate('subject', 'title shortCode')
      .populate('topic', 'title shortCode');
    
    if (questionPaper) {
      res.json(questionPaper);
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a question paper
// @route   POST /api/topics/:topicId/question-papers
// @access  Public
const createQuestionPaper = async (req, res) => {
  try {
    const { title, difficulty, time_to_solve, questions, link } = req.body;
    const topicId = req.params.topicId;

    // Validate topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Get subject for the topic
    const subject = await Subject.findById(topic.subject);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Increment lastPaperId
    topic.lastPaperId += 1;
    await topic.save();

    // Generate paper code
    const paperCode = generatePaperCode(
      subject.shortCode,
      topic.shortCode,
      topic.lastPaperId
    );

    const questionPaper = await QuestionPaper.create({
      title,
      difficulty,
      time_to_solve,
      questions,
      subject: subject._id,
      topic: topicId,
      paperCode,
      link: link || '',
      attempts: []
    });

    const populatedPaper = await QuestionPaper.findById(questionPaper._id)
      .populate('subject', 'title shortCode')
      .populate('topic', 'title shortCode');

    res.status(201).json(populatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question paper
// @route   PUT /api/question-papers/:id
// @access  Public
const updateQuestionPaper = async (req, res) => {
  try {
    const { title, difficulty, time_to_solve, questions, link } = req.body;
    
    const questionPaper = await QuestionPaper.findById(req.params.id);
    
    if (questionPaper) {
      questionPaper.title = title || questionPaper.title;
      questionPaper.difficulty = difficulty || questionPaper.difficulty;
      questionPaper.time_to_solve = time_to_solve || questionPaper.time_to_solve;
      questionPaper.questions = questions || questionPaper.questions;
      questionPaper.link = link !== undefined ? link : questionPaper.link;
      
      const updatedPaper = await questionPaper.save();
      const populatedPaper = await QuestionPaper.findById(updatedPaper._id)
        .populate('subject', 'title shortCode')
        .populate('topic', 'title shortCode');
      
      res.json(populatedPaper);
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question paper
// @route   DELETE /api/question-papers/:id
// @access  Public
const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);
    
    if (questionPaper) {
      await questionPaper.deleteOne();
      res.json({ message: 'Question paper removed' });
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a question to a question paper
// @route   POST /api/question-papers/:id/questions
// @access  Public
const addQuestion = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);
    
    if (questionPaper) {
      const newQuestion = req.body;
      questionPaper.questions.push(newQuestion);
      
      const updatedPaper = await questionPaper.save();
      res.status(201).json(updatedPaper);
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update question user note
// @route   PUT /api/question-papers/:id/questions/:questionIndex/note
// @access  Public
const updateQuestionUserNote = async (req, res) => {
  try {
    const { userNote } = req.body;
    const { id, questionIndex } = req.params;
    
    const questionPaper = await QuestionPaper.findById(id);
    
    if (questionPaper && questionPaper.questions[questionIndex]) {
      questionPaper.questions[questionIndex].userNote = userNote;
      
      const updatedPaper = await questionPaper.save();
      res.json(updatedPaper);
    } else {
      res.status(404).json({ message: 'Question paper or question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record an attempt on a question paper
// @route   POST /api/question-papers/:id/attempts
// @access  Public
const recordAttempt = async (req, res) => {
  try {
    const { startTime, endTime, questionsAttempted, questionsCorrect, score } = req.body;
    
    const questionPaper = await QuestionPaper.findById(req.params.id);
    
    if (questionPaper) {
      const attempt = {
        startTime,
        endTime,
        questionsAttempted,
        questionsCorrect,
        score
      };
      
      questionPaper.attempts.push(attempt);
      
      const updatedPaper = await questionPaper.save();
      res.status(201).json(updatedPaper);
    } else {
      res.status(404).json({ message: 'Question paper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestionPapers,
  getQuestionPapersByTopic,
  getQuestionPaperById,
  getQuestionPaperByCode,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  addQuestion,
  updateQuestionUserNote,
  recordAttempt,
};