const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subject title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    colorCode: {
      type: String,
      default: '#3498db', // Default color
    },
    icon: {
      type: String,
      default: 'book', // Default icon
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required for question paper coding'],
      uppercase: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subject', SubjectSchema);