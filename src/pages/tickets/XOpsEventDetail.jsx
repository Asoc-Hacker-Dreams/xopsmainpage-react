import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Tab, Tabs, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMicrophoneAlt, FaLaptopCode, FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import SEO from '../../components/SEO';
import './XOpsEventDetail.css';

const XOpsEventDetail = () => {
  const { t } = useTranslation();

  const agenda = {
    day1: [
      { time: '09:00', title: 'Registration & Welcome Coffee', type: 'networking' },
      { time: '10:00', title: 'Opening Keynote: The Future of Tech Operations', type: 'keynote', speaker: 'TBA' },
      { time: '11:30', title: 'DevSecOps in the Age of AI', type: 'session' },
      { time: '12:30', title: 'Networking Lunch', type: 'break' },
      { time: '14:00', title: 'Zero Trust Architecture Workshop', type: 'workshop' },
      { time: '15:30', title: 'Platform Engineering at Scale', type: 'session' },
      { time: '17:00', title: 'Executive Roundtable: CIO Priorities 2027', type: 'roundtable' },
      { time: '19:00', title: 'Welcome Reception', type: 'social' },
    ],
    day2: [
      { time: '09:00', title: 'Morning Coffee & Networking', type: 'networking' },
      { time: '10:00', title: 'Keynote: Scaling Infrastructure for AI Workloads', type: 'keynote', speaker: 'TBA' },
      { time: '11:30', title: 'Incident Response & Chaos Engineering', type: 'session' },
      { time: '12:30', title: 'Networking Lunch', type: 'break' },
      { time: '14:00', title: 'SRE Best Practices Panel', type: 'panel' },
      { time: '15:30', title: 'Cloud Cost Optimization Strategies', type: 'session' },
      { time: '17:00', title: 'Closing Keynote: Building Resilient Organizations', type: 'keynote', speaker: 'TBA' },
      { time: '18:30', title: 'Gala Dinner', type: 'social' },
    ],
    day3: [
      { time: '09:00', title: 'Hands-on Labs: Kubernetes Security', type: 'workshop' },
      { time: '11:00', title: 'Observability & Monitoring Workshop', type: 'workshop' },
      { time: '13:00', title: 'Farewell Lunch & Networking', type: 'break' },
      { time: '14:30', title: 'Closing Remarks & Awards', type: 'closing' },
    ],
  };

  const speakers = [
    { name: 'Keynote Speakers', role: 'TBA - Industry Leaders', company: 'Fortune 500 CTOs & Global Visionaries' },
    { name: 'DevSecOps Track', role: 'Security Leaders', company: 'TBA' },
    { name: 'Platform Engineering', role: 'Infrastructure Experts', company: 'TBA' },
  ];

  return (
    <>
      <SEO
        title="X-Ops Conference Dubai 2026 - Event Details"
        description="Full event details for X-Ops Conference Dubai 2026. October 15-17, Dubai, UAE. Agenda, speakers, venue information."
        path="/events/x-ops-conference-dubai-2026"
      />
      <div className="xops-detail">
        {/* Header */}
        <section className="xops-detail-header">
          <Container>
            <Row>
              <Col>
                <nav className="xops-breadcrumb">
                  <Link to="/">Home</Link> / <Link to="/events/x-ops-conference-dubai-2026">X-Ops Dubai 2026</Link>
                </nav>
                <span className="xops-detail-badge">October 15-17, 2026</span>
                <h1>X-Ops Conference Dubai 2026</h1>
                <div className="xops-detail-meta">
                  <span><FaMapMarkerAlt /> Dubai, UAE</span>
                  <span><FaCalendarAlt /> 3 Days</span>
                  <span><FaUsers /> 500+ Leaders</span>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Quick Stats */}
        <section className="xops-stats">
          <Container>
            <Row className="text-center">
              <Col xs={6} md={3} className="mb-3">
                <div className="xops-stat">3</div>
                <div className="xops-stat-label">Days</div>
              </Col>
              <Col xs={6} md={3} className="mb-3">
                <div className="xops-stat">30+</div>
                <div className="xops-stat-label">Sessions</div>
              </Col>
              <Col xs={6} md={3} className="mb-3">
                <div className="xops-stat">20+</div>
                <div className="xops-stat-label">Speakers</div>
              </Col>
              <Col xs={6} md={3} className="mb-3">
                <div className="xops-stat">500+</div>
                <div className="xops-stat-label">Attendees</div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Agenda */}
        <section className="xops-agenda">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2><FaClock /> Agenda</h2>
              </Col>
            </Row>
            <Tabs defaultActiveKey="day1" id="agenda-tabs" className="xops-agenda-tabs">
              <Tab eventKey="day1" title="Day 1 - Oct 15">
                <div className="xops-agenda-list">
                  {agenda.day1.map((item, idx) => (
                    <div key={idx} className={`xops-agenda-item xops-agenda-${item.type}`}>
                      <div className="xops-agenda-time">{item.time}</div>
                      <div className="xops-agenda-content">
                        <div className="xops-agenda-title">{item.title}</div>
                        {item.speaker && <div className="xops-agenda-speaker">{item.speaker}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="day2" title="Day 2 - Oct 16">
                <div className="xops-agenda-list">
                  {agenda.day2.map((item, idx) => (
                    <div key={idx} className={`xops-agenda-item xops-agenda-${item.type}`}>
                      <div className="xops-agenda-time">{item.time}</div>
                      <div className="xops-agenda-content">
                        <div className="xops-agenda-title">{item.title}</div>
                        {item.speaker && <div className="xops-agenda-speaker">{item.speaker}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="day3" title="Day 3 - Oct 17">
                <div className="xops-agenda-list">
                  {agenda.day3.map((item, idx) => (
                    <div key={idx} className={`xops-agenda-item xops-agenda-${item.type}`}>
                      <div className="xops-agenda-time">{item.time}</div>
                      <div className="xops-agenda-content">
                        <div className="xops-agenda-title">{item.title}</div>
                        {item.speaker && <div className="xops-agenda-speaker">{item.speaker}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </Container>
        </section>

        {/* Speakers */}
        <section className="xops-speakers">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2><FaMicrophoneAlt /> Speakers</h2>
                <p className="text-muted">World-class technology leaders sharing insights on the future of tech operations.</p>
              </Col>
            </Row>
            <Row>
              {speakers.map((s, idx) => (
                <Col md={4} key={idx} className="mb-4">
                  <Card className="xops-speaker-card">
                    <Card.Body>
                      <div className="xops-speaker-avatar">👤</div>
                      <h4>{s.name}</h4>
                      <p className="text-muted mb-1">{s.role}</p>
                      <p className="xops-speaker-company">{s.company}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row className="mt-4">
              <Col className="text-center">
                <p className="text-muted">More speakers to be announced. Follow our updates for the latest speaker lineup.</p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Venue */}
        <section className="xops-venue">
          <Container>
            <Row>
              <Col md={6}>
                <h2><FaMapMarkerAlt /> Venue</h2>
                <h4>Dubai World Trade Center</h4>
                <p>Sheikh Zayed Rd - Trade Centre 2<br />Dubai, United Arab Emirates</p>
                <p className="text-muted">The Dubai World Trade Center offers world-class facilities in the heart of Dubai's business district, easily accessible from all major hotels and the airport.</p>
                <div className="xops-venue-features">
                  <div><FaCheckCircle /> Premium Conference Facilities</div>
                  <div><FaCheckCircle /> 5-Star Hotels Walking Distance</div>
                  <div><FaCheckCircle /> Metro Station Nearby</div>
                  <div><FaCheckCircle /> Airport Transfer Available</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="xops-venue-map-placeholder">
                  <p>📍 Dubai World Trade Center</p>
                  <p className="text-muted">Map integration available soon</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* CTA */}
        <section className="xops-detail-cta">
          <Container className="text-center">
            <h2>Ready to Join X-Ops Dubai 2026?</h2>
            <p>Secure your spot at the premier technology leadership event in the Middle East.</p>
            <Link to="/events/x-ops-conference-dubai-2026/buy" className="xops-btn-primary">
              {t('tickets.buyTickets')}
            </Link>
          </Container>
        </section>

        {/* Sophia Footer Note */}
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
