import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import FilteringProvider from './contexts/FilteringContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
const Routes = () => {
  return (
    <Router>
      <AuthProvider>
        <FilteringProvider>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/" exact>
              <Dashboard />
            </Route>
          </Switch>
        </FilteringProvider>
      </AuthProvider>
    </Router>
  );
};

export default Routes;
