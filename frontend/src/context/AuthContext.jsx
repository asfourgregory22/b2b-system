import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/users/me');
          
          setUser(response.data.data.user);

        } catch(err){
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);


  const login = async (email, password) => {

    try{
      const response = await api.post('/users/login', { email, password });
      const newToken = response.data.token;
      const userData = response.data.data.user;

      localStorage.setItem('token', newToken);
      
      setToken(newToken);
      setUser(userData);

      return { success: true };

     }catch(err){
      const message = err.response?.data?.message || 'Login failed';
      return { success: false,
               error: message
             };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};