import React from 'react';
import XOpsSection from "../../..//components/XOpsSection";
import Themes from "../../../components/Themes";
import SpeakersSection from "../../../components/SpeakersSection";
import Events2024 from "./pages/archive/2023/Events2024";
import Ubication from "../../../components/Ubication";
import Collaborators from "../../../components/Collaborators";
import { Link } from 'react-router-dom'; // Importa Link



const Home2024 = () => {

  return (
    <>

      <XOpsSection />
      <Themes />
      <Events />
      <Ubication />
      <Collaborators />
      <SpeakersSection />
 {/* Agrego el enlace hacia la página de eventos anteriores */}
 <div className="text-center">
        <Link to="/Organizer2024" className="btn btn-primary">Eventos Anteriores</Link>
      </div>

    </>
  );
};

export default Home2024;
