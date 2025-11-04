import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import AgendaList from '../components/AgendaList';
import AnimationWrapper from '../components/AnimationWrapper';
import SEO from '../components/SEO';
import schedule2025 from '../data/schedule2025.json';
import './Agenda.css';

/**
 * Main Agenda page with filters and URL state management
 */
const Agenda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read filters from URL or use defaults
  const [filters, setFilters] = useState({
    track: searchParams.get('track') || '',
    room: searchParams.get('room') || '',
    day: searchParams.get('day') || '',
    type: searchParams.get('type') || '',
  });

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    const filterKeys = Object.keys(filters);
    filterKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key]) {
        params[key] = filters[key];
      }
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Get unique values for filters
  const uniqueTracks = [...new Set(schedule2025.map(t => t.track).filter(Boolean))];
  const uniqueRooms = [...new Set(schedule2025.map(t => t.room).filter(Boolean))];
  const uniqueDays = [...new Set(schedule2025.map(t => t.timeISO.split('T')[0]).filter(Boolean))];
  const uniqueTypes = [...new Set(schedule2025.map(t => t.type).filter(Boolean))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      track: '',
      room: '',
      day: '',
      type: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <>
      <SEO 
        title="Agenda - X-Ops Conference 2025"
        description="Agenda completa de la X-Ops Conference Madrid 2025. Descubre todas las sesiones, talleres y keynotes."
      />
      <Container className="agenda-page py-4">
        <AnimationWrapper animation="fade-up" duration={800}>
          <div className="agenda-header mb-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="mb-3">Agenda X-Ops Conference 2025</h1>
                <p className="lead">
                  21 y 22 de Noviembre de 2025 - Madrid
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <Link to="/my-agenda" className="btn btn-warning btn-lg">
                  <FaStar className="me-2" />
                  Mi Agenda
                </Link>
              </Col>
            </Row>
          </div>

          <div className="filters-section mb-4">
            <h5 className="mb-3">Filtrar sesiones</h5>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Track</Form.Label>
                  <Form.Select
                    value={filters.track}
                    onChange={(e) => handleFilterChange('track', e.target.value)}
                  >
                    <option value="">Todos los tracks</option>
                    {uniqueTracks.map(track => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Sala</Form.Label>
                  <Form.Select
                    value={filters.room}
                    onChange={(e) => handleFilterChange('room', e.target.value)}
                  >
                    <option value="">Todas las salas</option>
                    {uniqueRooms.map(room => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Día</Form.Label>
                  <Form.Select
                    value={filters.day}
                    onChange={(e) => handleFilterChange('day', e.target.value)}
                  >
                    <option value="">Todos los días</option>
                    {uniqueDays.map(day => (
                      <option key={day} value={day}>
                        {new Date(day + 'T00:00:00').toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">Todos los tipos</option>
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {hasActiveFilters && (
              <Button variant="outline-secondary" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>

          <AgendaList talks={schedule2025} filters={filters} />
        </AnimationWrapper>
      </Container>
    </>
  );
};

export default Agenda;
