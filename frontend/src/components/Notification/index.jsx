import './style.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const [notification, setNotification] = useState('');
  const [show, setShow] = useState(false);

  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      setNotification(notifications[notifications.length - 1]);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [notifications]);

  const closeNotification = () => {
    setShow(false);
  };

  const type =
    (199 < notification.status && notification.status < 300) ||
    notification.type === 'success'
      ? 'success-notification'
      : 400 <= notification.status || notification.type === 'error'
      ? 'error-notification'
      : '';

  return show ? (
    <div className="notification-wrapper">
      <div className={'notification ' + type}>
        <div className="notification-content">
          {/* <div className="notification-header"></div> */}
          <div className="notification-detail">{notification.detail}</div>
        </div>
        <div className="notification-options">
          <div className="dismiss-notification" onClick={closeNotification}>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Notification;
