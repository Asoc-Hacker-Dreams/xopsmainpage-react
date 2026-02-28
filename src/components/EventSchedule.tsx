import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useAgenda } from '../hooks/useAgenda';
import { useFavorites } from '../hooks/useFavorites';
import AnimationWrapper from './AnimationWrapper';
import type { Talk } from '../dal/types';

const EventSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const { talks, loading, days } = useAgenda({ day: selectedDay });
  const { isFavorite, toggleFavorite } = useFavorites();
  const [modalTalk, setModalTalk] = useState<Talk | null>(null);

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <h2 className="text-center margin-top">Agenda</h2>

        {/* Day tabs */}
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

                      <button className="button menu-btn me-2" onClick={() => setModalTalk(talk)}>
                        Más Detalles
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => toggleFavorite(talk.id)}
                        style={{ fontSize: '1.2rem' }}
                      >
                        {isFavorite(talk.id) ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <Modal show={!!modalTalk} onHide={() => setModalTalk(null)}>
          {modalTalk && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{modalTalk.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalTalk.description}</Modal.Body>
              <Modal.Footer className="d-flex justify-content-between">
                <span>{modalTalk.speakerIds?.map(s => s.replace(/-/g, ' ')).join(', ')}</span>
                <span>{modalTalk.startTime} – {modalTalk.endTime}</span>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </AnimationWrapper>
    </section>
  );
};

export default EventSchedule;
