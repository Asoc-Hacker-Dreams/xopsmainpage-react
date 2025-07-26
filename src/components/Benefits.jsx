import banner from '../assets/banner.jfif'
import AnimationWrapper from './AnimationWrapper';
import { BsMegaphone, BsGlobe, BsCalendarCheck, BsAward, BsCameraVideo } from 'react-icons/bs';
import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';

const Benefits = () => {
  return (
    <section id="patrocinio" className="collaboration-sponsorship-section">
      <Container>
        {/* Hero Section */}
        <div className="sponsorship-hero text-center py-5 mb-5" style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '15px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            backgroundImage: 'url(/assets/xops.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: 0.1,
            zIndex: 1
          }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <AnimationWrapper animation="fade-up" duration={1000}>
              <h1 className="text-white mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                ¿Por qué patrocinar la X-Ops Conference?
              </h1>
              <p className="text-light mb-4" style={{ fontSize: '1.2rem' }}>
                Conecta con cientos de profesionales de alto nivel en el mundo DevSec, MLOps, GitOps, AIOps y más.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4"
                  href="mailto:info@xopsconference.com?subject=Solicitud de Patrocinio - X-Ops Conference&body=Hola,%0D%0A%0D%0AEstoy interesado en patrocinar la X-Ops Conference.%0D%0A%0D%0APor favor, envíenme más información sobre los paquetes de patrocinio disponibles.%0D%0A%0D%0AGracias,%0D%0A"
                  as="a"
                >
                  🤝 Solicitar patrocinio
                </Button>
              </div>
            </AnimationWrapper>
          </div>
        </div>

        {/* Beneficios por Fases */}
        <div className="benefits-phases-section mb-5">
          <AnimationWrapper animation="fade-up" duration={1000}>
            <h2 className="text-center mb-5 text-primary">Beneficios por Fases del Evento</h2>
          </AnimationWrapper>

          <Row className="g-4">
            {/* Pre-evento */}
            <Col md={4}>
              <AnimationWrapper animation="fade-right" duration={1000}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white text-center">
                    <BsCalendarCheck size={24} className="mb-2" />
                    <h5 className="mb-0">🟦 Pre-evento</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ Logo en la web (tamaño según nivel)</li>
                      <li className="mb-2">✅ Promoción de la empresa una vez se cierra el acuerdo</li>
                      <li className="mb-2">✅ Agradecimientos semanales en redes sociales (X, LinkedIn, Telegram)</li>
                      <li className="mb-2">✅ Inclusión en el banner oficial</li>
                    </ul>
                  </Card.Body>
                </Card>
              </AnimationWrapper>
            </Col>

            {/* Durante el evento */}
            <Col md={4}>
              <AnimationWrapper animation="fade-up" duration={1000}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-success text-white text-center">
                    <BsMegaphone size={24} className="mb-2" />
                    <h5 className="mb-0">🟦 Durante el evento</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ Presencia en roll-up, banner físico y virtual</li>
                      <li className="mb-2">✅ Acceso a stand físico y/o virtual (según nivel)</li>
                      <li className="mb-2">✅ Charla técnica (desde Gold)</li>
                      <li className="mb-2">✅ Keynote (Track/Platinum)</li>
                      <li className="mb-2">✅ Mención en apertura y cierre</li>
                    </ul>
                  </Card.Body>
                </Card>
              </AnimationWrapper>
            </Col>

            {/* Post-evento */}
            <Col md={4}>
              <AnimationWrapper animation="fade-left" duration={1000}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-info text-white text-center">
                    <BsCameraVideo size={24} className="mb-2" />
                    <h5 className="mb-0">🟦 Post-evento</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ Logo en resumen/post oficial</li>
                      <li className="mb-2">✅ Agradecimientos finales en redes</li>
                      <li className="mb-2">✅ Visibilidad en grabaciones y contenidos on-demand</li>
                      <li className="mb-2">✅ Certificado digital de patrocinador oficial</li>
                    </ul>
                  </Card.Body>
                </Card>
              </AnimationWrapper>
            </Col>
          </Row>
        </div>

        {/* Beneficios adicionales */}
        <div className="additional-benefits-section">
          <AnimationWrapper animation="fade-up" duration={1000}>
            <h3 className="text-center mb-4 text-primary">Beneficios Adicionales</h3>
          </AnimationWrapper>
          
          <Row className="justify-content-center">
            <Col lg={8}>
              <AnimationWrapper animation="fade-up" duration={1200}>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <BsMegaphone className="me-3 text-primary" size={24} />
                    <span>Publicidad durante el evento y en todos nuestros canales de difusión</span>
                  </div>
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <BsGlobe className="me-3 text-primary" size={24} />
                    <span>Visibilidad, alcance y posicionamiento como marca colaboradora a nivel nacional e internacional</span>
                  </div>
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <BsAward className="me-3 text-primary" size={24} />
                    <span>Networking exclusivo con líderes de la industria y profesionales de élite</span>
                  </div>
                </div>
              </AnimationWrapper>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Benefits;
