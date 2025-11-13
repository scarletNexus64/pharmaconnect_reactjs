import React from 'react';
import logoImage from '../../assets/images/pharmaConnect.png';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="PharmaConnect" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
            PharmaConnect
          </span>
          {(size === 'lg' || size === 'xl') && (
            <span className="text-sm text-gray-500 font-medium">
              Gestion Pharmaceutique
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;