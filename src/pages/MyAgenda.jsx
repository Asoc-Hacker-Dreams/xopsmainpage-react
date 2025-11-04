import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Alert, Badge, Button } from 'react-bootstrap';
import { FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { 
  groupTalksByDay, 
  detectConflicts, 
  formatDate, 
  formatTime,
  generateTalkId 
} from '../utils/agendaUtils';
import AnimationWrapper from '../components/AnimationWrapper';
import SEO from '../components/SEO';
import './MyAgenda.css';

/**
 * MyAgenda page - Shows only favorited talks with conflict detection
 * @param {Object} props - Component props
 * @param {Array} props.talks - All available talks
 */
const MyAgenda = ({ talks = [] }) => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Filter talks to only show favorites
  const favoritedTalks = useMemo(() => {
    return talks
      .map(talk => ({ ...talk, id: generateTalkId(talk) }))
      .filter(talk => isFavorite(talk.id));
  }, [talks, isFavorite]);

  // Group favorited talks by day
  const groupedByDay = useMemo(() => {
    return groupTalksByDay(favoritedTalks);
  }, [favoritedTalks]);

  // Detect conflicts in favorited talks
  const conflicts = useMemo(() => {
    return detectConflicts(favoritedTalks);
  }, [favoritedTalks]);

  const hasConflicts = conflicts.size > 0;

  /**
   * Handle removing a talk from favorites
   */
  const handleRemoveFavorite = (event, talkId) => {
    event.preventDefault();
    toggleFavorite(talkId);
  };

  if (favoritedTalks.length === 0) {
    return (
      <>
        <SEO 
          title="Mi Agenda - X-Ops Conference 2025"
          description="Gestiona tu agenda personalizada de la X-Ops Conference"
        />
        <Container className="my-agenda-empty py-5">
          <AnimationWrapper animation="fade-up" duration={1000}>
            <div className="text-center">
              <FaStar size={64} color="#FFD700" className="mb-4" />
              <h2>Tu agenda está vacía</h2>
              <p className="lead mb-4">
                Aún no has marcado ninguna sesión como favorita.
              </p>
              <p className="text-muted mb-4">
                Explora la agenda completa y marca tus sesiones favoritas con la estrella ⭐
              </p>
              <Link to="/agenda" className="btn btn-primary btn-lg">
                Ver Agenda Completa
              </Link>
            </div>
          </AnimationWrapper>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Mi Agenda - X-Ops Conference 2025"
        description={`Tu agenda personalizada con ${favoritedTalks.length} sesiones favoritas`}
      />
      <Container className="my-agenda-page py-4">
        <AnimationWrapper animation="fade-up" duration={800}>
          <div className="mb-4">
            <h1 className="mb-3">
              <FaStar color="#FFD700" className="me-2" />
              Mi Agenda
            </h1>
            <p className="lead">
              Has marcado {favoritedTalks.length} {favoritedTalks.length === 1 ? 'sesión' : 'sesiones'} como favoritas
            </p>
            <Link to="/agenda" className="btn btn-outline-primary">
              ← Volver a la Agenda Completa
            </Link>
          </div>

          {hasConflicts && (
            <Alert variant="warning" className="d-flex align-items-center">
              <FaExclamationTriangle size={24} className="me-3" />
              <div>
                <strong>¡Atención! Hay conflictos de horario</strong>
                <p className="mb-0 mt-1">
                  Algunas de tus sesiones favoritas se solapan en el tiempo. 
                  Están marcadas con <FaExclamationTriangle color="#856404" /> para que puedas revisar tu selección.
                </p>
              </div>
            </Alert>
          )}

          {Object.keys(groupedByDay).sort().map(day => {
            if (!Object.prototype.hasOwnProperty.call(groupedByDay, day)) return null;
            const dayTalks = groupedByDay[day];
            return (
            <div key={day} className="day-section mb-5">
              <h2 className="day-title">{formatDate(day)}</h2>
              <div className="talks-list">
                {dayTalks.map(talk => {
                  const hasConflict = conflicts.has(talk.id);
                  return (
                    <Card 
                      key={talk.id} 
                      className={`talk-card mb-3 ${hasConflict ? 'conflict' : ''}`}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                              {hasConflict && (
                                <Badge bg="warning" text="dark">
                                  <FaExclamationTriangle className="me-1" />
                                  Conflicto
                                </Badge>
                              )}
                              <Badge bg={talk.type === 'keynote' ? 'primary' : 'secondary'}>
                                {talk.type || 'talk'}
                              </Badge>
                              <Badge bg="info">{talk.track || 'general'}</Badge>
                              <span className="text-muted">
                                📍 {talk.room}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-3 mb-2">
                              <strong className="time-display">
                                {formatTime(talk.timeISO)} - {talk.durationHuman}
                              </strong>
                            </div>
                            <Card.Title className="mb-2">{talk.talk}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {talk.speaker}
                            </Card.Subtitle>
                            {talk.description && (
                              <Card.Text className="talk-description">
                                {talk.description}
                              </Card.Text>
                            )}
                          </div>
                          <Button
                            variant="link"
                            className="favorite-btn p-0 ms-3"
                            onClick={(e) => handleRemoveFavorite(e, talk.id)}
                            aria-pressed="true"
                            aria-label="Eliminar de favoritos"
                          >
                            <FaStar size={24} color="#FFD700" />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </div>
            );
          })}
        </AnimationWrapper>
      </Container>
    </>
  );
};

MyAgenda.propTypes = {
  talks: PropTypes.arrayOf(PropTypes.shape({
    speaker: PropTypes.string.isRequired,
    talk: PropTypes.string.isRequired,
    description: PropTypes.string,
    timeISO: PropTypes.string.isRequired,
    durationMinutes: PropTypes.number,
    durationHuman: PropTypes.string,
    room: PropTypes.string,
    type: PropTypes.string,
    track: PropTypes.string,
  })),
};

export default MyAgenda;
