import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import PropTypes from 'prop-types';
import { FaCircle, FaRegCircle, FaTrashAlt, FaUserAlt } from 'react-icons/fa';
import '@components/dropdown/Dropdown.scss';
import { Utils } from '@services/utils/utils.service';
import { useEffect, useState } from 'react';

const Dropdown = ({
  data,
  notificationCount,
  title,
  style,
  height,
  onMarkAsRead,
  onDeleteNotification,
  onLogout,
  onNavigate
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Adjust styles for mobile
  const dropdownStyle = {
    ...style,
    ...(isMobile && {
      position: 'fixed',
      right: '10px',
      top: style?.top || '70px'
    })
  };

  return (
    <div className="social-dropdown" style={dropdownStyle} data-testid="dropdown">
      <div className="social-card">
        <div className="social-card-body">
          <div className="social-bg-primary">
            <h5>
              {title}
              {title === 'Notifications' && notificationCount > 0 && (
                <small className="social-count">{notificationCount}</small>
              )}
            </h5>
          </div>
          <div className="social-card-body-info">
            <div
              data-testid="info-container"
              className="social-card-body-info-container"
              style={{ maxHeight: `${height}px` }}
            >
              {data.length > 0 ? (
                data.map((item) => (
                  <div className="social-sub-card" key={Utils.generateString(10)}>
                    <div className="content-avatar">
                      {title === 'Notifications' ? (
                        <Avatar
                          name={item?.username}
                          bgColor={item?.avatarColor}
                          textColor="#ffffff"
                          size={isMobile ? 35 : 40}
                          avatarSrc={item?.profilePicture}
                        />
                      ) : (
                        <FaUserAlt className="userIcon" />
                      )}
                    </div>
                    <div
                      className="content-body"
                      onClick={() => {
                        if (title === 'Notifications') {
                          onMarkAsRead(item);
                        } else {
                          onNavigate();
                        }
                      }}
                    >
                      <h6 className="title">{item?.topText}</h6>
                      <p className="subtext">{item?.subText}</p>
                    </div>
                    {title === 'Notifications' && (
                      <div className="content-icons">
                        <FaTrashAlt
                          className="trash"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(item?._id);
                          }}
                        />
                        {item?.read ? <FaRegCircle className="circle" /> : <FaCircle className="circle" />}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="social-sub-card">
                  <p style={{ textAlign: 'center', width: '100%', padding: '10px' }}>
                    {title === 'Notifications' ? 'No notifications' : 'No settings available'}
                  </p>
                </div>
              )}
            </div>
            {title === 'Settings' && (
              <div className="social-sub-button">
                <Button label="Sign out" className="button signOut" handleClick={onLogout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  data: PropTypes.array,
  notificationCount: PropTypes.number,
  title: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number,
  onMarkAsRead: PropTypes.func,
  onDeleteNotification: PropTypes.func,
  onLogout: PropTypes.func,
  onNavigate: PropTypes.func
};

export default Dropdown;
