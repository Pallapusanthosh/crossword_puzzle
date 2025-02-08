import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Puzzle from './models/Puzzle.js';
import UserAttempt from './models/UserAttempt.js';

dotenv.config();


console.log('MONGODB_URI:', process.env.MONGODB_URI); // Add this line to verify the URI
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create new puzzle
app.post('/api/puzzles', async (req, res) => {
  try {
    const { size, grid, words } = req.body;

    // Add numbers to the grid based on across and down rules
    let number = 1;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value) {
          const isStartOfAcrossWord = col === 0 || !grid[row][col - 1].value;
          const isStartOfDownWord = row === 0 || !grid[row - 1][col].value;
          if (isStartOfAcrossWord || isStartOfDownWord) {
            grid[row][col].number = number++;
          }
        }
      }
    }

    const puzzle = new Puzzle({
      size,
      grid,
      words
    });
    await puzzle.save();
    res.status(201).json({"puzzle_id":puzzle._id,puzzle});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get puzzle by ID
app.get('/api/puzzles/:id', async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found' });
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify special cell answer
app.post('/api/puzzles/:id/verify-special', async (req, res) => {
  try {
    const { cellRow, cellCol, answer } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);
    
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found' });
    
    const cell = puzzle.grid[cellRow][cellCol];
    if (cell.answer.toLowerCase() === answer.toLowerCase()) {
      res.json({ correct: true, letter: cell.letter });
    } else {
      res.json({ correct: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit puzzle attempt
app.post('/api/attempts', async (req, res) => {
  try {
    const { puzzleId, userGrid, completedSpecialCells } = req.body;
    const puzzle = await Puzzle.findById(puzzleId);
    
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found' });
    
    let score = 0;
    // Calculate score based on correct words
    puzzle.words.forEach(word => {
      let isCorrect = true;
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'across' ? word.startRow : word.startRow + i;
        const col = word.direction === 'across' ? word.startCol + i : word.startCol;
        if (userGrid[row][col].toLowerCase() !== word.word[i].toLowerCase()) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) score++;
    });

    const attempt = new UserAttempt({
      puzzleId,
      userGrid,
      score,
      totalPossibleScore: puzzle.words.length,
      completedSpecialCells
    });
    
    await attempt.save();
    res.status(201).json({ 
      attempt,
      score,
      totalPossibleScore: puzzle.words.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's attempts for a puzzle
app.get('/api/puzzles/:puzzleId/attempts', async (req, res) => {
  try {
    const attempts = await UserAttempt.find({ puzzleId: req.params.puzzleId })
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));