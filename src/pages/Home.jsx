import React from 'react';
import XOpsSection from "../components/XOpsSection";
import Themes from "../components/Themes";
import SpeakersSection from "../components/SpeakersSection";
import Events from "../components/Events/Events";
import Ubication from "../components/Ubication";
import Collaborators from "../components/Collaborators"; 


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
