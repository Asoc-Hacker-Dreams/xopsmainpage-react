import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Speaker, Talk } from '../dal/types';
import AnimationWrapper from './AnimationWrapper';
import './SpeakerProfile.css';

interface SpeakerProfileProps {
  speaker: Speaker;
  talks?: Talk[];
  compact?: boolean;
  onClose?: () => void;
}

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({
  speaker,
  talks = [],
  compact = false,
  onClose
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState<'bio' | 'sessions' | 'social'>('bio');

  const truncatedBio = speaker.bio && speaker.bio.length > 200
    ? speaker.bio.substring(0, 200) + '...'
    : speaker.bio;

  const renderSocialLinks = () => {
    if (!speaker.social) return null;

    return (
      <div className="speaker-social-links">
        {speaker.social.twitter && (
          <a
            href={`https://twitter.com/${speaker.social.twitter}`}
            target="_blank"
            rel="noreferrer"
            className="social-link twitter"
            title="Twitter"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>@{speaker.social.twitter}</span>
          </a>
        )}
        {speaker.social.linkedin && (
          <a
            href={speaker.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="social-link linkedin"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        )}
        {speaker.social.github && (
          <a
            href={`https://github.com/${speaker.social.github}`}
            target="_blank"
            rel="noreferrer"
            className="social-link github"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>@{speaker.social.github}</span>
          </a>
        )}
        {speaker.social.web && (
          <a
            href={speaker.social.web}
            target="_blank"
            rel="noreferrer"
            className="social-link web"
            title="Website"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span>Website</span>
          </a>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="speaker-profile-compact">
        <div className="compact-header">
          <div className="compact-avatar">
            {speaker.photoUrl ? (
              <img src={speaker.photoUrl} alt={speaker.name} />
            ) : (
              <div className="avatar-placeholder">
                {speaker.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="compact-info">
            <h4>{speaker.name}</h4>
            {speaker.role && <p className="role">{speaker.role}</p>}
            {speaker.company && <p className="company">{speaker.company}</p>}
          </div>
          {renderSocialLinks()}
        </div>
        <div className="compact-bio">
          <p>{showFullBio ? speaker.bio : truncatedBio}</p>
          {speaker.bio && speaker.bio.length > 200 && (
            <button
              className="read-more-btn"
              onClick={() => setShowFullBio(!showFullBio)}
            >
              {showFullBio ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
        {talks.length > 0 && (
          <div className="compact-sessions">
            <h5>Sesiones ({talks.length})</h5>
            {talks.slice(0, 2).map(talk => (
              <div key={talk.id} className="compact-session-item">
                <Link to={"/agenda?talk=" + talk.id}>{talk.title}</Link>
              </div>
            ))}
            {talks.length > 2 && (
              <Link to={"/speaker/" + speaker.id} className="view-all-link">
                Ver todas las sesiones →
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="speaker-profile-full">
      {onClose && (
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      )}

      <div className="profile-header">
        <AnimationWrapper animation="fade-left" duration={600}>
          <div className="profile-avatar">
            {speaker.photoUrl ? (
              <img src={speaker.photoUrl} alt={speaker.name} />
            ) : (
              <div className="avatar-placeholder large">
                {speaker.name.charAt(0)}
              </div>
            )}
          </div>
        </AnimationWrapper>

        <AnimationWrapper animation="fade-right" duration={600}>
          <div className="profile-info">
            <h2>{speaker.name}</h2>
            {speaker.role && <p className="role">{speaker.role}</p>}
            {speaker.company && (
              <p className="company">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                {speaker.company}
              </p>
            )}
            {renderSocialLinks()}
          </div>
        </AnimationWrapper>
      </div>

      <div className="profile-tabs">
        <button
          className={"tab-btn" + (activeTab === 'bio' ? ' active' : '')}
          onClick={() => setActiveTab('bio')}
        >
          Biografía
        </button>
        {talks.length > 0 && (
          <button
            className={"tab-btn" + (activeTab === 'sessions' ? ' active' : '')}
            onClick={() => setActiveTab('sessions')}
          >
            {"Sesiones (" + talks.length + ")"}
          </button>
        )}
        {speaker.social && (
          <button
            className={"tab-btn" + (activeTab === 'social' ? ' active' : '')}
            onClick={() => setActiveTab('social')}
          >
            Redes
          </button>
        )}
      </div>

      <div className="profile-content">
        {activeTab === 'bio' && (
          <div className="bio-content">
            {speaker.bio ? (
              <p>{speaker.bio}</p>
            ) : (
              <p className="no-content">Biografía no disponible</p>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-content">
            {talks.length > 0 ? (
              <div className="sessions-list">
                {talks.map(talk => (
                  <div key={talk.id} className="session-card">
                    <h4>
                      <Link to={"/agenda?talk=" + talk.id}>{talk.title}</Link>
                    </h4>
                    <div className="session-meta">
                      <span className="session-day">📅 {talk.day}</span>
                      <span className="session-time">🕐 {talk.startTime} - {talk.endTime}</span>
                      <span className="session-room">📍 {talk.room}</span>
                    </div>
                    {talk.track && <span className="session-track">{talk.track}</span>}
                    {talk.description && (
                      <p className="session-description">
                        {talk.description.length > 150
                          ? talk.description.substring(0, 150) + '...'
                          : talk.description}
                      </p>
                    )}
                    <Link to={"/agenda?talk=" + talk.id} className="view-talk-btn">
                      Ver detalles →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-content">No hay sesiones disponibles</p>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="social-content">
            {speaker.social ? (
              <div className="social-grid">
                {renderSocialLinks()}
              </div>
            ) : (
              <p className="no-content">No hay redes sociales disponibles</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerProfile;
