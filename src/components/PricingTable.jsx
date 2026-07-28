import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsCheckCircleFill, BsStar } from 'react-icons/bs';
import AnimationWrapper from './AnimationWrapper';

const CONTACT_EMAIL = 'info@xopsconference.com';
const EUR_TO_AED = 4.0;
const EUR_TO_USD = 1.1;
const ROUND_STEP = 50;
const COMBINED_DISCOUNT = 0.1;

const roundToStep = (value, step = ROUND_STEP) => Math.round(value / step) * step;
const formatNumber = (value) => value.toLocaleString('es-ES');

const plans = [
  {
    id: 'platinum',
    name: 'PLATINUM',
    eurPrice: 10000,
    featured: true,
    features: [
      'Todos los beneficios del Track Sponsor',
      'Charla Principal (Keynote) de 30 minutos',
      'Stand físico premium en posición estratégica',
      'Logo en email de bienvenida a asistentes',
      'Agradecimiento en ceremonia de apertura y clausura',
      '15 entradas completas',
    ],
  },
  {
    id: 'track',
    name: 'TRACK SPONSOR',
    eurPrice: 6000,
    track: true,
    features: [
      'Todos los beneficios del paquete Gold',
      'Derechos de nomenclatura del track',
      'Branding exclusivo en sala física',
      'Logo en cabecera de la agenda del track',
      'Mención especial al inicio de cada jornada',
      '15 entradas completas',
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    eurPrice: 3000,
    features: [
      'Todos los beneficios del paquete Silver',
      'Charla técnica de 45 minutos',
      'Logo destacado en posición superior',
      'Publicación dedicada en redes sociales',
      '10 entradas completas',
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    eurPrice: 1500,
    features: [
      'Stand físico de 2x2m con mesa y sillas',
      'Logo, descripción y enlace web',
      "Logo en sección 'Silver Sponsors'",
      'Mención en publicación conjunta en redes sociales',
      '5 entradas completas',
    ],
  },
  {
    id: 'virtual',
    name: 'VIRTUAL-ONLY',
    eurPrice: 1000,
    features: [
      'Stand virtual premium',
      'Perfil completo en la aplicación web',
      'Logo, descripción y enlaces a redes sociales',
      'Vídeo promocional incrustado',
      'Formulario integrado para captura de leads',
    ],
  },
];

const cityModes = [
  {
    id: 'madrid',
    label: 'Patrocina Madrid',
    currencySymbol: '€',
    currencyCode: 'EUR',
    copy: 'Beneficios presenciales aplicados a Madrid.',
    computePrice: (eur) => eur,
    subjectPrefix: 'Madrid',
  },
  {
    id: 'dubai',
    label: 'Patrocina Dubai',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    copy: 'Beneficios presenciales aplicados a Dubai.',
    computePrice: (eur) => roundToStep(eur * EUR_TO_AED),
    subjectPrefix: 'Dubai',
  },
  {
    id: 'both',
    label: 'Patrocina ambas ciudades',
    currencySymbol: 'US$',
    currencyCode: 'USD',
    copy: 'Presencia en Madrid + Dubai con 10% de descuento combinado.',
    computePrice: (eur) => roundToStep(eur * 2 * EUR_TO_USD * (1 - COMBINED_DISCOUNT)),
    subjectPrefix: 'Madrid+Dubai',
  },
];

const renderPrice = (symbol, amount) => (
  <div className="sponsor-tiers__price">
    <span className="sponsor-tiers__price-sign">{symbol}</span>
    <span className="sponsor-tiers__price-amount">{formatNumber(amount)}</span>
  </div>
);

const PricingTable = () => {
  const [activeMode, setActiveMode] = useState(cityModes[0]);
  const featuredPlan = plans.find((plan) => plan.featured);
  const trackPlan = plans.find((plan) => plan.track);
  const standardPlans = plans.filter((plan) => !plan.featured && !plan.track);

  return (
    <section className="sponsor-tiers" id="patrocinio" aria-labelledby="sponsor-tiers-heading">
      <div className="sponsor-tiers__container">
        <header className="sponsor-tiers__header">
          <h2 id="sponsor-tiers-heading" className="sponsor-tiers__title">
            Nuestros Planes de Promoción
          </h2>
          <p className="sponsor-tiers__subtitle">
            Selecciona ciudad para ver precios y beneficios físicos aplicables.
          </p>
          <div className="sponsor-tiers__city-tabs" role="tablist" aria-label="Selector de patrocinio por ciudad">
            {cityModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`sponsor-tiers__city-tab${activeMode.id === mode.id ? ' sponsor-tiers__city-tab--active' : ''}`}
                onClick={() => setActiveMode(mode)}
                role="tab"
                aria-selected={activeMode.id === mode.id}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="sponsor-tiers__city-copy">
            {activeMode.copy}
          </p>
          <p className="sponsor-tiers__city-note">
            Tipo de cambio fijo: 1 EUR = {EUR_TO_AED.toFixed(2)} AED y 1 EUR = {EUR_TO_USD.toFixed(2)} USD (redondeo a {ROUND_STEP}).
          </p>
        </header>

        {featuredPlan && (
          <AnimationWrapper animation="fade-up" duration={800}>
            <div className="sponsor-tiers__featured">
              <div className="sponsor-tiers__featured-inner">
                <div className="sponsor-tiers__tier-side">
                  <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--gold">{featuredPlan.name}</span>
                  {renderPrice(activeMode.currencySymbol, activeMode.computePrice(featuredPlan.eurPrice))}
                  <span className="sponsor-tiers__price-sub">{activeMode.currencyCode} · inversión</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio ${activeMode.subjectPrefix} ${featuredPlan.name}`}
                    className="sponsor-tiers__cta sponsor-tiers__cta--gold"
                    aria-label={`Contactar sobre el plan ${featuredPlan.name} en ${activeMode.subjectPrefix}`}
                  >
                    Contactar
                  </a>
                </div>
                <ul className="sponsor-tiers__features sponsor-tiers__features--grid" aria-label={`Beneficios ${featuredPlan.name}`}>
                  {featuredPlan.features.map((feature) => (
                    <li key={feature} className="sponsor-tiers__feature">
                      <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--gold" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimationWrapper>
        )}

        {trackPlan && (
          <AnimationWrapper animation="fade-up" duration={800}>
            <div className="sponsor-tiers__track-wrap">
              <div className="sponsor-tiers__track">
                <div className="sponsor-tiers__exclusive-badge" aria-label="Exclusivo, solo 2 disponibles">
                  <BsStar aria-hidden="true" />
                  EXCLUSIVO · SOLO 2 DISPONIBLES
                </div>
                <div className="sponsor-tiers__featured-inner">
                  <div className="sponsor-tiers__tier-side">
                    <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--cyan">{trackPlan.name}</span>
                    {renderPrice(activeMode.currencySymbol, activeMode.computePrice(trackPlan.eurPrice))}
                    <span className="sponsor-tiers__price-sub">{activeMode.currencyCode} · inversión</span>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio ${activeMode.subjectPrefix} ${trackPlan.name}`}
                      className="sponsor-tiers__cta sponsor-tiers__cta--outline"
                      aria-label={`Contactar sobre el plan ${trackPlan.name} en ${activeMode.subjectPrefix}`}
                    >
                      Contactar
                    </a>
                  </div>
                  <ul className="sponsor-tiers__features" aria-label={`Beneficios ${trackPlan.name}`}>
                    {trackPlan.features.map((feature) => (
                      <li key={feature} className="sponsor-tiers__feature">
                        <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--cyan" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimationWrapper>
        )}

        <div className="sponsor-tiers__standard-row">
          {standardPlans.map((plan) => (
            <AnimationWrapper key={plan.id} animation="fade-up" duration={800}>
              <div className={`sponsor-tiers__card sponsor-tiers__card--${plan.id}`}>
                <span className={`sponsor-tiers__tier-label sponsor-tiers__tier-label--${plan.id === 'gold' ? 'amber' : 'slate'}`}>
                  {plan.name}
                </span>
                {renderPrice(activeMode.currencySymbol, activeMode.computePrice(plan.eurPrice))}
                <span className="sponsor-tiers__price-sub">{activeMode.currencyCode} · inversión</span>
                <ul className="sponsor-tiers__features" aria-label={`Beneficios ${plan.name}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="sponsor-tiers__feature">
                      <BsCheckCircleFill
                        className={`sponsor-tiers__check sponsor-tiers__check--${plan.id === 'gold' ? 'cyan-dim' : 'slate'}`}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Patrocinio ${activeMode.subjectPrefix} ${plan.name}`}
                  className="sponsor-tiers__cta sponsor-tiers__cta--muted"
                  aria-label={`Contactar sobre el plan ${plan.name} en ${activeMode.subjectPrefix}`}
                >
                  Contactar
                </a>
              </div>
            </AnimationWrapper>
          ))}
        </div>

        <div className="sponsor-tiers__startup">
          <h3>Startup Pack</h3>
          <p>
            Si eres startup, recupera el acceso rápido al formulario de elegibilidad y aplica hoy.
          </p>
          <Link to="/startup-pack" className="sponsor-tiers__cta sponsor-tiers__cta--gold">
            Ir a Startup Pack
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
