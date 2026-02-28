import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  BsGraphUp, 
  BsPeople, 
  BsTrophy, 
  BsAward,
  BsLightningCharge,
  BsShieldCheck
} from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const ValueProposition = () => {
  const { t } = useTranslation();

  const valueProps = [
    {
      icon: <BsGraphUp />,
      title: t('summit.value.strategic.title'),
      description: t('summit.value.strategic.description'),
    },
    {
      icon: <BsPeople />,
      title: t('summit.value.networking.title'),
      description: t('summit.value.networking.description'),
    },
    {
      icon: <BsTrophy />,
      title: t('summit.value.roi.title'),
      description: t('summit.value.roi.description'),
    },
    {
      icon: <BsAward />,
      title: t('summit.value.certification.title'),
      description: t('summit.value.certification.description'),
    },
    {
      icon: <BsLightningCharge />,
      title: t('summit.value.hackbcn.title'),
      description: t('summit.value.hackbcn.description'),
    },
    {
      icon: <BsShieldCheck />,
      title: t('summit.value.exclusivity.title'),
      description: t('summit.value.exclusivity.description'),
    },
  ];

  return (
    <section className="summit-value-prop" id="beneficios">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">
              {t('summit.value.sectionTitle')}
            </h2>
            <p className="summit-section-subtitle">
              {t('summit.value.sectionSubtitle')}
            </p>
          </Col>
        </Row>
        
        <Row>
          {valueProps.map((prop, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <div className="value-card">
                <div className="value-icon">
                  {prop.icon}
                </div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-description">{prop.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ValueProposition;
