import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  if (isLoading) {
    // while auth state is being restored, don't redirect. Show nothing (or a spinner later).
    return null;
  }

  if (!isAuthenticated) {
    // App uses `/auth` for both login and signup pages — redirect there.
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
