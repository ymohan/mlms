import { useState, useEffect } from 'react';
import { Notification } from '../types';

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      userId,
      title: 'New Course Available',
      message: 'React Advanced Patterns is now live! Check it out.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '2',
      userId,
      title: 'Quiz Reminder',
      message: 'JavaScript Fundamentals quiz is due tomorrow at 11:59 PM.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: '3',
      userId,
      title: 'Certificate Ready',
      message: 'Your HTML & CSS certificate is ready for download.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '4',
      userId,
      title: 'Assignment Graded',
      message: 'Your Node.js project has been graded. Score: 95/100',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '5',
      userId,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM EST.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  useEffect(() => {
    // Simulate API call
    const loadNotifications = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    loadNotifications();
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
};