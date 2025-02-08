import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
  value: { type: Number, required: true }, // 0 for black cell, 1 for input cell
  letter: { type: String, default: '' },
  isSpecial: { type: Boolean, default: false },
  question: { type: String }, // Only for special cells
  answer: { type: String }, // Answer for the special cell question
});

const puzzleSchema = new mongoose.Schema({
  grid: [[cellSchema]],
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  words: [{
    word: String,
    clue: String,
    direction: String, // 'across' or 'down'
    startRow: Number,
    startCol: Number
  }]
});

export default mongoose.model('Puzzle', puzzleSchema);