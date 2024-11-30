import React, { useEffect } from 'react';
import PricingTable from "../components/PricingTable";
import Benefits from "../components/Benefits";
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
    <Benefits/>
    <PricingTable />
    </div>
    </>
  );
};

export default Sponsor;
