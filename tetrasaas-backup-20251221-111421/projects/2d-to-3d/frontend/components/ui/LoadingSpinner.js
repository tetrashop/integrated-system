import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizes[size]} 
          ${colors[color]}
          border-4 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
