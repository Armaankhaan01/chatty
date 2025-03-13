import { Outlet } from 'react-router-dom';

import './Social.scss';
import Header from '@components/header/Header';

const Social = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <div>Sidebar</div>
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default Social;
