import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-window';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { groupTalksByDayAndRoom, formatDate, formatTime } from '../utils/agendaUtils';
import './AgendaList.css';

const ITEM_HEIGHT = 200; // Fixed height for all items (headers and talks)

/**
 * AgendaList component with virtualization, sticky headers, and favorites
 * @param {Object} props - Component props
 * @param {Array} props.talks - Array of talk objects
 * @param {Object} props.filters - Filter criteria from URL
 */
const AgendaList = ({ talks = [], filters = {} }) => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [listHeight, setListHeight] = useState(600);

  // Update list height based on window size
  useEffect(() => {
    const updateHeight = () => {
      setListHeight(Math.max(window.innerHeight - 300, 400));
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Apply filters to talks
  const filteredTalks = useMemo(() => {
    let filtered = [...talks];

    if (filters.track) {
      filtered = filtered.filter(t => t.track === filters.track);
    }
    if (filters.room) {
      filtered = filtered.filter(t => t.room === filters.room);
    }
    if (filters.day) {
      filtered = filtered.filter(t => t.timeISO.startsWith(filters.day));
    }
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    return filtered;
  }, [talks, filters]);

  // Group talks by day and room
  const groupedTalks = useMemo(() => {
    return groupTalksByDayAndRoom(filteredTalks);
  }, [filteredTalks]);

  // Flatten grouped talks into a list with headers
  const flattenedItems = useMemo(() => {
    const items = [];
    const days = Object.keys(groupedTalks).sort();

    days.forEach(day => {
      if (!Object.prototype.hasOwnProperty.call(groupedTalks, day)) return;
      items.push({ type: 'day-header', day, key: `day-${day}` });
      
      const dayData = groupedTalks[day];
      const rooms = Object.keys(dayData).sort();
      rooms.forEach(room => {
        if (!Object.prototype.hasOwnProperty.call(dayData, room)) return;
        items.push({ type: 'room-header', room, day, key: `room-${day}-${room}` });
        
        const roomTalks = dayData[room];
        roomTalks.forEach(talk => {
          items.push({ type: 'talk', talk, key: talk.id });
        });
      });
    });

    return items;
  }, [groupedTalks]);

  /**
   * Handle favorite toggle with accessibility
   */
  const handleToggleFavorite = (event, talkId) => {
    event.stopPropagation();
    toggleFavorite(talkId);
  };

  /**
   * Render a single row in the virtualized list
   */
  const Row = ({ index, style, ariaAttributes, flattenedItems: items }) => {
    const item = items[index];

    if (item.type === 'day-header') {
      return (
        <div style={{ ...style, position: 'relative', zIndex: 2 }} className="day-header" {...ariaAttributes}>
          <h3>{formatDate(item.day)}</h3>
        </div>
      );
    }

    if (item.type === 'room-header') {
      return (
        <div style={{ ...style, position: 'relative', zIndex: 1 }} className="room-header" {...ariaAttributes}>
          <h4>📍 {item.room}</h4>
        </div>
      );
    }

    // Talk item
    const { talk } = item;
    const isFav = isFavorite(talk.id);

    return (
      <div style={style} className="talk-item-wrapper" {...ariaAttributes}>
        <Card className="talk-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg={talk.type === 'keynote' ? 'primary' : 'secondary'}>
                    {talk.type || 'talk'}
                  </Badge>
                  <Badge bg="info">{talk.track || 'general'}</Badge>
                  <span className="text-muted">
                    {formatTime(talk.timeISO)} • {talk.durationHuman}
                  </span>
                </div>
                <Card.Title>{talk.talk}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {talk.speaker}
                </Card.Subtitle>
                {talk.description && (
                  <Card.Text className="talk-description">
                    {talk.description.length > 150 
                      ? `${talk.description.substring(0, 150)}...` 
                      : talk.description}
                  </Card.Text>
                )}
              </div>
              <Button
                variant="link"
                className="favorite-btn p-0"
                onClick={(e) => handleToggleFavorite(e, talk.id)}
                aria-pressed={isFav}
                aria-label={isFav ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              >
                {isFav ? (
                  <FaStar size={24} color="#FFD700" />
                ) : (
                  <FaRegStar size={24} color="#6c757d" />
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    ariaAttributes: PropTypes.object,
    flattenedItems: PropTypes.array.isRequired,
  };

  if (filteredTalks.length === 0) {
    return (
      <Container className="text-center py-5">
        <p>No hay sesiones disponibles con los filtros actuales.</p>
      </Container>
    );
  }

  return (
    <Container className="agenda-list-container">
      <div className="mb-3">
        <p className="text-muted">
          Mostrando {filteredTalks.length} sesiones • {favorites.size} favoritas
        </p>
      </div>
      <List
        height={listHeight}
        rowCount={flattenedItems.length}
        rowHeight={ITEM_HEIGHT}
        rowComponent={Row}
        rowProps={{ flattenedItems }}
        className="agenda-virtualized-list"
      />
    </Container>
  );
};

AgendaList.propTypes = {
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
  filters: PropTypes.object,
};

export default AgendaList;
