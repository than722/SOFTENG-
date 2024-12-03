import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployerNotification.css'; // Optional: Add CSS for styling
import HeaderEmployer from '../Header/HeaderEmployer';
import { useNavigate } from 'react-router-dom';

const EmployerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Get employer ID from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError('Invalid User ID');
      setLoading(false);
      return;
    }

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

  const handleNotificationClick = (applicationId) => {
    console.log('Application ID:', applicationId); // Debugging
    if (!applicationId) {
      console.error('Application ID is missing.');
      return;
    }
    navigate(`/view-applied-applicants`, { state: { applicationId } });
  };
  

  const markAsRead = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/notifications/${notificationId}`, {
        params: { userType: 'employer' }, // Specify userType as 'employer'
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read.');
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <HeaderEmployer
        userId={userId}
        auth={true}
        onSignOut={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      />

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
                onClick={() => handleNotificationClick(notification.applicationId)}
                style={{ cursor: 'pointer' }}
              >
                <p>{notification.message}</p>
                <p>
                  <small>Applied on: {notification.applyDate}</small>
                </p>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onClick for the notification
                      markAsRead(notification.id);
                    }}
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default EmployerNotification;
