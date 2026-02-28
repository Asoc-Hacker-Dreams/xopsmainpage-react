import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSpeakers } from '../hooks/useSpeakers';
import { useAgenda } from '../hooks/useAgenda';

const SpeakerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { speakers, loading: speakersLoading } = useSpeakers();
  const { talks, loading: talksLoading } = useAgenda();

  const speaker = speakers.find(s => s.id === id);
  const speakerTalks = talks.filter(t => t.speakerIds?.includes(id || ''));

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

  return (
    <>
      <Helmet>
        <title>{speaker.name} – X-Ops Conference Madrid 2025</title>
        <meta name="description" content={`Perfil de ${speaker.name} en la X-Ops Conference Madrid 2025.`} />
      </Helmet>

      <section className="container py-5">
        <Link to="/agenda" className="btn btn-outline-secondary btn-sm mb-3">← Volver a la agenda</Link>

        <div className="row">
          <div className="col-md-4 text-center">
            {speaker.photoUrl ? (
              <img src={speaker.photoUrl} alt={speaker.name} className="img-fluid rounded-circle mb-3" style={{ maxWidth: 250 }} />
            ) : (
              <div className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 200, height: 200 }}>
                <span className="text-white display-4">{speaker.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <h2>{speaker.name}</h2>
            {speaker.role && <p className="text-muted">{speaker.role}</p>}
            {speaker.company && <p><strong>{speaker.company}</strong></p>}
            {speaker.bio && <p>{speaker.bio}</p>}

            {speaker.social && (
              <div className="mb-3">
                {speaker.social.twitter && <a href={`https://twitter.com/${speaker.social.twitter}`} className="me-3" target="_blank" rel="noreferrer">Twitter</a>}
                {speaker.social.linkedin && <a href={speaker.social.linkedin} className="me-3" target="_blank" rel="noreferrer">LinkedIn</a>}
                {speaker.social.github && <a href={`https://github.com/${speaker.social.github}`} className="me-3" target="_blank" rel="noreferrer">GitHub</a>}
                {speaker.social.web && <a href={speaker.social.web} target="_blank" rel="noreferrer">Web</a>}
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
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default SpeakerPage;
