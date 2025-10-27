import React, { useState, useMemo } from 'react';
import AnimationWrapper from '../AnimationWrapper';
import { Modal, Container, Row, Col } from 'react-bootstrap';
import scheduleData from '../../data/schedule2025.json';

const Events = () => {
  // State for managing filters
  const [selectedDay, setSelectedDay] = useState('2025-11-21');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Extract unique days from schedule data
  const availableDays = useMemo(() => {
    const days = [...new Set(scheduleData.map(event => event.timeISO.split('T')[0]))];
    return days.sort();
  }, []);

  // Define track configuration
  const trackConfig = {
    all: { label: 'Todos los Tracks', filter: () => true },
    main: { label: 'Salón de Actos', filter: (event) => event.track === 'main' },
    hyperscalers: { label: 'Hyperscalers', filter: (event) => event.track === 'hyperscalers' },
    bsides: { label: 'Bsides Madrid', filter: (event) => event.track === 'bsides' }
  };

  // Format day label
  const formatDayLabel = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Format day title
  const formatDayTitle = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dayName = days[date.getDay()].charAt(0).toUpperCase() + days[date.getDay()].slice(1);
    return `${dayName} ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Format time from ISO to display format
  const formatTime = (timeISO) => {
    const [, time] = timeISO.split('T');
    return `${time} h`;
  };

  // Filter events by day and track, then organize by column
  const { leftColumnEvents, rightColumnEvents } = useMemo(() => {
    const dayEvents = scheduleData
      .filter(event => event.timeISO.startsWith(selectedDay))
      .filter(trackConfig[selectedTrack].filter)
      .sort((a, b) => a.timeISO.localeCompare(b.timeISO));

    const left = dayEvents.filter(event => event.track === 'main');
    const right = dayEvents.filter(event => event.track !== 'main');

    return { leftColumnEvents: left, rightColumnEvents: right };
  }, [selectedDay, selectedTrack]);

  // Modal handlers
  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Render event card
  const renderEventCard = (event, index) => (
    <div className="col-12 mb-4" key={`${event.timeISO}-${index}`}>
      <div className="card cardcuatroT">
        <div className="overlay"></div>
        <div className="card-body text-white">
          <h5 className="card-title">
            <span className="heading">Lugar: </span>{event.room}
          </h5>
          <p className="card-text">{formatTime(event.timeISO)} - {event.durationHuman}</p>
          <p>{event.talk}</p>
          <p><strong>{event.speaker}</strong></p>
          <button onClick={() => handleShowModal(event)} className="button menu-btn">
            Más Detalles
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <Container>
          <h2 className="text-center margin-top">Horario del Evento 2025</h2>
          
          {/* Day filter buttons */}
          <div className="text-center mb-4">
            {availableDays.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`date-btn ${selectedDay === day ? 'active' : ''}`}
                style={{ margin: '5px' }}
              >
                {formatDayLabel(day)}
              </button>
            ))}
          </div>

          {/* Track filter buttons */}
          <div className="text-center mb-4">
            {Object.entries(trackConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedTrack(key)}
                className={`date-btn ${selectedTrack === key ? 'active' : ''}`}
                style={{ margin: '5px' }}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Selected day title */}
          <h2 className="text-center margin-top">{formatDayTitle(selectedDay)}</h2>

          {/* Two-column layout */}
          <Row className="mt-5">
            {/* Left column - Main track */}
            <Col md={6}>
              {leftColumnEvents.length > 0 ? (
                leftColumnEvents.map((event, index) => renderEventCard(event, index))
              ) : (
                selectedTrack !== 'all' && selectedTrack !== 'main' && (
                  <div className="text-center text-muted">
                    <p>No hay eventos del track principal en este filtro</p>
                  </div>
                )
              )}
            </Col>

            {/* Right column - Secondary tracks */}
            <Col md={6}>
              {rightColumnEvents.length > 0 ? (
                rightColumnEvents.map((event, index) => renderEventCard(event, index))
              ) : (
                selectedTrack !== 'main' && (
                  <div className="text-center text-muted">
                    <p>No hay eventos de tracks secundarios disponibles</p>
                  </div>
                )
              )}
            </Col>
          </Row>

          {/* Modal for event details */}
          {selectedEvent && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedEvent.talk}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Ponente:</strong> {selectedEvent.speaker}</p>
                <p><strong>Lugar:</strong> {selectedEvent.room}</p>
                <p><strong>Duración:</strong> {selectedEvent.durationHuman}</p>
                <p><strong>Hora:</strong> {formatTime(selectedEvent.timeISO)}</p>
                <hr />
                <p>{selectedEvent.description}</p>
              </Modal.Body>
              <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>
                    {selectedEvent.speaker}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="card-text" style={{ margin: '0', padding: '0' }}>
                    {formatTime(selectedEvent.timeISO)} - {selectedEvent.durationHuman}
                  </p>
                </div>
              </Modal.Footer>
            </Modal>
          )}
        </Container>
      </AnimationWrapper>
    </section>
  );
};

export default Events;