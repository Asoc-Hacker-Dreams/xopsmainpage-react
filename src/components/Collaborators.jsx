import React from 'react';      
import nextdigital from "../assets/collaborators/nextdigital.png";
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
import crackersgameslogo from "../assets/collaborators/crackersgames.png";
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
                  <a href="https://ctf.hackerdreams.org" target="_blank" rel="noopener noreferrer">
                    <img src={crackersgameslogo} alt="Logo de Cracker Games" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>

              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={hackB} alt="Logo de Hack Buenos Aires" style={{width: '120px' }} />
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
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <a href="https://madrid.devops.es" target="_blank" rel="noopener noreferrer">
                    <img src={madridD} alt="Logo de Madrid DevOps" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://book.hacktricks.xyz" target="_blank" rel="noopener noreferrer">
                    <img src={hacktricksLogo} alt="Logo de HackTricks" style={{width: '120px' }} />
                  </a>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={hackbysecurityLogo} alt="Logo de Hack By Security" style={{width: '120px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <a href="https://sirviendo-codigo.dev" target="_blank" rel="noopener noreferrer">
                    <img src={sirviendoCodigoLogo} alt="Logo de Sirviendo Codigo" style={{width: '120px' }} />
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
