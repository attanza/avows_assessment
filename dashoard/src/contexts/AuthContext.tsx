import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import useError from '../hooks/useError';
import { IReducerAction } from '../interaces/reducers.interface';
import { IUser } from '../interaces/user.interface';
import api from '../utils/api';

type AuthContextType = {
  user: IUser | null;
  authLoading: boolean;
  logout: () => void;
  getMe: () => void;
  dispatch: (value: IReducerAction) => void;
};

const initialState: AuthContextType = {
  user: null,
  authLoading: true,
  logout: () => {},
  getMe: () => {},
  dispatch: (value: IReducerAction) => {},
};

const authReducer = (state: AuthContextType, action: IReducerAction) => {
  switch (action.type) {
    case 'set-user':
      return { ...state, user: action.payload };
    case 'set-auth-loading':
      return { ...state, authLoading: action.payload };

    default:
      return state;
  }
};

const AuthContext = createContext(initialState);

const AuthProvider: React.FC = ({ children }) => {
  const parseError = useError();
  const [state, dispatch] = useReducer(authReducer, initialState);
  const location = useLocation();
  const logout = async () => {
    try {
      await api.post('/logout', {});
      dispatch({ type: 'set-user', payload: null });
    } catch (error) {
      console.log(error);
    }
  };

  const getMe = async () => {
    try {
      const resp = await api.get('/me');
      dispatch({ type: 'set-user', payload: resp });
      dispatch({ type: 'set-auth-loading', payload: false });
    } catch (error) {
      parseError(error);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      await getMe();
    };
    if (location.pathname !== '/login') {
      fetchMe();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout, getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}
