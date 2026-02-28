import React, { useState } from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

interface PostEventSurveyProps {
  show: boolean;
  onHide: () => void;
}

interface SurveyData {
  overallRating: number;
  organizationRating: number;
  contentRating: number;
  venueRating: number;
  networkingRating: number;
  wouldAttendAgain: boolean | null;
  wouldRecommend: boolean | null;
  favoriteTrack: string;
  improvements: string[];
  additionalComments: string;
  email?: string;
}

const TRACKS = [
  'DevOps',
  'DevSecOps',
  'AIOps',
  'MLOps',
  'Cloud',
  'Platform Engineering',
  'SRE',
  'Culture & Leadership',
];

const IMPROVEMENT_AREAS = [
  'Más tiempo para networking',
  'Más charlas de nivel avanzado',
  'Mejor señal WiFi',
  'Más opciones de comida',
  'Mejor información previa',
  'Más talleres prácticos',
  'Mejor acceso al venue',
  'Otras',
];

const StarRating: React.FC<{
  rating: number;
  onChange: (rating: number) => void;
  label: string;
  required?: boolean;
}> = ({ rating, onChange, label, required }) => {
  const [hover, setHover] = useState(0);

  return (
    <Form.Group className="mb-4">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
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
          >
            <FaStar
              className="star-icon"
              color={(hover || rating) >= star ? '#ffc107' : '#e4e5e9'}
              size={32}
            />
          </button>
        ))}
        <span className="ms-2 text-muted">
          {rating > 0 ? `${rating}/5` : 'Sin valorar'}
        </span>
      </div>
    </Form.Group>
  );
};

