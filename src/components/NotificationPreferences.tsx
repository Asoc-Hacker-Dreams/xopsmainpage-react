import React, { useState } from 'react';
import { useNotificationContext, type NotificationPreferences as NP } from '../hooks/useNotifications';
import './NotificationPreferences.css';

interface NotificationPreferencesProps {
  show?: boolean;
  onClose?: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  show = true,
  onClose
}) => {
  const { preferences, updatePreferences, requestPushPermission } = useNotificationContext();
  const [pushPermissionStatus, setPushPermissionStatus] = useState<'default' | 'granted' | 'denied'>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const handleToggle = (key: keyof NP) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const handleReminderChange = (minutes: number) => {
    updatePreferences({ reminderMinutes: minutes });
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setPushPermissionStatus(granted ? 'granted' : 'denied');
  };

  if (!show) return null;

  return (
    <div className="notification-preferences">
      {onClose && (
        <button className="preferences-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      )}

      <h2>Preferencias de Notificaciones</h2>

      {/* Master Toggle */}
      <div className="preference-section">
        <div className="preference-item master">
          <div className="preference-info">
            <h4>Notificaciones</h4>
            <p>Habilitar todas las notificaciones</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enabled}
              onChange={() => handleToggle('enabled')}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="preference-section">
        <h3>Notificaciones Push (PWA)</h3>
        <div className="preference-item">
          <div className="preference-info">
            <h4>Permisos del navegador</h4>
            <p>
              {pushPermissionStatus === 'granted' && '✓ Permisos concedidos'}
              {pushPermissionStatus === 'denied' && '✕ Permisos denegados (configura en tu navegador)'}
              {pushPermissionStatus === 'default' && 'Solicitar permisos para notificaciones push'}
            </p>
          </div>
          {pushPermissionStatus === 'default' && (
            <button className="enable-push-btn" onClick={handleEnablePush}>
              Habilitar
            </button>
          )}
          {pushPermissionStatus === 'granted' && (
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={preferences.pushEnabled}
                onChange={() => handleToggle('pushEnabled')}
              />
              <span className="toggle-slider" />
            </label>
          )}
        </div>
      </div>

      {/* Notification Types */}
      <div className="preference-section">
        <h3>Tipos de Notificaciones</h3>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Recordatorios de sesiones</h4>
            <p>Recibe avisos antes de que empiecen tus sesiones favoritas</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.sessionReminders}
              onChange={() => handleToggle('sessionReminders')}
              disabled={!preferences.enabled}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Cambios de agenda</h4>
            <p>Avisos cuando haya cambios en el horario de las charlas</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.scheduleChanges}
              onChange={() => handleToggle('scheduleChanges')}
              disabled={!preferences.enabled}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Anuncios del evento</h4>
            <p>Noticias y anuncios importantes del evento</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.announcements}
              onChange={() => handleToggle('announcements')}
              disabled={!preferences.enabled}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Solicitudes de networking</h4>
            <p>Cuando alguien quiera reunirse contigo</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.networkingRequests}
              onChange={() => handleToggle('networkingRequests')}
              disabled={!preferences.enabled}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Reminder Timing */}
      {preferences.sessionReminders && (
        <div className="preference-section">
          <h3>Tiempo de recordatorio</h3>
          <p className="section-description">¿Con cuánta antelación quieres recibir recordatorios?</p>
          <div className="reminder-options">
            {[5, 10, 15, 30, 60].map(minutes => (
              <button
                key={minutes}
                className={"reminder-option" + (preferences.reminderMinutes === minutes ? " active" : "")}
                onClick={() => handleReminderChange(minutes)}
              >
                {minutes >= 60 ? `${minutes / 60}h` : `${minutes}min`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Email Preferences */}
      <div className="preference-section">
        <h3>Notificaciones por Email</h3>
        <div className="preference-item">
          <div className="preference-info">
            <h4>Resumen por email</h4>
            <p>Recibe un resumen diario de tus notificaciones</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.emailEnabled}
              onChange={() => handleToggle('emailEnabled')}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
