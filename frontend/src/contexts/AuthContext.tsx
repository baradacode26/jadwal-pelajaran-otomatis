import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUser, logoutUser } from '../store/slices/authSlice';
import { authApi } from '../api/endpoints';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token by fetching profile
      authApi
        .getProfile()
        .then((response) => {
          dispatch(setUser(response.data.data));
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          dispatch(logoutUser());
        })
        .finally(() => setIsAuthenticating(false));
    } else {
      setIsAuthenticating(false);
    }
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { accessToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      dispatch(setUser(user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: isAuthenticating || isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
