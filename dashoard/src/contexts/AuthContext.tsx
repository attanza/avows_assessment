import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import useError from '../hooks/useError';
import { IUser } from '../interaces/user.interface';
import api from '../utils/api';

type AuthContextType = {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => void;
  getMe: () => void;
  authenticated: boolean;
};

const initialValue: AuthContextType = {
  user: null,
  setUser: () => {},
  logout: () => {},
  getMe: () => {},
  authenticated: false,
};

const AuthContext = createContext(initialValue);

const AuthProvider: React.FC = ({ children }) => {
  const parseError = useError();
  const [user, setUser] = useState<IUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const logout = async () => {
    try {
      await api.post('/logout', {});
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getMe = async () => {
    try {
      const resp = await api.get('/me');
      await Promise.all([setUser(resp), setAuthenticated(true)]);
    } catch (error) {
      parseError(error);
    }
  };

  useEffect(() => {
    async function initFetch() {
      await getMe();
    }
    initFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout, authenticated, setUser, getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}
