import franciscoA from "../assets/organizers/franciscoA.jpg";
import juanillaA from "../assets/organizers/juanillaA.jpg";
import claraC from "../assets/organizers/claraC.jpg"
import { Helmet } from 'react-helmet-async';  // añado despues de instalar react helmet

import AnimationWrapper from "./AnimationWrapper";

const Organizers = () => {
  return (
    <>
                  <Helmet>
                    <title>Organizadores | X-Ops Conference Madrid 2026 | DevOps, DevSecOps, AIOps, MLOps</title>
                    <meta name="description" content="Conoce a los organizadores de la X-Ops Conference Madrid 2026, expertos en DevOps, DevSecOps, AIOps y MLOps, comprometidos con la innovación en la tecnología y la ciberseguridad."/>
                    <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Organizadores, Conferencia, Madrid, Ciberseguridad, Tecnologías"/>
                    <meta property="og:title" content="Conoce a los Organizadores de X-Ops Conference Madrid 2026 | DevOps, DevSecOps, AIOps, MLOps"/>
                    <meta property="og:description" content="Descubre a los organizadores de la X-Ops Conference Madrid 2026, líderes en la tecnología y la ciberseguridad."/>
                    <meta property="og:url" content="https://xopsconference.com/Organizer#organizr"/>
                    <meta name="twitter:card" content="summary_large_image" />
                  </Helmet>
      <section id="organizrs" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Organizadores</h2>

          <div className="speaker-cards margin-top">
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={franciscoA} alt="Francisco Arencibia" style={{ height: '331px', width: '346px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Francisco Arencibia</h3>
                  <p>
                    <strong>Posición:</strong> DevSecOps
                  </p>
                  <p>
                    Ingeniero DevOps con más de 10 años de experiencia en tecnologías de información,
                    <br />
                    especializado en automatización, virtualización y nube. Actualmente trabaja en JOTELULU,
                    <br />
                    diseñando y manteniendo infraestructura en la nube con herramientas como CloudStack,
                    <br />
                    Docker, Kubernetes, Ansible, y Terraform. 
                    <br />
                    Co-Fundador y COO de X-Ops Conference.
                    <br />
                    Organizador y miembro de HackMadrid%27.
                    <br />
                    Chapter Leader de DevSecCon Spain.
                    <br />
                    Cibercooperante del Instituto Nacional de Ciberseguridad (INCIBE). 
                    <br />
                    Apasionado de la cultura hacker y el hacking ético.
                    <br />
                  </p>
                  <p>
                    <strong>Redes:</strong><br />
                    LinkedIn: <a href="https://www.linkedin.com/in/franciscoarencibia/" target="_blank">in/franciscoarencibia</a>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Antonio Juanilla</h3>
                  <p>
                    <strong>Posición:</strong> DevSecOps
                  </p>
                  <p>
                    Docente. Escritor. Investigador.
                    <br />
                    Co-Fundador y CEO de X-Ops Conference.
                    <br />
                    Fundador, Organizador y miembro de HackerDreams%27.
                    <br />
                    Fundador, Coordinador General y miembro de HackBarcelona%27.
                    <br />
                    Chapter Leader de DevSecCon Spain y UAE.
                    <br />
                    Ponente en Congresos Internacionales como: BlackHatEU(UK), RootedCon (Esp), DragonJar Con (Col), Pacific Hackers Conference (USA), HackMiami Conference (USA), Ekoparty (Arg), CICC2023 (Bol) y WorldParty(ESP). 
                    <br />
                    Autodidacta. Eterno aprendiz.
                  </p>
                  <p>
                    <strong>Redes:</strong><br />
                    Twitter: <a href="https://twitter.com/spectertj" target="_blank">@spectertj</a><br />
                    LinkedIn: <a href="https://www.linkedin.com/in/spectertj" target="_blank">in/spectertj</a>
                  </p>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={juanillaA} alt="Antonio Juanilla" style={{ height: '331px', width: '346px' }} />
                </AnimationWrapper>
              </div>
            </div>




            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <img src={claraC} alt="Clara Contreras" style={{ height: '331px', width: '346px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>                 
               <h3>Clara Contreras</h3>
                  <p>
                    <strong>Ingeniera de Ciberseguridad</strong>
                  </p>
                  <p>
                  Ingeniera de Ciberseguridad | Líder Valkyrias | Mentora STEM
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

export default Organizers;
