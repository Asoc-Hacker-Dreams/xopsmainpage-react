import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal } from 'react-bootstrap';

/**
 * AgendaList Component - Displays a list of talks with favorite functionality
 * Includes accessibility attributes for screen readers
 */
const AgendaList = ({ talks, isFavorite, onToggleFavorite }) => {
  const [selectedTalk, setSelectedTalk] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (talk) => {
    setSelectedTalk(talk);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTalk(null);
  };

  const formatTime = (timeISO) => {
    return new Date(timeISO).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timeISO) => {
    return new Date(timeISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleToggleFavorite = (e, talkId) => {
    e.stopPropagation(); // Prevent triggering modal
    onToggleFavorite(talkId);
  };

  return (
    <>
      <Row className="mt-5">
        {talks.map((talk) => {
          const isFav = isFavorite(talk.id);
          
          return (
            <Col key={talk.id} xs={12} md={6} lg={4} className="mb-4">
              <div className="card cardcuatroT h-100">
                <div className="overlay"></div>
                <div className="card-body text-white d-flex flex-column">
                  {/* Favorite Button with Accessibility */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, talk.id)}
                    className="btn btn-link position-absolute top-0 end-0 p-2"
                    aria-pressed={isFav}
                    aria-label={isFav ? 
                      `Desmarcar "${talk.talk}" como favorita` : 
                      `Marcar "${talk.talk}" como favorita`
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: isFav ? '#FFD700' : '#FFFFFF',
                      textShadow: '0 0 3px rgba(0,0,0,0.5)',
                      zIndex: 10
                    }}
                  >
                    {isFav ? '★' : '☆'}
                  </button>

                  <h5 className="card-title">
                    <span className="heading">Lugar: </span>{talk.room}
                  </h5>
                  <p className="card-text">
                    {formatDate(talk.timeISO)} - {formatTime(talk.timeISO)} ({talk.durationHuman})
                  </p>
                  <h6 className="flex-grow-1">{talk.talk}</h6>
                  <p><strong>{talk.speaker}</strong></p>
                  <button 
                    onClick={() => handleShowModal(talk)} 
                    className="button menu-btn mt-auto"
                  >
                    Más Detalles
                  </button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Modal for talk details */}
      {selectedTalk && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTalk.talk}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Ponente:</strong> {selectedTalk.speaker}</p>
            <p><strong>Lugar:</strong> {selectedTalk.room}</p>
            <p><strong>Duración:</strong> {selectedTalk.durationHuman}</p>
            <p><strong>Hora:</strong> {formatTime(selectedTalk.timeISO)}</p>
            <p><strong>Track:</strong> {selectedTalk.track}</p>
            <hr />
            <p>{selectedTalk.description}</p>
          </Modal.Body>
          <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>
                {selectedTalk.speaker}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(selectedTalk.id);
                }}
                className="btn btn-outline-primary"
                aria-pressed={isFavorite(selectedTalk.id)}
                aria-label={isFavorite(selectedTalk.id) ? 
                  'Desmarcar como favorita' : 
                  'Marcar como favorita'
                }
              >
                {isFavorite(selectedTalk.id) ? '★ En Mi Agenda' : '☆ Añadir a Mi Agenda'}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

AgendaList.propTypes = {
  talks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    talk: PropTypes.string.isRequired,
    speaker: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    timeISO: PropTypes.string.isRequired,
    durationHuman: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    track: PropTypes.string
  })).isRequired,
  isFavorite: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};

export default AgendaList;
