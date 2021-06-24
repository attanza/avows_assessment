import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
const Layout: React.FC = ({ children }) => {
  return (
    <div className="hold-transition sidebar-mini">
      <div className="wrapper">
        <Topbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header"></div>
          <section className="content">
            <div className="container-fluid">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Layout;
