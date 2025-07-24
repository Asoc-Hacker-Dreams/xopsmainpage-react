import React from 'react';
import { Helmet } from 'react-helmet-async';  // añado despues de instalar react helmet

 function Hero() {
          return (
            <>
            <Helmet>
                <title>X-Ops Conference Madrid 2025 | DevOps, DevSecOps, AIOps, MLOps</title>
                <meta name="description" content="Únete a la X-Ops Conference en Madrid, el evento líder para profesionales de DevOps, DevSecOps, AIOps y MLOps. Descubre las últimas tendencias y conecta con expertos." />
                <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia Tecnología Madrid, GitOps, SecOps" />
                {/* También puedes añadir otras metaetiquetas aquí, como las de Open Graph para redes sociales */}
                <meta property="og:title" content="X-Ops Conference Madrid 2025 | DevOps, DevSecOps, AIOps, MLOps" />
                <meta property="og:description" content="Únete a la X-Ops Conference en Madrid..." />
                {/* <meta property="og:image" content="URL_A_UNA_IMAGEN_REPRESENTATIVA" /> */}
                <meta property="og:url" content="https://xopsconference.com/" />
                <meta name="twitter:card" content="summary_large_image" />
              </Helmet>
{/* Hasta aqui añado despues de intalar react helmet */}

{/* function Hero() {
  return (   */}
    <div className='Hero-section d-flex align-items-center justify-content-center text-center'>
      <div className="d-flex align-items-center justify-content-center text-center text-white py-5">
    <div className="container">
        <h1 className="display-4 font-weight-bold">
          X-Ops Conference Madrid 2025 - DevOps, DevSecOps, SecOps, AIOps y MLOps
        </h1>
        <h2 className="lead mt-3 mb-4">
          ¡Únete a la revolución tecnológica! El evento líder en España para profesionales de X-Ops
        </h2>
        <p className="lead">El mundo de las IT está cambiando. Únete a nosotros en la X-Ops Conference, donde descubrirás cómo la tecnología y las personas adecuadas están impulsando el cambio.</p>
        <p className="lead"><strong>📅 Fecha: 21 y 22 de Noviembre 2025 | 📍 Madrid, Universidad Rey Juan Carlos</strong></p>
        <div className="mt-4 mx-4">
        <a href="https://www.eventbrite.ch/e/entradas-x-ops-conference-madrid-2025-1306767269079" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">Compra tu entrada</a>
            <a href="#learn-more" className="btn mx-2  my-2 btn-outline-light btn-lg">Ver agenda</a>
            
        </div>
    </div>
</div>

    </div>
   </> // añadido
);
  }

export default Hero
