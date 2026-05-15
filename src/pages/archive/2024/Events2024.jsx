import React, { useState } from 'react';
import SEO from '../../../components/SEO';
import Madrid22 from './Madrid22';
import Madrid23 from './Madrid23';

const Events2024 = () => {
  const [selectedDay, setSelectedDay] = useState('friday');

  return (
    <div style={{ textAlign: 'center'}}>
      <SEO
        title="Agenda X-Ops Conference 2024"
        description="Programa completo de X-Ops Conference Madrid 2024 — 22 y 23 de noviembre 2024. Sesiones de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering."
        path="/archive/2024/Events2024"
        keywords="agenda, horario, X-Ops 2024, DevOps, DevSecOps, sesiones, Madrid"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/archive/2024/Events2024' },
          { hrefLang: 'en', href: 'https://xopsconference.com/archive/2024/Events2024' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Conference Madrid 2024",
          "description": "Programa completo de X-Ops Conference 2024. Sesiones de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering.",
          "startDate": "2024-11-22",
          "endDate": "2024-11-23",
          "eventStatus": "https://schema.org/EventComplete",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "ETSISI UPM Vallecas",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Madrid",
              "addressRegion": "Madrid",
              "addressCountry": "ES"
            }
          }
        }}
      />
      <h2 className="text-center margin-top">Horario del Evento 2024</h2>
      <div>
        <button 
          onClick={() => setSelectedDay('friday')} 
          className="date-btn"
          style={{ marginRight: '10px' }}
        >
          Viernes 22/11/2024
        </button>
        <button 
          onClick={() => setSelectedDay('saturday')} 
          className="date-btn"
        >
          Sábado 23/11/2024
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '-45px' }}>
        {selectedDay === 'friday' ? <Madrid22 /> : <Madrid23 />}
      </div>
    </div>
  );
};

export default Events2024;
