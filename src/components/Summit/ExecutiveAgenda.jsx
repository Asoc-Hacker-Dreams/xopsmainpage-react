import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ExecutiveAgenda = () => {
  const { t } = useTranslation();
  const [activeDay, setActiveDay] = useState('day1');
  const tba = t('summit.agenda.tba');

  const agendaData = {
    day1: {
      date: '18 Nov',
      title: t('summit.agenda.day1'),
      sessions: [
        { time: '09:00', title: tba, type: 'break' },
        { time: '10:00', title: tba, type: 'keynote' },
        { time: '11:00', title: tba, type: 'talk' },
        { time: '12:00', title: tba, type: 'panel' },
        { time: '13:00', title: tba, type: 'break' },
        { time: '15:00', title: tba, type: 'workshop' },
        { time: '16:00', title: tba, type: 'talk' },
        { time: '17:00', title: tba, type: 'roundtable' },
      ],
    },
    day2: {
      date: '19 Nov',
      title: t('summit.agenda.day2'),
      sessions: [
        { time: '09:00', title: tba, type: 'break' },
        { time: '10:00', title: tba, type: 'keynote' },
        { time: '11:00', title: tba, type: 'talk' },
        { time: '12:00', title: tba, type: 'panel' },
        { time: '13:00', title: tba, type: 'break' },
        { time: '15:00', title: tba, type: 'workshop' },
        { time: '16:00', title: tba, type: 'talk' },
        { time: '17:00', title: tba, type: 'break' },
      ],
    },
  };

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
        </div>
      </div>
    );
  };

  return (
    <section className="summit-agenda" id="agenda">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">{t('summit.agenda.title')}</h2>
            <p className="summit-section-subtitle">{t('summit.agenda.subtitle')}</p>
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
      </Container>
    </section>
  );
};

export default ExecutiveAgenda;
