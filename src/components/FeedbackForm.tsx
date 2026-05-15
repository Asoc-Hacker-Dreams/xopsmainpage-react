import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

interface FeedbackFormProps {
  talkId?: string;
  talkTitle?: string;
  show: boolean;
  onHide: () => void;
  onSubmit?: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  id: string;
  talkId?: string;
  talkTitle?: string;
  overallRating: number;
  contentRating: number;
  speakerRating: number;
  comment: string;
  wouldRecommend: boolean | null;
  submittedAt: string;
  type: 'session' | 'event';
}

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  label: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, label }) => {
  const [hover, setHover] = useState(0);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="star-rating" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="star-button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${star} estrellas`}
            aria-checked={rating === star}
            role="radio"
          >
            <FaStar
              className="star-icon"
              color={(hover || rating) >= star ? '#ffc107' : '#e4e5e9'}
              size={28}
            />
          </button>
        ))}
      </div>
    </Form.Group>
  );
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  talkId,
  talkTitle,
  show,
  onHide,
  onSubmit,
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [contentRating, setContentRating] = useState(0);
  const [speakerRating, setSpeakerRating] = useState(0);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (talkId && show) {
      const existingFeedback = getFeedbackFromStorage(talkId);
      if (existingFeedback) {
        setOverallRating(existingFeedback.overallRating);
        setContentRating(existingFeedback.contentRating);
        setSpeakerRating(existingFeedback.speakerRating);
        setComment(existingFeedback.comment);
        setWouldRecommend(existingFeedback.wouldRecommend);
        setSubmitted(true);
      } else {
        setOverallRating(0);
        setContentRating(0);
        setSpeakerRating(0);
        setComment('');
        setWouldRecommend(null);
        setSubmitted(false);
      }
    }
  }, [talkId, show]);

  const handleSubmit = () => {
    if (overallRating === 0) {
      alert('Por favor, selecciona una valoración general');
      return;
    }

    const feedback: FeedbackData = {
      id: `feedback-${Date.now()}`,
      talkId,
      talkTitle,
      overallRating,
      contentRating,
      speakerRating,
      comment,
      wouldRecommend,
      submittedAt: new Date().toISOString(),
      type: talkId ? 'session' : 'event',
    };

    saveFeedbackToStorage(feedback);

    if (onSubmit) {
      onSubmit(feedback);
    }

    setSubmitted(true);
    trackFeedbackEvent(feedback);
  };

  const handleClose = () => {
    onHide();
  };

  if (submitted) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>¡Gracias por tu feedback!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <FaStar color="#ffc107" size={48} />
          </div>
          <p>Tu opinión nos ayuda a mejorar futuras ediciones.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {talkTitle ? `Valora: ${talkTitle}` : 'Encuesta Post-Evento'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <StarRating
            label="⭐ Valoración General *"
            rating={overallRating}
            onChange={setOverallRating}
          />

          {talkId && (
            <>
              <StarRating
                label="📚 Contenido de la charla"
                rating={contentRating}
                onChange={setContentRating}
              />

              <StarRating
                label="🎤 Calidad del ponente"
                rating={speakerRating}
                onChange={setSpeakerRating}
              />
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>💬 ¿Recomendarías este{talkId ? 'a charla' : ' evento'}?</Form.Label>
            <div className="d-flex gap-3">
              <Button
                variant={wouldRecommend === true ? 'success' : 'outline-success'}
                onClick={() => setWouldRecommend(true)}
              >
                👍 Sí
              </Button>
              <Button
                variant={wouldRecommend === false ? 'danger' : 'outline-danger'}
                onClick={() => setWouldRecommend(false)}
              >
                👎 No
              </Button>
              <Button
                variant={wouldRecommend === null ? 'secondary' : 'outline-secondary'}
                onClick={() => setWouldRecommend(null)}
              >
                🤔 NS/NC
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>📝 Comentarios adicionales (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {comment.length}/500 caracteres
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={overallRating === 0}
        >
          Enviar Feedback
        </Button>
      </Modal.Footer>

      <style>{`
        .star-rating {
          display: inline-flex;
          gap: 0.25rem;
        }
        .star-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .star-button:hover {
          transform: scale(1.1);
        }
        .star-icon {
          transition: color 0.2s ease;
        }
      `}</style>
    </Modal>
  );
};

const FEEDBACK_STORAGE_KEY = 'xops-feedback';

export function saveFeedbackToStorage(feedback: FeedbackData): void {
  try {
    const existing = getAllFeedbackFromStorage();
    const index = existing.findIndex(f => f.talkId === feedback.talkId);
    if (index >= 0) {
      existing[index] = feedback;
    } else {
      existing.push(feedback);
    }
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving feedback to localStorage:', error);
  }
}

export function getFeedbackFromStorage(talkId: string): FeedbackData | null {
  try {
    const all = getAllFeedbackFromStorage();
    return all.find(f => f.talkId === talkId) || null;
  } catch {
    return null;
  }
}

export function getAllFeedbackFromStorage(): FeedbackData[] {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearAllFeedback(): void {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
}

function trackFeedbackEvent(feedback: FeedbackData): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'feedback_submitted', {
      event_category: 'feedback',
      event_label: feedback.talkTitle || 'Post-Event Survey',
      value: feedback.overallRating,
      talk_id: feedback.talkId,
      would_recommend: feedback.wouldRecommend,
    });
  }
}

export default FeedbackForm;
