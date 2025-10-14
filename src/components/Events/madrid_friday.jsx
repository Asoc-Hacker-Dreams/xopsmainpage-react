import AnimationWrapper from './AnimationWrapper';
import React, { useMemo } from 'react';
import scheduleData from '../../data/schedule2025.json';

const MadridFriday = () => {
  // Filter events for Friday (2025-11-21) and sort by time
  const fridayEvents = useMemo(() => (
    scheduleData
      .filter(event => event.timeISO.startsWith('2025-11-21'))
      .sort((a, b) => a.timeISO.localeCompare(b.timeISO))
  ), []);

  // Format time from ISO to display format (HH:MM h)
  const formatTime = (timeISO) => {
    // Parse the time from format "2025-11-21T10:00"
    const [, time] = timeISO.split('T');
    return `${time} h`;
  };

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <h2 className="text-center margin-top">Viernes 21 de noviembre de 2025</h2>
        <div className="container mt-5">
          <div className="row">
            
            {/* Opening Event */}
            <div className="col-md-6 mb-4">
              <div className="card cardBernabeuD">
                <div className="overlay"></div>
                <div className="card-body text-white">
                  <h5 className="card-title"><span className='heading'>Inicio: </span>Salón de Actos</h5>
                  <p className="card-text">9:30 h - 30 min</p>
                  <p>Dar la bienvenida a los asistentes y keynote del evento.</p>
                </div>
              </div>
            </div>

            {/* Dynamic schedule from JSON */}
            {fridayEvents.map((event, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="card cardcuatroT">
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
                  <p className="card-text">17:00 h</p>
                  <p>Cierre del primer día.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};

export default MadridFriday;
