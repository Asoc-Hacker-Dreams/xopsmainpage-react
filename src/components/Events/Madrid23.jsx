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

  return (
    <section id="events" className="event-schedule-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
      <h2 className="text-center margin-top">Sábado 22 de noviembre de 2025</h2>
      <div className="container mt-5">
        <div className="row">

          {/* Apertura día 2 */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeuD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Inicio: </span>Salón de Actos</h5>
                <p className="card-text">9:30 h - 30 min</p>
                <p>Bienvenida al segundo día del evento.</p>
              </div>
            </div>
          </div>

          {/* Guillermo Ruiz */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">10:00 h - 1h 50min</p>
                <p>Autoscaling Kubernetes Like a Pro: A Hands-On Karpenter Workshop</p>
                <p>Guillermo Ruiz</p>
                <button onClick={modal1Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal1} onHide={modal1Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Autoscaling Kubernetes Like a Pro</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Autoscaling Kubernetes Like a Pro: A Hands-On Karpenter Workshop
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Guillermo Ruiz</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>10:00 h - 1h 50min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Rossana Suarez */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">10:00 h - 50 min</p>
                <p>Migración inteligente: Containeriza tu aplicación heredada con MCP</p>
                <p>Rossana Suarez</p>
                <button onClick={modal2Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal2} onHide={modal2Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Migración inteligente</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Migración inteligente: Containeriza tu aplicación heredada con MCP
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Rossana Suarez</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>10:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Alejandro de la Hoz */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:00 h - 50 min</p>
                <p>De 0 a 100 con Ansible en AWX</p>
                <p>Alejandro de la Hoz Martin</p>
                <button onClick={modal3Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal3} onHide={modal3Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>De 0 a 100 con Ansible en AWX</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    De 0 a 100 con Ansible en AWX
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Alejandro de la Hoz Martin</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>11:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Carlos Polop */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:00 h - 50 min</p>
                <p>GCP Vulnerabilities &amp; Features of Offensive Engineers</p>
                <p>Carlos Polop</p>
                <button onClick={modal4Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal4} onHide={modal4Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>GCP Vulnerabilities</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    GCP Vulnerabilities &amp; Features of Offensive Engineers
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Carlos Polop</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>11:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Sara San Luís + Christian */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">12:10 h - 50 min</p>
                <p>Implementando un sistema de Machine Learning observable en la nube</p>
                <p>Sara San Luís Rodríguez, Christian Carballo Lozano</p>
                <button onClick={modal5Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal5} onHide={modal5Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Machine Learning observable</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Implementando un sistema de Machine Learning observable en la nube
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Sara San Luís Rodríguez, Christian Carballo Lozano</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>12:10 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Antonio Berben + Felipe */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitano">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">13:00 h - 50 min</p>
                <p>De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras</p>
                <p>Antonio Berben, Felipe Vicens</p>
                <button onClick={modal6Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal6} onHide={modal6Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>De Becario a Agente Épico</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Antonio Berben, Felipe Vicens</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>13:00 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Cleyra Uzcategui */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroTD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">13:00 h - 50 min</p>
                <p>Web UI: What's New and What's Next</p>
                <p>Cleyra Uzcategui</p>
                <button onClick={modal7Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal7} onHide={modal7Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Web UI: What's New and What's Next</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Web UI: What's New and What's Next
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Cleyra Uzcategui</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>13:00 h - 50 min</p></div>
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
                <p className="card-text">13:50 h - 60 min</p>
                <p>Pausa para comer.</p>
              </div>
            </div>
          </div>

          {/* Alkin Tezuysal */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanaresD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">14:50 h - 50 min</p>
                <p>Unified Observability: Leveraging ClickHouse as a Comprehensive Telemetry Database</p>
                <p>Alkin Tezuysal</p>
                <button onClick={modal8Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal8} onHide={modal8Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Unified Observability</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Unified Observability: Leveraging ClickHouse as a Comprehensive Telemetry Database
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Alkin Tezuysal</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>14:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Mani Ghelichkhani */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">15:50 h - 50 min</p>
                <p>Modernizing EKS workloads: Performance &amp; Cost at Scale with Graviton and Karpenter</p>
                <p>Mani Ghelichkhani</p>
                <button onClick={modal9Show} className="button menu-btn">Más Detalles</button>
                <Modal show={modal9} onHide={modal9Hid}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modernizing EKS workloads</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Modernizing EKS workloads: Performance &amp; Cost at Scale with Graviton and Karpenter
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div><p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Mani Ghelichkhani</p></div>
                    <div style={{ textAlign: 'right' }}><p className="card-text" style={{ margin: '0', padding: '0' }}>15:50 h - 50 min</p></div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* José Enrique Calderón */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">15:50 h - 50 min</p>
                <p>Evolutionary Architecture: the art of making decisions</p>
                <p>José Enrique Calderón Sanz</p>
              </div>
            </div>
          </div>

          {/* David Amorín */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitanoD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">16:50 h - 50 min</p>
                <p>Estrategias de Visualización de Datos para Comunicadores: Contando Historias con Números</p>
                <p>David Amorín García</p>
              </div>
            </div>
          </div>

          {/* Cierre */}
          <div className="col-md-6 mb-4">
            <div className="card cardpuertaA">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">17:40 h</p>
                <p>Cierre y despedida del evento.</p>
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
