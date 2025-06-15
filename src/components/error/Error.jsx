import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = ({ message = "Page not found", error, errorInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">{message}</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded">
            <p className="text-sm text-red-600 font-mono">
              {error.toString()}
            </p>
          </div>
        )}

        {errorInfo && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 font-mono">
              {errorInfo.componentStack}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
