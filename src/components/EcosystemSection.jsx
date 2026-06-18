import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';

const FeatureItem = ({ label, desc }) => (
  <li style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
    <span style={{ color: '#00BCD4', flexShrink: 0, marginTop: '2px', fontSize: '0.8rem' }}>▸</span>
    <span style={{ fontSize: '0.875rem', color: '#b8c5d6' }}>
      <strong style={{ color: '#e0e0e0' }}>{label}</strong> — {desc}
    </span>
  </li>
);

const EventCard = ({ badge, title, description, features, audience, audienceLabel, cta, to, animDir }) => (
  <AnimationWrapper animation={`fade-${animDir}`} duration={1200}>
    <div style={{
      background: '#16213e',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid #2a2a4a',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <span style={{ color: '#00BCD4', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
        // {title}
      </span>

      <span style={{
        display: 'inline-block',
        background: 'rgba(0,188,212,0.12)',
        color: '#00BCD4',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '20px',
        alignSelf: 'flex-start',
      }}>
        {badge}
      </span>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '24px', flex: 1 }}>
        {description}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
        {features.map((f, i) => (
          <FeatureItem key={i} label={f.label} desc={f.desc} />
        ))}
      </ul>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#636e7b', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{audienceLabel}</p>
        <p style={{ color: '#8892a0', fontSize: '0.8rem' }}>{audience}</p>
      </div>

      <Link
        to={to}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#FFD600',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          letterSpacing: '0.04em',
        }}
      >
        {cta} <span style={{ fontSize: '0.8rem' }}>→</span>
      </Link>
    </div>
  </AnimationWrapper>
);

const EcosystemSection = () => {
  const { t } = useTranslation();

  const conferenceFeatures = [
    { label: t('ecosystem.conference.features.talks.label'), desc: t('ecosystem.conference.features.talks.desc') },
    { label: t('ecosystem.conference.features.community.label'), desc: t('ecosystem.conference.features.community.desc') },
    { label: t('ecosystem.conference.features.workshops.label'), desc: t('ecosystem.conference.features.workshops.desc') },
  ];

  const summitFeatures = [
    { label: t('ecosystem.summit.features.strategic.label'), desc: t('ecosystem.summit.features.strategic.desc') },
    { label: t('ecosystem.summit.features.networking.label'), desc: t('ecosystem.summit.features.networking.desc') },
    { label: t('ecosystem.summit.features.cases.label'), desc: t('ecosystem.summit.features.cases.desc') },
  ];

  return (
    <section id="ecosistema" style={{ background: '#0A0F2E', padding: '80px 0 60px' }}>
      <div className="container">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="text-center mb-5">
            <span style={{ color: '#00BCD4', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              // {t('ecosystem.sectionPrefix')}
            </span>
            <h2 style={{ color: '#ffffff', fontWeight: 800, marginTop: '12px', marginBottom: '16px', fontSize: '2rem' }}>
              {t('ecosystem.title')}
            </h2>
            <p style={{ color: '#8892a0', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              {t('ecosystem.subtitle')}
            </p>
          </div>
        </AnimationWrapper>

        <div className="row justify-content-center g-4">
          <div className="col-lg-5 col-md-6">
            <EventCard
              badge={t('ecosystem.conference.badge')}
              title={t('ecosystem.conference.title')}
              description={t('ecosystem.conference.description')}
              features={conferenceFeatures}
              audience={t('ecosystem.conference.audience')}
              audienceLabel={t('ecosystem.audienceLabel')}
              cta={t('ecosystem.conference.cta')}
              to="/#events"
              animDir="right"
            />
          </div>
          <div className="col-lg-5 col-md-6">
            <EventCard
              badge={t('ecosystem.summit.badge')}
              title={t('ecosystem.summit.title')}
              description={t('ecosystem.summit.description')}
              features={summitFeatures}
              audience={t('ecosystem.summit.audience')}
              audienceLabel={t('ecosystem.audienceLabel')}
              cta={t('ecosystem.summit.cta')}
              to="/summit"
              animDir="left"
            />
          </div>
        </div>

        <AnimationWrapper animation="fade-up" duration={1200}>
          <p style={{
            textAlign: 'center',
            color: '#636e7b',
            fontStyle: 'italic',
            fontSize: '0.875rem',
            marginTop: '48px',
            maxWidth: '680px',
            margin: '48px auto 0',
          }}>
            {t('ecosystem.tagline')}
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
};

export default EcosystemSection;