const PostEventSurvey: React.FC<PostEventSurveyProps> = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [survey, setSurvey] = useState<SurveyData>({
    overallRating: 0,
    organizationRating: 0,
    contentRating: 0,
    venueRating: 0,
    networkingRating: 0,
    wouldAttendAgain: null,
    wouldRecommend: null,
    favoriteTrack: '',
    improvements: [],
    additionalComments: '',
    email: '',
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleImprovementToggle = (improvement: string) => {
    setSurvey((prev) => ({
      ...prev,
      improvements: prev.improvements.includes(improvement)
        ? prev.improvements.filter((i) => i !== improvement)
        : [...prev.improvements, improvement],
    }));
  };

  const handleSubmit = () => {
    const surveyData = {
      ...survey,
      submittedAt: new Date().toISOString(),
      id: `survey-${Date.now()}`,
    };

    const existingSurveys = JSON.parse(
      localStorage.getItem('xops-surveys') || '[]'
    );
    existingSurveys.push(surveyData);
    localStorage.setItem('xops-surveys', JSON.stringify(existingSurveys));

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_submitted', {
        event_category: 'feedback',
        value: survey.overallRating,
        would_recommend: survey.wouldRecommend,
        would_attend_again: survey.wouldAttendAgain,
      });
    }

    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    onHide();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return survey.overallRating > 0;
      case 2:
        return (
          survey.organizationRating > 0 &&
          survey.contentRating > 0
        );
      case 3:
        return survey.wouldRecommend !== null;
      default:
        return true;
    }
  };

  if (submitted) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 ¡Gracias por tu feedback!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🙏</span>
          </div>
          <h5>Tu opinión es muy valiosa para nosotros</h5>
          <p className="text-muted">
            Usaremos tu feedback para mejorar las próximas ediciones de X-Ops Conference.
          </p>
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
        <Modal.Title>📋 Encuesta Post-Evento</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ProgressBar now={progress} className="mb-4" />
        <p className="text-muted text-center mb-4">
          Paso {step} de {totalSteps}
        </p>

        {step === 1 && (
          <div className="survey-step">
            <h4 className="mb-4">Valoración General</h4>

            <StarRating
              label="¿Cómo valorarías tu experiencia general en X-Ops Conference?"
              rating={survey.overallRating}
              onChange={(rating) =>
                setSurvey((prev) => ({ ...prev, overallRating: rating }))
              }
              required
            />

            <StarRating
              label="¿Cómo valorarías el contenido de las charlas?"
              rating={survey.contentRating}
              onChange={(rating) =>
                setSurvey((prev) => ({ ...prev, contentRating: rating }))
              }
            />

            <StarRating
              label="¿Cómo valorarías el networking?"
              rating={survey.networkingRating}
              onChange={(rating) =>
                setSurvey((prev) => ({ ...prev, networkingRating: rating }))
              }
            />
          </div>
        )}

        {step === 2 && (
          <div className="survey-step">
            <h4 className="mb-4">Organización y Venue</h4>

            <StarRating
              label="¿Cómo valorarías la organización del evento?"
              rating={survey.organizationRating}
              onChange={(rating) =>
                setSurvey((prev) => ({ ...prev, organizationRating: rating }))
              }
              required
            />

            <StarRating
              label="¿Cómo valorarías el venue/ubicación?"
              rating={survey.venueRating}
              onChange={(rating) =>
                setSurvey((prev) => ({ ...prev, venueRating: rating }))
              }
            />

            <Form.Group className="mb-4">
              <Form.Label>¿Cuál fue tu track favorito?</Form.Label>
              <Form.Select
                value={survey.favoriteTrack}
                onChange={(e) =>
                  setSurvey((prev) => ({ ...prev, favoriteTrack: e.target.value }))
                }
              >
                <option value="">Selecciona un track...</option>
                {TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        )}

        {step === 3 && (
          <div className="survey-step">
            <h4 className="mb-4">Feedback Final</h4>

            <Form.Group className="mb-4">
              <Form.Label>
                ¿Recomendarías X-Ops Conference a colegas?{' '}
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex gap-3">
                <Button
                  variant={survey.wouldRecommend === true ? 'success' : 'outline-success'}
                  onClick={() =>
                    setSurvey((prev) => ({ ...prev, wouldRecommend: true }))
                  }
                >
                  👍 Sí, definitivamente
                </Button>
                <Button
                  variant={survey.wouldRecommend === false ? 'danger' : 'outline-danger'}
                  onClick={() =>
                    setSurvey((prev) => ({ ...prev, wouldRecommend: false }))
                  }
                >
                  👎 No creo que sí
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>¿Volverías a asistir el próximo año?</Form.Label>
              <div className="d-flex gap-3">
                <Button
                  variant={
                    survey.wouldAttendAgain === true ? 'primary' : 'outline-primary'
                  }
                  onClick={() =>
                    setSurvey((prev) => ({ ...prev, wouldAttendAgain: true }))
                  }
                >
                  ✅ Sí
                </Button>
                <Button
                  variant={
                    survey.wouldAttendAgain === false ? 'secondary' : 'outline-secondary'
                  }
                  onClick={() =>
                    setSurvey((prev) => ({ ...prev, wouldAttendAgain: false }))
                  }
                >
                  ❌ No
                </Button>
                <Button
                  variant={
                    survey.wouldAttendAgain === null ? 'secondary' : 'outline-secondary'
                  }
                  onClick={() =>
                    setSurvey((prev) => ({ ...prev, wouldAttendAgain: null }))
                  }
                >
                  🤔 Lo pensaré
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>¿Qué podríamos mejorar? (opcional)</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {IMPROVEMENT_AREAS.map((area) => (
                  <Button
                    key={area}
                    variant={
                      survey.improvements.includes(area)
                        ? 'primary'
                        : 'outline-primary'
                    }
                    size="sm"
                    onClick={() => handleImprovementToggle(area)}
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Comentarios adicionales (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={survey.additionalComments}
                onChange={(e) =>
                  setSurvey((prev) => ({
                    ...prev,
                    additionalComments: e.target.value,
                  }))
                }
                placeholder="Cuéntanos más sobre tu experiencia..."
                maxLength={1000}
              />
              <Form.Text className="text-muted">
                {survey.additionalComments.length}/1000 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Email (opcional - para notificarte de próximos eventos)
              </Form.Label>
              <Form.Control
                type="email"
                value={survey.email}
                onChange={(e) =>
                  setSurvey((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="tu@email.com"
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {step > 1 && (
          <Button variant="outline-secondary" onClick={() => setStep(step - 1)}>
            ← Anterior
          </Button>
        )}
        {step < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
          >
            Siguiente →
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={!isStepValid()}
          >
            📤 Enviar Encuesta
          </Button>
        )}
      </Modal.Footer>

      <style>{`
        .survey-step {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .star-rating {
          display: flex;
          align-items: center;
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
          transform: scale(1.15);
        }
        .star-icon {
          transition: color 0.2s ease;
        }
      `}</style>
    </Modal>
  );
};

export default PostEventSurvey;
