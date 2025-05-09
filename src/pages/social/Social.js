import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Social.scss';
import Header from '@components/header/Header';
import Sidebar from '@components/sidebar/Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const Social = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, sidebar should be hidden by default
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        {/* Mobile sidebar toggle button */}
        {isMobile && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {showSidebar ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* Sidebar - transforms in/out of view on mobile */}
        <div className={`dashboard-sidebar ${showSidebar ? 'show' : 'hide'}`}>
          <Sidebar onNavigate={isMobile ? toggleSidebar : undefined} />
        </div>

        {/* Overlay that appears behind the sidebar on mobile */}
        {isMobile && showSidebar && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

        {/* Main content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Social;
