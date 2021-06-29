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
            <Route path="/login" component={Login} />
            <Route path="/" exact component={Dashboard} />
            <Route path="*">
              <div>404 Not found </div>
            </Route>
          </Switch>
        </FilteringProvider>
      </AuthProvider>
    </Router>
  );
};

export default Routes;
