import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { toast } from 'react-hot-toast';

export default function Error() {
  // show a toast on page load
  useEffect(() => {
    toast.error("Oops! Page not found.");
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white p-6"
      style={{ marginTop: '-100px' }}
    >
      <AlertTriangle className="h-20 w-20 text-orange-500 mb-4" />
      <h1 className="text-5xl font-bold text-orange-600 mb-2">Oops!</h1>
      <p className="text-lg text-gray-700 mb-4">
        It looks like something went wrong. We couldn’t find the page you’re looking for.
      </p>
      <p className="text-md text-gray-500 mb-8">
        Don't worry, our team is on it! In the meantime, why not head back to the home page or explore other sections?
      </p>
      <Link 
        to="/" 
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded shadow transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
