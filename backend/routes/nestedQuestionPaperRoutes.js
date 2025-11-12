const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getQuestionPapersByTopic, 
  createQuestionPaper 
} = require('../controllers/questionPaperController');

// GET question papers by topic ID & POST new question paper under topic
router.route('/').get(getQuestionPapersByTopic).post(createQuestionPaper);

module.exports = router;