import React from "react";

function CluesList({ words }) {
  const acrossClues = words.filter((word) => word.direction === "across");
  const downClues = words.filter((word) => word.direction === "down");

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Clues</h2>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Across</h2>
        {acrossClues.map((word, index) => (
          <div key={word.number} className="text-gray-700 flex gap-2 items-center">
            <span className="font-bold text-lg">{index + 1}.</span>
            <span>{word.clue}</span>
            <span className="text-gray-500">({word.word.length})</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Down</h2>
        {downClues.map((word, index) => (
          <div key={word.number} className="text-gray-700 flex gap-2 items-center">
            <span className="font-bold text-lg">{index + 1}.</span>
            <span>{word.clue}</span>
            <span className="text-gray-500">({word.word.length})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CluesList;
