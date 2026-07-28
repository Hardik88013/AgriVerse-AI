// Purpose: A custom hook to easily access the AuthContext.
// How it works: Wraps useContext(AuthContext).
// Why it exists: Cleaner syntax in our components (e.g., const { user } = useAuth(); instead of importing Context every time).

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
