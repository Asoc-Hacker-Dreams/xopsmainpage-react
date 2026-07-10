import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';
import Theme1 from '../assets/theme1.jfif';
import Theme2 from '../assets/theme2.jfif';
import Theme3 from '../assets/theme3.jpeg';

const Themes = () => {
  const { t } = useTranslation();

  return (
    <section className="key-themes-section" id="conferencia">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <div className="container">
          <h6 className="heading text-center text-uppercase"></h6>
          <h2 className="text-center font-weight-bold">{t('themes.title')}</h2>
          <p className="mt-4">{t('themes.description')}</p>

          <div className="row mt-5">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme1} className="card-img-top" alt={t('themes.card1.title')} />
                <div className="card-body">
                  <h5 className="card-title">{t('themes.card1.title')}</h5>
                  <p className="card-text">{t('themes.card1.text')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme2} className="card-img-top" alt={t('themes.card2.title')} />
                <div className="card-body">
                  <h5 className="card-title">{t('themes.card2.title')}</h5>
                  <p className="card-text">{t('themes.card2.text')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme3} className="card-img-top" alt={t('themes.card3.title')} />
                <div className="card-body">
                  <h5 className="card-title">{t('themes.card3.title')}</h5>
                  <p className="card-text">{t('themes.card3.text')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};

export default Themes;
