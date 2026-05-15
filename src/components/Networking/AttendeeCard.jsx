import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FiCalendar, FiUser } from 'react-icons/fi';

const AttendeeCard = ({ attendee, onScheduleMeeting, onShowQR }) => {
  const getRoleColor = (role) => {
    const colors = {
      'CTO': 'primary',
      'CEO': 'danger',
      'Developer': 'success',
      'DevOps': 'info',
      'Security': 'warning',
      'Manager': 'secondary',
    };
    return colors[role] || 'dark';
  };

  return (
    <Card className="h-100 shadow-sm attendee-card">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div 
            className="attendee-avatar me-3"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {attendee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <Card.Title className="mb-1">{attendee.name}</Card.Title>
            <Badge bg={getRoleColor(attendee.role)}>{attendee.role}</Badge>
          </div>
        </div>

        <Card.Subtitle className="mb-2 text-muted">
          <FiUser className="me-1" />
          {attendee.company}
        </Card.Subtitle>

        {attendee.bio && (
          <Card.Text className="small text-truncate">
            {attendee.bio}
          </Card.Text>
        )}

        {attendee.interests && attendee.interests.length > 0 && (
          <div className="mb-3">
            {attendee.interests.slice(0, 3).map((interest, idx) => (
              <Badge key={idx} bg="light" text="dark" className="me-1 small">
                {interest}
              </Badge>
            ))}
          </div>
        )}

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-grow-1"
            onClick={() => onScheduleMeeting(attendee)}
          >
            <FiCalendar className="me-1" />
            Reunión
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => onShowQR(attendee)}
          >
            QR
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AttendeeCard;
