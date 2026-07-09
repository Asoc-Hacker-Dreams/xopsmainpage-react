import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BsCalendar3, BsGeoAlt, BsBullseye } from 'react-icons/bs';

const SummitHero = () => {
  const { t } = useTranslation();
  return (
    <section className="summit-hero" id="summit">
      <div className="summit-hero-overlay"></div>
      <Container className="summit-hero-content">
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <div className="summit-badge">
              <span className="badge-text">{t('summit.hero.badge')}</span>
            </div>
            <h1 className="summit-title">
              {t('summit.hero.title')}
              <span className="summit-title-accent">Madrid 2026</span>
            </h1>
            <p className="summit-subtitle">
              {t('summit.hero.subtitle')}
            </p>
            <div className="summit-details">
              <div className="summit-detail-item">
                <BsCalendar3 className="summit-detail-icon" aria-hidden="true" />
                <span>{t('summit.hero.date')}</span>
              </div>
              <div className="summit-detail-item">
                <BsGeoAlt className="summit-detail-icon" aria-hidden="true" />
                <span>{t('summit.hero.venue')}</span>
              </div>
              <div className="summit-detail-item">
                <BsBullseye className="summit-detail-icon" aria-hidden="true" />
                <span>{t('summit.hero.attendees')}</span>
              </div>
            </div>
            <p className="summit-description">
              {t('summit.hero.description')}
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitHero;
