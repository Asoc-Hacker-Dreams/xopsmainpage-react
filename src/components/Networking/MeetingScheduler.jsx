import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const MeetingScheduler = ({ show, onHide, attendee, onSchedule }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '30',
    topic: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSchedule({
        ...formData,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ date: '', time: '', duration: '30', topic: '', notes: '' });
        onHide();
      }, 1500);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!attendee) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          📅 Programar Reunión
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success" className="mb-3">
            ¡Reunión programada con éxito!
          </Alert>
        )}
        
        <div className="mb-3 p-3 bg-light rounded">
          <strong>Con:</strong> {attendee.name}<br />
          <strong className="text-muted">{attendee.company}</strong>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>
            <Form.Select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tema</Form.Label>
            <Form.Control
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="¿De qué quieres hablar?"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notas (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Detalles adicionales..."
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Programar'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MeetingScheduler;
