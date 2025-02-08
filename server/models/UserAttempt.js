import mongoose from 'mongoose';

const userAttemptSchema = new mongoose.Schema({
  puzzleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puzzle',
    required: true
  },
  userGrid: [[{
    type: String,
    default: ''
  }]], // Store user's input letters
  score: {
    type: Number,
    default: 0
  },
  totalPossibleScore: {
    type: Number,
    required: true
  },
  completedSpecialCells: [{
    row: Number,
    col: Number,
    answer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('UserAttempt', userAttemptSchema);