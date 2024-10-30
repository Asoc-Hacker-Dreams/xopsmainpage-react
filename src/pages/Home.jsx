import React from 'react';
import XOpsSection from "../componenets/XOpsSection";
import Themes from "../componenets/Themes";
import SpeakersSection from "../componenets/SpeakersSection";
import Events from "../componenets/Events/Events";
import Ubication from "../componenets/Ubication";
import Collaborators from "../componenets/Collaborators"; 


const Home = () => {
  return (
    <>

      <XOpsSection />
      <Themes />
      <Events />
      <Ubication />
      <Collaborators />
      <SpeakersSection />

    </>
  );
};

export default Home;
