import React from "react";
import { Link } from "react-router";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-8">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center px-4">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
