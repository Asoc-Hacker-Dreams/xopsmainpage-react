import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { getSpeaker } from '../services/speakerDAL';
import AnimationWrapper from '../components/AnimationWrapper';
import '../styles/Speakers.css';

const SpeakerDetail = () => {
  const { slug } = useParams();
  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    const speakerData = getSpeaker(slug);
    setSpeaker(speakerData);
  }, [slug]);

  if (!speaker) {
    return (
      <Container className="margin-top">
        <AnimationWrapper animation="fade-up" duration={800}>
          <div className="text-center">
            <h2>Ponente no encontrado</h2>
            <p className="lead">El ponente que buscas no existe o ha sido eliminado.</p>
            <Link to="/speakers" className="btn btn-primary">
              Ver todos los ponentes
            </Link>
          </div>
        </AnimationWrapper>
      </Container>
    );
  }

  const getImagePath = (image) => {
    if (!image) return '/src/assets/speakers/xops.png';
    return `/src/assets/speakers/${image}`;
  };

  const trackLabels = {
    main: 'Principal',
    hyperscalers: 'Hyperscalers',
    bsides: 'BSides Madrid'
  };

  // Generate JSON-LD schema.org Person markup
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": speaker.name,
    "jobTitle": speaker.title || undefined,
    "worksFor": speaker.company ? {
      "@type": "Organization",
      "name": speaker.company
    } : undefined,
    "description": speaker.bio || undefined,
    "image": speaker.image ? `https://xopsconference.com/src/assets/speakers/${speaker.image}` : undefined,
    "sameAs": speaker.social ? Object.values(speaker.social).filter(Boolean) : undefined,
    "performerIn": speaker.talks.map(talk => ({
      "@type": "Event",
      "name": talk.title,
      "description": talk.description,
      "startDate": talk.timeISO,
      "duration": `PT${talk.durationMinutes}M`,
      "location": {
        "@type": "Place",
        "name": talk.room
      },
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled"
    }))
  };

  return (
    <>
      <Helmet>
        <title>{speaker.name} - Ponente X-Ops Conference Madrid 2025</title>
        <meta name="description" content={speaker.bio || `Conoce a ${speaker.name}, ponente en la X-Ops Conference Madrid 2025.`} />
        <meta name="keywords" content={`${speaker.name}, X-Ops, DevOps, DevSecOps, AIOps, MLOps, Ponente, Speaker`} />
        <meta property="og:title" content={`${speaker.name} - X-Ops Conference Madrid 2025`} />
        <meta property="og:description" content={speaker.bio || `Conoce a ${speaker.name}, ponente en la X-Ops Conference Madrid 2025.`} />
        <meta property="og:url" content={`https://xopsconference.com/speakers/${speaker.slug}`} />
        {speaker.image && (
          <meta property="og:image" content={`https://xopsconference.com/src/assets/speakers/${speaker.image}`} />
        )}
        
        {/* JSON-LD Schema.org Person markup */}
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <section className="speaker-detail-section">
        <Container className="margin-top">
          {/* Back button */}
          <AnimationWrapper animation="fade-up" duration={600}>
            <Link to="/speakers" className="btn btn-outline-secondary mb-4">
              ← Volver a ponentes
            </Link>
          </AnimationWrapper>

          {/* Speaker Info */}
          <Row className="mb-5">
            <Col md={4}>
              <AnimationWrapper animation="fade-right" duration={800}>
                <img 
                  src={getImagePath(speaker.image)} 
                  alt={speaker.name}
                  className="img-fluid rounded shadow"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
              </AnimationWrapper>
            </Col>
            <Col md={8}>
              <AnimationWrapper animation="fade-left" duration={800}>
                <h1 className="mb-3">{speaker.name}</h1>
                {speaker.title && (
                  <h4 className="text-muted mb-3">
                    {speaker.title}
                    {speaker.company && (
                      <span className="ms-2">
                        @ <strong>{speaker.company}</strong>
                      </span>
                    )}
                  </h4>
                )}
                
                {speaker.bio && (
                  <div className="mb-4">
                    <h5>Biografía</h5>
                    <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                      {speaker.bio}
                    </p>
                  </div>
                )}

                {speaker.social && Object.keys(speaker.social).length > 0 && (
                  <div className="mb-3">
                    <h5>Redes Sociales</h5>
                    <div className="d-flex gap-3">
                      {speaker.social.twitter && (
                        <a href={speaker.social.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                          Twitter
                        </a>
                      )}
                      {speaker.social.linkedin && (
                        <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                          LinkedIn
                        </a>
                      )}
                      {speaker.social.github && (
                        <a href={speaker.social.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                          GitHub
                        </a>
                      )}
                      {speaker.social.website && (
                        <a href={speaker.social.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </AnimationWrapper>
            </Col>
          </Row>

          {/* Speaker's Talks */}
          <AnimationWrapper animation="fade-up" duration={800}>
            <h2 className="mb-4">
              Charlas ({speaker.talks.length})
            </h2>
          </AnimationWrapper>

          <Row>
            {speaker.talks.map((talk, index) => (
              <Col key={talk.id} md={12} className="mb-4">
                <AnimationWrapper animation="fade-up" duration={800} delay={index * 100}>
                  <Card className="talk-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <Badge bg="primary" className="me-2">
                            {trackLabels[talk.track] || talk.track}
                          </Badge>
                          <Badge bg="secondary">
                            {talk.type}
                          </Badge>
                        </div>
                        <div className="text-end text-muted">
                          <small>
                            <strong>{new Date(talk.startTime).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</strong>
                            <br />
                            {new Date(talk.startTime).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {talk.durationHuman}
                            <br />
                            {talk.room}
                          </small>
                        </div>
                      </div>
                      
                      <Card.Title as="h4">{talk.title}</Card.Title>
                      
                      <Card.Text style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                        {talk.description}
                      </Card.Text>

                      {talk.speakers.length > 1 && (
                        <div className="mt-3">
                          <small className="text-muted">
                            <strong>Co-ponentes:</strong>{' '}
                            {talk.speakers.filter(s => s !== speaker.name).join(', ')}
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </AnimationWrapper>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SpeakerDetail;
