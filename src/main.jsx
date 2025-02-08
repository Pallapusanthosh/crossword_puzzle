import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const initialPuzzle = {
  _id: null,
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
  words:[
    {
      "word": "MOTOR",
      "clue": "Powers a vehicle",
      "direction": "across",
      "startRow": 0,
      "startCol": 0,
      "number": 1
    },
    {
      "word": "OCEAN",
      "clue": "A vast body of saltwater",
      "direction": "across",
      "startRow": 2,
      "startCol": 2,
      "number": 2
    },
    {
      "word": "GALAXY",
      "clue": "A system of millions or billions of stars",
      "direction": "across",
      "startRow": 3,
      "startCol": 1,
      "number": 3
    },
    {
      "word": "SAINT",
      "clue": "A person recognized for their holiness",
      "direction": "across",
      "startRow": 4,
      "startCol": 2,
      "number": 4
    },
    {
      "word": "BRIDGE",
      "clue": "A structure built over a river",
      "direction": "across",
      "startRow": 5,
      "startCol": 0,
      "number": 5
    },
    {
      "word": "MIRROR",
      "clue": "Reflects an image",
      "direction": "across",
      "startRow": 8,
      "startCol": 0,
      "number": 6
    },
    {
      "word": "PLANET",
      "clue": "Orbits a star",
      "direction": "down",
      "startRow": 0,
      "startCol": 8,
      "number": 1
    },
    {
      "word": "OASIS",
      "clue": "A fertile spot in a desert",
      "direction": "down",
      "startRow": 2,
      "startCol": 2,
      "number": 2
    },
    {
      "word": "DOOR",
      "clue": "An entryway to a room or building",
      "direction": "down",
      "startRow": 5,
      "startCol": 3,
      "number": 3
    }
  ]
  
  
};

// Add special cells with questions
initialPuzzle.grid[3][1] = { value: 1, isSpecial: true, letter: 'G', question: 'What is the first letter of the word "Galaxy"?', answer: 'G' };
initialPuzzle.grid[0][2] = { value: 1, isSpecial: true, letter: 'T', question: 'What is the first letter of "Technology"?', answer: 'T' };
initialPuzzle.grid[2][2] = { value: 1, isSpecial: true, letter: 'O', question: 'What is the chemical symbol for Oxygen?', answer: 'O' };
initialPuzzle.grid[5][0] = { value: 1, isSpecial: true, letter: 'B', question: 'What is the first letter of "Bridge"?', answer: 'B' };



function RootComponent() {
  const [puzzle, setPuzzle] = useState(initialPuzzle);
  const [isCreated, setIsCreated] = useState(false); // Track if API was called

  useEffect(() => {
    async function createPuzzle() {
      try {
        const response = await fetch('http://localhost:5000/api/puzzles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(puzzle),
        });

        if (!response.ok) {
          throw new Error(`Failed to create puzzle: ${response.statusText}`);
        }

        console.log('Puzzle created successfully');
        const data = await response.json();
         puzzle._id = data.puzzle_id; 
         setPuzzle(puzzle);
        setIsCreated(true); // Mark as created
      } catch (error) {
        console.error('Error creating puzzle:', error);
      }
    }

    if (!isCreated && !puzzle._id) {
      createPuzzle();
    }
  }, [isCreated, puzzle._id]); // Run only when `_id` or `isCreated` changes

  return <App initialPuzzle={puzzle} />;
}


createRoot(document.getElementById('root')).render(

    <RootComponent />
 
);
