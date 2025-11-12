const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  incrementLastPaperId,
} = require('../controllers/topicController');

// GET all topics
router.route('/').get(getTopics);

// GET, PUT, DELETE topic by ID
router.route('/:id').get(getTopicById).put(updateTopic).delete(deleteTopic);

// PUT to increment the lastPaperId counter
router.route('/:id/increment-paper-id').put(incrementLastPaperId);

module.exports = router;