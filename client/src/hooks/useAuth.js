// new useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import from your new file

export const useAuth = () => {
  return useContext(AuthContext);
};