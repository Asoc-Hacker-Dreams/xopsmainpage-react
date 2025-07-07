import React, { useEffect } from 'react';
import Organizers from "../components/Organizers";
import { useLocation } from 'react-router-dom';


const Organizer = () => {
  const location = useLocation();


  useEffect(() => {
      if (location.hash === '#organizr') {
          const element = document.getElementById('organizr');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }, [location]);

  return (
      <div id="organizr">
        <SEO
            title="Organizadores - X-Ops Conference"
            description="X-Ops Conference la mejor conferencia de tecnologia en Madrid."
            path="/Organizer"
            image="https://xopsconference.com/assets/speakers-og.jpg"
            lang="es"
            alternates={[
            { hrefLang: 'es', href: 'https://xopsconference.com/organizadores' },
            { hrefLang: 'en', href: 'https://xopsconference.com/organizers' },
            ]}
            structuredData={{
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "X-Ops Conference Madrid 2025",
            "startDate": "2025-11-21",
            "location": {
                "@type": "Place",
                "name": "Madrid",
                "address": "Madrid, España"
            }
            }}
        />
        <Organizers />
      </div>
  );
};

export default Organizer;
