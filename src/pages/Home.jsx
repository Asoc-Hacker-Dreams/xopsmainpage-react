import React from 'react';
import XOpsSection from "../components/XOpsSection";
import Themes from "../components/Themes";
import SpeakersSection from "../components/SpeakersSection";
import Events from "../components/Events/Events";
import Ubication from "../components/Ubication";
import Collaborators from "../components/Collaborators";
import LastEditionData from "../components/LastEditionData";
import SEO from "../components/SEO";


const Home = () => {

  return (
    <>
      <SEO
        title="Home"
        description="X-Ops Conference la mejor conferencia de tecnologia en Madrid."
        path="/"
        image="https://xopsconference.com/assets/speakers-og.jpg"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/home' },
          { hrefLang: 'en', href: 'https://xopsconference.com/home' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Conference Madrid 2025",
          "startDate": "2025-11-21T09:00:00+01:00",
          "endDate": "2025-11-22T18:00:00+01:00",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "Universidad Rey Juan Carlos campus Móstoles",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Av. del Alcalde de Móstoles, s/n",
              "addressLocality": "Móstoles",
              "postalCode": "28933",
              "addressRegion": "Madrid",
              "addressCountry": "ES"
            }
          },
          "image": [
            "https://xopsconference.com/assets/speakers-og.jpg"
          ],
          "description": "X-Ops Conference la mejor conferencia de tecnologia en Madrid.",
          "organizer": {
            "@type": "Organization",
            "name": "X-Ops Conference",
            "url": "https://xopsconference.com"
          },
          "performer": [
            {
              "@type": "Person",
              "name": "Aga Bielak"
            },
            {
              "@type": "Person",
              "name": "Antonio Berben"
            },
            {
              "@type": "Person",
              "name": "Gabriela García"
            },
            {
              "@type": "Person",
              "name": "Juan Vicente Herrera Ruiz de Alejo"
            },
            {
              "@type": "Person",
              "name": "Natalie Godec"
            },
            {
              "@type": "Person",
              "name": "Oscar Cortes Bracho"
            },
            {
              "@type": "Person",
              "name": "Pablo Gómez-Caldito"
            },
            {
              "@type": "Person",
              "name": "David Sastre"
            }
          ],
          "offers": {
            "@type": "Offer",
            "url": "https://www.eventbrite.ch/e/entradas-x-ops-conference-madrid-2025-1306767269079",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        }}
      />
      <XOpsSection />
      <Themes />
      <Events />
      <Ubication />
      <LastEditionData/>
      <Collaborators />
      <SpeakersSection />

    </>
  );
};

export default Home;
