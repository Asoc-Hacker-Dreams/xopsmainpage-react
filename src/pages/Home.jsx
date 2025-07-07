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
          "startDate": "2025-10-15",
          "location": {
            "@type": "Place",
            "name": "Madrid",
            "address": "Madrid, España"
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
