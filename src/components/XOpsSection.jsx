import React from 'react';
import AnimationWrapper from "./AnimationWrapper";
import XopsImg from "../assets/xops-img.jpg";

const XOpsSection = () => {
  return (
    <>
    {/* Meta tags para SEO */}
    <Helmet>
      <title>Conoce la X-Ops Conference Madrid 2025</title>
      <meta name="description" content="Descubre que es X-Ops y cómo compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
      <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia Tecnología Madrid, Ponentes, GitOps, SecOps" />
      {/* También puedes añadir otras metaetiquetas aquí, como las de Open Graph para redes sociales */}
      <meta property="og:title" content="Conoce la X-Ops Conference Madrid 2025" />
      <meta property="og:description" content="Descubre que es X-Ops y cómo compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
      {/* <meta property="og:image" content="URL_A_UNA_IMAGEN_REPRESENTATIVA" /> */}
      <meta property="og:url" content="https://xopsconference.com/#events" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Conoce la X-Ops Conference Madrid 2025" />
      <meta name="twitter:description" content="Descubre que es X-Ops y cómo compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
      {/* <meta name="twitter:image" content="URL_A_UNA_IMAGEN_REPRESENTATIVA" /> */}
      <link rel="canonical" href="https://xopsconference.com/#events" />
      
    </Helmet>

    <section id="inicio" className="xops-section">
      <div className="container">
        <div>
          <h2 className="font-weight-bold justify-content-center text-center ">
            Que es X-Ops?
          </h2>
          <p className="xos-p">
            La X-Ops Conference es un evento de primer nivel que se llevará a
            cabo en la vibrante ciudad de Madrid. Esta conferencia está diseñada
            específicamente para profesionales y entusiastas del mundo X-Ops,
            una metodología que ya ha empezado a ganar terreno y mucha tracción
            en el mundo empresarial. X-Ops es una amalgama de DevOps, DevSecOps,
            AIOps, MLOps y BizDevOps. Durante el evento, los asistentes tendrán
            la oportunidad de aprender de los mejores, asistir a charlas
            magistrales, participar en talleres prácticos, y establecer
            conexiones valiosas en el mundo X-Ops.
          </p>
        </div>
        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 mt-4">
            <AnimationWrapper animation="fade-right" duration={1500}>
              <h4 className="mb-3">Componentes Clave</h4>
              <ul>
                <li>
                  <strong>DevOps:</strong> Colaboración entre equipos de
                  desarrollo y operaciones.
                </li>
                <li>
                  <strong>DevSecOps:</strong> Integra prácticas de seguridad
                  dentro del proceso DevOps.
                </li>
                <li>
                  <strong>AIOps:</strong> Utiliza inteligencia artificial para
                  mejorar las operaciones de TI.
                </li>
                <li>
                  <strong>MLOps:</strong> Optimiza el despliegue de modelos de
                  aprendizaje automático.
                </li>
                <li>
                  <strong>BizDevOps:</strong> Alinea los objetivos empresariales
                  con las operaciones de TI.
                </li>
              </ul>
            </AnimationWrapper>
          </div>

          <div className="col-lg-6 col-md-12">
            <AnimationWrapper animation="fade-left" duration={1500}>
              <img
                src={XopsImg}
                alt="X-Ops Illustration"
                className="img-fluid"
              />
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default XOpsSection;
