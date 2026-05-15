import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from "../components/SEO";
import SponsorDossier from './SponsorDossier';


const Sponsor = () => {

  const location = useLocation();
  useEffect(() => {
      if (location.hash === '#patrocinio') {
          const element = document.getElementById('patrocinio');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }, [location]);


  return (
    <>
    <div id="patrocinio">
    <SEO
            title="Patrocina X-Ops Conference 2026"
            description="Patrocina X-Ops Conference, el mayor evento de DevOps, DevSecOps, AIOps y Platform Engineering en España. Paquetes: Platinum, Gold, Silver, Startup Pack."
            path="/Sponsor"
            image="https://xopsconference.com/icon-512x512.png"
            lang="es"
            alternates={[
            { hrefLang: 'es', href: 'https://xopsconference.com/Patrocina' },
            { hrefLang: 'en', href: 'https://xopsconference.com/Sponsor' },
            ]}
            structuredData={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cuáles son los paquetes de patrocinio disponibles?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ofrecemos Platinum (€8.000), Track Sponsor (€6.000), Gold (€3.000), Silver (€2.000), Welcome Pack (€350) y Startup Pack (€350-€950)."
                }
              },
              {
                "@type": "Question",
                "name": "¿Dónde se celebra X-Ops Conference 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "X-Ops Conference 2026 se celebra en Madrid (URJC), con expansión planificada a Dubai y London."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué es el Startup Pack?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "El Startup Pack está diseñado para startups de hasta 3 años con menos de 15 empleados y ARR inferior a €500K. Incluye visibilidad en web, mención en redes, 1 pase completo y stand compartido, desde €350."
                }
              },
              {
                "@type": "Question",
                "name": "¿Existe descuento por patrocinar en múltiples ciudades?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí: 20% de descuento para 2 ciudades y 30% para 3-4 ciudades."
                }
              }
            ]
            }}
        />
    <SponsorDossier />
    </div>
    </>
  );
};

export default Sponsor;
