const express = require('express');
const router = express.Router();
const {
  getQuestionPapers,
  getQuestionPaperById,
  getQuestionPaperByCode,
  updateQuestionPaper,
  deleteQuestionPaper,
  addQuestion,
  updateQuestionUserNote,
  recordAttempt,
} = require('../controllers/questionPaperController');

// GET all question papers
router.route('/').get(getQuestionPapers);

// GET question paper by paper code
router.route('/code/:paperCode').get(getQuestionPaperByCode);

// GET, PUT, DELETE question paper by ID
router.route('/:id').get(getQuestionPaperById).put(updateQuestionPaper).delete(deleteQuestionPaper);

// Add a question to a question paper
router.route('/:id/questions').post(addQuestion);

// Update a question's user note
router.route('/:id/questions/:questionIndex/note').put(updateQuestionUserNote);

// Record an attempt on a question paper
router.route('/:id/attempts').post(recordAttempt);

module.exports = router;