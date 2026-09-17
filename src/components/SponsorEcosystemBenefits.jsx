import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckCircleFill } from 'react-icons/bs';
import AnimationWrapper from './AnimationWrapper';
import '../styles/SponsorEcosystemBenefits.css';

const CONTACT_EMAIL = 'info@xopsconference.com';

const copy = {
  es: {
    prefix: 'Beneficios del ecosistema',
    title: 'Tu patrocinio activa capacidades, no solo visibilidad.',
    subtitle:
      'X-Ops combina Conference, Consulting, Media y seguridad ofensiva para que los partners obtengan valor antes, durante y después del evento. Las activaciones tienen alcance definido y se adaptan al nivel de patrocinio.',
    pillars: [
      {
        key: 'conference',
        eyebrow: 'CONNECT',
        title: 'X-Ops Conference',
        description: 'Visibilidad, conversaciones y acceso al ecosistema técnico y ejecutivo.',
        items: ['Stand y presencia de marca', 'Charlas y keynote según tier', 'Networking, leads y comunidad'],
      },
      {
        key: 'consulting',
        eyebrow: 'TRANSFORM',
        title: 'X-Ops Consulting',
        description: 'Assessments y activaciones técnicas sobre problemas reales de la organización.',
        items: [
          'AI, AIOps, MLOps, agentes y LLM',
          'Automatización e integración de workflows',
          'Enterprise Knowledge Intelligence',
          'DevOps, Platform Engineering y DevSecOps',
          'Cloud, observabilidad y arquitectura',
          'vCISO, ISO 27001, ENS, GRC y auditorías',
        ],
      },
      {
        key: 'media',
        eyebrow: 'AMPLIFY',
        title: 'X-Ops Media',
        description: 'Contenido que extiende la conversación del sponsor más allá de los días del evento.',
        items: [
          'Entrevistas ejecutivas o técnicas',
          'Technology briefings',
          'Content repurposing de charlas',
          'Clips y piezas para distribución digital',
        ],
      },
      {
        key: 'grayback',
        eyebrow: 'SECURE',
        title: 'X-Ops BugBounty by Grayback',
        description: 'Seguridad ofensiva gestionada como beneficio incluido desde Gold.',
        items: [
          'Programa gestionado por Grayback',
          'Triaje y validación técnica',
          'Scope y condiciones definidos con el sponsor',
        ],
      },
    ],
    creditsTitle: 'X-Ops Ecosystem Credits',
    creditsSubtitle:
      'Gold, Track Sponsor y Platinum pueden elegir activaciones de Consulting o Media según sus prioridades. Silver recibe un Technology Scorecard específico; Virtual mantiene sus beneficios digitales sin créditos adicionales.',
    tiers: [
      { name: 'VIRTUAL-ONLY', value: '0', label: 'credits', note: 'Beneficios digitales incluidos' },
      { name: 'SILVER', value: 'SCORECARD', label: '', note: 'X-Ops Technology Scorecard' },
      { name: 'GOLD', value: '1', label: 'credit', note: 'Activación elegible' },
      { name: 'TRACK SPONSOR', value: '2', label: 'credits', note: 'Activaciones elegibles' },
      { name: 'PLATINUM', value: '4', label: 'credits', note: 'Máxima flexibilidad de activación' },
    ],
    examplesTitle: 'Ejemplos de activaciones',
    examples: [
      'Automation Opportunity Scan',
      'AI & Agent Readiness Assessment',
      'Enterprise Knowledge Intelligence Assessment',
      'AIOps / MLOps / DevSecOps Health Check',
      'Cloud, Platform & Observability Review',
      'vCISO / ISO 27001 / ENS Readiness Session',
      'Grayback Remediation Clinic',
      'X-Ops Media Interview & Content Repurposing',
    ],
    scopeNote:
      'Los créditos cubren assessments, workshops, blueprints y proofs of value con alcance definido. No sustituyen proyectos completos de implementación, auditorías de certificación ni servicios abiertos sin límite de horas.',
    cta: 'Hablar sobre patrocinio',
  },
  en: {
    prefix: 'Ecosystem benefits',
    title: 'Your sponsorship activates capabilities, not just visibility.',
    subtitle:
      'X-Ops combines Conference, Consulting, Media and offensive security so partners receive value before, during and after the event. Activations are scoped and aligned with each sponsorship tier.',
    pillars: [
      {
        key: 'conference',
        eyebrow: 'CONNECT',
        title: 'X-Ops Conference',
        description: 'Visibility, conversations and access to the technical and executive ecosystem.',
        items: ['Booth and brand presence', 'Talks and keynote by tier', 'Networking, leads and community'],
      },
      {
        key: 'consulting',
        eyebrow: 'TRANSFORM',
        title: 'X-Ops Consulting',
        description: 'Assessments and technical activations focused on real organisational challenges.',
        items: [
          'AI, AIOps, MLOps, agents and LLMs',
          'Workflow automation and integration',
          'Enterprise Knowledge Intelligence',
          'DevOps, Platform Engineering and DevSecOps',
          'Cloud, observability and architecture',
          'vCISO, ISO 27001, ENS, GRC and audits',
        ],
      },
      {
        key: 'media',
        eyebrow: 'AMPLIFY',
        title: 'X-Ops Media',
        description: 'Content that extends the sponsor conversation beyond the event dates.',
        items: [
          'Executive or technical interviews',
          'Technology briefings',
          'Talk content repurposing',
          'Short-form clips and digital distribution assets',
        ],
      },
      {
        key: 'grayback',
        eyebrow: 'SECURE',
        title: 'X-Ops BugBounty by Grayback',
        description: 'Managed offensive security included as a sponsor benefit from Gold upwards.',
        items: [
          'Program managed by Grayback',
          'Triage and technical validation',
          'Scope and terms defined with the sponsor',
        ],
      },
    ],
    creditsTitle: 'X-Ops Ecosystem Credits',
    creditsSubtitle:
      'Gold, Track Sponsor and Platinum can choose Consulting or Media activations according to their priorities. Silver receives a dedicated Technology Scorecard; Virtual keeps its digital benefits without additional credits.',
    tiers: [
      { name: 'VIRTUAL-ONLY', value: '0', label: 'credits', note: 'Digital benefits included' },
      { name: 'SILVER', value: 'SCORECARD', label: '', note: 'X-Ops Technology Scorecard' },
      { name: 'GOLD', value: '1', label: 'credit', note: 'Eligible activation' },
      { name: 'TRACK SPONSOR', value: '2', label: 'credits', note: 'Eligible activations' },
      { name: 'PLATINUM', value: '4', label: 'credits', note: 'Maximum activation flexibility' },
    ],
    examplesTitle: 'Activation examples',
    examples: [
      'Automation Opportunity Scan',
      'AI & Agent Readiness Assessment',
      'Enterprise Knowledge Intelligence Assessment',
      'AIOps / MLOps / DevSecOps Health Check',
      'Cloud, Platform & Observability Review',
      'vCISO / ISO 27001 / ENS Readiness Session',
      'Grayback Remediation Clinic',
      'X-Ops Media Interview & Content Repurposing',
    ],
    scopeNote:
      'Credits cover scoped assessments, workshops, blueprints and proofs of value. They do not replace full implementation projects, certification audits or open-ended services with unlimited hours.',
    cta: 'Discuss sponsorship',
  },
};

