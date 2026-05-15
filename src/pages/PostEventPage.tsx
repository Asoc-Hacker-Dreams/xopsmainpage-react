import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PhotoGallery from '../components/PhotoGallery';
import VideoReplay from '../components/VideoReplay';
import FeedbackSummary from '../components/FeedbackSummary';
import CountdownTimer from '../components/CountdownTimer';
import './PostEventPage.css';

interface EventStats {
  attendees: number;
  sessions: number;
  speakers: number;
  sponsors: number;
  satisfaction: number;
}

const PostEventPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'videos' | 'feedback'>('gallery');

  // These would come from API in production
  const stats: EventStats = {
    attendees: 850,
    sessions: 45,
    speakers: 52,
    sponsors: 28,
    satisfaction: 4.7,
  };

  // Next event date (example: 1 year from now)
  const nextEventDate = new Date();
  nextEventDate.setFullYear(nextEventDate.getFullYear() + 1);

  return (
    <>
      <Helmet>
        <title>X-Ops Conference Madrid 2025 - Gracias por venir</title>
        <meta name="description" content="Gracias por asistir a la X-Ops Conference Madrid 2025. Revive los mejores momentos, ve las charlas en diferido y comparte tu feedback." />
      </Helmet>

      <div className="post-event-page">
        {/* Thank You Hero */}
        <section className="thank-you-hero">
          <div className="hero-content">
            <h1>¡Gracias por venir!</h1>
            <p className="hero-subtitle">
              X-Ops Conference Madrid 2025 fue un éxito gracias a ti
            </p>

            {/* Event Stats */}
            <div className="event-stats">
              <div className="stat">
                <span className="stat-value">{stats.attendees.toLocaleString()}</span>
                <span className="stat-label">Asistentes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.sessions}</span>
                <span className="stat-label">Sesiones</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.speakers}</span>
                <span className="stat-label">Ponentes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.sponsors}</span>
                <span className="stat-label">Patrocinadores</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.satisfaction}/5</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown to Next Event */}
        <section className="next-event-section">
          <h2>Nos vemos el próximo año</h2>
          <CountdownTimer targetDate={nextEventDate} />
          <p className="newsletter-cta">
            ¿Quieres enterarte antes que nadie?{' '}
            <a href="#newsletter" className="newsletter-link">
              Suscríbete a nuestra newsletter
            </a>
          </p>
        </section>

        {/* Content Tabs */}
        <section className="content-section">
          <div className="content-tabs">
            <button
              className={"tab-btn" + (activeTab === 'gallery' ? ' active' : '')}
              onClick={() => setActiveTab('gallery')}
            >
              📷 Galería de Fotos
            </button>
            <button
              className={"tab-btn" + (activeTab === 'videos' ? ' active' : '')}
              onClick={() => setActiveTab('videos')}
            >
              🎥 Charlas en Diferido
            </button>
            <button
              className={"tab-btn" + (activeTab === 'feedback' ? ' active' : '')}
              onClick={() => setActiveTab('feedback')}
            >
              💬 Feedback
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'gallery' && <PhotoGallery />}
            {activeTab === 'videos' && <VideoReplay />}
            {activeTab === 'feedback' && <FeedbackSummary />}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>¿Te lo perdiste o quieres repetir?</h2>
            <p>
              Todas las grabaciones estarán disponibles para los asistentes.
              Si no pudiste venir, suscríbete para enterarte de la próxima edición.
            </p>
            <div className="cta-buttons">
              <a href="#newsletter" className="cta-btn primary">
                Suscribirme a la Newsletter
              </a>
              <a href="https://twitter.com/xopsconference" target="_blank" rel="noreferrer" className="cta-btn secondary">
                Seguir en Twitter
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PostEventPage;
