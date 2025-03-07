import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Puzzle from './models/Puzzle.js';
import UserAttempt from './models/UserAttempt.js';
import { userTokenCheck } from './middleware/auth.js';

dotenv.config();


console.log('MONGODB_URI:', process.env.MONGODB_URI); // Add this line to verify the URI
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Login route - before protected routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { techziteId, name, contact, email, password } = req.body;

    // Check for fixed password
    if (password !== '1234') {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Find or create user
    let user = await User.findOrCreateUser({ techziteId, name, contact, email });

    // Check if the user has already attempted the puzzle
    const existingAttempt = await UserAttempt.findOne({ userId: user._id });
    if (existingAttempt) {
      return res.status(403).json({ message: 'You have already attempted the puzzle.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        techziteId: user.techziteId,
        name: user.name,
        contact: user.contact,
        email: user.email // Add email field
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Verify token route
app.get('/api/auth/verify', userTokenCheck, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-attempts');
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
});

// Apply authentication middleware to protected routes
app.use('/api/puzzles', userTokenCheck);
app.use('/api/attempts', userTokenCheck);

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

    // Add wordLength to each word
    words.forEach(word => {
      word.wordLength = word.word.length;
    });

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


app.get('/api/puzzles/', async (req, res) => {
  try {
    const puzzles = await Puzzle.find({}, { "words.word": 0 });  // Exclude the 'word' field
    if (puzzles.length === 0) {
      return res.status(404).json({ message: 'No puzzles found' });  // Return 404 if no puzzles exist
    }
    res.json(puzzles);  // Return the puzzles in the response
  } catch (error) {
    res.status(500).json({ error: error.message });  // Handle server errors
  }
});


// Submit puzzle attempt
app.post('/api/attempts', userTokenCheck, async (req, res) => {
  try {
    const { puzzleId, userGrid } = req.body;
    const userId = req.user._id;
    const puzzle = await Puzzle.findById(puzzleId);
    
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found' });
    
    let score = 0;
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
      userId,
      userGrid,
      score,
      totalPossibleScore: puzzle.words.length
    });
    
    await attempt.save();
    res.status(201).json({ attempt });
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