import robertoG from "../assets/organizers/robertoG.jpeg";
import franciscoA from "../assets/organizers/franciscoA.jpg";
import juanillaA from "../assets/organizers/juanillaA.jpg";

import AnimationWrapper from "./AnimationWrapper";

const Organizers = () => {
  return (
    <>
      <section id="organizrs" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Organizadores</h2>

          <div className="speaker-cards margin-top">
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Roberto Gonzalez</h3>
                  <p>
                    <strong>Posición:</strong> Perito y Analista Informático y Telefónico Forense.
                  </p>
                  <p>
                    Investigador Digital. Docente. Productor. Redactor y Editor.
                    <br /> 
                    Co-Fundador y General Manager de Osintomático Conference y OsintomátiCOPS Conference. 
                    <br />
                    Co-Fundador y CMO de XOps Conference. 
                    <br />
                    Fundador, Coordinador General y miembro de Hack%27BuenosAires.
                    <br />
                    Ponente en Congresos Internacionales como: Tapas&Hacks (Esp), DragonJar Con (Col), 
                    <br />
                    HackForAll (Lat), IntelCon (Esp), Ekoparty (Arg), CICC2023 (Bol) y Osintomático Bootcamp (Esp). 
                    <br />
                    Autodidacta. Eterno aprendiz. Osint e Ingeniería Social. 
                    <br />
                    Cine y series freakys (Star Wars, GOT y todo eso).
                  </p>
                  <p>
                    <strong>Redes:</strong><br />
                    Twitter: <a href="https://twitter.com/robedugonzalez" target="_blank">@robedugonzalez</a><br />
                    LinkedIn: <a href="https://www.linkedin.com/in/robertoegonzalez1" target="_blank">in/robertoegonzalez1</a>
                  </p>
                </AnimationWrapper>
              </div>
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={robertoG} alt="Roberto Gonzalez" style={{ height: '331px', width: '346px' }} />
                </AnimationWrapper>
              </div>
            </div>

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
                    Co-Fundador y COO de XOps Conference.
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
                    Co-Fundador y CEO de XOps Conference.
                    <br />
                    Organizador y miembro de HackMadrid%27.
                    <br />
                    Fundador, Coordinador General y miembro de HackBarcelona%27.
                    <br />
                    Chapter Leader de DevSecCon Spain.
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
          </div>
        </div>
      </section>
    </>
  );
};

export default Organizers;
