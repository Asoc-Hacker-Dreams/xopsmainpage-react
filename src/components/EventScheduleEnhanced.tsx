import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useAgenda } from '../hooks/useAgenda';
import { useFavorites } from '../hooks/useFavorites';
import AnimationWrapper from './AnimationWrapper';
import ShareButtons from './ShareButtons';
import FeedbackForm from './FeedbackForm';
import { trackLocalAnalytics } from './AnalyticsDashboard';
import type { Talk } from '../dal/types';

const EventScheduleEnhanced: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const { talks, loading, days } = useAgenda({ day: selectedDay });
  const { isFavorite, toggleFavorite } = useFavorites();
  const [modalTalk, setModalTalk] = useState<Talk | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTalk, setFeedbackTalk] = useState<Talk | null>(null);

  const handleFavoriteToggle = (talkId: string) => {
    toggleFavorite(talkId);
    trackLocalAnalytics('agendaInteractions', 'favorites');
  };

  const handleFeedbackClick = (talk: Talk) => {
    setFeedbackTalk(talk);
    setShowFeedback(true);
  };

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <h2 className="text-center margin-top">Agenda</h2>

        <div className="text-center mb-4">
          <button
            className={`btn btn-sm me-2 ${!selectedDay ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedDay(undefined)}
          >
            Todos
          </button>
          {days.map(d => (
            <button
              key={d}
              className={`btn btn-sm me-2 ${selectedDay === d ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedDay(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center">Cargando…</p>
        ) : (
          <div className="container mt-5">
            <div className="row">
              {talks.map(talk => (
                <div key={talk.id} className="col-md-6 mb-4">
                  <div className="card cardBernabeu">
                    <div className="overlay"></div>
                    <div className="card-body text-white">
                      <h5 className="card-title">
                        <span className="heading">Lugar: </span>{talk.room}
                      </h5>
                      <p className="card-text">{talk.startTime} – {talk.endTime}</p>
                      <p>{talk.title}</p>
                      <p>{talk.speakerIds?.map(s => s.replace(/-/g, ' ')).join(', ')}</p>

                      <button 
                        className="button menu-btn me-2" 
                        onClick={() => setModalTalk(talk)}
                      >
                        Más Detalles
                      </button>
                      <button
                        className="btn btn-sm me-2"
                        onClick={() => handleFavoriteToggle(talk.id)}
                        style={{ fontSize: '1.2rem' }}
                        aria-label={isFavorite(talk.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      >
                        {isFavorite(talk.id) ? '⭐' : '☆'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleFeedbackClick(talk)}
                        aria-label="Dar feedback"
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Modal show={!!modalTalk} onHide={() => setModalTalk(null)} size="lg">
          {modalTalk && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{modalTalk.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{modalTalk.description}</p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="badge bg-secondary">{modalTalk.track}</span>
                  <span className="badge bg-info text-dark">{modalTalk.room}</span>
                  <span className="text-muted">{modalTalk.day}</span>
                </div>
                <div className="mb-3">
                  <strong>Ponentes:</strong>{' '}
                  {modalTalk.speakerIds?.map(s => s.replace(/-/g, ' ')).join(', ')}
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span>¿Te gustó esta charla?</span>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        handleFeedbackClick(modalTalk);
                        setModalTalk(null);
                      }}
                    >
                      💬 Dar Feedback
                    </Button>
                    <ShareButtons
                      title={modalTalk.title}
                      url={`https://xopsconference.com/agenda#${modalTalk.id}`}
                      hashtags={['XOps', 'DevOps', modalTalk.track]}
                      variant="icons"
                      size="sm"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between">
                <span>{modalTalk.speakerIds?.map(s => s.replace(/-/g, ' ')).join(', ')}</span>
                <span>{modalTalk.startTime} – {modalTalk.endTime}</span>
              </Modal.Footer>
            </>
          )}
        </Modal>

        <FeedbackForm
          show={showFeedback}
          onHide={() => setShowFeedback(false)}
          talkId={feedbackTalk?.id}
          talkTitle={feedbackTalk?.title}
        />
      </AnimationWrapper>
    </section>
  );
};

export default EventScheduleEnhanced;
