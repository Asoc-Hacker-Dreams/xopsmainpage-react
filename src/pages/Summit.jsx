import React from 'react';
import { Helmet } from 'react-helmet-async';
import SummitHero from '../components/Summit/SummitHero';
import ValueProposition from '../components/Summit/ValueProposition';
import TicketTier from '../components/Summit/TicketTier';
import ExecutiveAgenda from '../components/Summit/ExecutiveAgenda';
import SummitLocation from '../components/Summit/SummitLocation';
import SummitOrganizers from '../components/Summit/SummitOrganizers';

const Summit = () => {
  return (
    <>
      <Helmet>
        <title>X-Ops Summit Madrid 2026 | Evento Ejecutivo para Decision Makers</title>
        <meta name="description" content="El evento exclusivo para CTOs, CISOs y líderes tecnológicos. 18-19 noviembre 2026, Madrid. Networking de alto nivel y contenido estratégico." />
        <meta name="keywords" content="X-Ops Summit, DevOps, SecOps, CTO, CISO, Madrid, Decision Makers, Executive Event" />
        <meta property="og:title" content="X-Ops Summit Madrid 2026" />
        <meta property="og:description" content="El evento exclusivo para líderes tecnológicos. Networking de alto nivel y contenido estratégico." />
        <meta property="og:type" content="event" />
        <meta property="og:url" content="https://xopsconferences.com/summit" />
      </Helmet>

      <div className="summit-page">
        <SummitHero />
        <ValueProposition />
        <ExecutiveAgenda />
        <TicketTier />
        <SummitLocation />
        <SummitOrganizers />
      </div>
    </>
  );
};

export default Summit;
