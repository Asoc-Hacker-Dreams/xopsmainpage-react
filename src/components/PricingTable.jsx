import React from 'react';
import { BsCheckCircleFill, BsStar } from 'react-icons/bs';
import AnimationWrapper from './AnimationWrapper';

const CONTACT_EMAIL = 'info@xopsconference.com';

const formatPrice = (price) => price.toLocaleString('es-ES');

const platinum = {
  id: 'platinum',
  name: 'PLATINUM',
  price: 10000,
  features: [
    'Todos los beneficios del Track Sponsor',
    'Charla Principal (Keynote) de 30 minutos',
    'Stand Físico grande (3×2m) en posición estratégica',
    'Logo en email de bienvenida a asistentes',
    'Agradecimiento en ceremonia de apertura y clausura',
    '15 Entradas completas',
  ],
};

const track = {
  id: 'track',
  name: 'TRACK SPONSOR',
  price: 6000,
  features: [
    'Todos los beneficios del paquete Gold',
    'Derechos de Nomenclatura del Track',
    'Branding exclusivo en la sala física',
    'Logo en cabecera de la agenda del track',
    'Mención especial al inicio de cada jornada',
    'Stand Virtual Premium en posición destacada',
    '15 Entradas completas',
  ],
};

const standard = [
  {
    id: 'gold',
    name: 'GOLD',
    price: 3000,
    features: [
      'Todos los beneficios del paquete Silver',
      'Charla técnica de 45 minutos',
      'Logo destacado en posición superior',
      'Publicación dedicada en redes sociales',
      'Stand Virtual Mejorado con vídeo y formulario',
      '10 Entradas completas',
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    price: 1500,
    features: [
      'Stand Físico de 2×2m con mesa y sillas',
      'Stand Virtual Básico',
      'Logo, descripción y enlace web',
      "Logo en sección 'Silver Sponsors'",
      'Mención en publicación conjunta en redes sociales',
      '5 Entradas completas',
    ],
  },
  {
    id: 'virtual',
    name: 'VIRTUAL-ONLY',
    price: 1000,
    features: [
      'Stand Virtual Premium',
      'Perfil completo en la aplicación web',
      'Logo, descripción y enlaces a redes sociales',
      'Vídeo promocional incrustado',
      'Chat en tiempo real con asistentes',
      'Formulario integrado para captura de leads',
      "Logo en sección 'Virtual Sponsors' de la web",
    ],
  },
];

const PricingTable = () => (
  <section className="sponsor-tiers" id="patrocinio" aria-labelledby="sponsor-tiers-heading">
    <div className="sponsor-tiers__container">

      <header className="sponsor-tiers__header">
        <h2 id="sponsor-tiers-heading" className="sponsor-tiers__title">
          Nuestros Planes de Promoción
        </h2>
        <p className="sponsor-tiers__subtitle">
          Elige el nivel que mejor encaja con tu estrategia de visibilidad
        </p>
      </header>

      {/* Platinum — full-width featured */}
      <AnimationWrapper animation="fade-up" duration={800}>
        <div className="sponsor-tiers__featured">
          <div className="sponsor-tiers__featured-inner">
            <div className="sponsor-tiers__tier-side">
              <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--gold">
                {platinum.name}
              </span>
              <div className="sponsor-tiers__price">
                <span className="sponsor-tiers__price-sign">€</span>
                <span className="sponsor-tiers__price-amount">{formatPrice(platinum.price)}</span>
              </div>
              <span className="sponsor-tiers__price-sub">inversión</span>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio Platinum`}
                className="sponsor-tiers__cta sponsor-tiers__cta--gold"
                aria-label="Contactar sobre el plan Platinum"
              >
                Contactar
              </a>
            </div>
            <ul className="sponsor-tiers__features sponsor-tiers__features--grid" aria-label="Beneficios Platinum">
              {platinum.features.map((f, i) => (
                <li key={i} className="sponsor-tiers__feature">
                  <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--gold" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimationWrapper>

      {/* Track Sponsor — centered, exclusive */}
      <AnimationWrapper animation="fade-up" duration={800}>
        <div className="sponsor-tiers__track-wrap">
          <div className="sponsor-tiers__track">
            <div className="sponsor-tiers__exclusive-badge" aria-label="Exclusivo, solo 2 disponibles">
              <BsStar aria-hidden="true" />
              EXCLUSIVO · SOLO 2 DISPONIBLES
            </div>
            <div className="sponsor-tiers__featured-inner">
              <div className="sponsor-tiers__tier-side">
                <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--cyan">
                  {track.name}
                </span>
                <div className="sponsor-tiers__price">
                  <span className="sponsor-tiers__price-sign">€</span>
                  <span className="sponsor-tiers__price-amount">{formatPrice(track.price)}</span>
                </div>
                <span className="sponsor-tiers__price-sub">inversión</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio Track Sponsor`}
                  className="sponsor-tiers__cta sponsor-tiers__cta--outline"
                  aria-label="Contactar sobre el plan Track Sponsor"
                >
                  Contactar
                </a>
              </div>
              <ul className="sponsor-tiers__features" aria-label="Beneficios Track Sponsor">
                {track.features.map((f, i) => (
                  <li key={i} className="sponsor-tiers__feature">
                    <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--cyan" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimationWrapper>

      {/* Gold / Silver / Virtual-Only */}
      <div className="sponsor-tiers__standard-row">
        {standard.map((plan) => (
          <AnimationWrapper key={plan.id} animation="fade-up" duration={800}>
            <div className={`sponsor-tiers__card sponsor-tiers__card--${plan.id}`}>
              <span className={`sponsor-tiers__tier-label sponsor-tiers__tier-label--${plan.id === 'gold' ? 'amber' : 'slate'}`}>
                {plan.name}
              </span>
              <div className="sponsor-tiers__price">
                <span className="sponsor-tiers__price-sign">€</span>
                <span className="sponsor-tiers__price-amount">{formatPrice(plan.price)}</span>
              </div>
              <span className="sponsor-tiers__price-sub">inversión</span>
              <ul className="sponsor-tiers__features" aria-label={`Beneficios ${plan.name}`}>
                {plan.features.map((f, i) => (
                  <li key={i} className="sponsor-tiers__feature">
                    <BsCheckCircleFill
                      className={`sponsor-tiers__check sponsor-tiers__check--${plan.id === 'gold' ? 'cyan-dim' : 'slate'}`}
                      aria-hidden="true"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio ${plan.name}`}
                className="sponsor-tiers__cta sponsor-tiers__cta--muted"
                aria-label={`Contactar sobre el plan ${plan.name}`}
              >
                Contactar
              </a>
            </div>
          </AnimationWrapper>
        ))}
      </div>

    </div>
  </section>
);

export default PricingTable;
