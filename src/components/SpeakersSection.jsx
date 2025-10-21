import React from 'react';
import placeholderImg from "../assets/speakers/xops.png";
import antonioB from "../assets/speakers/antonioB.png";
import juanV from "../assets/speakers/juanV.jpg";
import giselaT from "../assets/speakers/giselaT.png";
import shaniA from "../assets/speakers/shaniA.png";
import alejandroH from "../assets/speakers/alejandroH.png";
import albertoM from "../assets/speakers/albertoM.png";
import guillermoR from "../assets/speakers/guillermoR.png";
import carlosV from "../assets/speakers/carlosV.png";
import maniG from "../assets/speakers/maniG.png";
import cleyraU from "../assets/speakers/cleyraU.png";
import saraS from "../assets/speakers/saraS.png";
import rossanaS from "../assets/speakers/rossanaS.png";
import dachiG from "../assets/speakers/dachiG.png";
import carlosP from "../assets/speakers/carlosP.png";
import patriciaR from "../assets/speakers/patriciaR.png";
import veronicaR from "../assets/speakers/veronicaR.png";
import ignacioD from "../assets/speakers/ignacioD.png";
import jeffF from "../assets/speakers/jeffF.png";
import alkinT from "../assets/speakers/alkinT.png";
import juarezJ from "../assets/speakers/juarezJ.png";
import joseC from "../assets/speakers/joseC.png";
import davidA from "../assets/speakers/davidA.png";
import { Helmet } from 'react-helmet-async';

import AnimationWrapper from "./AnimationWrapper";

const SpeakersSection = () => {
  return (
    <>
      <Helmet>
        <title>Conoce a los Ponentes de la X-Ops Conference Madrid 2025</title>
        <meta name="description" content="Descubre a los expertos que compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025. Conoce sus perfiles y temas destacados." />
        <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia Tecnología Madrid, Ponentes, GitOps, SecOps" />
        <meta property="og:title" content="Ponentes de la X-Ops Conference Madrid 2025" />
        <meta property="og:description" content="Conoce a los expertos que compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
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
                  <img src={giselaT} alt="Gisela Torres" style={{ height: '250px', width: '280px' }} />
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
                  <img src={shaniA} alt="Shani Adadi Kazaz" style={{ height: '250px', width: '280px' }} />
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
                  <img src={alejandroH} alt="Alejandro de la Hoz Martin" style={{ height: '250px', width: '280px' }} />
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
                  <img src={albertoM} alt="Alberto Morgante" style={{ height: '250px', width: '280px' }} />
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
                  <img src={guillermoR} alt="Guillermo Ruiz" style={{ height: '250px', width: '280px' }} />
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
                  <img src={antonioB} alt="Antonio Berben" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Antonio Berben, Felipe Vicens</h3>
                  <p>
                    <strong>De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras</strong>
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
                    <strong>$Git It Done: API Management as Code (The DevOps &amp; Platform Team Dream)</strong>
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
                  <p>
                    <strong>Modernizing EKS workloads: Performance &amp; Cost at Scale with Graviton and Karpenter</strong>
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
                    <strong>Web UI: What's New and What's Next</strong>
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
                    <strong>Implementando un sistema de Machine Learning observable en la nube</strong>
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
                    <strong>Migración inteligente: Containeriza tu aplicación heredada con MCP</strong>
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
                    <strong>IA generativa en DevSecOps: automatización inteligente de pipelines</strong>
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
                    <strong>GCP Vulnerabilities &amp; Features of Offensive Engineers</strong>
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
                    <strong>Microsoft Fabric meets AI: Building real-world business solutions</strong>
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
                    <strong>Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI</strong>
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
                    <strong>Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps</strong>
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
                    <strong>Hacking CI/CD Pipelines</strong>
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
                    <strong>Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards</strong>
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
                    <strong>Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase</strong>
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
                    <strong>Evolutionary Architecture: the art of making decisions</strong>
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
