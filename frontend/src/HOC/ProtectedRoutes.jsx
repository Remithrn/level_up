import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);  // Re-run this effect when `isAuthenticated` or `navigate` changes

  return (
    <>
      {isAuthenticated ? children : null}
    </>
  );
};

export default ProtectedRoutes;
