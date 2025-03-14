import { useEffect, useState } from 'react';
import { fontAwesomeIcons, sideBarItems } from '@services/utils/static.data';

import './Sidebar.scss';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [Sidebar, setSidebar] = useState([]);
  const location = useLocation();

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {Sidebar.map((data) => (
            <li key={data.index}>
              <div className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''} `}>
                <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                <div className="menu-link">
                  <span>{data.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
