import React from 'react';
import SEO from '../components/SEO';
import SummitHero from '../components/Summit/SummitHero';
import ValueProposition from '../components/Summit/ValueProposition';
import TicketTier from '../components/Summit/TicketTier';
import ExecutiveAgenda from '../components/Summit/ExecutiveAgenda';
import SummitLocation from '../components/Summit/SummitLocation';

const Summit = () => {
  return (
    <>
      <SEO
        title="X-Ops Summit Madrid 2026 · Evento Ejecutivo para Decision Makers"
        description="El evento exclusivo para CTOs, CISOs y líderes tecnológicos. 19 de noviembre de 2026, Madrid. Networking de alto nivel y contenido estratégico."
        path="/summit"
        keywords="X-Ops Summit, DevOps, SecOps, CTO, CISO, Madrid, Decision Makers, Executive Event, 2026"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/summit' },
          { hrefLang: 'en', href: 'https://xopsconference.com/summit' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Summit Madrid 2026",
          "description": "Evento exclusivo para CTOs, CISOs y líderes tecnológicos. Networking de alto nivel y contenido estratégico.",
          "startDate": "2026-11-18",
          "endDate": "2026-11-19",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "URJC Madrid",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Madrid",
              "addressRegion": "Madrid",
              "addressCountry": "ES"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": "X-Ops Conference",
            "url": "https://xopsconference.com"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://xopsconference.com/summit#tickets",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        }}
      />

      <div className="summit-page">
        <SummitHero />
        <ValueProposition />
        <ExecutiveAgenda />
        <TicketTier />
        <SummitLocation />
      </div>
    </>
  );
};

export default Summit;
