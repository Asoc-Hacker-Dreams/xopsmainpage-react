import React from 'react';
import placeholderImg from "../../../assets/speakers/xops.png";
import antonioB from "../../../assets/speakers/antonioB.png";
import juanV from "../../../assets/speakers/juanV.jpg";
import giselaT from "../../../assets/speakers/giselaT.png";
import shaniA from "../../../assets/speakers/shaniA.png";
import alejandroH from "../../../assets/speakers/alejandroH.png";
import albertoM from "../../../assets/speakers/albertoM.png";
import guillermoR from "../../../assets/speakers/guillermoR.png";
import pabloS from "../../../assets/speakers/pabloS.png";
import carlosV from "../../../assets/speakers/carlosV.png";
import maniG from "../../../assets/speakers/maniG.png";
import cleyraU from "../../../assets/speakers/cleyraU.png";
import saraS from "../../../assets/speakers/saraS.png";
import rossanaS from "../../../assets/speakers/rossanaS.png";
import dachiG from "../../../assets/speakers/dachiG.png";
import carlosP from "../../../assets/speakers/carlosP.png";
import patriciaR from "../../../assets/speakers/patriciaR.png";
import veronicaR from "../../../assets/speakers/veronicaR.png";
import ignacioD from "../../../assets/speakers/ignacioD.png";
import jeffF from "../../../assets/speakers/jeffF.png";
import alkinT from "../../../assets/speakers/alkinT.png";
import juarezJ from "../../../assets/speakers/juarezJ.png";
import joseC from "../../../assets/speakers/joseC.png";
import joseG from "../../../assets/speakers/joseG.png";
import davidA from "../../../assets/speakers/davidA.png";
import AnimationWrapper from "../../../components/AnimationWrapper";
import SEO from "../../../components/SEO";

