import React, { useState, useEffect } from 'react';

function Timer({ onTimeUp, duration = 2700 }) { // 45 minutes = 2700 seconds
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-xl font-bold text-gray-700">
      Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;
