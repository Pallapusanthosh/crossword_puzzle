import React from "react";

function Cell({ value, letter, isSpecial, isSelected, isRevealed, onClick, onChange, number, isHighlighted }) {
  if (!value) {
    return <div className="w-12 h-12 bg-gray-200 border border-gray-300" />;
  }

  const handleChange = (e) => {
    const input = e.target.value.toUpperCase();
    if (/^[A-Z]?$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer
        transition-colors duration-200
        ${isSelected ? "bg-yellow-100" : "bg-blue-100 hover:bg-blue-400"}
        ${isHighlighted ? "bg-yellow-200" : ""}
        ${isSpecial && !isRevealed ? "bg-blue-800 hover:bg-yellow-300" : ""}
      `}
    >
      {number && (
        <div className="absolute top-0 left-1 text-xs text-gray-600 font-bold">{number}</div>
      )}
      <input
        type="text"
        maxLength="1"
        value={letter || ""}
        onChange={handleChange}
        className={`
          w-full h-full text-center text-xl font-semibold uppercase
          focus:outline-none bg-transparent caret-transparent
          ${isSpecial && !isRevealed ? "text-transparent" : "text-gray-900"}
        `}
      />
    </div>
  );
}

export default Cell;
