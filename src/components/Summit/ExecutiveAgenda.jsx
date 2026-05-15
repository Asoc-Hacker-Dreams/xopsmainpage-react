import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const agendaData = {
  day1: {
    date: '18 Nov',
    title: 'Día 1 — Estrategia y Transformación',
    sessions: [
      { time: '09:00-09:30', title: 'Acreditación & Welcome Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote de apertura', speaker: 'Por anunciar', type: 'keynote' },
      { time: '10:30-11:15', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel ejecutivo', speakers: 'Por anunciar', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop ejecutivo', speaker: 'Por anunciar', type: 'workshop' },
      { time: '15:15-16:00', title: 'Caso de éxito', speaker: 'Por anunciar', type: 'talk' },
      { time: '16:00-16:30', title: 'Coffee & Networking', type: 'break' },
      { time: '16:30-17:30', title: 'Roundtable: Desafíos 2026-2027', type: 'roundtable' },
    ],
  },
  day2: {
    date: '19 Nov',
    title: 'Día 2 — Implementación y Futuro',
    sessions: [
      { time: '09:00-09:30', title: 'Morning Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote', speaker: 'Por anunciar', type: 'keynote' },
      { time: '10:30-11:15', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel ejecutivo', speakers: 'Por anunciar', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop ejecutivo', speaker: 'Por anunciar', type: 'workshop' },
      { time: '15:15-16:00', title: 'Sesión de cierre', speaker: 'Por anunciar', type: 'talk' },
      { time: '16:00-17:00', title: 'Closing & Networking Cocktail', type: 'break' },
    ],
  },
};

const ExecutiveAgenda = () => {
  const [activeDay, setActiveDay] = useState('day1');

  const renderSession = (session, index) => {
    const typeClass = {
      keynote: 'session-keynote',
      talk: 'session-talk',
      panel: 'session-panel',
      workshop: 'session-workshop',
      roundtable: 'session-roundtable',
      break: 'session-break',
    }[session.type] || 'session-talk';

    return (
      <div key={index} className={`agenda-item ${typeClass}`}>
        <div className="agenda-time">{session.time}</div>
        <div className="agenda-content">
          <h4 className="agenda-title">{session.title}</h4>
          {session.speaker && <span className="agenda-speaker">{session.speaker}</span>}
          {session.speakers && <span className="agenda-speaker">{session.speakers}</span>}
        </div>
      </div>
    );
  };

  return (
    <section className="summit-agenda" id="agenda">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Programa Ejecutivo</h2>
            <p className="summit-section-subtitle">
              Dos días de contenido estratégico de alto impacto — programa por confirmar
            </p>
          </Col>
        </Row>

        <div className="agenda-day-selector">
          <Button
            className={`day-btn ${activeDay === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            <span className="day-date">18 Nov</span>
            <span className="day-title">Día 1</span>
          </Button>
          <Button
            className={`day-btn ${activeDay === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            <span className="day-date">19 Nov</span>
            <span className="day-title">Día 2</span>
          </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="agenda-day-header">
              <h3>{agendaData[activeDay].title}</h3>
            </div>
            <div className="agenda-timeline">
              {agendaData[activeDay].sessions.map(renderSession)}
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <p className="agenda-disclaimer">
              * Programa sujeto a cambios. Los speakers serán anunciados próximamente.
            </p>
            <Button className="summit-btn-outline" href="#tickets">
              Reservar mi plaza
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExecutiveAgenda;
