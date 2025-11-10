import React from 'react';      
import nextdigital from "../assets/collaborators/nextdigital.png";
import { Link } from 'react-router-dom';
import amaxop from "../assets/collaborators/amaxop.png";
import hackerD from "../assets/collaborators/hackerD.jpeg";
import hackB from "../assets/collaborators/hackB.png";
import CNCFlogo from "../assets/collaborators/CNCF_MADRID.png";
import hackBcn from "../assets/collaborators/hackBcn.png";
import madridD from "../assets/collaborators/madridD.png";
import devsecconLogo from "../assets/collaborators/devseccon.png";
import secadminlogo from "../assets/collaborators/secadmin.png";
//import engineerlogo from "../assets/collaborators/engineergame.jpeg"
import crackersgameslogo from "../assets/collaborators/crackersgames.png";
import cybershieldlogo from "../assets/collaborators/cybershield.png";
import asturC from "../assets/collaborators/asturC.jpeg";
import hacktricksLogo from "../assets/collaborators/hacktricks.png";
import hackbysecurityLogo from "../assets/collaborators/hackbysecurity.png";
import sirviendoCodigoLogo from "../assets/collaborators/SirviendoCodigologo.png";
import AnimationWrapper from "./AnimationWrapper";


const Collaborators = () => {
  return (
    <>
      <section id="colaboradores" role="region" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Patrocinadores</h2>
          <h2 className="text-center">PLATINUM</h2>
          <div className="speaker-cards margin-top">
            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-up" duration={1500}>
                  <a href="https://nextdigital.es" target="_blank" rel="noopener noreferrer">
                    <img src={nextdigital} alt="Logo de Next Digital" style={{ height: '160px'}} />
                  </a>
                </AnimationWrapper>
              </div>
            </div>
          </div>

          <hr />

          <h2 className="text-center">Colaboradores</h2>
          <p className="text-center">Gracias a la comunidad y todos los colaboradores que hacen posible este evento</p>
          <div className="speaker-cards margin-top">

            <div className="speaker1 justify-content-center d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <a href="https://hackerdreams.org/" target="_blank" rel="noopener noreferrer">
                    <img src={hackerD} alt="Logo de Hacker Dreams" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://hackbcn.org" target="_blank" rel="noopener noreferrer">
                    <img src={hackBcn} alt="Logo de HackBCN" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={CNCFlogo} alt="Logo de Cloud Native Madrid" style={{width: '120px' }} />
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <Link to="/sponsors/crackersgames">
                    <img src={crackersgameslogo} alt="Logo de CrackerGames" style={{width: '120px' }} />
                  </Link>
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-right" duration={1500}>
                    <Link to="/sponsors/hackbcn">
                      <img src={hackBcn} alt="Logo de HackBCN" style={{width: '120px' }} />
                    </Link>
                  </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <Link to="/sponsors/asturcon">
                      <img src={asturC} alt="Logo de AsturCon" style={{width: '120px' }} />
                    </Link>
                  </AnimationWrapper>
              </div>

              <div className="speaker-img">
                  <AnimationWrapper animation="fade-left" duration={1500}>
                    <Link to="/sponsors/madrid-devops">
                      <img src={madridD} alt="Logo de MadridDevOps" style={{width: '120px' }} />
                    </Link>
                  </AnimationWrapper>
              </div>

            </div>
            <div className="speaker1 d-flex justify-content-center justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://snyk.io/community/" target="_blank" rel="noopener noreferrer">
                    <img src={devsecconLogo} alt="Logo de DevSecCon" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <Link to="/sponsors/secadmin">
                    <img src={secadminlogo} alt="Logo de SecAdmin" style={{width: '120px' }} />
                  </Link>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <Link to="/sponsors/cncf-madrid">
                    <img src={CNCFlogo} alt="Logo CNCF" style={{width: '120px' }} />
                  </Link>
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
