import AnimationWrapper from '../../../components/AnimationWrapper';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const Madrid22 = () => {

  const [tercerS, settercerS] = useState(false);
  const tercerHid = () => settercerS(false);
  const tercerShow = () => settercerS(true);

  const [quartoS, setquartoS] = useState(false);
  const quartoHid = () => setquartoS(false);
  const quartoShow = () => setquartoS(true);

  const [sestoS, setsestoS] = useState(false);
  const sestoHid = () => setsestoS(false);
  const sestoShow = () => setsestoS(true);

  const [doceS, setdoceS] = useState(false);
  const doceHid = () => setdoceS(false);
  const doceShow = () => setdoceS(true);

  const [treceS, settreceS] = useState(false);
  const treceHid = () => settreceS(false);
  const treceShow = () => settreceS(true);

  const [octavoS, setoctavoS] = useState(false);
  const octavoHid = () => setoctavoS(false);
  const octavoShow = () => setoctavoS(true);

  const [nuevS, setnuevS] = useState(false);
  const nuevHid = () => setnuevS(false);
  const nuevShow = () => setnuevS(true);

  const [diezS, setdiezS] = useState(false);
  const diezHid = () => setdiezS(false);
  const diezShow = () => setdiezS(true);

  const [onceS, setonceS] = useState(false);
  const onceHid = () => setonceS(false);
  const onceShow = () => setonceS(true);

  const [catorceS, setcatorceS] = useState(false);
  const catorceHid = () => setcatorceS(false);
  const catorceShow = () => setcatorceS(true);

  return (
    <section id="events" className="event-schedule-section">

      <AnimationWrapper animation="fade-up" duration={1500}>
      <h2 className="text-center margin-top">Viernes 22 de noviembre de 2024</h2>
      <div className="container mt-5">
        <div className="row">

          {/* Register Evento */}
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

          {/* Opening Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeuD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Inicio: </span>Salón de Actos</h5>
                <p className="card-text">10:00 h - 30 min</p>
                <p>Dar la bienvenida a los asistentes y keynote del evento.</p>
              </div>
            </div>
          </div>

          {/* Aga B. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">10:30 h - 30 min</p>
                <p>Scaling AI Workloads with Kubernetes: Orchestrating Success.</p>
                <p>Aga Bielak</p>

                <button onClick={tercerShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={tercerS}
                    onHide={tercerHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Scaling AI Workloads with Kubernetes: Orchestrating Success.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Discover proven strategies to successfully deploy and scale AI workloads within Google Kubernetes Engine (GKE). This session will provide a practical guide to optimizing resource allocation, maximizing GPU utilization, and streamlining distributed training processes. Delve into best practices, specialized tools, and GCP features to ensure your AI projects achieve optimal performance and scalability on Kubernetes. Leave with actionable insights to enhance your AI cloud implementations.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Aga Bielak</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                                10:30 h - 30 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {/* Juan V. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:00 h - 30 min</p>
                <p>Un puente entre MLOps y DevOps con OpenShift AI.</p>
                <p>Juan Vicente Herrera Ruiz de Alejo</p>

                <button onClick={sestoShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={sestoS}
                    onHide={sestoHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Un puente entre MLOps y DevOps con OpenShift AI.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Red Hat OpenShift AI (RHOAI) es una plataforma para que científicos de datos, profesionales de IA, desarrolladores, ingenieros de aprendizaje automático y equipos de operaciones prototipen, construyan, implementen y monitoreen modelos de IA.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Juan Vicente Herrera Ruiz de Alejo</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            11:00 h - 30 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Natalie G. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanaresD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">11:30 h - 50 min</p>
                <p>Building a cloud-native data platform with security in mind.</p>
                <p>Natalie Godec</p>

                <button onClick={quartoShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={quartoS}
                    onHide={quartoHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Building a cloud-native data platform with security in mind.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      In today's world data is king. Cloud technologies enable us to build robust, scalable, and easy-to-use platforms quickly.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Natalie Godec</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            11:30 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Break Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardgranV">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Pasillo principal</h5>
                <p className="card-text">12:20 h - 40 min</p>
                <p>Pausa para café.</p>
              </div>
            </div>
          </div>

          {/* Oscar C. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">13:00 h - 60 min</p>
                <p>Ambientes efímeros con Serverless y Custom Resources.</p>
                <p>Oscar Cortes Bracho</p>

                <button onClick={doceShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={doceS}
                    onHide={doceHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Ambientes efímeros con Serverless y Custom Resources</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Cómo construir ambientes efímeros en GitLab CI/CD que acompañen el ciclo de vida de una funcionalidad.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Oscar Cortes Bracho</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            13:00 h - 60 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

        {/* Break Evento */}
        <div className="col-md-6 mb-4">
            <div className="card cardgranV">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Pasillo principal</h5>
                <p className="card-text">14:50 h - 70 min</p>
                <p>Pausa para comer.</p>
              </div>
            </div>
          </div>

          {/* Gabriela G. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">16:00 h - 50 min</p>
                <p>SDLC con OWASP.</p>
                <p>Gabriela García</p>

                <button onClick={treceShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={treceS}
                    onHide={treceHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>SDLC con OWASP</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Cómo integrar la seguridad en cada etapa del SDLC utilizando las directrices de OWASP.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Gabriela García
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            16:00 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Alejandro A. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitano">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">16:50 h - 50 min</p>
                <p>Descubre y aplica la estrategia que utilizan XOPS para mejorar de trabajo.</p>
                <p>Alejandro Acosta</p>

                <button onClick={octavoShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={octavoS}
                    onHide={octavoHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Descubre y aplica la estrategia que utilizan XOPS para mejorar de trabajo.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Estrategias para mejorar de trabajo y conseguir mejores oportunidades en el mercado de Cloud Ops.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Alejandro Acosta</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            16:50 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* David S. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroTD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">17:40 h - 40 min</p>
                <p>Adopting Linked Open Data in Product Security: a Modular Knowledge Graph.</p>
                <p>David Sastre</p>

                <button onClick={nuevShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={nuevS}
                    onHide={nuevHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Adopting Linked Open Data in Product Security: a Modular Knowledge Graph.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Implementación de Linked Open Data (LOD) en el ámbito de la seguridad de productos.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>David Sastre</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            17:40 h - 40 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Alvaro R. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">18:20 h - 50 min</p>
                <p>Securing Kubernetes Workloads: From Code to Cluster.</p>
                <p>Álvaro Revuelta M.</p>

                <button onClick={diezShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={diezS}
                    onHide={diezHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Securing Kubernetes Workloads: From Code to Cluster</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Securing Kubernetes workloads from coding to deployment. Tools like Kube-hunter and Trivy.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Álvaro Revuelta M.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            18:20 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Antonio B. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardministeriosD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">19:10 h - 50 min</p>
                <p>Istio Ambient Mesh: Sidecar vs Sidecar-less like if I am 10 years old.</p>
                <p>Antonio Berben</p>

                <button onClick={onceShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={onceS}
                    onHide={onceHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Istio Ambient Mesh: Sidecar vs Sidecar-less like if I am 10 years old</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    The difference between the Sidecar model and the Sidecar-less model in Istio Service Mesh.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Antonio Berben</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            19:10 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Pablo G. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">20:00 h - 60 min</p>
                <p>Instalación de Whonix en QEMU/KVM.</p>
                <p>Pablo Gómez - Caldito</p>

                <button onClick={catorceShow} className="button menu-btn">Más Detalles</button>

                <Modal
                    show={catorceS}
                    onHide={catorceHid}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Instalación de Whonix en QEMU/KVM</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Cómo instalar Whonix sobre QEMU/KVM como alternativa a los hipervisores propietarios.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Pablo Gómez - Caldito</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            20:00 h - 60 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* End Evento */}
         <div className="col-md-6 mb-4">
            <div className="card cardpuertaA">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón de Actos</h5>
                <p className="card-text">21:00 h</p>
                <p>Cierre.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </AnimationWrapper>  
    </section>    

  );   

};   

export default Madrid22;
