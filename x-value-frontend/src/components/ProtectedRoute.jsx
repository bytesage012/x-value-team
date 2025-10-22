import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    // App uses `/auth` for both login and signup pages — redirect there.
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
