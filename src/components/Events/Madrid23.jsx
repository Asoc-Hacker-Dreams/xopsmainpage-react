import AnimationWrapper from './AnimationWrapper';
import React from 'react';
import scheduleData from '../../data/schedule2025.json';

const EventSchedule = () => {
  // Filter events for Saturday (2025-11-22) and sort by time
  const saturdayEvents = scheduleData
    .filter(event => event.timeISO.startsWith('2025-11-22'))
    .sort((a, b) => a.timeISO.localeCompare(b.timeISO));

  // Format time from ISO to display format (HH:MM h)
  const formatTime = (timeISO) => {
    const date = new Date(timeISO);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} h`;
  };

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <h2 className="text-center margin-top">Sábado 22 de noviembre de 2025</h2>
        <div className="container mt-5">
          <div className="row">

            {/* Opening Event */}
            <div className="col-md-6 mb-4">
              <div className="card cardBernabeuD">
                <div className="overlay"></div>
                <div className="card-body text-white">
                  <h5 className="card-title"><span className='heading'>Inicio: </span>Salón de Actos</h5>
                  <p className="card-text">9:30 h - 30 min</p>
                  <p>Bienvenida al segundo día del evento.</p>
                </div>
              </div>
            </div>

            {/* Dynamic schedule from JSON */}
            {saturdayEvents.map((event, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="card cardmanzanares">
                  <div className="overlay"></div>
                  <div className="card-body text-white">
                    <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                    <p className="card-text">{formatTime(event.timeISO)} - {event.durationHuman}</p>
                    <p>{event.talk}</p>
                    <p><strong>{event.speaker}</strong></p>
                  </div>
                </div>
              </div>
            ))}

            {/* Closing Event */}
            <div className="col-md-6 mb-4">
              <div className="card cardpuertaA">
                <div className="overlay"></div>
                <div className="card-body text-white">
                  <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                  <p className="card-text">18:00 h</p>
                  <p>Cierre y despedida del evento.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};

export default EventSchedule;
