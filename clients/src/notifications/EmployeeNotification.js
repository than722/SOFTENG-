import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeNotification.css';

const EmployeeNotification = () => {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setError('User ID not found. Please log in.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8081/api/notifications/${userId}`)
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, [userId]);

  const handleMarkAsRead = (notificationId) => {
    axios
      .delete(`http://localhost:8081/api/notifications/${notificationId}`, {
        params: { userType: 'employee' },
      })
      .then(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="notification-employee-container">
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notification-employee-list">
          {notifications.map((notification) => (
            <li key={notification.id} className="notification-employee-item">
              <div className="notification-message">
                <p>{notification.message}</p>
                <span className="notification-type">
                  {notification.type === 'hire'
                    ? 'Hiring Update'
                    : notification.type === 'application'
                    ? 'Application Status'
                    : 'General'}
                </span>
              </div>
              <button
                className="mark-as-read-button"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeNotification;
