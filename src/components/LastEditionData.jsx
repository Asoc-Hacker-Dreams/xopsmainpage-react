import React from 'react';
import AnimationWrapper from './AnimationWrapper';
import { BsPeople, BsCalendar, BsMic, BsBuilding } from 'react-icons/bs';

const LastEditionData = () => {
  const stats = [
    {
      icon: BsPeople,
      number: "300+",
      label: "Asistentes",
      description: "personas asistieron al evento"
    },
    {
      icon: BsCalendar,
      number: "15",
      label: "Sesiones",
      description: "charlas y talleres especializados"
    },
    {
      icon: BsMic,
      number: "16",
      label: "Speakers",
      description: "nacionales e internacionales"
    },
    {
      icon: BsBuilding,
      number: "11",
      label: "Comunidades",
      description: "colaboradoras participantes"
    }
  ];

  const chartData = [
    { label: 'DevSecOps', percentage: 25, color: '#d90845' },
    { label: 'DevOps', percentage: 15, color: '#007bff' },
    { label: 'MLOps', percentage: 15, color: '#28a745' },
    { label: 'AIOps', percentage: 15, color: '#ffc107' },
    { label: 'PrivacyOps', percentage: 15, color: '#6f42c1' },
    { label: 'SecOps', percentage: 15, color: '#fd7e14' }
  ];

  return (
    <section className="last-edition-section">
      <div className="container">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <h2 className="text-center margin-top">Datos de la Edición Anterior</h2>
          <p className="text-center">
            Los números de nuestra <span className='heading'><strong>X-Ops Conference 2024</strong></span> que demuestran 
            el éxito y el impacto de nuestro evento.
          </p>
        </AnimationWrapper>

        {/* Statistics Grid */}
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

        {/* Pie Chart Section */}
        <div className="row justify-content-center margin-top">
          <div className="col-lg-8">
            <AnimationWrapper animation="fade-up" duration={1500}>
              <h4 className="text-center mb-4">Distribución de Contenidos por Área</h4>
              <div className="pie-chart-container">
                <div className="pie-chart"></div>
                <div className="chart-legend">
                  {chartData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: item.color }}
                      ></div>
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