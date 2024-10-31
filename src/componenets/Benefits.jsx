import React from 'react';
import banner from '../assets/banner.jfif'
import AnimationWrapper from './AnimationWrapper';
import { BsMegaphone, BsGlobe } from 'react-icons/bs';

const Benefits = () => {
  return (
    <section id="patrocinio" className="collaboration-sponsorship-section banner-section">
      <div className="container">
        <h2 className="text-center margin-top">Colaboración y Patrocinio</h2>
        <p className="text-center">
          Sería un honor y placer que su organización nos acompañe en esta primera edición de 
          <span className='heading'> <strong> X-Ops Conference</strong> </span> y así poder impulsar esta iniciativa para la mayor 
          capacitación y divulgación del X-Ops.
        </p>

        <div className="row justify-content-center align-items-center">
        <div className="col-md-6 mb-4 text-justify">
        <AnimationWrapper animation="fade-right" duration={1000}>

          <h5 className="mt-5">¿Por qué patrocinar la X-Ops Conference?</h5>
          <p>
            Al convertirte en patrocinador de la X-Ops Conference Madrid, tendrás la oportunidad de posicionarte como líder en el ámbito de X-Ops. 
            Obtén visibilidad ante una audiencia altamente selecta y comprometida de profesionales, desarrolladores, ingenieros de seguridad y líderes de opinión. 
            ¡No te pierdas la oportunidad de destacar entre tus competidores y fortalecer tu presencia en el mercado!
          </p>
          </AnimationWrapper>
        </div>
        <div className="col-md-6 mb-4 text-center mt-5">
        <AnimationWrapper animation="fade-left" duration={1000}>

          <img src={banner} alt="Sponsor Conference" className="banner-img " />
        </AnimationWrapper>
        </div>
      </div>

        <h5 className="text-center mt-4 heading">BENEFICIOS EXTRA</h5>
        <ul className="benefits-list">
          <li>
            <BsMegaphone className="me-2 benefits-icon" /> 
            Publicidad durante el evento y en todos nuestros canales de difusión.
          </li>
          <li>
            <BsGlobe className="me-2 benefits-icon" /> 
            Visibilidad, alcance y posicionamiento como marca colaboradora a nivel nacional e internacional.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Benefits;


  