import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSpeakers } from '../hooks/useSpeakers';
import AnimationWrapper from './AnimationWrapper';

const SpeakersSection: React.FC = () => {
  const { speakers, loading } = useSpeakers();

  return (
    <>
      <Helmet>
        <title>Conoce a los Ponentes de la X-Ops Conference Madrid 2025</title>
        <meta name="description" content="Descubre a los expertos que compartirán sus conocimientos en DevOps, DevSecOps, AIOps y MLOps en la X-Ops Conference Madrid 2025." />
      </Helmet>

      <section id="ponentes" className="speaker-section">
        <div className="container margin-top">
          <h2 className="text-center">Conoce a Nuestros Ponentes</h2>

          {loading ? (
            <p className="text-center mt-4">Cargando ponentes…</p>
          ) : (
            <div className="speaker-cards margin-top">
              {speakers.map(speaker => (
                <div key={speaker.id} className="speaker1 d-flex justify-around margin-top">
                  <div className="speaker-img">
                    <AnimationWrapper animation="fade-left" duration={1500}>
                      {speaker.photoUrl ? (
                        <img src={speaker.photoUrl} alt={speaker.name} style={{ height: 250, width: 280 }} />
                      ) : (
                        <div
                          className="bg-secondary d-flex align-items-center justify-content-center"
                          style={{ height: 250, width: 280, fontSize: '4rem', color: '#fff' }}
                        >
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                    </AnimationWrapper>
                  </div>
                  <div className="speaker-content">
                    <AnimationWrapper animation="fade-right" duration={1500}>
                      <h3>
                        <Link to={`/speaker/${speaker.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {speaker.name}
                        </Link>
                      </h3>
                      {speaker.role && <p>{speaker.role}{speaker.company ? ` – ${speaker.company}` : ''}</p>}
                      {speaker.bio && <p>{speaker.bio}</p>}
                    </AnimationWrapper>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SpeakersSection;
