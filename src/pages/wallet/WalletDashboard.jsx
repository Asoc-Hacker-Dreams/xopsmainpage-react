import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaIdCard, FaStamp, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import WalletGuard from '../../components/wallet/WalletGuard';
import './WalletDashboard.css';

const WalletDashboard = () => {
  const { t } = useTranslation();

  // Mock data - in production, this would come from the API
  const identity = {
    handle: '@specter',
    displayName: 'Specter',
    email: 'specter@example.com',
    country: 'UAE',
    status: 'active',
    memberSince: '2026-01-15',
  };

  const stamps = [
    {
      id: 1,
      name: 'X-Ops Dubai 2026 Attendee',
      type: 'attendance',
      issuedAt: '2026-10-15',
      eventContext: 'X-Ops Conference Dubai 2026',
    },
    {
      id: 2,
      name: 'Sophia Citizen',
      type: 'achievement',
      issuedAt: '2026-01-15',
      eventContext: 'Citizenship Postulation',
    },
    {
      id: 3,
      name: 'Early Adopter',
      type: 'achievement',
      issuedAt: '2026-02-01',
      eventContext: 'Founding Membership',
    },
  ];

  const communities = [
    { id: 1, name: 'DevSecOps Collective', role: 'member', members: 1250 },
    { id: 2, name: 'Platform Engineering Hub', role: 'admin', members: 890 },
  ];

  return (
    <WalletGuard>
      <SEO
        title="Wallet - Sophia Metapolis"
        description="Your Sophia Metapolis digital wallet. Manage your identity, stamps, and community memberships."
        path="/wallet"
      />
      <div className="wallet-dashboard">
        {/* Header */}
        <header className="wallet-header">
          <Container>
            <Row className="align-items-center">
              <Col>
                <Link to="/sophia" className="wallet-brand">
                  <span className="wallet-icon">◇</span>
                  <span>Sophia Wallet</span>
                </Link>
              </Col>
              <Col className="text-end">
                <button className="wallet-btn-icon">
                  <FaCog />
                </button>
                <button className="wallet-btn-icon">
                  <FaSignOutAlt />
                </button>
              </Col>
            </Row>
          </Container>
        </header>

        <Container className="py-4">
          {/* Identity Card */}
          <Row className="mb-4">
            <Col>
              <Card className="wallet-identity-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <div className="wallet-avatar">👤</div>
                    </Col>
                    <Col md={6}>
                      <h2 className="wallet-name">{identity.displayName}</h2>
                      <p className="wallet-handle text-muted">{identity.handle}</p>
                      <Badge bg={identity.status === 'active' ? 'success' : 'secondary'}>
                        {identity.status}
                      </Badge>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <div className="wallet-meta">
                        <p><strong>Country:</strong> {identity.country}</p>
                        <p><strong>Member since:</strong> {new Date(identity.memberSince).toLocaleDateString()}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stamps */}
          <Row className="mb-4">
            <Col>
              <div className="wallet-section-header">
                <h3><FaStamp /> Stamps</h3>
                <span className="wallet-count">{stamps.length}</span>
              </div>
              <Row>
                {stamps.map((stamp) => (
                  <Col md={4} key={stamp.id} className="mb-3">
                    <Card className="wallet-stamp-card">
                      <Card.Body>
                        <div className="wallet-stamp-icon">
                          {stamp.type === 'attendance' ? '🎫' : '🏆'}
                        </div>
                        <h4>{stamp.name}</h4>
                        <p className="text-muted">{stamp.eventContext}</p>
                        <small className="text-muted">
                          Issued: {new Date(stamp.issuedAt).toLocaleDateString()}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Communities */}
          <Row>
            <Col>
              <div className="wallet-section-header">
                <h3><FaUsers /> Communities</h3>
                <span className="wallet-count">{communities.length}</span>
              </div>
              <Row>
                {communities.map((community) => (
                  <Col md={6} key={community.id} className="mb-3">
                    <Card className="wallet-community-card">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col>
                            <h4>{community.name}</h4>
                            <p className="text-muted mb-1">{community.members.toLocaleString()} members</p>
                          </Col>
                          <Col xs="auto">
                            <Badge bg={community.role === 'admin' ? 'primary' : 'secondary'}>
                              {community.role}
                            </Badge>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </WalletGuard>
  );
};

export default WalletDashboard;
