import React from 'react';

function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Thank You!</h2>
        <p className="text-gray-700">Your puzzle has been submitted successfully.</p>
      </div>
    </div>
  );
}

export default Thanks;
