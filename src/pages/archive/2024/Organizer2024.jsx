import React, { useEffect } from 'react';
import Organizers from "../components/Organizers";
import { useLocation } from 'react-router-dom';
import Organizers2024 from "../components/Organizers2024";


const Organizer2024 = () => {
  const location = useLocation();


  useEffect(() => {
      if (location.hash === '#Organizer2024') {
          const element = document.getElementById('Organizer2024');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }, [location]);

  return (
      <div id="Organizer2024">
          <Organizers2024 />
      </div>
  );
};

export default Organizer2024;
