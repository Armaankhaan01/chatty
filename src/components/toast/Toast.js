import { useCallback, useEffect, useRef, useState } from 'react';
import './Toast.scss';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { useDispatch } from 'react-redux';
import { Utils } from '@services/utils/utils.service';

const Toast = (props) => {
  const { toastList, position, autoDelete, autoDeleteTime = 2000 } = props;
  const [list, setList] = useState(toastList);
  const listData = useRef([]);
  const dispatch = useDispatch();

  const deleteToast = useCallback(
    (id) => {
      listData.current = cloneDeep(list);
      const deleteIndex = list.findIndex((item) => {
        return item.id === id;
      });
      listData.current.splice(deleteIndex, 1);
      setList([...listData.current]);
      if (!listData.current.length) {
        list.length = 0;
        Utils.dispatchClearNotification(dispatch);
      }
    },
    [list, dispatch]
  );

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const tick = () => {
      deleteToast();
    };

    if (autoDelete && toastList.length && list.length) {
      const interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);

  return (
    <div className={`toast-notification-container ${position}`}>
      {list.map((toast, index) => (
        <div
          className={`toast-notification toast ${position}`}
          key={index}
          style={{ backgroundColor: toast.backgroundColor }}
        >
          <button className="cancel-button" onClick={() => deleteToast(toast.id)}>
            X
          </button>
          <div className={`toast-notification-image ${toast.description.length <= 73 ? 'toast-icon' : ''}`}>
            <img src={toast.icon} alt="toast icon" />
          </div>
          <div className={`toast-notification-message ${toast.description.length <= 73 ? 'toast-message' : ''}`}>
            {toast.description}
          </div>
        </div>
      ))}
    </div>
  );
};

Toast.propTypes = {
  toastList: PropTypes.array,
  position: PropTypes.string,
  autoDelete: PropTypes.bool,
  autoDeleteTime: PropTypes.number
};

export default Toast;
