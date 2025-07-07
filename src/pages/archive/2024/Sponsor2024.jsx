import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Collaborators from "../components/Collaborators2024";


const Sponsor2024 = () => {

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
    <div id="patrocinio2024">
    <Collaborators />
    </div>
    </>
  );
};

export default Sponsor2024;