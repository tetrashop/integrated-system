import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300"
  };

  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2.5 text-base",
    large: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          در حال پردازش...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
