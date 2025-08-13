import React from 'react';

const Logo = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-16 w-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="POS System Logo" 
        className={`${sizeClasses[size]} object-contain`} 
      />
    </div>
  );
};

export default Logo;