const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTopicsBySubject, createTopic } = require('../controllers/topicController');

// GET topics by subject ID & POST new topic under subject
router.route('/').get(getTopicsBySubject).post(createTopic);

module.exports = router;