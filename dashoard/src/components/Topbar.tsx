import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Topbar = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const logoutAction = async () => {
    await logout();
    history.push('/login');
  };
  useEffect(() => {
    if (user) {
      toast.info(`Welcome back ${user.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <span className="nav-link" data-widget="pushmenu" role="button">
            <i className="fas fa-bars" />
          </span>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <span className="nav-link" data-toggle="dropdown">
            Welcome {user && user.name}
          </span>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <button className="dropdown-item dropdown-footer" onClick={logoutAction}>
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
