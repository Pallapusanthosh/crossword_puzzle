import React from "react";
import Cell from "./Cell";

function CrosswordGrid({ 
  grid = [[]],  // Default value to prevent undefined error
  userGrid = [[]], 
  setUserGrid, 
  onCellClick, 
  onCellChange, 
  highlightedCells = [],
  selectedWord,
  words = [] 
}) {
  const isHighlighted = (row, col) => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };

  const getWordNumber = (row, col) => {
    const word = words.find(w => w.startRow === row && w.startCol === col);
    return word ? word.number : null;
  };

  return (
    <div className="grid grid-cols-1 gap-1 p-4 bg-gray-100 rounded-lg shadow-md">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell.value}
              letter={userGrid[rowIndex][colIndex] || ""}  // Prevent error
              isSelected={selectedWord?.startRow === rowIndex && selectedWord?.startCol === colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onChange={(val) => onCellChange(rowIndex, colIndex, val)}
              number={getWordNumber(rowIndex, colIndex)}
              isHighlighted={isHighlighted(rowIndex, colIndex)}
              isWordStart={words.some(w => w.startRow === rowIndex && w.startCol === colIndex)}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default CrosswordGrid;
