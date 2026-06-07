import React from 'react';

const FormInputField = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) => {
    return (
        <div className="flex flex-col space-y-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
    );
};

export default FormInputField;