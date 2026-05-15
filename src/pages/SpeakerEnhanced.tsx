import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSpeakers } from '../hooks/useSpeakers';
import { useAgenda } from '../hooks/useAgenda';
import ShareButtons from '../components/ShareButtons';
import SEOEnhanced from '../components/SEOEnhanced';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const SpeakerPageEnhanced: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { speakers, loading: speakersLoading } = useSpeakers();
  const { talks, loading: talksLoading } = useAgenda();
  const { trackSpeakerView } = useAnalyticsEvents();

  const speaker = speakers.find(s => s.id === id);
  const speakerTalks = talks.filter(t => t.speakerIds?.includes(id || ''));

  useEffect(() => {
    if (speaker && id) {
      trackSpeakerView(id, speaker.name);
    }
  }, [speaker, id, trackSpeakerView]);

  if (speakersLoading || talksLoading) {
    return <div className="container py-5 text-center">Cargando…</div>;
  }

  if (!speaker) {
    return (
      <div className="container py-5 text-center">
        <h2>Ponente no encontrado</h2>
        <Link to="/agenda">Volver a la agenda</Link>
      </div>
    );
  }

  const shareUrl = `https://xopsconference.com/speaker/${id}`;
  const shareTitle = `${speaker.name} en X-Ops Conference 2026`;

  return (
    <>
      <SEOEnhanced
        title={speaker.name}
        description={speaker.bio || `${speaker.name} - ${speaker.role} en ${speaker.company}`}
        path={`/speaker/${id}`}
        image={speaker.photoUrl || 'https://xopsconference.com/assets/og-speaker.jpg'}
        imageAlt={`${speaker.name} - X-Ops Conference 2026`}
        ogType="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: speaker.name,
          jobTitle: speaker.role,
          worksFor: {
            '@type': 'Organization',
            name: speaker.company,
          },
          description: speaker.bio,
          image: speaker.photoUrl,
          sameAs: [
            speaker.social?.twitter && `https://twitter.com/${speaker.social.twitter}`,
            speaker.social?.linkedin,
            speaker.social?.github && `https://github.com/${speaker.social.github}`,
          ].filter(Boolean),
        }}
      />

      <section className="container py-5">
        <Link to="/agenda" className="btn btn-outline-secondary btn-sm mb-3">← Volver a la agenda</Link>

        <div className="row">
          <div className="col-md-4 text-center">
            {speaker.photoUrl ? (
              <img 
                src={speaker.photoUrl} 
                alt={speaker.name} 
                className="img-fluid rounded-circle mb-3" 
                style={{ maxWidth: 250 }} 
              />
            ) : (
              <div className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 200, height: 200 }}>
                <span className="text-white display-4">{speaker.name.charAt(0)}</span>
              </div>
            )}

            <div className="mt-3">
              <p className="text-muted small mb-2">Compartir perfil</p>
              <ShareButtons
                url={shareUrl}
                title={shareTitle}
                description={speaker.bio}
                variant="icons"
                size="sm"
              />
            </div>
          </div>
          <div className="col-md-8">
            <h2>{speaker.name}</h2>
            {speaker.role && <p className="text-muted">{speaker.role}</p>}
            {speaker.company && <p><strong>{speaker.company}</strong></p>}
            {speaker.bio && <p>{speaker.bio}</p>}

            {speaker.social && (
              <div className="mb-3">
                <h5>Redes Sociales</h5>
                <div className="d-flex flex-wrap gap-2">
                  {speaker.social.twitter && (
                    <a 
                      href={`https://twitter.com/${speaker.social.twitter}`} 
                      className="btn btn-outline-primary btn-sm"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Twitter (@{speaker.social.twitter})
                    </a>
                  )}
                  {speaker.social.linkedin && (
                    <a 
                      href={speaker.social.linkedin} 
                      className="btn btn-outline-primary btn-sm"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {speaker.social.github && (
                    <a 
                      href={`https://github.com/${speaker.social.github}`} 
                      className="btn btn-outline-dark btn-sm"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {speaker.social.web && (
                    <a 
                      href={speaker.social.web} 
                      className="btn btn-outline-secondary btn-sm"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Web
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {speakerTalks.length > 0 && (
          <>
            <h3 className="mt-4">Charlas</h3>
            <div className="list-group">
              {speakerTalks.map(talk => (
                <div key={talk.id} className="list-group-item">
                  <h5>{talk.title}</h5>
                  <p className="text-muted mb-1">
                    📅 {talk.day} | 🕐 {talk.startTime}–{talk.endTime} | 📍 {talk.room}
                  </p>
                  {talk.description && <p className="small mb-0">{talk.description.slice(0, 300)}…</p>}
                  
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <span className="text-muted small">Compartir charla:</span>
                    <ShareButtons
                      url={`https://xopsconference.com/agenda#${talk.id}`}
                      title={`${talk.title} - X-Ops Conference`}
                      description={talk.description}
                      hashtags={['XOps', talk.track]}
                      variant="icons"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default SpeakerPageEnhanced;
