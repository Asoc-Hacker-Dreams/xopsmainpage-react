import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { BsSend, BsCheckCircle, BsPerson, BsEnvelope, BsFileText, BsMic } from 'react-icons/bs';
import { IdbCFPDal } from '../dal/idb-dal';

const TRACKS = [
  { value: 'devops', label: 'DevOps & Platform Engineering' },
  { value: 'devsecops', label: 'DevSecOps & Security' },
  { value: 'platform', label: 'Platform Engineering' },
  { value: 'cloud', label: 'Cloud Native & Infrastructure' },
  { value: 'automation', label: 'Automation & IaC' },
  { value: 'observability', label: 'Observability & Monitoring' },
  { value: 'culture', label: 'Culture & Team Practices' },
  { value: 'ai', label: 'AI & ML in Operations' },
];

const cfpDal = new IdbCFPDal();

const CFPPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    talkTitle: '',
    abstract: '',
    track: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Introduce un email valido';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'La biografia es obligatoria';
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = 'La biografia debe tener al menos 50 caracteres';
    }
    
    if (!formData.talkTitle.trim()) {
      newErrors.talkTitle = 'El titulo de la charla es obligatorio';
    }
    
    if (!formData.abstract.trim()) {
      newErrors.abstract = 'El resumen de la charla es obligatorio';
    } else if (formData.abstract.trim().length < 100) {
      newErrors.abstract = 'El resumen debe tener al menos 100 caracteres';
    }
    
    if (!formData.track) {
      newErrors.track = 'Selecciona un track';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const id = await cfpDal.submitCFP({
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        talkTitle: formData.talkTitle.trim(),
        abstract: formData.abstract.trim(),
        track: formData.track,
      });
      
      setSubmissionId(id);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        bio: '',
        talkTitle: '',
        abstract: '',
        track: '',
      });
    } catch (error) {
      console.error('Error submitting CFP:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Call for Papers - X-Ops Conference 2026</title>
        <meta name="description" content="Envia tu propuesta de charla para la X-Ops Conference 2026." />
      </Helmet>

      <section className="cfp-page">
        <div className="cfp-hero">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <div className="cfp-badge">
                  <BsMic className="me-2" />
                  Call for Papers
                </div>
                <h1 className="cfp-title">Comparte tu experiencia</h1>
                <p className="cfp-subtitle">
                  Tienes una historia, caso de estudio o experiencia que pueda inspirar a la comunidad? 
                  Queremos escucharte en la X-Ops Conference 2026.
                </p>
              </Col>
            </Row>
          </Container>
        </div>

        <Container className="cfp-form-container">
          <Row className="justify-content-center">
            <Col lg={8}>
              {submitStatus === 'success' ? (
                <div className="cfp-success-card">
                  <BsCheckCircle className="cfp-success-icon" />
                  <h2>Propuesta enviada con exito!</h2>
                  <p>
                    Gracias por tu interes en participar como ponente. 
                    Nuestro comite de programa revisara tu propuesta y te contactaremos pronto.
                  </p>
                  <p className="cfp-submission-id">
                    ID de envio: <code>{submissionId}</code>
                  </p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setSubmitStatus(null)}
                    className="mt-3"
                  >
                    Enviar otra propuesta
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit} className="cfp-form">
                  {submitStatus === 'error' && (
                    <Alert variant="danger" className="mb-4">
                      Hubo un error al enviar tu propuesta. Por favor, intentalo de nuevo.
                    </Alert>
                  )}

                  <div className="cfp-form-section">
                    <h3 className="cfp-section-title">
                      <BsPerson className="me-2" />
                      Informacion personal
                    </h3>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            isInvalid={!!errors.name}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <BsEnvelope className="me-1" />
                            Email *
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            isInvalid={!!errors.email}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Biografia *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Cuentanos sobre ti, tu experiencia y tu contexto profesional (minimo 50 caracteres)"
                        isInvalid={!!errors.bio}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bio}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {formData.bio.length} caracteres
                      </Form.Text>
                    </Form.Group>
                  </div>

                  <div className="cfp-form-section">
                    <h3 className="cfp-section-title">
                      <BsFileText className="me-2" />
                      Informacion de la charla
                    </h3>

                    <Form.Group className="mb-3">
                      <Form.Label>Titulo de la charla *</Form.Label>
                      <Form.Control
                        type="text"
                        name="talkTitle"
                        value={formData.talkTitle}
                        onChange={handleChange}
                        placeholder="Un titulo atractivo que describa tu charla"
                        isInvalid={!!errors.talkTitle}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.talkTitle}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Resumen / Abstract *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        placeholder="Describe el contenido de tu charla: que aprendera la audiencia, que problemas abordaras, y por que es relevante (minimo 100 caracteres)"
                        isInvalid={!!errors.abstract}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.abstract}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {formData.abstract.length} caracteres
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Track tematico *</Form.Label>
                      <Form.Select
                        name="track"
                        value={formData.track}
                        onChange={handleChange}
                        isInvalid={!!errors.track}
                        disabled={isSubmitting}
                      >
                        <option value="">Selecciona un track</option>
                        {TRACKS.map(track => (
                          <option key={track.value} value={track.value}>
                            {track.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.track}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="cfp-submit-section">
                    <Button 
                      type="submit" 
                      className="cfp-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <BsSend className="me-2" />
                          Enviar propuesta
                        </>
                      )}
                    </Button>
                    <p className="cfp-disclaimer">
                      Al enviar tu propuesta, aceptas nuestros terminos y condiciones del CFP.
                      Tu informacion sera tratada segun nuestra politica de privacidad.
                    </p>
                  </div>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CFPPage;
