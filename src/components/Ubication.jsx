import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';

const VenueBlock = ({ label, name, address }) => (
  <div style={{ marginBottom: '8px' }}>
    <p style={{ color: '#00BCD4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
    <p style={{ color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{name}</p>
    <p style={{ color: '#636e7b', fontSize: '0.8rem', margin: 0 }}>{address}</p>
  </div>
);

function Ubication() {
  const { t } = useTranslation();

  return (
    <section id="ubicacion" style={{ background: '#0f0f1a', padding: '80px 0 60px' }}>
      <div className="container">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="text-center mb-5">
            <span style={{ color: '#00BCD4', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              // {t('ubication.sectionPrefix')}
            </span>
            <h2 style={{ color: '#ffffff', fontWeight: 800, marginTop: '12px', marginBottom: '16px', fontSize: '2rem' }}>
              {t('ubication.title')}
            </h2>
            <p style={{ color: '#8892a0', maxWidth: '540px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              {t('ubication.subtitle')}
            </p>
          </div>
        </AnimationWrapper>

        {/* Madrid dates and venues are no longer valid. */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div style={{ background: '#16213e', borderRadius: '12px', border: '1px solid #00BCD4', padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800 }}>{t('announcement.status')}</h3>
              <p style={{ color: '#bdc9d6', marginBottom: '12px' }}>{t('announcement.venue')}</p>
              <a href="https://madrid.xopsconference.com/" style={{ color: '#70eaf5', fontWeight: 700 }}>
                {t('announcement.ctaMadrid')}
              </a>
            </div>
          </div>
        </div>

        {/* Dubai */}
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.6rem' }}>🇦🇪</span>
            <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('ubication.dubai.city')}</h3>
          </div>
        </AnimationWrapper>

        <div className="row g-4">
          <div className="col-md-6">
            <AnimationWrapper animation="fade-right" duration={1200}>
              <div style={{
                background: '#16213e',
                borderRadius: '12px',
                border: '1px solid #2a2a4a',
                padding: '32px',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <VenueBlock
                  label={t('ubication.dubai.label')}
                  name={t('ubication.dubai.name')}
                  address={t('ubication.dubai.address')}
                />
                <p style={{ color: '#636e7b', fontSize: '0.82rem', fontStyle: 'italic', marginTop: '20px', marginBottom: 0 }}>
                  {t('ubication.dubai.tbdNote')}
                </p>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ubication;
