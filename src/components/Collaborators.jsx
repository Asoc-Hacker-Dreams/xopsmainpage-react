import React from 'react';      
import seguridadS from "../assets/collaborators/seguridad.si.jpg";
import amaxop from "../assets/collaborators/amaxop.jpeg";
import hackerD from "../assets/collaborators/hackerD.png";
import hackB from "../assets/collaborators/hackB.png";
import CNCFlogo from "../assets/collaborators/CNCF_MADRID.png";
import hackBcn from "../assets/collaborators/hackBcn.png";
import asturC from "../assets/collaborators/asturC.jpeg";
import madridD from "../assets/collaborators/madridD.png";
import morterueloC from "../assets/collaborators/morterueloC.png";
import upmLogo from "../assets/collaborators/upm.png";
import devsecconLogo from "../assets/collaborators/devseccon.png";
import secadminlogo from "../assets/collaborators/secadmin.png"
import engineerlogo from "../assets/collaborators/engineergame.jpeg"
import crackersgameslogo from "../assets/collaborators/crackersgames.png"
import cybershieldlogo from "../assets/collaborators/cybershield.png"
import AnimationWrapper from "./AnimationWrapper";


const Collaborators = () => {
  return (
    <>
      <section id="patros" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Gracias al patrocinio de:</h2>
          <h2 className="text-center">ORO</h2>
          <div className="speaker-cards margin-top">
            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://cybershield.com" target="_blank" rel="noopener noreferrer">
                    <img src={cybershieldlogo} alt="Logo de Cybershield" style={{ height: '160px'}} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
          </div>
          <h2 className="text-center">PLATA</h2>
          <div className="speaker-cards margin-top">
            <div className="speaker1 justify-content-center d-flex justify-around margin-top">

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <a href="https://seguridadsi.com" target="_blank" rel="noopener noreferrer">
                      <img src={seguridadS} alt="Logo de seguridadsi" style={{ height: '150px', width: '150px' }} />
                    </a>
                  </AnimationWrapper>
              </div>
              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <a href="https://www.amaxop.com/" target="_blank" rel="noopener noreferrer">
                      <img src={amaxop} alt="Logo de Amaxop" style={{ height: '150px', width: '150px' }} />
                    </a>
                  </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://engineergame.com" target="_blank" rel="noopener noreferrer">
                    <img src={engineerlogo} alt="Logo de EngineerGames" style={{ height: '90px', width: '180px' }} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
          </div>

          <hr />

          <h2 className="text-center">Gracias a la colaboración:</h2>
          <div className="speaker-cards margin-top">

            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                  <AnimationWrapper animation="fade-right" duration={1500}>
                    <img src={hackB} alt="Roberto Gonzalez" style={{width: '120px' }} />
                  </AnimationWrapper>
              </div>

              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://ctf.hackerdreams.org" target="_blank" rel="noopener noreferrer">
                    <img src={crackersgameslogo} alt="Logo de CrackerGames" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-right" duration={1500}>
                    <a href="https://hackbcn.org" target="_blank" rel="noopener noreferrer">
                      <img src={hackBcn} alt="Logo de HackBCN" style={{width: '120px' }} />
                    </a>
                  </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <a href="https://asturcon.tech" target="_blank" rel="noopener noreferrer">
                      <img src={asturC} alt="Logo de AsturCon" style={{width: '120px' }} />
                    </a>
                  </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <a href="https://madrid.devops.es" target="_blank" rel="noopener noreferrer">
                      <img src={madridD} alt="Logo de MadridDevOps" style={{width: '120px' }} />
                    </a>
                  </AnimationWrapper>
              </div>

            </div>
            <div className="speaker1 d-flex justify-content-center justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.morteruelo.net/" target="_blank" rel="noopener noreferrer">
                    <img src={morterueloC} alt="Logo de Morteruelo C" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://hackerdreams.org/" target="_blank" rel="noopener noreferrer">
                    <img src={hackerD} alt="Logo de Hacker D" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://www.upm.es/" target="_blank" rel="noopener noreferrer">
                    <img src={upmLogo} alt="Logo de la UPM" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://snyk.io/community/" target="_blank" rel="noopener noreferrer">
                    <img src={devsecconLogo} alt="Logo de DevSecCon" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
            <div className="speaker1 d-flex justify-content-center justify-around margin-top">
              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <a href="https://secadmin.es" target="_blank" rel="noopener noreferrer">
                      <img src={secadminlogo} alt="Logo de SecAdmin" style={{width: '120px' }} />
                    </a>
                  </AnimationWrapper>
                </div>
                <div className="speaker-img">
                  <AnimationWrapper animation="fade-right" duration={1500}>
                    <img src={CNCFlogo} alt="Logo CNCF" style={{width: '120px' }} />
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
