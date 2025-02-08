import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrosswordGrid from './components/CrosswordGrid';
import CluesList from './components/CluesList';
import SpecialModal from './components/SpecialModal';

function App({ initialPuzzle }) {
  console.log('apppuzzle', initialPuzzle);
  const [userGrid, setUserGrid] = useState(
    Array(initialPuzzle.size).fill('').map(() => Array(initialPuzzle.size).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [specialAnswer, setSpecialAnswer] = useState('');
  const [revealedSpecialCells, setRevealedSpecialCells] = useState(new Set());
  const [completedSpecialCells, setCompletedSpecialCells] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/puzzles/${initialPuzzle._id}/attempts`);
        setAttempts(response.data);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };
    fetchAttempts();
  }, [initialPuzzle._id]);

  const generateNumberedGrid = (grid) => {
    let number = 1;
    const numberedGrid = grid.map(row => row.map(cell => ({ ...cell, number: null })));

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].value) {
          const isStartOfAcrossWord = col === 0 || !grid[row][col - 1].value;
          const isStartOfDownWord = row === 0 || !grid[row - 1][col].value;
          if (isStartOfAcrossWord || isStartOfDownWord) {
            numberedGrid[row][col].number = number++;
          }
        }
      }
    }
    return numberedGrid;
  };

  const numberedGrid = generateNumberedGrid(initialPuzzle.grid);

  const handleCellClick = (row, col) => {
    if (!initialPuzzle.grid[row][col].value) return;

    const cell = initialPuzzle.grid[row][col];
    const word = initialPuzzle.words.find(word => {
      if (word.direction === 'across') {
        return word.startRow === row && col >= word.startCol && col < word.startCol + word.word.length;
      } else {
        return word.startCol === col && row >= word.startRow && row < word.startRow + word.word.length;
      }
    });

    if (word) {
      const newHighlightedCells = [];
      if (word.direction === 'across') {
        for (let i = 0; i < word.word.length; i++) {
          newHighlightedCells.push({ row: word.startRow, col: word.startCol + i });
        }
      } else {
        for (let i = 0; i < word.word.length; i++) {
          newHighlightedCells.push({ row: word.startRow + i, col: word.startCol });
        }
      }
      setHighlightedCells(newHighlightedCells);
      setSelectedWord(word);
    }

    if (cell.isSpecial && !revealedSpecialCells.has(`${row}-${col}`)) {
      setSelectedCell({ row, col });
      setShowSpecialModal(true);
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleCellChange = (row, col, value) => {
    if (!selectedWord || value.length > 1) return;
  
    const newGrid = [...userGrid];
    newGrid[row][col] = value.toUpperCase();
    setUserGrid(newGrid);
  
    // Find index of current cell in the highlightedCells array
    const currentIndex = highlightedCells.findIndex(cell => cell.row === row && cell.col === col);
    
    if (currentIndex !== -1 && currentIndex < highlightedCells.length - 1) {
      // Move to the next cell in the highlighted word
      const nextCell = highlightedCells[currentIndex + 1];
      setSelectedCell({ row: nextCell.row, col: nextCell.col });
  
      // Automatically focus the next cell
      setTimeout(() => {
        document.getElementById(`cell-${nextCell.row}-${nextCell.col}`)?.focus();
      }, 10);
    }
  };

  const handleSpecialAnswer = async (answer) => {
    if (!selectedCell) return;
   
    const { row, col } = selectedCell;
    const cell = initialPuzzle.grid[row][col];
   
    if (answer.toLowerCase() === cell.answer.toLowerCase()) {
      setUserGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]); 
        newGrid[row][col] = cell.letter;
        return newGrid;
      });
  
      setRevealedSpecialCells(prev => new Set([...prev, `${row}-${col}`]));
      initialPuzzle.grid[row][col].isRevealed = true;
  
      setMessage('Correct answer! Special cell revealed.');
    } else {
      setMessage('Incorrect answer. Try again!');
    }
  
    setTimeout(() => setMessage(''), 3000);
    setShowSpecialModal(false);
    setSpecialAnswer('');
  };

  const handleSubmitPuzzle = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/attempts', {
        puzzleId: initialPuzzle._id,
        userGrid,
        completedSpecialCells
      });
      
      const { score, totalPossibleScore } = response.data;
      setMessage(`Puzzle submitted! Score: ${score} out of ${totalPossibleScore}`);
      setTimeout(() => setMessage(''), 5000);
      
      // Refresh attempts list
      const attemptsResponse = await axios.get(`http://localhost:5000/api/puzzles/${initialPuzzle._id}/attempts`);
      setAttempts(attemptsResponse.data);
    } catch (error) {
      console.error('Error submitting puzzle:', error);
      setMessage('Failed to submit puzzle. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crossword Puzzle</h1>
          {message && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-opacity">
              {message}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CrosswordGrid
              grid={numberedGrid}
              userGrid={userGrid}
              setUserGrid={setUserGrid}
              words={initialPuzzle.words}
              selectedCell={selectedCell}
              highlightedCells={highlightedCells}
              onCellClick={handleCellClick}
              onCellChange={handleCellChange}
              revealedSpecialCells={revealedSpecialCells}
            />
            <button
              onClick={handleSubmitPuzzle}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Puzzle
            </button>
            
            {attempts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Previous Attempts</h3>
                <div className="space-y-2">
                  {attempts.map((attempt, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                      <p className="text-gray-700">
                        Score: {attempt.score}/{attempt.totalPossibleScore}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <CluesList words={initialPuzzle.words} />
          </div>
        </div>
      </div>
      
      <SpecialModal
        show={showSpecialModal}
        onClose={() => setShowSpecialModal(false)}
        onSubmit={handleSpecialAnswer}
        answer={specialAnswer}
        setAnswer={setSpecialAnswer}
        question={selectedCell ? initialPuzzle.grid[selectedCell.row][selectedCell.col].question : ''}
      />
    </div>
  );
}

export default App;