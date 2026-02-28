import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const agendaData = {
  day1: {
    date: '6 Mayo',
    title: 'Estrategia y Transformación',
    sessions: [
      { time: '09:00-09:30', title: 'Acreditación & Welcome Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote: El futuro de las operaciones tecnológicas', speaker: 'TBD', type: 'keynote' },
      { time: '10:30-11:15', title: 'DevOps como ventaja competitiva', speaker: 'TBD', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'Security-first: Cuando la seguridad impulsa el negocio', speaker: 'TBD', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel: ROI de la transformación DevSecOps', speakers: '3 C-levels', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop: Building the business case for SRE', speaker: 'TBD', type: 'workshop' },
      { time: '15:15-16:00', title: 'Caso de éxito: Transformación en Enterprise', speaker: 'TBD', type: 'talk' },
      { time: '16:00-16:30', title: 'Coffee & Networking', type: 'break' },
      { time: '16:30-17:30', title: 'Roundtable: Desafíos 2026-2027', type: 'roundtable' },
    ],
  },
  day2: {
    date: '7 Mayo',
    title: 'Implementación y Futuro',
    sessions: [
      { time: '09:00-09:30', title: 'Morning Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote: AI en Operaciones - más allá del hype', speaker: 'TBD', type: 'keynote' },
      { time: '10:30-11:15', title: 'Platform Engineering: ¿Inversión o gasto?', speaker: 'TBD', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'FinOps: Optimizando la nube sin sacrificar innovación', speaker: 'TBD', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel: Talent & Culture en el mundo DevOps', speakers: '3 HR/CTOs', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop: Maturity Model Assessment', speaker: 'TBD', type: 'workshop' },
      { time: '15:15-16:00', title: 'Roadmap tecnológico 2026-2028', speaker: 'TBD', type: 'talk' },
      { time: '16:00-17:00', title: 'Closing & Networking Cocktail', type: 'break' },
    ],
  },
};

const ExecutiveAgenda = () => {
  const { t } = useTranslation();
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
            <h2 className="summit-section-title">
              {t('summit.agenda.sectionTitle')}
            </h2>
            <p className="summit-section-subtitle">
              {t('summit.agenda.sectionSubtitle')}
            </p>
          </Col>
        </Row>

        <div className="agenda-day-selector">
          <Button
            className={`day-btn ${activeDay === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            <span className="day-date">{t('summit.agenda.day1Date')}</span>
            <span className="day-title">{t('summit.agenda.day1Label')}</span>
          </Button>
          <Button
            className={`day-btn ${activeDay === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            <span className="day-date">{t('summit.agenda.day2Date')}</span>
            <span className="day-title">{t('summit.agenda.day2Label')}</span>
          </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="agenda-day-header">
              <h3>{t(activeDay === 'day1' ? 'summit.agenda.day1Title' : 'summit.agenda.day2Title')}</h3>
            </div>
            <div className="agenda-timeline">
              {agendaData[activeDay].sessions.map(renderSession)}
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <p className="agenda-disclaimer">
              {t('summit.agenda.disclaimer')}
            </p>
            <Button className="summit-btn-outline" href="#tickets">
              {t('summit.agenda.cta')}
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExecutiveAgenda;
