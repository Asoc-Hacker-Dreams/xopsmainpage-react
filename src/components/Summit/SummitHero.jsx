import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SummitHero = () => {
  const { t } = useTranslation();

  return (
    <section className="summit-hero">
      <div className="summit-hero-overlay"></div>
      <Container className="summit-hero-content">
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <div className="summit-badge">
              <span className="badge-text">{t('summit.hero.badge')}</span>
            </div>
            
            <h1 className="summit-title">
              {t('summit.hero.title')}
              <span className="summit-title-accent">{t('summit.hero.titleAccent')}</span>
            </h1>
            
            <p className="summit-subtitle">
              {t('summit.hero.subtitle')}
            </p>
            
            <div className="summit-details">
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📅</span>
                <span>{t('summit.hero.date')}</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📍</span>
                <span>{t('summit.hero.location')}</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">🎯</span>
                <span>{t('summit.hero.capacity')}</span>
              </div>
            </div>
            
            <p className="summit-description">
              {t('summit.hero.description')}
            </p>
            
            <div className="summit-cta">
              <Button className="summit-btn-primary" href="#tickets">
                {t('summit.hero.ctaPrimary')}
              </Button>
              <Button className="summit-btn-secondary" href="#agenda">
                {t('summit.hero.ctaSecondary')}
              </Button>
            </div>
            
            <div className="summit-early-bird">
              <span className="early-bird-badge">{t('summit.hero.earlyBirdBadge')}</span>
              <span className="early-bird-text">{t('summit.hero.earlyBirdText')}</span>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="summit-scroll-indicator">
        <span>{t('summit.hero.scrollText')}</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default SummitHero;
