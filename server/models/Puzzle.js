import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
  value: { type: Number, required: true }, // 0 for black cell, 1 for input cell
  letter: { type: String, default: '' }
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
    startCol: Number,
    number: Number,
    wordLength: { type: Number, required: true } // Add wordLength field
  }]
});

export default mongoose.model('Puzzle', puzzleSchema);