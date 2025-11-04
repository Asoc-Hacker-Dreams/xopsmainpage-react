import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { getAllSpeakers, getSpeakersByTrack, getAllTracks } from '../services/speakerDAL';
import AnimationWrapper from '../components/AnimationWrapper';

const SpeakersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [speakers, setSpeakers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const selectedTrack = searchParams.get('track') || '';

  useEffect(() => {
    // Load tracks
    const allTracks = getAllTracks();
    setTracks(allTracks);

    // Load speakers based on selected track
    if (selectedTrack) {
      setSpeakers(getSpeakersByTrack(selectedTrack));
    } else {
      setSpeakers(getAllSpeakers());
    }
  }, [selectedTrack]);

  const handleTrackChange = (event) => {
    const track = event.target.value;
    if (track) {
      setSearchParams({ track });
    } else {
      setSearchParams({});
    }
  };

  const getImagePath = (image) => {
    if (!image) return '/src/assets/speakers/xops.png';
    return `/src/assets/speakers/${image}`;
  };

  const trackLabels = {
    main: 'Principal',
    hyperscalers: 'Hyperscalers',
    bsides: 'BSides Madrid'
  };

  return (
    <>
      <Helmet>
        <title>Ponentes - X-Ops Conference Madrid 2025</title>
        <meta name="description" content="Conoce a todos los ponentes de la X-Ops Conference Madrid 2025. Expertos en DevOps, DevSecOps, AIOps y MLOps compartiendo sus conocimientos." />
        <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Ponentes, Speakers, Conferencia Tecnología Madrid" />
        <meta property="og:title" content="Ponentes - X-Ops Conference Madrid 2025" />
        <meta property="og:description" content="Conoce a todos los ponentes de la X-Ops Conference Madrid 2025." />
        <meta property="og:url" content="https://xopsconference.com/speakers" />
      </Helmet>

      <section className="speakers-list-section">
        <Container className="margin-top">
          <AnimationWrapper animation="fade-up" duration={800}>
            <h1 className="text-center mb-4">Nuestros Ponentes</h1>
            <p className="text-center lead mb-5">
              Conoce a los expertos que compartirán sus conocimientos en la X-Ops Conference Madrid 2025
            </p>
          </AnimationWrapper>

          {/* Track Filter */}
          <Row className="mb-4">
            <Col md={6} className="mx-auto">
              <Form.Group>
                <Form.Label><strong>Filtrar por track:</strong></Form.Label>
                <Form.Select 
                  value={selectedTrack} 
                  onChange={handleTrackChange}
                  aria-label="Filtrar ponentes por track"
                >
                  <option value="">Todos los tracks</option>
                  {tracks.map(track => (
                    <option key={track} value={track}>
                      {trackLabels[track] || track}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Speakers Grid */}
          <Row>
            {speakers.length === 0 ? (
              <Col>
                <p className="text-center text-muted">No se encontraron ponentes para este track.</p>
              </Col>
            ) : (
              speakers.map((speaker, index) => (
                <Col key={speaker.id} md={6} lg={4} className="mb-4">
                  <AnimationWrapper animation="fade-up" duration={800} delay={index * 50}>
                    <Card className="h-100 speaker-card">
                      <Card.Img 
                        variant="top" 
                        src={getImagePath(speaker.image)} 
                        alt={speaker.name}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{speaker.name}</Card.Title>
                        {speaker.title && (
                          <Card.Subtitle className="mb-2 text-muted">
                            {speaker.title}
                            {speaker.company && ` @ ${speaker.company}`}
                          </Card.Subtitle>
                        )}
                        {speaker.bio && (
                          <Card.Text className="flex-grow-1">
                            {speaker.bio.length > 150 
                              ? `${speaker.bio.substring(0, 150)}...` 
                              : speaker.bio}
                          </Card.Text>
                        )}
                        <div className="mt-2">
                          <p className="text-muted mb-2">
                            <small>{speaker.talks.length} charla{speaker.talks.length !== 1 ? 's' : ''}</small>
                          </p>
                          <Link 
                            to={`/speakers/${speaker.slug}`} 
                            className="btn btn-primary btn-sm"
                          >
                            Ver perfil
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </AnimationWrapper>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SpeakersList;
