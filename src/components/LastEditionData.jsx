import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';
import { BsPeople, BsCalendar, BsMic, BsBuilding } from 'react-icons/bs';

const TRACK_COLORS = {
  DevSecOps: '#d90845',
  DevOps: '#00BCD4',
  MLOps: '#28a745',
  AIOps: '#FFD600',
  PrivacyOps: '#6f42c1',
  SecOps: '#fd7e14'
};

const LastEditionData = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: BsPeople,   number: '300+', label: t('lastEdition.stats.attendees.label'),  description: t('lastEdition.stats.attendees.desc') },
    { icon: BsCalendar, number: '24',   label: t('lastEdition.stats.sessions.label'),   description: t('lastEdition.stats.sessions.desc') },
    { icon: BsMic,      number: '28',   label: t('lastEdition.stats.speakers.label'),   description: t('lastEdition.stats.speakers.desc') },
    { icon: BsBuilding, number: '11',   label: t('lastEdition.stats.communities.label'), description: t('lastEdition.stats.communities.desc') },
  ];

  const chartData = [
    { label: 'DevSecOps',   percentage: 25, color: TRACK_COLORS.DevSecOps },
    { label: 'DevOps',      percentage: 15, color: TRACK_COLORS.DevOps },
    { label: 'MLOps',       percentage: 15, color: TRACK_COLORS.MLOps },
    { label: 'AIOps',       percentage: 15, color: TRACK_COLORS.AIOps },
    { label: 'PrivacyOps',  percentage: 15, color: TRACK_COLORS.PrivacyOps },
    { label: 'SecOps',      percentage: 15, color: TRACK_COLORS.SecOps },
  ];

  return (
    <section className="last-edition-section">
      <div className="container">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <h2 className="text-center margin-top">{t('lastEdition.title')}</h2>
          <p className="text-center">
            {t('lastEdition.description')}
          </p>
        </AnimationWrapper>

        <div className="row margin-top">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <AnimationWrapper animation="fade-up" duration={1000} delay={index * 100}>
                <div className="stat-card text-center">
                  <div className="stat-icon">
                    <stat.icon size={40} className="heading" />
                  </div>
                  <h3 className="stat-number heading">{stat.number}</h3>
                  <h5 className="stat-label">{stat.label}</h5>
                  <p className="stat-description">{stat.description}</p>
                </div>
              </AnimationWrapper>
            </div>
          ))}
        </div>

        <div className="row justify-content-center margin-top">
          <div className="col-lg-8">
            <AnimationWrapper animation="fade-up" duration={1500}>
              <h4 className="text-center mb-4">{t('lastEdition.chartTitle')}</h4>
              <div className="pie-chart-container">
                <div className="pie-chart"></div>
                <div className="chart-legend">
                  {chartData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                      <span>{item.label} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LastEditionData;