const SponsorEcosystemBenefits = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.toLowerCase().startsWith('en') ? 'en' : 'es';
  const content = copy[language];

  return (
    <section className="sponsor-ecosystem" aria-labelledby="sponsor-ecosystem-heading">
      <div className="sponsor-ecosystem__container">
        <AnimationWrapper animation="fade-up" duration={900}>
          <header className="sponsor-ecosystem__header">
            <span className="sponsor-ecosystem__prefix">// {content.prefix}</span>
            <h2 id="sponsor-ecosystem-heading" className="sponsor-ecosystem__title">
              {content.title}
            </h2>
            <p className="sponsor-ecosystem__subtitle">{content.subtitle}</p>
          </header>
        </AnimationWrapper>

        <div className="sponsor-ecosystem__pillars">
          {content.pillars.map((pillar, index) => (
            <AnimationWrapper key={pillar.key} animation="fade-up" duration={800 + index * 100}>
              <article className={`sponsor-ecosystem__pillar sponsor-ecosystem__pillar--${pillar.key}`}>
                <span className="sponsor-ecosystem__eyebrow">{pillar.eyebrow}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>
                      <BsCheckCircleFill aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </AnimationWrapper>
          ))}
        </div>

        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="sponsor-ecosystem__credits">
            <div className="sponsor-ecosystem__credits-copy">
              <span className="sponsor-ecosystem__prefix">// FLEXIBLE ACTIVATION</span>
              <h3>{content.creditsTitle}</h3>
              <p>{content.creditsSubtitle}</p>
            </div>

            <div className="sponsor-ecosystem__tier-grid">
              {content.tiers.map((tier) => (
                <div key={tier.name} className={`sponsor-ecosystem__tier sponsor-ecosystem__tier--${tier.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="sponsor-ecosystem__tier-name">{tier.name}</span>
                  <div className="sponsor-ecosystem__tier-value">
                    <strong>{tier.value}</strong>
                    {tier.label && <span>{tier.label}</span>}
                  </div>
                  <small>{tier.note}</small>
                </div>
              ))}
            </div>

            <div className="sponsor-ecosystem__activation-wrap">
              <div>
                <h4>{content.examplesTitle}</h4>
                <div className="sponsor-ecosystem__activation-list">
                  {content.examples.map((example) => (
                    <span key={example}>{example}</span>
                  ))}
                </div>
              </div>
              <p className="sponsor-ecosystem__scope-note">{content.scopeNote}</p>
            </div>

            <a
              className="sponsor-ecosystem__cta"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('X-Ops 2026 Sponsorship')}`}
            >
              {content.cta}
            </a>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};

export default SponsorEcosystemBenefits;
