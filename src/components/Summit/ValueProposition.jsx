import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsGraphUp, BsPeople, BsTrophy, BsAward, BsShieldCheck } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const ValueProposition = () => {
  const { t } = useTranslation();

  const valueProps = [
    { icon: <BsGraphUp />, key: 'strategic' },
    { icon: <BsPeople />, key: 'networking' },
    { icon: <BsTrophy />, key: 'roi' },
    { icon: <BsAward />, key: 'cert' },
    { icon: <BsShieldCheck />, key: 'exclusive' },
  ];

  return (
    <section className="summit-value-prop" id="beneficios">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">{t('summit.value.title')}</h2>
            <p className="summit-section-subtitle">{t('summit.value.subtitle')}</p>
          </Col>
        </Row>
        <Row>
          {valueProps.map((prop, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <div className="value-card">
                <div className="value-icon">{prop.icon}</div>
                <h3 className="value-title">{t(`summit.value.props.${prop.key}.title`)}</h3>
                <p className="value-description">{t(`summit.value.props.${prop.key}.desc`)}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ValueProposition;
