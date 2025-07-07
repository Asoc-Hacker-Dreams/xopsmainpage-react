import gabrielaG from "../../../assets/speakers/gabrielaG.jpg";
import juanV from "../../../assets/speakers/juanV.jpg";
import davidS from "../../../assets/speakers/davidS.png";  
import oszi from "../../../assets/speakers/oszi.jpg";    /*agrego las fotos del 2023*/
import gomezSantos from "../../../assets/speakers/gomezSantos.png"; 
import faria from "../../../assets/speakers/faria.jpeg"; 
import chorenRuiz from "../../../assets/speakers/chorenRuiz.jpeg";
import rodriguezBerzosa from "../../../assets/speakers/rodriguezBerzosa.png";
import reynaldo from "../../../assets/speakers/reynaldo.png";
import rafael from "../../../assets/speakers/rafael.jpg";
import eun from "../../../assets/speakers/eun.jpg";
import joseLuis from "../../../assets/speakers/joseLuis.jpg";
import davidC from "../../../assets/speakers/davidC.jpg";

import AnimationWrapper from "../../../components/AnimationWrapper";

const Speakers2023 = () => {
  return (
    <>
      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Conoce a Nuestros Ponentes</h2>

          <div className="speaker-cards margin-top">

            

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={gabrielaG} alt="Gabriela García" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Gabriela García</h3>
                  <p>
                    <strong>Desarrollador de software de seguridad | Instructor de codificación y ciberseguridad | Entusiasta de la piratería de hardware.</strong>
                  </p>
                  <p>
                    Profesora universitaria y mentora en programas de maestría, especializada en ciberseguridad y programación. Además de docente, y speaker en conferencias de ciberseguridad como RootedCON, DEFCON o BlackHat es desarrolladora de software con un enfoque particular en el desarrollo seguro y participa activamente en la organización de comunidades de hackers, tanto en España como a nivel global. Como profesional independiente, tiene el privilegio de colaborar con una amplia gama de clientes, tanto locales como internacionales, a quienes ofrece soluciones personalizadas de desarrollo y ciberseguridad. Está plenamente comprometida con la promoción de un mundo digital más seguro y accesible para todos.
                  </p>
                  <p>
                    <strong>SDLC con OWASP.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={juanV} alt="Juan Vicente Herrera Ruiz de Alejo" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Juan Vicente Herrera Ruiz de Alejo</h3>
                  <p>
                    <strong>Cloud Architect.</strong>
                  </p>
                  <p>
                    Cloud Architect en Red Hat, co-organizador de Madrid Devops y Devopsdays Madrid y profesor asociado de Cloud Computing en la Universidad Pontificia de Comillas.
                  </p>
                  <p>
                    <strong>Un puente entre MLOps y DevOps con OpenShift AI.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

           

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={davidS} alt="David Sastre" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>David Sastre</h3>
                  <p>
                    <strong>Principal Product Security Engineer at Red Hat</strong>
                  </p>
                  <p>
                    David Sastre cuenta con una amplia experiencia profesional en seguridad y arquitectura de la nube. Actualmente, trabaja como Principal Product Security Engineer en Red Hat, donde ha liderado iniciativas en seguridad de productos y adopción de datos abiertos enlazados para mejorar la gestión de amenazas y vulnerabilidades.
                  </p>
                  <p>
                    Ha desempeñado roles destacados como Senior Product Security Engineer y Cloud and DevOps Senior Architect. Con más de 7 años de experiencia, sus habilidades abarcan desde Information Security, Red Hat Enterprise Linux (RHEL), y OpenShift hasta Network Security, Threat Modeling, y ciberseguridad.
                  </p>
                  <p>
                    <strong>Adopting Linked Open Data in Product Security: a Modular Knowledge Graph</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>
{/*agrego ponentes 2023*/}

<div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={joseLuis} alt="joseLuis" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>José Luis Navarro Adam</h3>
                  <p>
                    <strong>CISO ZINETIK</strong> 
                  </p>
                  <p>
                  Director de Ciberseguridad en ZINETIK y especialista en Offensive Blue Team. Profesor externo de Ciberseguridad en Upgrade Hub (Madrid),  CESUR Formación (Málaga) e Imagina Group (Valencia)
                  </p>
                  
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={reynaldo} alt="reynaldo" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Reynaldo Cordero</h3>
                  <p>
                    <strong>Organizador en el Meetup HaskellMAD</strong> 
                  </p>
                  <p>
                  Analista programador en los SSII de la Unversidad de Alcalá.
Licenciado en Farmacia.
Perrosaurio informático.
Interesado en Haskell, programación funcional, zettelkasten, logseq.
 </p>
                  
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={davidC} alt="davidC" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>David Carrasco</h3>
                  <p>
                    <strong>Software Engineer</strong> 
                  </p>
                  <p>
                  Fricazo. Python and Rust lover. Desarrollador trabajando en el sector de la ciberseguridad.

 </p>
                    
                </AnimationWrapper>
              </div>
            </div>

                       
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={eun} alt="eun" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Eun Young Cho</h3>
                  <p>
                    <strong>EthicHub - Backend developer</strong> 
                  </p>
                  <p>
                  Sin un background tecnológico (Ciencias Ambientales), me reciclé porque quería programar y encontré el camino en Python para convertirme en desarrolladora backend. Actualmente trabajo en EthicHub ayudando a crear smart contracts y sigo aprendiendo con la convicción de que con el código se puede hacer de un mundo un poco mejor.
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div> 

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={rafael} alt="rafael" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Rafael Hernampérez</h3>
                  <p>
                    <strong>Apasionado por la Tecnología</strong> 
                  </p>
                  <p>
                  Apasionado de la tecnología, con más de 30 años de experiencia en proyectos y servicios de innovación tecnológica y transformación digital. Background en Arquitectura de Soluciones, Backend, Movilidad, Web, Integración, Microservicios, APIs, Cloud, Bases de Datos, Data Analytics, Inteligencia Artificial, Ciberseguridad, Computación Cuántica, IoT, Robótica… 

- MBA en Dirección y Administración de empresas (EUDE y Universidad Complutense de Madrid)
- Máster en Big Data y Business Intelligence (ENEB y Universidad Isabel I de Barcelona)
- Máster en Inteligencia Artificial (INESEM Business School + IEEE)
- Máster en Ciberseguridad (INESEM Business School + IEEE)
- Máster en Informática Forense (ENESCA Business School)

Siempre curioso y abierto a nuevas posibilidades. 
</p>
                    
                </AnimationWrapper>
              </div>
            </div> 

           
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={rodriguezBerzosa} alt="rodriguezBerzosa" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Luis Rodriguez</h3>
                  <p>
                    <strong>Co-founder and CTO at Xygeni</strong> 
                  </p>
                  <p>
                  Luis Rodriguez is a physicist + mathematician and CISSP. Currently co-founder and CTO at Xygeni. He has over 20 years of experience in software security, and participated in projects like SAST and SCA. At the present he is focused on software supply chain security.
 </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={chorenRuiz} alt="chorenRuiz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Matias Choren</h3>
                  <p>
                    <strong></strong> 
                  </p>
                  <p>
                  Apasionado por la Seguridad Informática, el Software Libre, Unix y la historia de la informática. Speaker en varias charlas relacionadas a la Seguridad y concientización y organizador de FLISOL en Caseros, Argentina.
                 </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={faria} alt="faria" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Daniel Faria</h3>
                  <p>
                    <strong></strong> 
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={gomezSantos} alt="gomezSantos" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Javier Gómez</h3>
                  <p>
                    <strong>Solutions architect at Cloudera </strong> 
                  </p>
                  <p>
                  Javier Gómez Santos es Ingeniero informático por la UCM, es socio de la empresa Pronoide SL y trabaja como Solutions Architect en Cloudera, donde desarrolla diversas labores relacionadas con la tecnología BigData, desde diseñar la arquitectura, implantar la solución y securizar la misma.
Durante su tiempo libre lleva un Coderdojo donde realizan proyectos de divulgación relacionados con el mundo de la tecnología.</p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={oszi} alt="oszi" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Agustín Osorio</h3>
                  <p>
                    <strong></strong> 
                  </p>
                  <p>
                  Arquitecto y consultor de seguridad en la nube con un historial probado de trabajo con líderes mundiales del sector, como Netflix, Meta, Snapchat, Toyota, Nestlé y Google, para mejorar sus normas de seguridad y cumplir los objetivos de arquitectura.  Participa activamente en las comunidades de ciberseguridad y TI, y es ponente en respetadas conferencias sobre seguridad, como Ekoparty, B-Sides, Tandilsec y SASO Conf.  Entusiasta de las redes, los protocolos de cifrado y las innovaciones de blue-team. Coordinador de iniciativas y workshops galardonados, como Wardriving y FollowTheR00ts.
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Speakers2023;