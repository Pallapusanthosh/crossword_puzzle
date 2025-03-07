import React from "react";

function Cell({ value, letter, isSelected, onClick, onChange, number, isHighlighted, isWordStart, row, col }) {
  const handleKeyDown = (e) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      onChange(e.key);
      e.preventDefault();
    }
  };

  return (
    <div
      className={`
        w-[25px] h-[25px] flex items-center justify-center relative
        ${value ? 'bg-white border-2 border-gray-900' : 'bg-white'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isHighlighted ? 'bg-yellow-200' : ''}
        ${value ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
      data-row={row}
      data-col={col}
    >
      {isWordStart && number && (
        <span className="absolute top-0 left-0.5 text-[8px] font-bold">{number}</span>
      )}
      {value === 1 && (
        <input
          type="text"
          maxLength={1}
          value={letter || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full text-center uppercase font-bold bg-transparent outline-none text-sm"
          data-row={row}
          data-col={col}
        />
      )}
    </div>
  );
}

export default Cell;
