import React, { useState } from 'react';
import SEO from '../../../components/SEO';
import MadridFriday from './madrid_friday';
import MadridSaturday from './madrid_saturday';

const Events2025 = () => {
  const [selectedDay, setSelectedDay] = useState('friday');

  return (
    <div style={{ textAlign: 'center'}}>
      <SEO
        title="Agenda X-Ops Conference 2025"
        description="Programa completo de X-Ops Conference Madrid 2025 — 21 y 22 de noviembre 2025. Sesiones de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering."
        path="/archive/2025/Events2025"
        keywords="agenda, horario, X-Ops 2025, DevOps, DevSecOps, sesiones, Madrid"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/archive/2025/Events2025' },
          { hrefLang: 'en', href: 'https://xopsconference.com/archive/2025/Events2025' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Conference Madrid 2025",
          "description": "Programa completo de X-Ops Conference 2025. Sesiones de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering.",
          "startDate": "2025-11-21",
          "endDate": "2025-11-22",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "URJC Móstoles",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Móstoles",
              "addressRegion": "Madrid",
              "addressCountry": "ES"
            }
          }
        }}
      />
      <h2 className="text-center margin-top">Horario del Evento 2025</h2>
      <div>
        <button 
          onClick={() => setSelectedDay('friday')} 
          className="date-btn"
          style={{ marginRight: '10px' }}
        >
          Viernes 21/11/2025
        </button>
        <button 
          onClick={() => setSelectedDay('saturday')} 
          className="date-btn"
        >
          Sábado 22/11/2025
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '-45px' }}>
        {selectedDay === 'friday' ? <MadridFriday /> : <MadridSaturday />}
      </div>
    </div>
  );
};

export default Events2025;
