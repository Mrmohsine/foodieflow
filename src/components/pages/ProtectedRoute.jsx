// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="text-center p-8 text-xl">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;