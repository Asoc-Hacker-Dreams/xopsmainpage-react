import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import AnimationWrapper from '../components/AnimationWrapper';
import sponsorsData from '../data/sponsorsData.json';

/**
 * SponsorMicrosite Component
 * 
 * Individual microsite page for sponsors with optimized images
 * and Core Web Vitals performance optimizations.
 * 
 * Features:
 * - AVIF/WebP image support
 * - Lazy loading for below-fold content
 * - Priority loading for hero images
 * - SEO optimizations
 * - Responsive design
 */
const SponsorMicrosite = () => {
  const { sponsorId } = useParams();
  
  // Find sponsor by ID
  const sponsor = sponsorsData.sponsors.find(s => s.id === parseInt(sponsorId, 10));

  if (!sponsor) {
    return (
      <Container className="py-5">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="text-center">
            <h1>Patrocinador no encontrado</h1>
            <p>El patrocinador que buscas no existe.</p>
            <Link to="/Sponsor" className="btn btn-primary">
              Ver todos los patrocinadores
            </Link>
          </div>
        </AnimationWrapper>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`${sponsor.name} - Patrocinador X-Ops Conference`}
        description={`${sponsor.description} - Patrocinador ${sponsor.tier} de X-Ops Conference Madrid 2025`}
        path={`/sponsor/${sponsorId}`}
        image={sponsor.logo}
        lang="es"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": sponsor.name,
          "url": sponsor.website,
          "logo": sponsor.logo,
          "description": sponsor.description
        }}
      />

      {/* Hero Section */}
      <section className="sponsor-hero bg-light py-5">
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <OptimizedImage
                  src={sponsor.logo}
                  alt={`Logo de ${sponsor.name}`}
                  width={300}
                  height={200}
                  priority={true}
                  loading="eager"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Col>
              <Col md={8}>
                <h1 className="display-4 mb-3">{sponsor.name}</h1>
                <p className="lead">{sponsor.description}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className={`badge bg-${getTierBadgeColor(sponsor.tier)} fs-6`}>
                    {sponsor.tier}
                  </span>
                  <Button
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="lg"
                  >
                    Visitar sitio web
                  </Button>
                </div>
              </Col>
            </Row>
          </AnimationWrapper>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <Row>
              <Col lg={8} className="mx-auto">
                <h2 className="mb-4">Sobre {sponsor.name}</h2>
                <p className="lead">
                  {sponsor.description}
                </p>
                <p>
                  Como patrocinador {sponsor.tier} de X-Ops Conference Madrid 2025, 
                  {sponsor.name} está comprometido con la innovación y el avance de las 
                  prácticas DevOps, DevSecOps y tecnologías emergentes en la comunidad.
                </p>
              </Col>
            </Row>
          </AnimationWrapper>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="bg-light py-5">
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <h2 className="text-center mb-5">Beneficios de patrocinar X-Ops Conference</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="h5">Visibilidad</h3>
                    <p>
                      Exposición ante cientos de profesionales de tecnología y líderes de la industria.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="h5">Networking</h3>
                    <p>
                      Conexión directa con la comunidad tech más activa de España y Europa.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="h5">Liderazgo</h3>
                    <p>
                      Posicionamiento como referente en innovación y transformación digital.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </AnimationWrapper>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <div className="text-center">
              <h2 className="mb-4">¿Interesado en patrocinar?</h2>
              <p className="lead mb-4">
                Únete a {sponsor.name} y otros líderes de la industria como patrocinador de X-Ops Conference.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/Sponsor#patrocinio" className="btn btn-primary btn-lg">
                  Ver opciones de patrocinio
                </Link>
                <Button
                  href="mailto:info@xopsconference.com"
                  variant="outline-primary"
                  size="lg"
                >
                  Contactar
                </Button>
              </div>
            </div>
          </AnimationWrapper>
        </Container>
      </section>
    </>
  );
};

// Helper function to get badge color based on tier
const getTierBadgeColor = (tier) => {
  const colors = {
    'platinum': 'primary',
    'track sponsor': 'info',
    'gold': 'warning',
    'silver': 'secondary',
    'virtual-only': 'light',
    'community': 'success'
  };
  return colors[tier.toLowerCase()] || 'light';
};

export default SponsorMicrosite;
