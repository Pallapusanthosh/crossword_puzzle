import React, { useState } from "react";
import Cell from "./Cell";

function CrosswordGrid({ grid, userGrid, setUserGrid, words, onCellClick, onCellChange }) {
  const [selectedWord, setSelectedWord] = useState(null);

  const handleCellClick = (row, col) => {
    onCellClick(row, col);
    const foundWord = words.find(
      (word) => word.startRow === row && word.startCol === col
    );

    if (foundWord) {
      setSelectedWord(foundWord);
    }
  };

  const isHighlighted = (row, col) => {
    if (!selectedWord) return false;

    const { startRow, startCol, word, direction } = selectedWord;
    if (direction === "across") {
      return row === startRow && col >= startCol && col < startCol + word.length;
    } else if (direction === "down") {
      return col === startCol && row >= startRow && row < startRow + word.length;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-1 gap-1 p-4 bg-gray-100 rounded-lg shadow-md">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const word = words.find(
              (word) => word.startRow === rowIndex && word.startCol === colIndex
            );
            return (
              <Cell
                key={colIndex}
                value={cell.value}
                letter={userGrid[rowIndex][colIndex]}
                isSpecial={cell.isSpecial}
                isSelected={selectedWord?.startRow === rowIndex && selectedWord?.startCol === colIndex}
                isRevealed={cell.isRevealed}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onChange={(val) => onCellChange(rowIndex, colIndex, val)}
                number={word?.number}
                isHighlighted={isHighlighted(rowIndex, colIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CrosswordGrid;
