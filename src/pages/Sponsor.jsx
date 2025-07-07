import React, { useEffect } from 'react';
import PricingTable from "../components/PricingTable";
import Benefits from "../components/Benefits";
import LastEditionData from "../components/LastEditionData";
import { useLocation } from 'react-router-dom';


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
            title="Patrocina - X-Ops Conference"
            description="Patrocina a X-Ops Conference la mejor conferencia de tecnologia en Madrid."
            path="/Organizer"
            image="https://xopsconference.com/assets/speakers-og.jpg"
            lang="es"
            alternates={[
            { hrefLang: 'es', href: 'https://xopsconference.com/patrocina' },
            { hrefLang: 'en', href: 'https://xopsconference.com/sponsorship' },
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
    <LastEditionData/>
    <Benefits/>
    <PricingTable />
    </div>
    </>
  );
};

export default Sponsor;
