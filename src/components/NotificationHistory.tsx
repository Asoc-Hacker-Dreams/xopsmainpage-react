import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationContext, type Notification } from '../hooks/useNotifications';
import './NotificationHistory.css';

interface NotificationHistoryProps {
  show?: boolean;
  onClose?: () => void;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({
  show = true,
  onClose
}) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount
  } = useNotificationContext();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES');
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  if (!show) return null;

  return (
    <div className="notification-history">
      {onClose && (
        <button className="history-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      )}

      <div className="history-header">
        <h2>
          Notificaciones
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
        <div className="history-actions">
          {unreadCount > 0 && (
            <button className="action-btn" onClick={markAllAsRead}>
              Marcar todas leídas
            </button>
          )}
          {notifications.length > 0 && (
            <button className="action-btn danger" onClick={clearAll}>
              Limpiar todo
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="history-filter">
        <button
          className={"filter-btn" + (filter === 'all' ? ' active' : '')}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button
          className={"filter-btn" + (filter === 'unread' ? ' active' : '')}
          onClick={() => setFilter('unread')}
        >
          No leídas ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <p>
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer'
                : 'No tienes notificaciones'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={"notification-item" + (notification.read ? ' read' : '')}
            >
              <div className={"notification-icon " + notification.type}>
                {getIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {formatTimestamp(notification.timestamp)}
                </span>
                {notification.actionUrl && notification.actionLabel && (
                  <Link to={notification.actionUrl} className="notification-action">
                    {notification.actionLabel} →
                  </Link>
                )}
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="item-action"
                    onClick={() => markAsRead(notification.id)}
                    title="Marcar como leída"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="item-action delete"
                  onClick={() => removeNotification(notification.id)}
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationHistory;
