const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({})
      .populate('subject', 'title shortCode')
      .sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get topics by subject ID
// @route   GET /api/subjects/:subjectId/topics
// @access  Public
const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId })
      .populate('subject', 'title shortCode')
      .sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('subject', 'title shortCode');
    
    if (topic) {
      res.json(topic);
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a topic
// @route   POST /api/subjects/:subjectId/topics
// @access  Public
const createTopic = async (req, res) => {
  try {
    const { title, description, tags, rating, shortCode } = req.body;
    const subjectId = req.params.subjectId;

    // Validate subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Ensure shortCode is provided
    if (!shortCode) {
      return res.status(400).json({ message: 'Short code is required' });
    }

    // Check if shortCode already exists for this subject
    const existingTopic = await Topic.findOne({ 
      subject: subjectId,
      shortCode: shortCode.toUpperCase()
    });
    
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic with this short code already exists for this subject' });
    }

    const topic = await Topic.create({
      title,
      description,
      tags,
      rating: rating || 3,
      subject: subjectId,
      shortCode: shortCode.toUpperCase(),
      lastPaperId: 0
    });

    const populatedTopic = await Topic.findById(topic._id).populate('subject', 'title shortCode');
    res.status(201).json(populatedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Public
const updateTopic = async (req, res) => {
  try {
    const { title, description, tags, rating, shortCode } = req.body;
    
    const topic = await Topic.findById(req.params.id);
    
    if (topic) {
      // If shortCode is being changed, check if the new one already exists
      if (shortCode && shortCode !== topic.shortCode) {
        const existingTopic = await Topic.findOne({ 
          subject: topic.subject,
          shortCode: shortCode.toUpperCase()
        });
        
        if (existingTopic && existingTopic._id.toString() !== req.params.id) {
          return res.status(400).json({ message: 'Topic with this short code already exists for this subject' });
        }
      }

      topic.title = title || topic.title;
      topic.description = description || topic.description;
      topic.tags = tags || topic.tags;
      topic.rating = rating || topic.rating;
      topic.shortCode = shortCode ? shortCode.toUpperCase() : topic.shortCode;
      
      const updatedTopic = await topic.save();
      const populatedTopic = await Topic.findById(updatedTopic._id).populate('subject', 'title shortCode');
      res.json(populatedTopic);
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Public
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (topic) {
      await topic.deleteOne();
      res.json({ message: 'Topic removed' });
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment topic's lastPaperId
// @route   PUT /api/topics/:id/increment-paper-id
// @access  Public
const incrementLastPaperId = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (topic) {
      topic.lastPaperId += 1;
      const updatedTopic = await topic.save();
      res.json({ lastPaperId: updatedTopic.lastPaperId });
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTopics,
  getTopicsBySubject,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  incrementLastPaperId,
};