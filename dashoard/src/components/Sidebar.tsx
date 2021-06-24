import { Link } from 'react-router-dom';
import Filtering from './Filtering';
const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link className="brand-link" role="button" to="/">
        <span className="brand-text font-weight-light ml-3">Dashboard</span>
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false">
            {/* <li className="nav-item">
              <NavLink to="/" className="nav-link">
                <i className="nav-icon fas fa-th"></i>
                <p>Dashboard</p>
              </NavLink>
            </li> */}
            <Filtering />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
