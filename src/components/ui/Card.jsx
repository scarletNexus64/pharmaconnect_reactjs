import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = true,
  padding = 'md',
  onClick,
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = `
    bg-white rounded-xl border border-gray-100 transition-all duration-300
    ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;