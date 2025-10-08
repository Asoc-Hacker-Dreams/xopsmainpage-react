import React from 'react';
import agaB from "../assets/speakers/agaB.png";
import alejandroA from "../assets/speakers/alejandroA.png";
import alvaroR from "../assets/speakers/alvaroR.png";
import antonioB from "../assets/speakers/antonioB.png";
import gabrielaG from "../assets/speakers/gabrielaG.jpg";
import juanV from "../assets/speakers/juanV.jpg";
import natalieG from "../assets/speakers/natalieG.jpg";
import oscarC from "../assets/speakers/oscarC.png";
import pabloG from "../assets/speakers/pabloG.jpg";
import santiagoC from "../assets/speakers/santiagoC.jpg";
import davidS from "../assets/speakers/davidS.png";
import placeholderImg from "../assets/speakers/xops.png";  // Placeholder for new speakers
import { Helmet } from 'react-helmet-async';

import AnimationWrapper from "./AnimationWrapper";

const SpeakersSection = () => {
  return (
    <>
      <Helmet>
        <title>Conoce a los Ponentes de la X-Ops Conference Madrid 2025</title>
        <meta name="description" content="Descubre a los expertos que compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025. Conoce sus perfiles y temas destacados." />
        <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia Tecnología Madrid, Ponentes, GitOps, SecOps" />
        {/* También puedes añadir otras metaetiquetas aquí, como las de Open Graph para redes sociales */}
        <meta property="og:title" content="Ponentes de la X-Ops Conference Madrid 2025" />
        <meta property="og:description" content="Conoce a los expertos que compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
        {/* <meta property="og:image" content="URL_A_UNA_IMAGEN_REPRESENTATIVA" /> */}
        <meta property="og:url" content="https://xopsconference.com/#ponentes" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Conoce a Nuestros Ponentes</h2>

          <div className="speaker-cards margin-top">

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={agaB} alt="Aga Bielak" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Aga Bielak</h3>
                  <p>
                    <strong>Google - Especialista técnico en soluciones en la nube.</strong> 
                  </p>
                  <p>
                    Aga es un experto en la nube y Kubernetes con 7 años de experiencia. Nominada como Mejor Mujer en Computación en la Nube en Polonia en 2023, se dedica a romper barreras e inspirar a jóvenes talentos en TI.
                  </p>
                  <p>
                    <strong>Scaling AI Workloads with Kubernetes: Orchestrating Success.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            {/*
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <img src={alejandroA} alt="Alejandro Acosta" style={{ height: '250px', width: '280px' }} />
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alejandro Acosta</h3>
                  <p>
                    <strong>Ingeniero de software y mentor de carrera.</strong>
                  </p>
                  <p>
                    Por más de 20 años, he estado trabajando en la industria de tecnología y de código abierto.
                    <br />
                    Después de mudarme a Silicon Valley en 2015, logré un aumento significativo en mi compensación, saltando de $130k a $1M en total.
                    <br />
                    A lo largo de mi carrera, he participado en más de 1000 entrevistas de trabajo con empresas líderes en tecnología como Amazon, Facebook, Google y Microsoft.
                    <br />
                    Puedo aprovechar mi experiencia y conocimiento para ayudarte a ahorrar tiempo y evitar errores comunes en tu propia carrera.
                    <br />
                    Como mentor, he ayudado con éxito a otros Ingenieros de Software a conseguir puestos en empresas de primera categoría como Amazon, Twitter, Uber y Google.
                  </p>
                  <p>
                    <strong>Descubre y aplica la estrategia que utilizan xOPS para mejorar de trabajo.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>
  */}
{/*
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={alvaroR} alt="Álvaro Revuelta M" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Álvaro Revuelta M.</h3>
                  <p>
                    <strong>Systems Developer.</strong>
                  </p>
                  <p>
                    Graduado en Ing Informática por la UPM y Master en Data Engineering por Uppsala.
                    <br />
                    <br />
                    Trabajo desarrollando infraestructura en entornos cloud y con un enfoque especial en seguridad.
                  </p>
                  <p>
                    <strong>Proteger las cargas de trabajo de Kubernetes: del código al clúster.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>
*/}


            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={antonioB} alt="Antonio Berben" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Antonio Berben</h3>
                  <p>
                    <strong>Principal Solutions Engineer.</strong>
                  </p>
                  <p>
                    Antonio es ingeniero principal de soluciones en Solo.io, donde trabaja para aprender de los usuarios y ayudarlos a recorrer el camino hacia la adopción total de Service Mesh.
                    <br />
                    Es organizador de CNCF (KCD España, CNCF Iberia) y contribuye a proyectos de código abierto.
                    <br />
                    Su trayectoria profesional procedente del desarrollo le hace poner siempre a los desarrolladores en primer lugar. Su filosofía: “Los desarrolladores crean el negocio. El resto estamos aquí sólo para hacerles la vida más fácil”
                    <br />
                    Su mayor preocupación es: cómo acelerar el ciclo de vida del desarrollo. Ésa es una de las razones por las que es un entusiasta de Service Mesh.
                  </p>
                  <p>
                    <strong>Istio Ambient Mesh: Sidecar vs Sidecar-less como si tuviera 10 años.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

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
                    <strong>Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>


            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={natalieG} alt="Natalie Godec" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Natalie Godec</h3>
                  <p>
                    <strong>Arquitecto de la nube | Experto en desarrollo de Google en la nube | Innovador campeón de GCP.</strong>
                  </p>
                  <p>
                    Ingeniero de sistemas/infraestructura convertido en arquitecto de la nube, con debilidad por las plataformas de datos y la seguridad. GDE (Google Dev Expert) en la nube, embajadora de Women TechMakers y oradora tecnológica experimentada.
                    <br />
                    <br />
                    Hablo inglés, ucraniano y francés (y un poquito de italiano) y resido en Londres, Reino Unido.
                    <br />
                    <br />
                    Mis charlas y entrevistas anteriores (algunas de ellas):
                    <br />
                    <a href="https://www.youtube.com/playlist?list=PLS3g1K3mnmajt5Eu3nNaAiMK3hXjVRRNL" target="_blank" rel="noopener noreferrer">https://www.youtube.com/playlist?list=PLS3g1K3mnmajt5Eu3nNaAiMK3hXjVRRNL</a>
                  </p>
                  <p>
                    <strong>Creación de una plataforma de datos nativa de la nube teniendo en cuenta la seguridad.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>


            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={oscarC} alt="Oscar Cortes Bracho" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Oscar Cortes Bracho</h3>
                  <p>
                    <strong>Arquitecto en la nube.</strong>
                  </p>
                  <p>
                    Ingeniero Electronico, Cloud / Software Architect.
                    <br />
                    <br />
                    AWSCommunityBuilder - serverless.
                  </p>
                  <p>
                    <strong>Ambientes efímeros con Serverless y Custom Resources.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>



            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={pabloG} alt="Pablo Gómez-Caldito" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Pablo Gómez-Caldito</h3>
                  <p>
                    <strong>DevOps Engineer.</strong>
                  </p>
                  <p>
                    Soy Pablo Gómez-Caldito, me encanta construir herramientas, productos e infraestructura utilizando software. Mi experiencia laboral es principalmente en SRE, incrementando la confiabilidad de los servicios online e implementando la filosofía DevOps en las organizaciones. También publico proyectos de software de código abierto y me divierto aprendiendo sobre seguridad de la información.
                  </p>
                  <p>
                    <strong>Instalación de Whonix en QEMU/KVM.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>


{/*
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={santiagoC} alt="Santiago Castro Vilabella" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Santiago Castro Vilabella</h3>
                  <p>
                    <strong>Inteligencia Artificial - Experto en Tecnología.</strong>
                  </p>
                  <p>
                    Graduado en Ingeniería Electrónica Industrial y Automática y Máster en Inteligencia Artificial. Desde que finalicé mis estudios no he parado de formarme en las últimas tendencias, descubriendo mi pasión por la innovación y la tecnología. Llevo más de 5 años dedicado a la Inteligencia Artificial, trabajando como Ingeniero de IA en diversas empresas. Actualmente trabajo en Telefónica como Technology Expert y la Inteligencia Artificial Generativa forma parte de mi día a día.
                  </p>
                  <p>
                    <strong>El Futuro de las Operaciones con Agentes de IA: De la Automatización a la Autonomía.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>
*/}


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

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Gisela Torres" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Gisela Torres</h3>
                  <p>
                    <strong>Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Shani Adadi Kazaz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Shani Adadi Kazaz</h3>
                  <p>
                    <strong>Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Alejandro de la Hoz Martin" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alejandro de la Hoz Martin</h3>
                  <p>
                    <strong>De 0 a 100 con Ansible en AWX</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Alberto Morgante" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alberto Morgante</h3>
                  <p>
                    <strong>Automated Baremetal deployment with CAPI + ClusterClass</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Guillermo Ruiz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Guillermo Ruiz</h3>
                  <p>
                    <strong>Autoscaling Kubernetes Like a Pro: A Hands-On Karpenter Workshop</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Carlos Villanúa" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Carlos Villanúa</h3>
                  <p>
                    <strong>$Git It Done: API Management as Code (The DevOps &amp; Platform Team Dream)</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Mani Ghelichkhani" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Mani Ghelichkhani</h3>
                  <p>
                    <strong>Modernizing EKS workloads: Performance &amp; Cost at Scale with Graviton and Karpenter</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Cleyra Uzcategui" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Cleyra Uzcategui</h3>
                  <p>
                    <strong>Web UI: What's New and What's Next</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Sara San Luís Rodríguez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Sara San Luís Rodríguez, Christian Carballo Lozano</h3>
                  <p>
                    <strong>Implementando un sistema de Machine Learning observable en la nube</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Rossana Suarez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Rossana Suarez</h3>
                  <p>
                    <strong>Migración inteligente: Containeriza tu aplicación heredada con MCP</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Dachi Gogotchuri" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Dachi Gogotchuri</h3>
                  <p>
                    <strong>IA generativa en DevSecOps: automatización inteligente de pipelines</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Carlos Polop" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Carlos Polop</h3>
                  <p>
                    <strong>GCP Vulnerabilities &amp; Features of Offensive Engineers</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Patricia Rodríguez Vaquero" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Patricia Rodríguez Vaquero, Almudena Zhou Ramírez López</h3>
                  <p>
                    <strong>Microsoft Fabric meets AI: Building real-world business solutions</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Verónica Rivas Remiseiro" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Verónica Rivas Remiseiro, Toni Granell</h3>
                  <p>
                    <strong>Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Ignacio Dominguez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Ignacio Dominguez</h3>
                  <p>
                    <strong>Hacking CI/CD Pipelines</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Jeff Fan" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Jeff Fan</h3>
                  <p>
                    <strong>Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Alkin Tezuysal" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alkin Tezuysal</h3>
                  <p>
                    <strong>Unified Observability: Leveraging ClickHouse as a Comprehensive Telemetry Database</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="Juarez Junior" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Juarez Junior</h3>
                  <p>
                    <strong>Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="José Enrique Calderón Sanz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>José Enrique Calderón Sanz</h3>
                  <p>
                    <strong>Evolutionary Architecture: the art of making decisions</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={placeholderImg} alt="David Amorín García" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>David Amorín García</h3>
                  <p>
                    <strong>Estrategias de Visualización de Datos para Comunicadores: Contando Historias con Números</strong>
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

export default SpeakersSection;
