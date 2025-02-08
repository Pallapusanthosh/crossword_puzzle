import React from 'react';

function SpecialModal({ show, onClose, onSubmit, answer, setAnswer, question }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;  // Prevent empty submissions
    onSubmit(answer.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4 text-blue-600">Special Challenge!</h3>
        <form onSubmit={handleSubmit}>
          <p className="mb-6 text-gray-700 text-lg">{question}</p>
          
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-6 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
            placeholder="Your answer..."
            autoFocus
            aria-labelledby="special-question"
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SpecialModal;