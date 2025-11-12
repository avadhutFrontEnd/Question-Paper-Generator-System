const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required for question paper coding'],
      uppercase: true,
      trim: true,
    },
    lastPaperId: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Topic', TopicSchema);