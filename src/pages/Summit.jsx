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
        <title>X-Ops Summit Barcelona 2026 | Evento Ejecutivo para Decision Makers</title>
        <meta name="description" content="El evento exclusivo para CTOs, CISOs y líderes tecnológicos. 6-7 Mayo 2026, Barcelona. Networking de alto nivel y contenido estratégico paralelo a HackBCN Con." />
        <meta name="keywords" content="X-Ops Summit, DevOps, SecOps, CTO, CISO, Barcelona, HackBCN, Decision Makers, Executive Event" />
        <meta property="og:title" content="X-Ops Summit Barcelona 2026" />
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
