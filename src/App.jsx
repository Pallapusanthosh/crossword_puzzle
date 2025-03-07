import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CrosswordGrid from './components/CrosswordGrid';
import CluesList from './components/CluesList';
import Login from './components/Login';
import Timer from './components/Timer';

function App({ initialPuzzle }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userGrid, setUserGrid] = useState(
    Array(initialPuzzle.size).fill('').map(() => Array(initialPuzzle.size).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnswer, setModalAnswer] = useState("");
  const navigate = useNavigate();

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const generateNumberedGrid = (grid) => {
    const numberedGrid = grid.map(row => row.map(cell => ({ ...cell, number: null })));
    (initialPuzzle.words || []).forEach(word => {
      numberedGrid[word.startRow][word.startCol].number = word.number;
    });
    return numberedGrid;
  };

  const numberedGrid = generateNumberedGrid(initialPuzzle.grid);

  const handleCellClick = (row, col) => {
    if (!initialPuzzle.grid[row][col].value) return;
    console.log('Cell clicked at:', row, col, initialPuzzle.grid[row][col]);
  
    // Clear previous state
    setHighlightedCells([]);
    setSelectedWord(null);
  
    const acrossWord = initialPuzzle.words.find(word => 
      word.direction === 'across' &&
      word.startRow === row && col >= word.startCol && col < word.startCol + word.wordLength
    );
    const downWord = initialPuzzle.words.find(word => 
      word.direction === 'down' &&
      word.startCol === col && row >= word.startRow && row < word.startRow + word.wordLength
    );
    console.log('Found acrossWord:', acrossWord);
    console.log('Found downWord:', downWord);
    let wordToHighlight;
    if (acrossWord && downWord) {
      const direction = prompt("This cell is part of both an Across and a Down word. Type '1' for Across or '2' for Down:");
      if (direction === '1') {
        wordToHighlight = acrossWord;
      } else if (direction === '2') {
        wordToHighlight = downWord;
      } else {
        alert("Invalid choice. Please select '1' for Across or '2' for Down.");
        return;
      }
    } else {
      wordToHighlight = acrossWord || downWord;
    }
  
    if (wordToHighlight) {
      highlightWord(wordToHighlight);
      setSelectedCell({ row, col });
      setModalAnswer("");
      setIsModalOpen(true);
    }
  };
  
  const highlightWord = (word) => {
    const newHighlightedCells = [];
    for (let i = 0; i < word.wordLength; i++) {
      if (word.direction === 'across') {
        newHighlightedCells.push({
          row: word.startRow,
          col: word.startCol + i
        });
      } else {
        newHighlightedCells.push({
          row: word.startRow + i,
          col: word.startCol
        });
      }
    }
    setSelectedWord(word);
    setHighlightedCells(newHighlightedCells);
  };

  const handleModalSubmit = () => {
    if (!selectedWord || !modalAnswer) {
      handleModalClose();
      return;
    }

    const answer = modalAnswer.toUpperCase().trim();
    console.log('Answer submitted:', answer.length);
    console.log('Selected word:', selectedWord.wordLength);
    if (answer.length !== selectedWord.wordLength) {
      alert("The answer length doesn't match the word length.");
      return;
    }

    const newGrid = [...userGrid];
    for (let i = 0; i < answer.length; i++) {
      const row = selectedWord.direction === 'across' ? selectedWord.startRow : selectedWord.startRow + i;
      const col = selectedWord.direction === 'across' ? selectedWord.startCol + i : selectedWord.startCol;
      newGrid[row][col] = answer[i];
    }

    setUserGrid(newGrid);
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalAnswer("");
    setSelectedWord(null);
    setHighlightedCells([]);
    setSelectedCell(null);
  };

  const handleCellChange = (row, col, val) => {
    if (!selectedWord || !val) return;

    const newGrid = [...userGrid];
    const currentIndex = highlightedCells.findIndex(cell => cell.row === row && cell.col === col);
    
    if (currentIndex !== -1) {
      newGrid[row][col] = val.toUpperCase();
      setUserGrid(newGrid);

      if (currentIndex < selectedWord.wordLength - 1) {
        const nextCell = highlightedCells[currentIndex + 1];
        setSelectedCell(nextCell);
        setTimeout(() => {
          const nextInput = document.querySelector(
            `input[data-row="${nextCell.row}"][data-col="${nextCell.col}"]`
          );
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      }
    }
  };

  const handleSubmitPuzzle = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/attempts',
        {
          puzzleId: initialPuzzle._id,
          userGrid
        },
        getAuthHeader()
      );
      
      setMessage('Puzzle submitted successfully!');
      localStorage.clear(); 
      setTimeout(() => {
        setMessage('');
        navigate('/thanks'); // Navigate to the Thanks page
      }, 3000);
    } catch (error) {
      console.error('Error submitting puzzle:', error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
      setMessage('Failed to submit puzzle. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTimeUp = () => {
    handleSubmitPuzzle();
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(userData) => {
      setUser(userData);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crossword Puzzle</h1>
          <Timer onTimeUp={handleTimeUp} duration={45 * 60} />
          {message && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-opacity">
              {message}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col items-center">
            <CrosswordGrid
              grid={numberedGrid}
              userGrid={userGrid}
              setUserGrid={setUserGrid}
              words={initialPuzzle.words}
              selectedCell={selectedCell}
              highlightedCells={highlightedCells}
              onCellClick={handleCellClick}
              onCellChange={handleCellChange}
              selectedWord={selectedWord}
            />
            <button
              onClick={handleSubmitPuzzle}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Puzzle
            </button>
          </div>
          <div>
            <CluesList words={initialPuzzle.words} />
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Enter Your Answer</h2>
              <input
                type="text"
                value={modalAnswer}
                onChange={(e) => setModalAnswer(e.target.value)}
                className="border p-2 w-full"
                autoFocus
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleModalClose} 
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleModalSubmit} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}

export default App;