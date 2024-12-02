import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployerNotification.css';

const EmployerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Get employer ID from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications for the employer
    axios
      .get(`http://localhost:8081/api/employers/${userId}/notifications`)
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employer notifications:', error);
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, [userId]);

  const markAsRead = (notificationId, applicationId) => {
    axios
      .post(`http://localhost:8081/api/notifications/${notificationId}/mark-as-read`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        // Redirect to applicant details using applicationId
        navigate(`/employee-details/${applicationId}`);
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
              onClick={() => markAsRead(notification.id, notification.id)} // Using notification.id as applicationId
            >
              <p>{notification.message}</p>
              <p><small>{new Date(notification.createdAt).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerNotification;
