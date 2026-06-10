import React from 'react';

const LoadingComponent = ({ message = 'Loading...', fullScreen = false }) => {
    // Adjust container classes based on whether it needs to take up the whole screen or just its parent container
    const containerClasses = fullScreen
        ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50"
        : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

    return (
        <div className={containerClasses}>
            {/* Tailwind CSS Spinner */}
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            
            {/* Optional Loading Message */}
            {message && (
                <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingComponent;