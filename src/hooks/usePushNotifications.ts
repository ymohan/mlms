import { useEffect, useState } from 'react';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setRegistration(reg);
          console.log('Service Worker registered:', reg);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Notifications are not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = async (options: PushNotificationOptions) => {
    if (!isSupported) {
      throw new Error('Notifications are not supported');
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        throw new Error('Notification permission denied');
      }
    }

    // Send notification through service worker if available
    if (registration) {
      registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
        badge: options.badge || '/vite.svg',
        tag: options.tag,
        data: options.data,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/vite.svg'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/vite.svg'
          }
        ]
      });
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
        tag: options.tag,
        data: options.data,
      });
    }
  };

  const scheduleNotification = (options: PushNotificationOptions, delay: number) => {
    setTimeout(() => {
      sendNotification(options);
    }, delay);
  };

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification,
  };
};