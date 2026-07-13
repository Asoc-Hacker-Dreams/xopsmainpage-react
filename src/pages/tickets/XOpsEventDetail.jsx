import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMicrophoneAlt, FaCheckCircle, FaUsers } from 'react-icons/fa';
import SEO from '../../components/SEO';
import './XOpsEventDetail.css';

const XOpsEventDetail = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  const copy = isEs
    ? {
        seoTitle: 'X-Ops Dubai 2026 · Summit + Conference',
        seoDescription: 'Detalle oficial de X-Ops Dubai 2026. Summit y Conference diferenciados por bloques, con sede pendiente de confirmación.',
        home: 'Inicio',
        page: 'X-Ops Dubai 2026',
        badge: '15-17 de octubre de 2026',
        title: 'X-Ops Dubai 2026',
        navSummit: 'Ver bloque Summit',
        navConference: 'Ver bloque Conference',
        summitTitle: 'X-Ops Summit Dubai 2026',
        summitSubtitle: '15 y 16 de octubre · Track ejecutivo',
        conferenceTitle: 'X-Ops Conference Dubai 2026',
        conferenceSubtitle: '17 de octubre · Track técnico',
        speakersTitle: 'Speakers',
        speakersSubtitle: 'Lineup en confirmación. Compartiremos ponentes conforme se cierre agenda por bloque.',
        venueTitle: 'Sede Dubai',
        venueName: 'Venue por confirmar',
        venueDescription: 'La sede oficial de Dubai se anunciará próximamente. El programa mantiene fechas activas y plazas limitadas.',
        venueMap: '📍 Dubai, EAU',
        venueMapNote: 'Mapa disponible cuando se confirme la sede',
        sponsorTitle: '¿Quieres patrocinar Dubai?',
        sponsorText: 'Accede a los planes por ciudad en la sección de patrocinio (Madrid / Dubai / Ambas).',
        sponsorCta: 'Ver patrocinio por ciudad',
        ticketCtaTitle: 'Reserva tu entrada para Dubai 2026',
        ticketCtaText: 'Entradas independientes por ciudad y por tipo de evento (Summit o Conference).',
      }
    : {
        seoTitle: 'X-Ops Dubai 2026 · Summit + Conference',
        seoDescription: 'Official detail page for X-Ops Dubai 2026. Summit and Conference split into separate blocks, venue pending confirmation.',
        home: 'Home',
        page: 'X-Ops Dubai 2026',
        badge: 'October 15-17, 2026',
        title: 'X-Ops Dubai 2026',
        navSummit: 'View Summit block',
        navConference: 'View Conference block',
        summitTitle: 'X-Ops Summit Dubai 2026',
        summitSubtitle: 'October 15 & 16 · Executive track',
        conferenceTitle: 'X-Ops Conference Dubai 2026',
        conferenceSubtitle: 'October 17 · Technical track',
        speakersTitle: 'Speakers',
        speakersSubtitle: 'Lineup in progress. Speakers will be announced as each block is finalized.',
        venueTitle: 'Dubai venue',
        venueName: 'Venue to be confirmed',
        venueDescription: 'The official Dubai venue will be announced soon. Dates remain active and seats are limited.',
        venueMap: '📍 Dubai, UAE',
        venueMapNote: 'Map available once venue is confirmed',
        sponsorTitle: 'Want to sponsor Dubai?',
        sponsorText: 'Access city-based plans in sponsorship section (Madrid / Dubai / Both).',
        sponsorCta: 'View city sponsorship plans',
        ticketCtaTitle: 'Reserve your ticket for Dubai 2026',
        ticketCtaText: 'Tickets are independent by city and event type (Summit or Conference).',
      };

  const summitAgenda = isEs
    ? {
        day1: [
          { time: '09:00', title: 'Registro ejecutivo y café de bienvenida' },
          { time: '10:00', title: 'Keynote: liderazgo tecnológico en mercados de alto crecimiento' },
          { time: '12:00', title: 'Mesa redonda C-Level: resiliencia operativa y riesgo' },
          { time: '14:00', title: 'Almuerzo de networking' },
          { time: '16:00', title: 'Sesión privada: hoja de ruta 2027 para líderes de plataforma' },
        ],
        day2: [
          { time: '09:30', title: 'Breakfast briefing con líderes de la región' },
          { time: '11:00', title: 'Panel: gobierno, compliance y seguridad en escala multi-país' },
          { time: '13:00', title: 'Roundtables por industria' },
          { time: '16:30', title: 'Cierre ejecutivo y próximos pasos' },
        ],
      }
    : {
        day1: [
          { time: '09:00', title: 'Executive registration and welcome coffee' },
          { time: '10:00', title: 'Keynote: tech leadership in high-growth markets' },
          { time: '12:00', title: 'C-Level roundtable: operational resilience and risk' },
          { time: '14:00', title: 'Networking lunch' },
          { time: '16:00', title: 'Private session: 2027 platform leadership roadmap' },
        ],
        day2: [
          { time: '09:30', title: 'Breakfast briefing with regional leaders' },
          { time: '11:00', title: 'Panel: governance, compliance and security at multi-country scale' },
          { time: '13:00', title: 'Industry roundtables' },
          { time: '16:30', title: 'Executive closing and next steps' },
        ],
      };

  const conferenceAgenda = isEs
    ? [
        { time: '09:00', title: 'Apertura técnica y contexto de plataforma' },
        { time: '10:00', title: 'Sesión: DevSecOps para plataformas cloud-native' },
        { time: '11:30', title: 'Sesión: observabilidad práctica para equipos de alta velocidad' },
        { time: '13:00', title: 'Pausa networking' },
        { time: '14:30', title: 'Workshop: fiabilidad, incident response y mejora continua' },
        { time: '16:30', title: 'Cierre técnico y roadmap de comunidad' },
      ]
    : [
        { time: '09:00', title: 'Technical opening and platform context' },
        { time: '10:00', title: 'Session: DevSecOps for cloud-native platforms' },
        { time: '11:30', title: 'Session: practical observability for high-velocity teams' },
        { time: '13:00', title: 'Networking break' },
        { time: '14:30', title: 'Workshop: reliability, incident response and continuous improvement' },
        { time: '16:30', title: 'Technical closing and community roadmap' },
      ];

  const speakers = isEs
    ? [
        { name: 'Track Summit', role: 'Líderes C-Level', company: 'Confirmación en curso' },
        { name: 'Track Conference', role: 'Referentes de ingeniería', company: 'Confirmación en curso' },
        { name: 'Panel regional', role: 'Expertos MENA y Europa', company: 'Confirmación en curso' },
      ]
    : [
        { name: 'Summit track', role: 'C-Level leaders', company: 'Lineup in progress' },
        { name: 'Conference track', role: 'Engineering leaders', company: 'Lineup in progress' },
        { name: 'Regional panel', role: 'MENA and Europe experts', company: 'Lineup in progress' },
      ];

  return (
    <>
      <SEO
        title={copy.seoTitle}
        description={copy.seoDescription}
        path="/events/x-ops-conference-dubai-2026"
      />
      <div className="xops-detail">
        <section className="xops-detail-header">
          <Container>
            <Row>
              <Col>
                <nav className="xops-breadcrumb">
                  <Link to="/">{copy.home}</Link> / <Link to="/events/x-ops-conference-dubai-2026">{copy.page}</Link>
                </nav>
                <span className="xops-detail-badge">{copy.badge}</span>
                <h1>{copy.title}</h1>
                <div className="xops-detail-meta">
                  <span><FaMapMarkerAlt /> Dubai, UAE</span>
                  <span><FaCalendarAlt /> 3 Days</span>
                  <span><FaUsers /> 500+ Leaders</span>
                </div>
                <div className="xops-hero-cta" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href="#summit-dubai" className="xops-btn-outline">{copy.navSummit}</a>
                  <a href="#conference-dubai" className="xops-btn-outline">{copy.navConference}</a>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section id="summit-dubai" className="xops-agenda">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2><FaClock /> {copy.summitTitle}</h2>
                <p className="text-muted">{copy.summitSubtitle}</p>
              </Col>
            </Row>
            <Tabs defaultActiveKey="summit-day1" id="summit-agenda-tabs" className="xops-agenda-tabs">
              <Tab eventKey="summit-day1" title={isEs ? 'Día 1 · 15 Oct' : 'Day 1 · Oct 15'}>
                <div className="xops-agenda-list">
                  {summitAgenda.day1.map((item, idx) => (
                    <div key={idx} className="xops-agenda-item xops-agenda-session">
                      <div className="xops-agenda-time">{item.time}</div>
                      <div className="xops-agenda-content">
                        <div className="xops-agenda-title">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="summit-day2" title={isEs ? 'Día 2 · 16 Oct' : 'Day 2 · Oct 16'}>
                <div className="xops-agenda-list">
                  {summitAgenda.day2.map((item, idx) => (
                    <div key={idx} className="xops-agenda-item xops-agenda-session">
                      <div className="xops-agenda-time">{item.time}</div>
                      <div className="xops-agenda-content">
                        <div className="xops-agenda-title">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </Container>
        </section>

        <section id="conference-dubai" className="xops-agenda">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2><FaClock /> {copy.conferenceTitle}</h2>
                <p className="text-muted">{copy.conferenceSubtitle}</p>
              </Col>
            </Row>
            <div className="xops-agenda-list">
              {conferenceAgenda.map((item, idx) => (
                <div key={idx} className="xops-agenda-item xops-agenda-session">
                  <div className="xops-agenda-time">{item.time}</div>
                  <div className="xops-agenda-content">
                    <div className="xops-agenda-title">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="xops-speakers">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2><FaMicrophoneAlt /> {copy.speakersTitle}</h2>
                <p className="text-muted">{copy.speakersSubtitle}</p>
              </Col>
            </Row>
            <Row>
              {speakers.map((speaker, idx) => (
                <Col md={4} key={idx} className="mb-4">
                  <Card className="xops-speaker-card">
                    <Card.Body>
                      <div className="xops-speaker-avatar">👤</div>
                      <h4>{speaker.name}</h4>
                      <p className="text-muted mb-1">{speaker.role}</p>
                      <p className="xops-speaker-company">{speaker.company}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="xops-venue">
          <Container>
            <Row>
              <Col md={6}>
                <h2><FaMapMarkerAlt /> {copy.venueTitle}</h2>
                <h4>{copy.venueName}</h4>
                <p>{copy.venueDescription}</p>
                <div className="xops-venue-features">
                  <div><FaCheckCircle /> {isEs ? 'Fechas confirmadas' : 'Dates confirmed'}</div>
                  <div><FaCheckCircle /> {isEs ? 'Actualizaciones por email' : 'Email updates enabled'}</div>
                  <div><FaCheckCircle /> {isEs ? 'Aforo limitado' : 'Limited capacity'}</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="xops-venue-map-placeholder">
                  <p>{copy.venueMap}</p>
                  <p className="text-muted">{copy.venueMapNote}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="xops-detail-cta">
          <Container className="text-center">
            <h2>{copy.sponsorTitle}</h2>
            <p>{copy.sponsorText}</p>
            <Link to="/#patrocinio" className="xops-btn-outline">
              {copy.sponsorCta}
            </Link>
          </Container>
        </section>

        <section className="xops-detail-cta">
          <Container className="text-center">
            <h2>{copy.ticketCtaTitle}</h2>
            <p>{copy.ticketCtaText}</p>
            <Link to="/events/x-ops-conference-dubai-2026/buy" className="xops-btn-primary">
              {t('tickets.event.buyTickets')}
            </Link>
          </Container>
        </section>

        <section className="xops-sophia-note">
          <Container>
            <p className="text-center">
              X-Ops Conference es una iniciativa de <Link to="/sophia">Sophia Metapolis</Link>. Conoce la nación digital.
            </p>
          </Container>
        </section>
      </div>
    </>
  );
};

export default XOpsEventDetail;
