'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';  // Adjust path to authSlice
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/logout', {
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(logout());  // Update global auth state
        router.push('/login');  // Redirect to login page
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return isAuthenticated ? (
    <button onClick={handleLogout} className='logout_button'>
      Logout
    </button>
  ) : null;
};

export default LogoutButton;