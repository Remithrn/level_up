import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authentication/AuthSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.auth.message);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isAuthenticated && (
        <button onClick={handleLogout} variant="destructive">
          Logout
        </button>
      )}
  
    </div>
  );
};

export default LogoutButton;
