import React from 'react';
import XOpsSection from "../components/XOpsSection";
import Themes from "../components/Themes";
import SpeakersSection from "../components/SpeakersSection";
import Events from "../components/Events/Events";
import Ubication from "../components/Ubication";
import Collaborators from "../components/Collaborators";
import LastEditionData from "../components/LastEditionData";


const Home = () => {

  return (
    <>

      <XOpsSection />
      <Themes />
      <Events />
      <Ubication />
      <LastEditionData/>
      <Collaborators />
      <SpeakersSection />

    </>
  );
};

export default Home;
