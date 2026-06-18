import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from '../AnimationWrapper';
import { Modal, Container, Row, Col } from 'react-bootstrap';
import scheduleData from '../../data/schedule2026.json';

const trackFilters = {
  all: () => true,
  main: (event) => event.track === 'main' || event.type === 'break',
  hyperscalers: (event) => event.track === 'hyperscalers' || event.type === 'break',
  bsides: (event) => event.track === 'bsides' || event.type === 'break',
};

const Events = () => {
  const { t, i18n } = useTranslation();

  const [selectedDay, setSelectedDay] = useState('2025-11-21');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const availableDays = useMemo(() => {
    const days = [...new Set(scheduleData.map(event => event.timeISO.split('T')[0]))];
    return days.sort();
  }, []);

  const trackLabels = {
    all: t('events.tracks.all'),
    main: t('events.tracks.main'),
    hyperscalers: t('events.tracks.hyperscalers'),
    bsides: t('events.tracks.bsides'),
  };

  const formatDayLabel = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return new Intl.DateTimeFormat(i18n.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatDayTitle = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return new Intl.DateTimeFormat(i18n.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timeISO) => {
    const [, time] = timeISO.split('T');
    return `${time} h`;
  };

  const { leftColumnEvents, rightColumnEvents, showTwoColumns, singleColumnEvents } = useMemo(() => {
    const dayEvents = scheduleData
      .filter(event => event.timeISO.startsWith(selectedDay))
      .filter(trackFilters[selectedTrack])
      .sort((a, b) => a.timeISO.localeCompare(b.timeISO));

    const breaks = dayEvents.filter(event => event.type === 'break');
    const regularEvents = dayEvents.filter(event => event.type !== 'break');

    const left = regularEvents.filter(event => event.track === 'main');
    const right = regularEvents.filter(event => event.track !== 'main');

    const leftColumnEvents = [...left, ...breaks].sort((a, b) => a.timeISO.localeCompare(b.timeISO));
    const rightColumnEvents = [...right, ...breaks].sort((a, b) => a.timeISO.localeCompare(b.timeISO));
    const singleColumnEvents = [...dayEvents].sort((a, b) => a.timeISO.localeCompare(b.timeISO));

    const showTwoColumns = selectedTrack === 'all' && left.length > 0 && right.length > 0;

    return { leftColumnEvents, rightColumnEvents, showTwoColumns, singleColumnEvents };
  }, [selectedDay, selectedTrack]);

  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  if (scheduleData.length === 0) {
    return (
      <section id="events" className="event-schedule-section">
        <AnimationWrapper animation="fade-up" duration={1500}>
          <Container>
            <h2 className="text-center margin-top">{t('events.title')}</h2>
            <div className="text-center py-5">
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📢</p>
              <h3>{t('events.comingSoon')}</h3>
              <p className="lead mt-3">{t('events.cfpOpen')}</p>
              <a
                href="https://sessionize.com/x-ops-conference-mad-2026/"
                className="button menu-btn mt-3"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block' }}
              >
                {t('events.cfpCta')} →
              </a>
            </div>
          </Container>
        </AnimationWrapper>
      </section>
    );
  }

  const renderEventCard = (event, index) => {
    const cardClass = event.type === 'break' ? 'cardgranV' : 'cardcuatroT';

    return (
      <div className="col-12 mb-4" key={`${event.timeISO}-${index}`}>
        <div className={`card ${cardClass} h-100`}>
          <div className="overlay"></div>
          <div className="card-body text-white d-flex flex-column">
            <h5 className="card-title">
              <span className="heading">{t('events.place')}: </span>{event.room}
            </h5>
            <p className="card-text">{formatTime(event.timeISO)} - {event.durationHuman}</p>
            <p className="flex-grow-1">{event.talk}</p>
            <p><strong>{event.speaker}</strong></p>
            <button onClick={() => handleShowModal(event)} className="button menu-btn mt-auto">
              {t('events.details')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <Container>
          <h2 className="text-center margin-top">{t('events.scheduleTitle')}</h2>

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

          <div className="text-center mb-4">
            {Object.entries(trackLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedTrack(key)}
                className={`date-btn ${selectedTrack === key ? 'active' : ''}`}
                style={{ margin: '5px' }}
              >
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-center margin-top">{formatDayTitle(selectedDay)}</h2>

          {showTwoColumns ? (
            <Row className="mt-5">
              <Col md={6}>
                {leftColumnEvents.map((event, index) => renderEventCard(event, index))}
              </Col>
              <Col md={6}>
                {rightColumnEvents.map((event, index) => renderEventCard(event, index))}
              </Col>
            </Row>
          ) : (
            <Row className="mt-5 justify-content-center">
              <Col md={8} lg={6}>
                {singleColumnEvents.map((event, index) => renderEventCard(event, index))}
              </Col>
            </Row>
          )}

          {selectedEvent && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedEvent.talk}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>{t('events.modal.speaker')}:</strong> {selectedEvent.speaker}</p>
                <p><strong>{t('events.modal.place')}:</strong> {selectedEvent.room}</p>
                <p><strong>{t('events.modal.duration')}:</strong> {selectedEvent.durationHuman}</p>
                <p><strong>{t('events.modal.time')}:</strong> {formatTime(selectedEvent.timeISO)}</p>
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
