import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import AnimationWrapper from './AnimationWrapper';
import SEO from './SEO';
import { BsQuestionCircle, BsInfoCircle } from 'react-icons/bs';

const FAQ = () => {
  const faqData = [
    {
      id: '0',
      question: '¿Quién asiste a la X-Ops Conference?',
      answer: 'Profesionales mid y senior de áreas como DevOps, SecOps, AIOps, GitOps, DevSecOps, MLOps, AIOps, SRE, arquitectura cloud y líderes técnicos. En 2024 participaron más de 300 asistentes; en 2025 esperamos superar los 600 presencialmente.'
    },
    {
      id: '1',
      question: '¿Qué tipos de patrocinio existen y qué incluyen?',
      answer: 'Tenemos cinco niveles: Virtual, Silver, Gold, Track Sponsor y Platinum. Cada uno ofrece beneficios escalonados como logo en la web, publicaciones en redes, stand físico y virtual, charlas técnicas y keynote (según nivel). Solicita más información.'
    },
    {
      id: '2',
      question: '¿Puedo tener un stand físico o solo virtual?',
      answer: 'Desde Silver ya puedes contar con un stand físico de 2x2m. Todos los niveles incluyen stand virtual con diferentes niveles de visibilidad según el paquete.'
    },
    {
      id: '3',
      question: '¿Y si no puedo estar en Madrid?',
      answer: 'Puedes patrocinar como Virtual Sponsor, con presencia digital, stand interactivo, promoción en redes y contenidos on-demand. También puedes enviar contenido pregrabado o material promocional.'
    },
    {
      id: '4',
      question: '¿Dónde y cuándo será la conferencia?',
      answer: 'La X-Ops Conference 2025 se celebrará el 21 y 22 de noviembre en la Universidad Rey Juan Carlos, campus de Móstoles (Madrid). Contaremos con tracks paralelos y experiencia híbrida.'
    },
    {
      id: '5',
      question: '¿Cuándo comienza la visibilidad del patrocinador?',
      answer: 'Desde el momento de la confirmación, publicamos una mención oficial en nuestras redes, añadimos tu logo al sitio web y comenzamos una campaña de agradecimientos semanales hasta la semana posterior al evento.'
    },
    {
      id: '6',
      question: '¿Qué canales de comunicación utiliza X-Ops?',
      answer: (
        <div>
          <p>Utilizamos una red de canales para amplificar la visibilidad de nuestros patrocinadores antes, durante y después del evento:</p>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">📱 <strong>X (Twitter):</strong> <a href="https://twitter.com/XopsConference" target="_blank" rel="noopener noreferrer" className="text-primary">@XopsConference</a></li>
            <li className="mb-2">📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/xops_conference" target="_blank" rel="noopener noreferrer" className="text-primary">@xops_conference</a></li>
            <li className="mb-2">📢 <strong>Telegram (canal global):</strong> <a href="https://t.me/xopscon" target="_blank" rel="noopener noreferrer" className="text-primary">t.me/xopscon</a></li>
            <li className="mb-2">🌍 <strong>Telegram (comunidad en español):</strong> <a href="https://t.me/xopshispano" target="_blank" rel="noopener noreferrer" className="text-primary">t.me/xopshispano</a></li>
            <li className="mb-2">💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/101439409" target="_blank" rel="noopener noreferrer" className="text-primary">LinkedIn Company</a></li>
            <li className="mb-2">🔗 <strong>Linktree general:</strong> <a href="https://linktr.ee/xopscon" target="_blank" rel="noopener noreferrer" className="text-primary">linktr.ee/xopscon</a></li>
          </ul>
          <p className="mt-3"><em>Además, contamos con distribución a través de la newsletter de Hacker Dreams %27.</em></p>
        </div>
      )
    },
    {
      id: '7',
      question: '¿Puedo presentar una charla o demo técnica?',
      answer: 'Sí. Sponsors Gold o superiores pueden presentar una charla técnica de 45 min. Track Sponsors y Platinum tienen también acceso a keynote de 30 min y visibilidad en escenario principal.'
    },
    {
      id: '8',
      question: '¿Recibiremos métricas o informes de impacto?',
      answer: 'Sponsors Gold, Track y Platinum reciben un informe post-evento con estadísticas de alcance, interacciones en redes, participación estimada, leads recolectados y métricas de visibilidad digital.'
    }
  ];

  return (
    <>
      <SEO 
        title="Preguntas Frecuentes para Patrocinadores"
        description="Encuentra respuestas sobre patrocinio, stands, charlas técnicas, canales de comunicación y beneficios de la X-Ops Conference 2025 en Madrid."
        path="/faq"
        keywords="FAQ, preguntas frecuentes, patrocinio X-Ops, sponsorship, DevOps conference, stands Madrid, charlas técnicas"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": typeof faq.answer === 'string' ? faq.answer : 
                "Utilizamos múltiples canales de comunicación para amplificar la visibilidad de patrocinadores."
            }
          }))
        }}
      />
      <section id="faq" className="faq-section py-5 bg-light">
      <Container>
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="text-center mb-5">
            <BsQuestionCircle size={48} className="text-primary mb-3" />
            <h2 className="text-primary mb-3">Preguntas Frecuentes - Patrocinadores</h2>
            <p className="lead text-muted">
              Encuentra respuestas a las preguntas más comunes sobre el patrocinio de la X-Ops Conference
            </p>
          </div>
        </AnimationWrapper>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <AnimationWrapper animation="fade-up" duration={1200}>
              <Accordion defaultActiveKey="0" className="shadow-sm">
                {faqData.map((faq, index) => (
                  <Accordion.Item key={faq.id} eventKey={faq.id} className="border-0 mb-3 rounded">
                    <Accordion.Header className="bg-white">
                      <div className="d-flex align-items-center">
                        <BsInfoCircle className="text-primary me-3" size={20} />
                        <span className="fw-semibold">{faq.question}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-white pt-3">
                      <div className="text-muted">
                        {typeof faq.answer === 'string' ? (
                          <p className="mb-0">{faq.answer}</p>
                        ) : (
                          faq.answer
                        )}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </AnimationWrapper>
          </Col>
        </Row>

        {/* Call to Action */}
        <AnimationWrapper animation="fade-up" duration={1400}>
          <div className="text-center mt-5 p-4 bg-primary text-white rounded">
            <h4 className="mb-3">¿Tienes más preguntas?</h4>
            <p className="mb-4">
              Nuestro equipo está disponible para resolver cualquier duda sobre el patrocinio
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a 
                href="mailto:info@xopsconference.com?subject=Consulta sobre Patrocinio - X-Ops Conference&body=Hola,%0D%0A%0D%0ATengo algunas preguntas sobre el patrocinio de la X-Ops Conference.%0D%0A%0D%0A[Escribe tu consulta aquí]%0D%0A%0D%0AGracias,%0D%0A"
                className="btn btn-light btn-lg px-4"
              >
                📧 Contactar por email
              </a>
              <a 
                href="https://linktr.ee/xopscon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-lg px-4"
              >
                🔗 Ver todos nuestros canales
              </a>
            </div>
          </div>
        </AnimationWrapper>
      </Container>
    </section>
    </>
  );
};

export default FAQ;
