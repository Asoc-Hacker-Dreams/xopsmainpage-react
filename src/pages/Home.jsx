import React from 'react';
import XOpsSection from "../components/XOpsSection";
import EcosystemSection from "../components/EcosystemSection";
import EditionsSection from "../components/EditionsSection";
import Themes from "../components/Themes";
import Ubication from "../components/Ubication";
import Collaborators from "../components/Collaborators";
import LastEditionData from "../components/LastEditionData";
import PricingTable from "../components/PricingTable";
import SEO from "../components/SEO";


const Home = () => {

  return (
    <>
      <SEO
        title="X-Ops Conference & Summit 2026 · Madrid y Dubai"
        description="X-Ops Conference: el mayor evento de DevOps, DevSecOps, AIOps, MLOps y Platform Engineering en dos ciudades. Madrid y Dubai 2026."
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
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "url": "https://madrid.xopsconference.com",
              "name": "X-Ops Madrid 2026"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "url": "https://dubai.xopsconference.com",
              "name": "X-Ops Dubai 2026"
            }
          ]
        }}
      />
      <XOpsSection />
      <EcosystemSection />
      <EditionsSection />

      <Themes />
      <Ubication />
      <PricingTable />
      <LastEditionData />
      <Collaborators />
    </>
  );
};

export default Home;
