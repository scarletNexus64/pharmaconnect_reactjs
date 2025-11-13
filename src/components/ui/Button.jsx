import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out transform
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-green to-primary-green-dark
      text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
      focus:ring-primary-green/50
    `,
    secondary: `
      bg-gradient-to-r from-secondary-blue to-secondary-blue-dark
      text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
      focus:ring-secondary-blue/50
    `,
    outline: `
      border-2 border-primary-green text-primary-green bg-white
      hover:bg-primary-green hover:text-white
      focus:ring-primary-green/50
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100
      focus:ring-gray-300/50
    `,
    danger: `
      bg-red-500 text-white hover:bg-red-600
      focus:ring-red-300/50
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-4 py-2 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12',
    xl: 'px-8 py-4 text-lg min-h-14'
  };

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        '--color-primary-green': '#02C98A',
        '--color-primary-green-dark': '#029B63',
        '--color-secondary-blue': '#00AAD8',
        '--color-secondary-blue-dark': '#0080A8'
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Chargement...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </div>
      )}
    </button>
  );
};

export default Button;