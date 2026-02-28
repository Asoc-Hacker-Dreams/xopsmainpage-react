import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  BsGraphUp, 
  BsPeople, 
  BsTrophy, 
  BsAward,
  BsLightningCharge,
  BsShieldCheck
} from 'react-icons/bs';

const valueProps = [
  {
    icon: <BsGraphUp />,
    title: 'ENFOQUE ESTRATÉGICO',
    description: 'Contenido diseñado para C-levels y directivos. Sin technical deep-dives, sí business impact.',
  },
  {
    icon: <BsPeople />,
    title: 'NETWORKING EJECUTIVO',
    description: 'Sesiones exclusivas con 50 máximo asistentes. Coffee breaks premium con catering de alto nivel.',
  },
  {
    icon: <BsTrophy />,
    title: 'ROI DEMOSTRABLE',
    description: 'Casos de éxito de implementación DevOps/SecOps. Métricas y KPIs que puedes aplicar el lunes.',
  },
  {
    icon: <BsAward />,
    title: 'CERTIFICACIÓN',
    description: 'Certificado de asistencia de X-Ops Conferences, reconocido por la industria tech europea.',
  },
  {
    icon: <BsLightningCharge />,
    title: 'PARALELO A HACKBCN',
    description: 'Aprovecha el ecosistema de HackBCN Con mientras asistes a contenido ejecutivo exclusivo.',
  },
  {
    icon: <BsShieldCheck />,
    title: 'EXCLUSIVIDAD',
    description: 'Aforo limitado a 50 ejecutivos. Garantizamos calidad en cada interacción.',
  },
];

const ValueProposition = () => {
  return (
    <section className="summit-value-prop" id="beneficios">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">
              ¿Por qué asistir al X-Ops Summit?
            </h2>
            <p className="summit-section-subtitle">
              Un evento diseñado pensando en las necesidades de los líderes tecnológicos
            </p>
          </Col>
        </Row>
        
        <Row>
          {valueProps.map((prop, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <div className="value-card">
                <div className="value-icon">
                  {prop.icon}
                </div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-description">{prop.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ValueProposition;
