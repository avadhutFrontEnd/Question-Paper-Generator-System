const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');

// GET all subjects & POST new subject
router.route('/').get(getSubjects).post(createSubject);

// GET, PUT, DELETE subject by ID
router.route('/:id').get(getSubjectById).put(updateSubject).delete(deleteSubject);

module.exports = router;