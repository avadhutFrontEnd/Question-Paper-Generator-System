const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  category: {
    type: String,
    required: true,
  },
  time_to_solve: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: undefined, // Makes the field optional
  },
  answer: {
    type: String,
    default: undefined, // Makes the field optional
  },
  instructions: {
    type: String,
    default: undefined, // Makes the field optional
  },
  note: {
    type: String,
    default: '',
  },
  userNote: {
    type: String,
    default: '',
  },
  solution: {
    type: String,
    default: '',
  },
});

const QuestionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question paper title is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    time_to_solve: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    paperCode: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      default: '',
    },
    attempts: [{
      startTime: Date,
      endTime: Date,
      questionsAttempted: Number,
      questionsCorrect: Number,
      score: Number
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);