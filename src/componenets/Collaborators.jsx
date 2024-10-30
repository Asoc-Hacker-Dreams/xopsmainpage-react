import cloud2sec from "../assets/collaborators/cloud2sec.jpeg"; 
import seguridadS from "../assets/collaborators/seguridad.si.jpg";
import hackerD from "../assets/collaborators/hackerD.png";
import hackB from "../assets/collaborators/hackB.png";
import flaghuntersT from "../assets/collaborators/flaghuntersT.png";
import hackBcn from "../assets/collaborators/hackBcn.png";
import asturC from "../assets/collaborators/asturC.jpeg";
import madridD from "../assets/collaborators/madridD.png";
import morterueloC from "../assets/collaborators/morterueloC.png";
import amaxop from "../assets/collaborators/amaxop.png";
import upmLogo from "../assets/collaborators/upm.png";

import AnimationWrapper from "./AnimationWrapper";

const Collaborators = () => {
  return (
    <>
      <section id="ponentes" className="speaker-section">
        <div className="container margin-top">
          <h2 className="text-center">Gracias al patrocinio de:</h2>
          <h2 className="text-center">PLATA</h2>
          <div className="speaker-cards margin-top">
            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.seguridadsi.com/" target="_blank" rel="noopener noreferrer">
                    <img src={seguridadS} alt="Logo de Seguridad S" style={{ height: '180px', width: '200px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.amaxop.com/" target="_blank" rel="noopener noreferrer">
                    <img src={amaxop} alt="Logo de Amaxop" style={{ height: '180px', width: '200px' }} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
          </div>

          <hr />
          <hr />

          <h2 className="text-center">Gracias a la colaboración de:</h2>
          <div className="speaker-cards margin-top">
            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={hackB} alt="Logo de Hack B" style={{ height: '120px', width: '150px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={flaghuntersT} alt="Logo de Flag Hunters T" style={{ height: '120px', width: '150px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={hackBcn} alt="Logo de Hack BCN" style={{ height: '120px', width: '150px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://asturcon.tech/" target="_blank" rel="noopener noreferrer">
                    <img src={asturC} alt="Logo de Astur C" style={{ height: '120px', width: '150px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://madrid.devops.es/" target="_blank" rel="noopener noreferrer">
                    <img src={madridD} alt="Logo de Madrid D" style={{ height: '120px', width: '150px' }} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-content-center justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.morteruelo.net/" target="_blank" rel="noopener noreferrer">
                    <img src={morterueloC} alt="Logo de Morteruelo C" style={{ height: '120px', width: '150px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.hackerdreams.org/" target="_blank" rel="noopener noreferrer">
                    <img src={hackerD} alt="Logo de Hacker D" style={{ height: '120px', width: '150px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.upm.es/" target="_blank" rel="noopener noreferrer">
                    <img src={upmLogo} alt="Logo de la UPM" style={{ height: '120px', width: '150px' }} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Collaborators;
