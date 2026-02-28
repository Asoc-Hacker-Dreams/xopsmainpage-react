import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  sessionReminders: boolean;
  scheduleChanges: boolean;
  announcements: boolean;
  networkingRequests: boolean;
  reminderMinutes: number; // minutes before session
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  pushEnabled: false,
  emailEnabled: true,
  sessionReminders: true,
  scheduleChanges: true,
  announcements: true,
  networkingRequests: true,
  reminderMinutes: 15,
};

const HISTORY_KEY = 'xops-notification-history';
const PREFERENCES_KEY = 'xops-notification-preferences';

interface NotificationContextType {
  notifications: Notification[];
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  requestPushPermission: () => Promise<boolean>;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setNotifications(JSON.parse(storedHistory));
      }

      const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (storedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) });
      }
    } catch (error) {
      console.warn('Error loading notifications:', error);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.warn('Error saving notifications:', error);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Error saving preferences:', error);
    }
  }, [preferences]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100

    // Show browser notification if enabled
    if (preferences.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
      });
    }
  }, [preferences.pushEnabled]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      updatePreferences({ pushEnabled: true });
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updatePreferences({ pushEnabled: true });
        return true;
      }
    }

    return false;
  }, [updatePreferences]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        updatePreferences,
        requestPushPermission,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Toast Hook for transient notifications
export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    const duration = toast.duration ?? 5000;

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'success', message, duration });
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'error', message, duration: duration ?? 8000 });
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'warning', message, duration });
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'info', message, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
