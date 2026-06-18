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

        {/* Madrid */}
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.6rem' }}>🇪🇸</span>
            <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{t('ubication.madrid.city')}</h3>
          </div>
        </AnimationWrapper>

        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <AnimationWrapper animation="fade-right" duration={1200}>
              <div style={{ background: '#16213e', borderRadius: '12px', border: '1px solid #2a2a4a', overflow: 'hidden', height: '100%' }}>
                <div style={{ padding: '20px 20px 16px' }}>
                  <VenueBlock
                    label={t('ubication.madrid.summit.label')}
                    name={t('ubication.madrid.summit.name')}
                    address={t('ubication.madrid.summit.address')}
                  />
                </div>
                <iframe
                  src="https://maps.google.com/maps?q=Fundaci%C3%B3n+Juan+XXIII+Roncalli+Madrid&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fundación Juan XXIII Roncalli, Madrid"
                />
              </div>
            </AnimationWrapper>
          </div>

          <div className="col-md-6">
            <AnimationWrapper animation="fade-left" duration={1200}>
              <div style={{ background: '#16213e', borderRadius: '12px', border: '1px solid #2a2a4a', overflow: 'hidden', height: '100%' }}>
                <div style={{ padding: '20px 20px 16px' }}>
                  <VenueBlock
                    label={t('ubication.madrid.conference.label')}
                    name={t('ubication.madrid.conference.name')}
                    address={t('ubication.madrid.conference.address')}
                  />
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.6529659675674!2d-3.8775690232329794!3d40.335414571434226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418fc5ceff7897%3A0x811e3f75ccc3b6fb!2sUniversidad%20Rey%20Juan%20Carlos%2C%20Campus%20de%20M%C3%B3stoles!5e0!3m2!1ses!2ses!4v1737632400000!5m2!1ses!2ses"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Universidad Rey Juan Carlos, Campus Móstoles"
                />
              </div>
            </AnimationWrapper>
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
