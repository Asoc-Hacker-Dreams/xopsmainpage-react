import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';
import XopsImg from '../assets/xops-img.jpg';

const XOpsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="inicio" className="xops-section">
      <div className="container">
        <div>
          <h2 className="font-weight-bold justify-content-center text-center">
            {t('xops.title')}
          </h2>
          <p className="xos-p">
            {t('xops.description')}
          </p>
        </div>
        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 mt-4">
            <AnimationWrapper animation="fade-right" duration={1500}>
              <h4 className="mb-3">{t('xops.keyComponents')}</h4>
              <ul>
                <li><strong>DevOps:</strong> {t('xops.items.devops')}</li>
                <li><strong>DevSecOps:</strong> {t('xops.items.devsecops')}</li>
                <li><strong>AIOps:</strong> {t('xops.items.aiops')}</li>
                <li><strong>MLOps:</strong> {t('xops.items.mlops')}</li>
                <li><strong>BizDevOps:</strong> {t('xops.items.bizdevops')}</li>
              </ul>
            </AnimationWrapper>
          </div>

          <div className="col-lg-6 col-md-12">
            <AnimationWrapper animation="fade-left" duration={1500}>
              <img
                src={XopsImg}
                alt="X-Ops Illustration"
                className="img-fluid"
              />
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default XOpsSection;
