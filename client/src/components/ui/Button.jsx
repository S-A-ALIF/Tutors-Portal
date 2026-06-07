import React from 'react';

const Button = ({ children, type = "button", className = "", disabled = false, ...props }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;