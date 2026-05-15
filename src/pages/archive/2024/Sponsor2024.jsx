import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../../components/SEO';
import Collaborators from "../../../components/Collaborators2024";


const Sponsor2024 = () => {

  const location = useLocation();
  useEffect(() => {
      if (location.hash === '#patrocinio2024') {
          const element = document.getElementById('patrocinio2024');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }, [location]);


  return (
    <>
    <div id="patrocinio2024">
    <SEO
      title="Patrocinadores X-Ops Conference 2024"
      description="Patrocinadores y colaboradores de X-Ops Conference Madrid 2024. Conoce a las empresas que apoyaron la segunda edición del mayor evento de DevOps en España."
      path="/archive/2024/Sponsor2024"
      keywords="patrocinadores, sponsors, X-Ops 2024, colaboradores, DevOps Madrid"
      lang="es"
      alternates={[
        { hrefLang: 'es', href: 'https://xopsconference.com/archive/2024/Sponsor2024' },
        { hrefLang: 'en', href: 'https://xopsconference.com/archive/2024/Sponsor2024' },
      ]}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "X-Ops Conference Madrid 2024",
        "description": "Patrocinadores y colaboradores de X-Ops Conference 2024.",
        "startDate": "2024-11-22",
        "endDate": "2024-11-23",
        "eventStatus": "https://schema.org/EventComplete",
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
    <Collaborators />
    </div>
    </>
  );
};

export default Sponsor2024;