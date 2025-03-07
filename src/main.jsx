import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Your Crossword App
import Login from './components/Login';
import Thanks from './components/Thanks';
import './index.css';

function RootComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [puzzle, setPuzzle] = useState(null); // Store puzzle data

  useEffect(() => {
    if (isLoggedIn) {
      async function fetchPuzzle() {
        const token = localStorage.getItem('token'); // Get token from local storage
        try {
          const response = await fetch('http://localhost:5000/api/puzzles/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
          }
          const data = await response.json();
          setPuzzle(data[0]); // Set fetched puzzle data
        } catch (error) {
          console.error('Error fetching puzzle:', error);
        }
      }
      fetchPuzzle();
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update state to show the puzzle once logged in
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!puzzle) {
    return <div>Loading puzzle...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App initialPuzzle={puzzle} />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(<RootComponent />);
