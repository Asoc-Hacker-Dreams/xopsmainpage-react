import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ExecutiveAgenda = () => {
  const { t } = useTranslation();
  const tba = t('summit.agenda.tba');

  const day = {
    date: '19 Nov',
    title: t('summit.agenda.day'),
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

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="agenda-day-header">
              <span className="agenda-day-badge">{day.date}</span>
              <h3>{day.title}</h3>
            </div>
            <div className="agenda-timeline">
              {day.sessions.map(renderSession)}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExecutiveAgenda;
