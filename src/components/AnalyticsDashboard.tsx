import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Alert } from 'react-bootstrap';
import { FaTicketAlt, FaUsers, FaStar, FaShare, FaChartLine } from 'react-icons/fa';
import { getAllFeedbackFromStorage, type FeedbackData } from './FeedbackForm';

interface LocalAnalyticsData {
  pageViews: number;
  ticketClicks: number;
  speakerViews: Record<string, number>;
  agendaInteractions: {
    filters: number;
    searches: number;
    favorites: number;
    exports: number;
  };
  shares: Record<string, number>;
  feedback: {
    total: number;
    averageRating: number;
    wouldRecommend: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<LocalAnalyticsData | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([]);

  useEffect(() => {
    loadLocalAnalytics();
  }, []);

  const loadLocalAnalytics = () => {
    const stored = localStorage.getItem('xops-analytics');
    const analytics: LocalAnalyticsData = stored
      ? JSON.parse(stored)
      : getDefaultAnalytics();

    const feedback = getAllFeedbackFromStorage();
    setFeedbackList(feedback);

    if (feedback.length > 0) {
      analytics.feedback = {
        total: feedback.length,
        averageRating:
          feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length,
        wouldRecommend: feedback.filter((f) => f.wouldRecommend === true).length,
      };
    }

    setData(analytics);
  };

  const getDefaultAnalytics = (): LocalAnalyticsData => ({
    pageViews: 0,
    ticketClicks: 0,
    speakerViews: {},
    agendaInteractions: { filters: 0, searches: 0, favorites: 0, exports: 0 },
    shares: {},
    feedback: { total: 0, averageRating: 0, wouldRecommend: 0 },
  });

  const exportAnalytics = () => {
    if (!data) return;

    const exportData = {
      exportedAt: new Date().toISOString(),
      analytics: data,
      feedback: feedbackList,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xops-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return <div className="text-center py-5">Cargando analytics...</div>;
  }

  const metrics = [
    {
      label: 'Clics en Tickets',
      value: data.ticketClicks,
      icon: <FaTicketAlt />,
    },
    {
      label: 'Vistas de Speakers',
      value: Object.values(data.speakerViews).reduce((a, b) => a + b, 0),
      icon: <FaUsers />,
    },
    {
      label: 'Favoritos en Agenda',
      value: data.agendaInteractions.favorites,
      icon: <FaStar />,
    },
    {
      label: 'Compartidos',
      value: Object.values(data.shares).reduce((a, b) => a + b, 0),
      icon: <FaShare />,
    },
  ];

  return (
    <div className="analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaChartLine className="me-2" />
          Dashboard de Analytics
        </h2>
        <button className="btn btn-outline-primary btn-sm" onClick={exportAnalytics}>
          📊 Exportar JSON
        </button>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>Nota:</strong> Este dashboard muestra métricas almacenadas localmente.
        Para analytics completos, consulta Google Analytics 4.
      </Alert>

      <Row className="g-4 mb-4">
        {metrics.map((metric, index) => (
          <Col key={index} xs={6} md={3}>
            <Card className="h-100 metric-card">
              <Card.Body className="text-center">
                <div className="metric-icon mb-2">{metric.icon}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label text-muted">{metric.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">⭐ Feedback Reciente</h5>
            </Card.Header>
            <Card.Body>
              {data.feedback.total > 0 ? (
                <>
                  <div className="mb-3">
                    <strong>Rating Promedio:</strong>{' '}
                    <Badge bg="warning" text="dark">
                      {data.feedback.averageRating.toFixed(1)} / 5
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <strong>Recomendarían:</strong>{' '}
                    <Badge bg="success">
                      {data.feedback.wouldRecommend} de {data.feedback.total}
                    </Badge>
                  </div>
                  <ListGroup>
                    {feedbackList.slice(0, 5).map((fb) => (
                      <ListGroup.Item key={fb.id}>
                        <div className="d-flex justify-content-between">
                          <span>{fb.talkTitle || 'Encuesta General'}</span>
                          <span>
                            {'⭐'.repeat(fb.overallRating)}
                          </span>
                        </div>
                        {fb.comment && (
                          <small className="text-muted d-block mt-1">
                            {fb.comment.slice(0, 100)}
                            {fb.comment.length > 100 ? '...' : ''}
                          </small>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <p className="text-muted mb-0">Aún no hay feedback registrado.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📱 Interacciones en Agenda</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Búsquedas</span>
                  <Badge bg="primary">{data.agendaInteractions.searches}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Filtros aplicados</span>
                  <Badge bg="secondary">{data.agendaInteractions.filters}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Favoritos añadidos</span>
                  <Badge bg="warning" text="dark">{data.agendaInteractions.favorites}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Exportaciones ICS</span>
                  <Badge bg="info">{data.agendaInteractions.exports}</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .analytics-dashboard {
          padding: 1rem;
        }
        .metric-card {
          border-radius: 12px;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: transform 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-4px);
        }
        .metric-icon {
          font-size: 2rem;
          color: #005DAA;
        }
        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #212529;
        }
        .metric-label {
          font-size: 0.875rem;
        }
        [data-theme="dark"] .metric-value {
          color: #f8f9fa;
        }
        [data-theme="dark"] .metric-card {
          background: #343a40;
        }
      `}</style>
    </div>
  );
};

export const trackLocalAnalytics = (
  category: keyof LocalAnalyticsData,
  action: string,
  value?: string | number
): void => {
  const stored = localStorage.getItem('xops-analytics');
  const data: LocalAnalyticsData = stored
    ? JSON.parse(stored)
    : {
        pageViews: 0,
        ticketClicks: 0,
        speakerViews: {},
        agendaInteractions: { filters: 0, searches: 0, favorites: 0, exports: 0 },
        shares: {},
        feedback: { total: 0, averageRating: 0, wouldRecommend: 0 },
      };

  switch (category) {
    case 'ticketClicks':
      data.ticketClicks++;
      break;
    case 'speakerViews':
      if (typeof value === 'string') {
        data.speakerViews[value] = (data.speakerViews[value] || 0) + 1;
      }
      break;
    case 'agendaInteractions':
      if (action in data.agendaInteractions) {
        (data.agendaInteractions as any)[action]++;
      }
      break;
    case 'shares':
      if (typeof value === 'string') {
        data.shares[value] = (data.shares[value] || 0) + 1;
      }
      break;
  }

  localStorage.setItem('xops-analytics', JSON.stringify(data));
};

export default AnalyticsDashboard;
