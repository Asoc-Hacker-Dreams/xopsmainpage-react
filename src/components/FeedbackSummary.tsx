import React, { useState } from 'react';
import './FeedbackSummary.css';

interface FeedbackStats {
  totalResponses: number;
  averageRating: number;
  ratings: {
    [key: number]: number; // rating: count
  };
  categories: {
    name: string;
    rating: number;
  }[];
  highlights: string[];
}

interface FeedbackResponse {
  id: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

// Demo data - in production this would come from API
const demoStats: FeedbackStats = {
  totalResponses: 425,
  averageRating: 4.7,
  ratings: {
    5: 289,
    4: 102,
    3: 28,
    2: 5,
    1: 1,
  },
  categories: [
    { name: 'Calidad de contenido', rating: 4.8 },
    { name: 'Ponentes', rating: 4.7 },
    { name: 'Organización', rating: 4.6 },
    { name: 'Networking', rating: 4.5 },
    { name: 'Venue', rating: 4.4 },
    { name: 'Catering', rating: 4.2 },
  ],
  highlights: [
    'Excelente calidad de charlas',
    'Buen ambiente de networking',
    'Organización impecable',
    'Ponentes de primer nivel',
    'Venue accesible y moderno',
  ],
};

const demoResponses: FeedbackResponse[] = [
  { id: '1', rating: 5, comment: 'Increíble evento, aprendí mucho y conocí gente genial!', timestamp: '2025-11-21T18:00:00Z' },
  { id: '2', rating: 5, comment: 'Las charlas de Kubernetes fueron espectaculares.', timestamp: '2025-11-21T17:30:00Z' },
  { id: '3', rating: 4, comment: 'Muy bien organizado, pero faltaron más opciones vegetarianas.', timestamp: '2025-11-21T17:00:00Z' },
  { id: '4', rating: 5, comment: 'El keynote de apertura fue memorable. ¡Gracias!', timestamp: '2025-11-21T16:30:00Z' },
  { id: '5', rating: 5, comment: 'Networking de alta calidad. Ya tengo varios follow-ups pendientes.', timestamp: '2025-11-21T16:00:00Z' },
];

const FeedbackSummary: React.FC = () => {
  const [stats] = useState<FeedbackStats>(demoStats);
  const [responses] = useState<FeedbackResponse[]>(demoResponses);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [userFeedback, setUserFeedback] = useState({ rating: 0, comment: '' });

  const totalRatings = Object.values(stats.ratings).reduce((a, b) => a + b, 0);

  const getPercentage = (count: number) => {
    return Math.round((count / totalRatings) * 100);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className={"stars" + (interactive ? ' interactive' : '')}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={"star" + (star <= rating ? ' filled' : '')}
            onClick={interactive ? () => setUserFeedback(f => ({ ...f, rating: star })) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to API
    console.log('Feedback submitted:', userFeedback);
    setShowFeedbackForm(false);
    setUserFeedback({ rating: 0, comment: '' });
  };

  return (
    <div className="feedback-summary">
      <div className="feedback-header">
        <h2>Resumen de Feedback</h2>
        <p>Gracias a los {stats.totalResponses} asistentes que compartieron su opinión</p>
      </div>

      {/* Overall Rating */}
      <div className="overall-rating">
        <div className="rating-display">
          <span className="big-rating">{stats.averageRating}</span>
          <span className="max-rating">/ 5</span>
        </div>
        {renderStars(Math.round(stats.averageRating))}
        <p className="rating-label">Valoración media</p>
      </div>

      {/* Rating Distribution */}
      <div className="rating-distribution">
        <h3>Distribución de valoraciones</h3>
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="distribution-row">
            <span className="rating-label">{rating} ★</span>
            <div className="distribution-bar">
              <div
                className="distribution-fill"
                style={{ width: getPercentage(stats.ratings[rating]) + '%' }}
              />
            </div>
            <span className="distribution-count">
              {stats.ratings[rating] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Category Ratings */}
      <div className="category-ratings">
        <h3>Valoración por categorías</h3>
        <div className="categories-grid">
          {stats.categories.map(cat => (
            <div key={cat.name} className="category-item">
              <span className="category-name">{cat.name}</span>
              <div className="category-rating">
                {renderStars(Math.round(cat.rating))}
                <span className="rating-value">{cat.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="feedback-highlights">
        <h3>Lo más destacado</h3>
        <div className="highlights-list">
          {stats.highlights.map((highlight, index) => (
            <span key={index} className="highlight-tag">
              ✓ {highlight}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="recent-feedback">
        <h3>Comentarios recientes</h3>
        <div className="feedback-list">
          {responses.map(response => (
            <div key={response.id} className="feedback-item">
              <div className="feedback-rating">
                {renderStars(response.rating)}
              </div>
              {response.comment && (
                <p className="feedback-comment">"{response.comment}"</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div className="feedback-form-section">
        {!showFeedbackForm ? (
          <button
            className="give-feedback-btn"
            onClick={() => setShowFeedbackForm(true)}
          >
            ✏️ Dejar mi feedback
          </button>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmitFeedback}>
            <h3>Tu opinión importa</h3>
            <div className="form-group">
              <label>¿Cómo valorarías el evento?</label>
              {renderStars(userFeedback.rating, true)}
            </div>
            <div className="form-group">
              <label>Tu comentario (opcional)</label>
              <textarea
                value={userFeedback.comment}
                onChange={(e) => setUserFeedback(f => ({ ...f, comment: e.target.value }))}
                placeholder="Cuéntanos tu experiencia..."
                rows={4}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={userFeedback.rating === 0}>
                Enviar feedback
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowFeedbackForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackSummary;
