import React from 'react';
import XOpsSection from "../components/XOpsSection";
import EcosystemSection from "../components/EcosystemSection";
import EditionsSection from "../components/EditionsSection";
import Themes from "../components/Themes";
import Events from "../components/Events/Events";
import Ubication from "../components/Ubication";
import Collaborators from "../components/Collaborators";
import LastEditionData from "../components/LastEditionData";
import SpeakersSection from "../components/SpeakersSection";
import SummitHero from "../components/Summit/SummitHero";
import ValueProposition from "../components/Summit/ValueProposition";
import ExecutiveAgenda from "../components/Summit/ExecutiveAgenda";
import PricingTable from "../components/PricingTable";
import SEO from "../components/SEO";


const Home = () => {

  return (
    <>
      <SEO
        title="X-Ops Conference & Summit 2026 · Madrid y Dubai"
        description="X-Ops Conference: el mayor evento de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering en España. Madrid y Dubai 2026 · Summit ejecutivo + Conference técnica."
        path="/"
        image="https://xopsconference.com/icon-512x512.png"
        keywords="X-Ops Conference, DevOps, DevSecOps, AIOps, MLOps, Platform Engineering, Ciberseguridad, SecOps, Kubernetes, Madrid, Dubai, conferencia tecnología 2026"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/' },
          { hrefLang: 'en', href: 'https://xopsconference.com/' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Conference & Summit 2026 · Madrid y Dubai",
          "description": "Ecosistema X-Ops 2026 en Madrid y Dubai: Summit ejecutivo y Conference técnica.",
          "startDate": "2026-10-15",
          "endDate": "2026-11-21",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "Madrid y Dubai",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Madrid / Dubai",
              "addressRegion": "Madrid / Dubai",
              "addressCountry": "ES / AE"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": "X-Ops Conference",
            "url": "https://xopsconference.com"
          },
          "image": "https://xopsconference.com/icon-512x512.png",
          "offers": {
            "@type": "Offer",
            "url": "https://xopsconference.com/summit",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        }}
      />
      <XOpsSection />
      <EcosystemSection />
      <EditionsSection />

      <div className="summit-page">
        <SummitHero />
        <ValueProposition />
        <ExecutiveAgenda />
      </div>

      <Themes />
      <Events />
      <Ubication />
      <PricingTable />
      <LastEditionData/>
      <Collaborators />
      <SpeakersSection />
    </>
  );
};

export default Home;
