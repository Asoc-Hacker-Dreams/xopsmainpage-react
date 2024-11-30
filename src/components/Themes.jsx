import AnimationWrapper from './AnimationWrapper';
import Theme1 from '../assets/theme1.jfif';
import Theme2 from '../assets/theme2.jfif';
import Theme3 from '../assets/theme3.jpeg';

const Themes = () => {
  return (
    <section className="key-themes-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <div className="container">
          <h6 className="heading text-center text-uppercase"></h6>
          <h2 className="text-center font-weight-bold">Temas Clave de la Conferencia</h2>
          <p className="mt-4">
            La X-Ops Conference Madrid contará con una agenda completa y diversa que abarcará temas clave como automatización de pruebas de seguridad, integración continua, entrega continua, monitoreo y análisis de seguridad, arquitecturas seguras, y mucho más. 
            Los participantes podrán explorar las últimas tendencias y descubrir cómo implementar prácticas de X-Ops de manera efectiva en sus organizaciones.
          </p>
          
          <div className="row mt-5">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme1} className="card-img-top" alt="Tema 1" />
                <div className="card-body">
                  <h5 className="card-title">Nuestro Objetivo</h5>
                  <p className="card-text">
                    El objetivo principal de la conferencia es reunir a expertos, líderes de la industria, desarrolladores,
                    ingenieros de seguridad y otros profesionales del sector para compartir conocimientos, experiencias
                    y mejores prácticas en el ámbito de X-Ops. Durante el evento, los asistentes tendrán la oportunidad
                    de aprender de los mejores, asistir a charlas magistrales, participar en talleres prácticos, conocer las últimas
                    herramientas y tecnologías, y establecer conexiones valiosas en el mundo X-Ops.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme2} className="card-img-top" alt="Tema 2" />
                <div className="card-body">
                  <h5 className="card-title">¿Dónde y Cuándo?</h5>
                  <p className="card-text">
                    La X-Ops Conference Madrid se llevará a cabo los días 22 y 23 de Noviembre en el Auditorio del ETSISI en el Campus Sur de la Universidad Politécnica de Madrid, en Vallecas. La agenda de la conferencia cubrirá temas como automatización de pruebas de seguridad, integración continua, entrega continua, monitoreo y arquitecturas seguras. Será un entorno ideal para aprender e implementar prácticas de X-Ops en sus organizaciones.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card">
                <img src={Theme3} className="card-img-top" alt="Tema 3" />
                <div className="card-body">
                  <h5 className="card-title">El Futuro del Trabajo</h5>
                  <p className="card-text">
                    Este evento transformador reúne a expertos y líderes de la industria, impactando significativamente a los participantes. Al finalizar, los asistentes habrán adquirido conocimientos prácticos sobre las últimas herramientas en X-Ops, mejorando sus habilidades y la eficiencia en sus organizaciones. Las charlas y talleres permitirán implementar mejores prácticas, mientras que las conexiones establecidas promoverán redes de colaboración y un entorno de aprendizaje continuo en la comunidad de seguridad y desarrollo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 
          <div className="text-center mt-4">
            <a href="#register" className="button btn-lg">Regístrate ahora</a>
          </div>
          */}
        </div>
      </AnimationWrapper>
    </section>
  );
};

export default Themes;
