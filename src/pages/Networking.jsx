import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Badge, ListGroup, Button, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';
import AttendeeCard from '../components/Networking/AttendeeCard';
import MeetingScheduler from '../components/Networking/MeetingScheduler';
import QRModal from '../components/Networking/QRModal';
import { useAttendees, useMeetings } from '../hooks/useMeetings';

const Networking = () => {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { meetings, loading: meetingsLoading, scheduleMeeting, cancelMeeting } = useMeetings();
  
  const [roleFilter, setRoleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [viewMode, setViewMode] = useState('directory'); // 'directory' or 'meetings'

  // Get unique roles and companies for filters
  const { roles, companies } = useMemo(() => {
    const roleSet = new Set();
    const companySet = new Set();
    attendees.forEach(a => {
      if (a.role) roleSet.add(a.role);
      if (a.company) companySet.add(a.company);
    });
    return { 
      roles: Array.from(roleSet).sort(), 
      companies: Array.from(companySet).sort() 
    };
  }, [attendees]);

  // Filter attendees
  const filteredAttendees = useMemo(() => {
    return attendees.filter(attendee => {
      const matchesRole = !roleFilter || attendee.role === roleFilter;
      const matchesCompany = !companyFilter || attendee.company === companyFilter;
      const matchesSearch = !searchQuery || 
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attendee.bio && attendee.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesCompany && matchesSearch;
    });
  }, [attendees, roleFilter, companyFilter, searchQuery]);

  const handleScheduleMeeting = (attendee) => {
    setSelectedAttendee(attendee);
    setShowScheduler(true);
  };

  const handleShowQR = (attendee) => {
    setSelectedAttendee(attendee);
    setShowQR(true);
  };

  const handleSchedule = async (meetingData) => {
    await scheduleMeeting(meetingData);
  };

  const loading = attendeesLoading || meetingsLoading;

  return (
    <>
      <Helmet>
        <title>Networking – X-Ops Conference Madrid 2025</title>
      </Helmet>

      <section className="py-5 bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">🤝 Networking</h2>
              <p className="text-muted mb-0">Conecta con otros asistentes de la conferencia</p>
            </div>
            <div className="btn-group">
              <Button 
                variant={viewMode === 'directory' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('directory')}
              >
                <FiUsers className="me-1" />
                Directorio
              </Button>
              <Button 
                variant={viewMode === 'meetings' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('meetings')}
              >
                <FiCalendar className="me-1" />
                Mis Reuniones ({meetings.length})
              </Button>
            </div>
          </div>

          {viewMode === 'directory' ? (
            <>
              {/* Filters */}
              <div className="bg-white rounded shadow-sm p-3 mb-4">
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small text-muted">
                        <FiFilter className="me-1" /> Buscar
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre, empresa, bio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small text-muted">Rol</Form.Label>
                      <Form.Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="">Todos los roles</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small text-muted">Empresa</Form.Label>
                      <Form.Select
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                      >
                        <option value="">Todas las empresas</option>
                        {companies.map(company => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Results count */}
              <div className="mb-3">
                <Badge bg="secondary">{filteredAttendees.length} asistentes</Badge>
                {(roleFilter || companyFilter || searchQuery) && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setRoleFilter('');
                      setCompanyFilter('');
                      setSearchQuery('');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>

              {/* Attendee Grid */}
              {loading ? (
                <p className="text-center py-5">Cargando asistentes...</p>
              ) : filteredAttendees.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No se encontraron asistentes con los filtros seleccionados
                </Alert>
              ) : (
                <Row className="g-4">
                  {filteredAttendees.map(attendee => (
                    <Col key={attendee.id} md={6} lg={4} xl={3}>
                      <AttendeeCard
                        attendee={attendee}
                        onScheduleMeeting={handleScheduleMeeting}
                        onShowQR={handleShowQR}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          ) : (
            /* Meetings View */
            <div className="bg-white rounded shadow-sm">
              {meetings.length === 0 ? (
                <div className="text-center py-5">
                  <FiCalendar size={48} className="text-muted mb-3" />
                  <h5>No tienes reuniones programadas</h5>
                  <p className="text-muted">
                    Explora el directorio y programa reuniones con otros asistentes
                  </p>
                  <Button variant="primary" onClick={() => setViewMode('directory')}>
                    Ver Directorio
                  </Button>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {meetings.map(meeting => (
                    <ListGroup.Item key={meeting.id} className="py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{meeting.attendeeName}</h5>
                          <p className="mb-1 text-muted small">
                            📅 {meeting.date} | 🕐 {meeting.time} | ⏱️ {meeting.duration} min
                          </p>
                          <p className="mb-0">
                            <strong>Tema:</strong> {meeting.topic}
                          </p>
                          {meeting.notes && (
                            <p className="mb-0 text-muted small">{meeting.notes}</p>
                          )}
                        </div>
                        <div className="text-end">
                          <Badge 
                            bg={meeting.status === 'scheduled' ? 'success' : 'secondary'}
                            className="mb-2"
                          >
                            {meeting.status === 'scheduled' && <FiCheck className="me-1" />}
                            {meeting.status === 'scheduled' ? 'Programada' : meeting.status}
                          </Badge>
                          <br />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => cancelMeeting(meeting.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Meeting Scheduler Modal */}
      <MeetingScheduler
        show={showScheduler}
        onHide={() => setShowScheduler(false)}
        attendee={selectedAttendee}
        onSchedule={handleSchedule}
      />

      {/* QR Modal */}
      <QRModal
        show={showQR}
        onHide={() => setShowQR(false)}
        attendee={selectedAttendee}
      />
    </>
  );
};

export default Networking;
