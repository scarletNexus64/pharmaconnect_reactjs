import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  type = 'text',
  placeholder,
  disabled = false,
  className = '',
  icon,
  onIconClick,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 text-sm border-2 rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-green/20
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 focus:border-red-500' 
      : 'border-gray-200 focus:border-primary-green'
    }
    ${icon ? 'pr-12' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          style={{
            '--color-primary-green': '#02C98A'
          }}
          {...props}
        />
        
        {icon && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onIconClick}
            disabled={disabled}
          >
            {icon}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;