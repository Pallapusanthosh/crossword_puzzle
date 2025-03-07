import React from "react";

function CluesList({ words }) {
  const acrossClues = words.filter(word => word.direction === "across")
    .sort((a, b) => a.number - b.number);
  const downClues = words.filter(word => word.direction === "down")
    .sort((a, b) => a.number - b.number);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Clues</h2>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Across</h2>
        {acrossClues.map((word) => (
          <div key={word.number} className="text-gray-700 flex  gap-2 items-center">
            <span className="font-bold text-lg ">{word.number}.</span>
            <span>{word.clue}</span>
            <span className="text-gray-500">({word.wordLength})</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Down</h2>
        {downClues.map((word) => (
          <div key={word.number} className="text-gray-700 flex gap-2 items-center">
            <span className="font-bold text-lg">{word.number}.</span>
            <span>{word.clue}</span>
            <span className="text-gray-500">({word.wordLength})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CluesList;
