import AnimationWrapper from './AnimationWrapper';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const EventSchedule = () => {

  const [modal1, setModal1] = useState(false);
  const modal1Hid = () => setModal1(false);
  const modal1Show = () => setModal1(true);

  const [modal2, setModal2] = useState(false);
  const modal2Hid = () => setModal2(false);
  const modal2Show = () => setModal2(true);

  const [modal3, setModal3] = useState(false);
  const modal3Hid = () => setModal3(false);
  const modal3Show = () => setModal3(true);

  const [modal4, setModal4] = useState(false);
  const modal4Hid = () => setModal4(false);
  const modal4Show = () => setModal4(true);

  const [modal5, setModal5] = useState(false);
  const modal5Hid = () => setModal5(false);
  const modal5Show = () => setModal5(true);

  const [modal6, setModal6] = useState(false);
  const modal6Hid = () => setModal6(false);
  const modal6Show = () => setModal6(true);

  const [modal7, setModal7] = useState(false);
  const modal7Hid = () => setModal7(false);
  const modal7Show = () => setModal7(true);

  const [modal8, setModal8] = useState(false);
  const modal8Hid = () => setModal8(false);
  const modal8Show = () => setModal8(true);

  const [modal9, setModal9] = useState(false);
  const modal9Hid = () => setModal9(false);
  const modal9Show = () => setModal9(true);

  const [modal10, setModal10] = useState(false);
  const modal10Hid = () => setModal10(false);
  const modal10Show = () => setModal10(true);

  const [modal11, setModal11] = useState(false);
  const modal11Hid = () => setModal11(false);
  const modal11Show = () => setModal11(true);

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
      <h2 className="text-center margin-top">Viernes 21 de noviembre de 2025</h2>
      <div className="container mt-5">
        <div className="row">

          {/* Registro */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeu">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Registro: </span>Salón de Actos</h5>
                <p className="card-text">9:00 h - 60 min</p>
                <p>Registro de asistentes.</p>
              </div>
            </div>
          </div>

          {/* Apertura */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeuD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Inicio: </span>Salón de Actos</h5>
                <p className="card-text">10:00 h - 30 min</p>
                <p>Bienvenida y keynote del evento.</p>
              </div>
            </div>
          </div>

          {/* Shani Adadi Kazaz */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">10:00 h - 50 min</p>
                <p>Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure</p>
                <p>Shani Adadi Kazaz</p>
                <button onClick={modal1Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal1} onHide={modal1Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Kubernetes as a Platform</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Shani Adadi Kazaz</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>10:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Verónica Rivas + Toni Granell */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">10:50 h - 50 min</p>
                <p>Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps</p>
                <p>Verónica Rivas Remiseiro, Toni Granell</p>
                <button onClick={modal2Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal2} onHide={modal2Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Análisis Predictivo con Copilot</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Verónica Rivas Remiseiro, Toni Granell</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>10:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Gisela Torres */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:00 h - 50 min</p>
                <p>Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering</p>
                <p>Gisela Torres</p>
                <button onClick={modal3Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal3} onHide={modal3Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Platform Engineering</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Gisela Torres</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>11:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Juan Vicente Herrera */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:50 h - 50 min</p>
                <p>Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI</p>
                <p>Juan Vicente Herrera Ruiz de Alejo</p>
                <button onClick={modal4Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal4} onHide={modal4Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Secure by Design</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Juan Vicente Herrera Ruiz de Alejo</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>11:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Carlos Villanúa */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">12:00 h - 50 min</p>
                <p>$Git It Done: API Management as Code (The DevOps &amp; Platform Team Dream)</p>
                <p>Carlos Villanúa</p>
                <button onClick={modal5Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal5} onHide={modal5Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>$Git It Done</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    $Git It Done: API Management as Code (The DevOps &amp; Platform Team Dream)
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Carlos Villanúa</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>12:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Patricia + Almudena */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitano">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">12:50 h - 50 min</p>
                <p>Microsoft Fabric meets AI: Building real-world business solutions</p>
                <p>Patricia Rodríguez Vaquero, Almudena Zhou Ramírez López</p>
                <button onClick={modal6Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal6} onHide={modal6Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Microsoft Fabric meets AI</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Microsoft Fabric meets AI: Building real-world business solutions
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Patricia Rodríguez Vaquero, Almudena Zhou Ramírez López</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>12:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Comida */}
          <div className="col-md-6 mb-4">
            <div className="card cardgranV">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Pasillo principal</h5>
                <p className="card-text">13:40 h - 70 min</p>
                <p>Pausa para comer.</p>
              </div>
            </div>
          </div>

          {/* Jeff Fan */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroTD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">13:50 h - 50 min</p>
                <p>Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards</p>
                <p>Jeff Fan</p>
                <button onClick={modal7Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal7} onHide={modal7Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Make Rival GPUs Play Nice</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Jeff Fan</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>13:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Alberto Morgante */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">14:00 h - 50 min</p>
                <p>Automated Baremetal deployment with CAPI + ClusterClass</p>
                <p>Alberto Morgante</p>
                <button onClick={modal8Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal8} onHide={modal8Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Automated Baremetal deployment</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Automated Baremetal deployment with CAPI + ClusterClass
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Alberto Morgante</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>14:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Juarez Junior */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">14:50 h - 50 min</p>
                <p>Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase</p>
                <p>Juarez Junior</p>
                <button onClick={modal9Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal9} onHide={modal9Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Automating Database CI/CD</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Juarez Junior</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>14:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Ignacio Dominguez */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">15:00 h - 50 min</p>
                <p>Hacking CI/CD Pipelines</p>
                <p>Ignacio Dominguez</p>
                <button onClick={modal10Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal10} onHide={modal10Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Hacking CI/CD Pipelines</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Hacking CI/CD Pipelines
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Ignacio Dominguez</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>15:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Dachi Gogotchuri */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitanoD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">15:50 h - 50 min</p>
                <p>IA generativa en DevSecOps: automatización inteligente de pipelines</p>
                <p>Dachi Gogotchuri</p>
                <button onClick={modal11Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal11} onHide={modal11Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>IA generativa en DevSecOps</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    IA generativa en DevSecOps: automatización inteligente de pipelines
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Dachi Gogotchuri</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>15:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Cierre */}
          <div className="col-md-6 mb-4">
            <div className="card cardpuertaA">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">16:40 h</p>
                <p>Cierre del primer día.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </AnimationWrapper>
    </section>
  );
};

export default EventSchedule;
