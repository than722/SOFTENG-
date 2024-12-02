import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployerNotification.css'; // Optional: Add CSS for styling

const EmployerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Get employer ID from localStorage

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/employers/${userId}/notifications`)
      .then((response) => {
        const formattedNotifications = response.data.map((notification) => ({
          ...notification,
          applyDate: new Date(notification.applyDate).toLocaleString(),
        }));
        setNotifications(formattedNotifications);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employer notifications:', error);
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, [userId]);

  const markAsRead = (notificationId) => {
    axios
      .delete(`http://localhost:8081/api/notifications/${notificationId}`, {
        params: { userType: 'employer' }, // Specify userType as 'employer'
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

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="employer-notification-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <p>{notification.message}</p>
              <p>
                <small>Applied on: {notification.applyDate}</small>
              </p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerNotification;
