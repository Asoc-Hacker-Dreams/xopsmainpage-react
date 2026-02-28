import React from 'react';
import type { Toast } from '../hooks/useNotifications';
import './ToastContainer.css';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const getIcon = (type: Toast['type']) => {
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

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={"toast toast-" + toast.type}
        >
          <span className="toast-icon" aria-hidden="true">
            {getIcon(toast.type)}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => onRemove(toast.id)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