const Speakers2025 = () => {
  return (
    <>
      <SEO
        title="Ponentes | X-Ops Conference Madrid 2025"
        description="Conoce a los expertos de X-Ops Conference Madrid 2025."
        path="/archive/2025/Speakers2025"
        image="https://xopsconference.com/assets/speakers-og.jpg"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/ponentes2025' },
          { hrefLang: 'en', href: 'https://xopsconference.com/speakers2025' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "X-Ops Conference Madrid 2025",
          "startDate": "2025-11-21",
          "location": {
            "@type": "Place",
            "name": "Universidad Rey Juan Carlos campus Móstoles",
            "address": "Av. del Alcalde de Móstoles, s/n, 28933 Móstoles, Madrid"
          }
        }}
      />
      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Conoce a Nuestros Ponentes 2025</h2>

          <div className="speaker-cards margin-top">

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={giselaT} alt="Gisela Torres" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Gisela Torres</h3>
                  <p>Sr. Global Blackbelt - Developer Audience @Microsoft</p>
                  <p>
                    Sr. Global Blackbelt - Developer Audience @Microsoft | Microsoft Azure MVP 2010&2011 | Lemoncode 🍋 teacher| Blogger at https://www.returngis.net
                  </p>
                  <p>
                    <strong>Charla: Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={shaniA} alt="Shani Adadi Kazaz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Shani Adadi Kazaz</h3>
                  <p>Senior Containers & Serverless GTM Specialist - AWS</p>
                  <p>
                    I started my career as a software developer and later expanded into roles as a Technical Account Manager and Business Developer for Containers and Serverless technologies. Today, I help companies build platforms that are resilient, self-healing, and built to last. I'm passionate about innovation, emerging cloud-native technologies, and enabling builders to succeed, and I thrive on turning transformative ideas into practical, scalable solutions.
                  </p>
                  <p>
                    <strong>Charla: Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={alejandroH} alt="Alejandro de la Hoz Martin" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alejandro de la Hoz Martin</h3>
                  <p>RedHat Senior Consultant</p>
                  <p>
                    Mas de 17 años trabajando en el sector TI y soy un enamorado de la methodologias y filosofias DevOps. Soy Javero por naturaleza, pero me encanta Python y la automatización.
                  </p>
                  <p>
                    <strong>Charla: De 0 a 100 con Ansible en AWX</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={albertoM} alt="Alberto Morgante" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alberto Morgante</h3>
                  <p>SUSE - Principal Telco Edge Engineer</p>
                  <p>
                    I'm an engineer passionate about cloud, development and new technologies. I'm always looking for new challenges in order to improve myself everyday!!!
                  </p>
                  <p>
                    <strong>Charla: Automated Baremetal deployment with CAPI + ClusterClass</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={pabloS} alt="Pablo Sánchez Carmona" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Pablo Sánchez Carmona</h3>
                  <p>Senior Network Specialist Solutions Architect, AWS</p>
                  <p>
                    Pablo es arquitecto de soluciones especializado en redes en AWS, donde se ha especializado en Infraestructura como Código (IaC), para enseñar a clientes de AWS cómo poder simplificar la creación, gestión y securización de redes complejas en AWS.
                  </p>
                  <p>
                    <strong>Charla: Shift Left, Scale Right - Securizando la infraestructura de AWS a escala con DevSecOps</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={antonioB} alt="Antonio Berben" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Antonio Berben, Felipe Vicens</h3>
                  <p>Solo.io - Principal Solutions Engineer</p>
                  <p>
                    Antonio is a Principal Solutions Engineer at Solo.io, where he works on learning from the users and helping them to walk the path towards full Service Mesh adoption. He is a CNCF Organizer (KCD Spain, CNCF Iberia) and contributes to open-source projects. His career path coming from development, makes him always put the Developers always at first. His philosophy: "Developers create the business. The rest we are here only to make their life easier" His biggest concern is: How to speed up the development lifecycle. That is one of the reasons why he is an enthusiast of Service Mesh
                  </p>
                  <p>
                    <strong>Charla: De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={carlosV} alt="Carlos Villanúa" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Carlos Villanúa</h3>
                  <p>
                    <strong>Charla: $Git It Done: API Management as Code (The DevOps &amp; Platform Team Dream)</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={maniG} alt="Mani Ghelichkhani" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Mani Ghelichkhani</h3>
                  <p>Senior Cloud Operations Architect en Amazon Web Services (AWS)</p>
                  <p>
                    Computer Engineer with extensive experience in IT system administration and operation of critical services. In addition to keeping systems up and running, provides analytical and communication skills to manage teams, improve processes and assist in general business activities.
                  </p>
                  <p>
                    <strong>Charla: Modernizing EKS workloads: Performance & Cost at Scale with Graviton and Karpenter</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={cleyraU} alt="Cleyra Uzcategui" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Cleyra Uzcategui</h3>
                  <p>
                    <strong>Charla: Web UI: What's New and What's Next</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={saraS} alt="Sara San Luís Rodríguez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Sara San Luís Rodríguez, Christian Carballo Lozano</h3>
                  <p>
                    <strong>Charla: Implementando un sistema de Machine Learning observable en la nube</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={rossanaS} alt="Rossana Suarez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Rossana Suarez</h3>
                  <p>
                    <strong>Charla: Migración inteligente: Containeriza tu aplicación heredada con MCP</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={dachiG} alt="Dachi Gogotchuri" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Dachi Gogotchuri</h3>
                  <p>
                    <strong>Charla: IA generativa en DevSecOps: automatización inteligente de pipelines</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={carlosP} alt="Carlos Polop" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Carlos Polop</h3>
                  <p>
                    <strong>Charla: GCP Vulnerabilities &amp; Features of Offensive Engineers</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={patriciaR} alt="Patricia Rodríguez Vaquero" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Patricia Rodríguez Vaquero, Almudena Zhou Ramírez López</h3>
                  <p>
                    <strong>Charla: Microsoft Fabric meets AI: Building real-world business solutions</strong>
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
                    <strong>Charla: Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={veronicaR} alt="Verónica Rivas Remiseiro" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Verónica Rivas Remiseiro, Toni Granell</h3>
                  <p>
                    <strong>Charla: Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={ignacioD} alt="Ignacio Dominguez" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Ignacio Dominguez</h3>
                  <p>
                    <strong>Charla: Hacking CI/CD Pipelines</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={jeffF} alt="Jeff Fan" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Jeff Fan</h3>
                  <p>
                    <strong>Charla: Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={joseG} alt="Jose Gómez-Sellés" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Jose Gómez-Sellés</h3>
                  <p>Product Lead for VictoriaMetrics Cloud</p>
                  <p>
                    Jose is the Product Lead for VictoriaMetrics Cloud. With a focus on Observability and Sustainability, his work has been deeply related to the OpenTelemetry project, distributed tracing and power monitoring projects.
                  </p>
                  <p>
                    His expertise has been built from previous gigs as a Software Architect, Tech Lead and Product Owner in the Telecommunications industry, all the way from the software programming trenches where agile ways of working where a sound CI, testing and observability best practices have presented themselves as the main principles that drive every successful project.
                  </p>
                  <p>
                    With a scientific background in Physics and a PhD in Computational Materials Engineering, curiosity, openness and a pragmatic view are always expected. Beyond the boardroom, he is a C++ enthusiast and a creative force: contributing symphonic touches as a keyboardist in metal bands, when he is not playing video games or lowering lap times at the simracing cockpit. He also loves to spend time teaching Physics to Vet students in the Complutense University of Madrid, as an Associate Professor.
                  </p>
                  <p>
                    <strong>Charla: Scale Your Monitoring Solution With the VictoriaMetrics Ecosystem</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={juarezJ} alt="Juarez Junior" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Juarez Junior</h3>
                  <p>
                    <strong>Charla: Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={joseC} alt="José Enrique Calderón Sanz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>José Enrique Calderón Sanz</h3>
                  <p>
                    <strong>Charla: Evolutionary Architecture: the art of making decisions</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={davidA} alt="David Amorín García" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>David Amorín García</h3>
                  <p>
                    <strong>Charla: Estrategias de Visualización de Datos para Comunicadores: Contando Historias con Números</strong>
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

export default Speakers2025;
