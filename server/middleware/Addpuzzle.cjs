const mongoose = require('mongoose');

async function addPuzzle() {
  try {
    const dbUri = "mongodb+srv://santhosh:santhosh123@cluster0.jfzhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Connect to MongoDB Atlas
    await mongoose.connect(dbUri);

    const { default: Puzzle } = await import('../models/Puzzle.js'); // Use dynamic import

    const newPuzzle = new Puzzle({
      size: 9,
      grid: [
        [1, 1, 1, 1, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 1, 1, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 0, 1],
        [0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 0]
      ].map(row =>
        row.map(value => ({
          value,
          isSpecial: false,
          letter: '',
          question: '',
          answer: ''
        }))
      ),
      words: [
        { word: "MOTOR", clue: "Powers a vehicle", direction: "across", startRow: 0, startCol: 0, number: 1, length: 5 },
        { word: "OCEAN", clue: "A vast body of saltwater", direction: "across", startRow: 2, startCol: 2, number: 2, length: 5 },
        { word: "GALAXY", clue: "A system of millions or billions of stars", direction: "across", startRow: 3, startCol: 1, number: 3, length: 6 },
        { word: "SAINT", clue: "A person recognized for their holiness", direction: "across", startRow: 4, startCol: 2, number: 4, length: 5 },
        { word: "BRIDGE", clue: "A structure built over a river", direction: "across", startRow: 5, startCol: 0, number: 5, length: 6 },
        { word: "MIRROR", clue: "Reflects an image", direction: "across", startRow: 8, startCol: 0, number: 6, length: 6 },
        { word: "PLANET", clue: "Orbits a star", direction: "down", startRow: 0, startCol: 8, number: 1, length: 6 },
        { word: "OASIS", clue: "A fertile spot in a desert", direction: "down", startRow: 2, startCol: 2, number: 2, length: 5 },
        { word: "DOOR", clue: "An entryway to a room or building", direction: "down", startRow: 5, startCol: 3, number: 3, length: 4 }
      ]
    });

    await newPuzzle.save();
    console.log('Puzzle saved successfully!');
  } catch (error) {
    console.error('Error saving puzzle:', error);
  } finally {
    mongoose.connection.close();
  }
}

addPuzzle();