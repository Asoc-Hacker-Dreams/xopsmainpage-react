import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const organizers = [
  {
    name: 'Pau Cañadillas',
    role: 'Co-fundador',
    bio: 'Técnico en Administración de Sistemas Informáticos en Red. Perfil de ciberseguridad.',
  },
  {
    name: 'Antonio Juanilla',
    role: 'Co-fundador',
    bio: 'DevSecOps (SecDevOps) professional',
  },
  {
    name: 'Marc Mora',
    role: 'Co-fundador',
    bio: 'Cybersecurity Auditor, Trainer & Tech Evangelist',
  },
];

const SummitOrganizers = () => {
  return (
    <section className="summit-organizers" id="organizadores">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">
              Organizadores
            </h2>
            <p className="summit-section-subtitle">
              X-Ops Summit es organizado por el equipo de X-Ops Conferences 
              en colaboración con HackBCN
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {organizers.map((org, index) => (
            <Col md={4} key={index} className="mb-4">
              <div className="organizer-card">
                <div className="organizer-avatar">
                  {org.name.charAt(0)}
                </div>
                <h4 className="organizer-name">{org.name}</h4>
                <p className="organizer-role">{org.role}</p>
                <p className="organizer-bio">{org.bio}</p>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <div className="organizers-logos">
              <div className="organizer-logo">
                <strong>X-Ops</strong>
                <span>CONFERENCES</span>
              </div>
              <span className="logo-divider">×</span>
              <div className="organizer-logo">
                <strong>Hack</strong>
                <span>BCN</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitOrganizers;
