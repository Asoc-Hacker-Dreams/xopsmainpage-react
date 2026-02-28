import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SummitHero = () => {
  return (
    <section className="summit-hero">
      <div className="summit-hero-overlay"></div>
      <Container className="summit-hero-content">
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <div className="summit-badge">
              <span className="badge-text">EVENTO EJECUTIVO</span>
            </div>
            
            <h1 className="summit-title">
              X-Ops Summit
              <span className="summit-title-accent">Barcelona 2026</span>
            </h1>
            
            <p className="summit-subtitle">
              El evento exclusivo para <strong>líderes tecnológicos</strong>
            </p>
            
            <div className="summit-details">
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📅</span>
                <span>6-7 de Mayo 2026</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📍</span>
                <span>Barcelona · Cinesa Diagonal Mar</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">🎯</span>
                <span>Máximo 50 asistentes</span>
              </div>
            </div>
            
            <p className="summit-description">
              Un programa ejecutivo paralelo a <strong>HackBCN Con</strong>, diseñado 
              para CTOs, CISOs y Decision Makers que buscan networking de alto nivel 
              y contenido estratégico.
            </p>
            
            <div className="summit-cta">
              <Button className="summit-btn-primary" href="#tickets">
                Reservar entrada VIP
              </Button>
              <Button className="summit-btn-secondary" href="#agenda">
                Ver programa
              </Button>
            </div>
            
            <div className="summit-early-bird">
              <span className="early-bird-badge">🎭 EARLY BIRD</span>
              <span className="early-bird-text">20% de descuento hasta el 15 de Marzo</span>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="summit-scroll-indicator">
        <span>Descubre más</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default SummitHero;
