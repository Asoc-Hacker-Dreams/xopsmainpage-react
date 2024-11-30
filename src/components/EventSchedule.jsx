import AnimationWrapper from './AnimationWrapper';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const EventSchedule = () => {

  const [tercerS, settercerS] = useState(false);
  const tercerHid = () => settercerS(false);
  const tercerShow = () => settercerS(true);


  const [quartoS, setquartoS] = useState(false);
  const quartoHid = () => setquartoS(false);
  const quartoShow = () => setquartoS(true);

  const [sestoS, setsestoS] = useState(false);
  const sestoHid = () => setsestoS(false);
  const sestoShow = () => setsestoS(true);

  const [septS, setseptS] = useState(false);
  const septHid = () => setseptS(false);
  const septShow = () => setseptS(true);

  const [octavoS, setoctavoS] = useState(false);
  const octavoHid = () => setoctavoS(false);
  const octavoShow = () => setoctavoS(true);

  const [diezS, setdiezS] = useState(false);
  const diezHid = () => setdiezS(false);
  const diezShow = () => setdiezS(true);

  const [onceS, setonceS] = useState(false);
  const onceHid = () => setonceS(false);
  const onceShow = () => setonceS(true);

  const [doceS, setdoceS] = useState(false);
  const doceHid = () => setdoceS(false);
  const doceShow = () => setdoceS(true);

  return (
    <section id="events" className="event-schedule-section">

      <AnimationWrapper animation="fade-up" duration={1500}>

      <h2 className="text-center margin-top">Agenda</h2>
      <h2 className="text-center margin-top">Viernes 22 de noviembre de 2024</h2>
      <div className="container mt-5">
        <div className="row">

          {/* Register Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeu">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Registro: </span>Salón Actos</h5>
                <p className="card-text">9:00 h - 60 min</p>
                <p>Registro de clientes y organización.</p>
              </div>
            </div>
          </div>

          {/* Openint Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeuD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Inicio:  </span>Salón Actos</h5>
                <p className="card-text">10:00 h - 30 min</p>
                <p>Establecer el tono del evento y dar la bienvenida a los asistentes.</p>
              </div>
            </div>
          </div>

          {/* Aga B. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span> Salón Actos</h5>
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
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Hila Fish</p>
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

          {/* Oscar C. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">11:00 h - 60 min</p>
                <p>Ambientes efímeros con Serverless y Custom Resources.</p>
                <p>Oscar Cortes Bracho</p>

                <button onClick={sestoShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={sestoS} 
                    onHide={sestoHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Navegando por el caos: un enfoque holístico para la gestión de incidentes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Uno de los principales problemas que encontramos cuando trabajamos con Serverless a nivel arquitectura, es el paso de los ambientes de desarrollo y testing a los ambientes productivos, la misma naturaleza del Serverless hace que sea complejo la validación de manera local delas nuevas funcionalidades, esto conlleva tener que validar las features en el Cloud provider directamente que dependiendo de distintos factores puede ser un cuello de botella.
                    <br />
                    <br />
                    Aquí es donde aparecen los ambientes de desarrollo efímeros que puedan vivir lo que la funcionalidad demore desarrollándose; sin embargo, esto no es tan simple de implementar en la práctica
                    <br />
                    <br />
                    Por otro lado, tenemos la dificultad de que necesitamos hidratar con datos los ambientes de Test y Desarrollo para validar nuestras funcionalidades, y además en ocasiones la necesidad de personalizarlos, para esto herramientas como Custom Resources con CloudFormation pueden ser de mucha utilizar
                    <br />
                    <br />
                    El objetivo de esta charla será mostrar como construir ambientes efímeros en GitLab CI/CD
                    que acompañen el ciclo de vida de una funcionalidad, desplegar en AWS ante la creación de la rama y destruirlos ante la propuesta del un Merge Request, customizando recursos como las bases de datos en estos ambientes, hidratando con datos específicos.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Oscar Cortes Bracho</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            11:00 h - 60 min
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
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">12:00 h - 60 min</p>
                <p>Pausa para café.</p>
                <br />
                <p>Break.</p>
              </div>
            </div>
          </div>

          {/* Pablo G. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardplazaM">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">13:00 h - 60 min</p>
                <p>Instalación de Whonix en QEMU/KVM.</p>
                <p>Pablo Gómez - Caldito</p>

                <button onClick={doceShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={doceS} 
                    onHide={doceHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Instalación de Whonix en QEMU/KVM</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Después de asistir a este Lugar, habrá instalado Whonix en su computadora portátil sobre QEMU/KVM. También mostrará cómo funciona QEMU/KVM como una mejor alternativa a los hipervisores propietarios.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Pablo Gómez - Caldito</p>
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

          {/* Natalie G. Evento */} 
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanaresD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">14:00 h - 50 min</p>
                <p>Creación de una plataforma de datos nativa de la nube teniendo en cuenta la seguridad.</p>
                <p>Natalie Godec</p>

                <button onClick={septShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={septS} 
                    onHide={septHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Creación de una plataforma de datos nativa de la nube teniendo en cuenta la seguridad.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    En el mundo actual, los datos son los reyes. Está en todas partes y aparentemente todos lo recopilan; sin embargo, muchas industrias carecen de una buena plataforma de datos. Las tecnologías en la nube nos permiten construir rápidamente plataformas robustas, escalables y fáciles de usar, pero uno podría preguntarse si almacenar datos confidenciales en la nube es seguro. En esta charla, exploraremos los principios técnicos para proteger una plataforma de datos en la nube, veremos ejemplos en AWS y GCP y analizaremos los requisitos normativos y de cumplimiento.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Natalie Godec</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            14:00 h - 50 min
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
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">14:50 h - 50 min</p>
                <p>Descubre y aplica la estrategia que utilizan xOPS para mejorar de trabajo.</p>
                <p>Alejandro Acosta</p>

                <button onClick={octavoShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={octavoS} 
                    onHide={octavoHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Descubre y aplica la estrategia que utilizan xOPS para mejorar de trabajo.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Hablaremos de estrategias que te permitirán mejorar de trabajo y conseguir mejores oportunidades para que puedas tener entrevistas en empresas que te gustaría trabajar y poder pasar esas entrevistas en el mercado de Cloud Ops.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Alejandro Acosta</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            14:50 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Joaquin M. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroTD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">15:40 h - 50 min</p>
                <p>AzureDevOps y la Ciberseguridad.</p>
                <p>Joaquin Molina</p>

                <button onClick={octavoShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={octavoS} 
                    onHide={octavoHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>AzureDevOps y la ciberseguridad.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    En la charla veremos varios aspectos de la ciberseguridad de este entorno, tanto ataque como detección.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Joaquin Molina</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            15:40 h - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Break Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmetropolitanoD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">16:30 h - 60 min</p>
                <p>Lunch.</p>
                <br />
                <p>Break.</p>
              </div>
            </div>
          </div>

          {/* Jon R. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardministerios">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">17:30 h - 50 min</p>
                <p>Cilium: Seguridad y Observabilidad en Redes con EBPF.</p>
                <p>Jon Rodriguez Aranguren.</p>

                <button onClick={diezShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={diezS} 
                    onHide={diezHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cilium: Seguridad y Observabilidad en Redes con EBPF</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Descubre cómo Cilium, con la potencia de eBPF, está cambiando las reglas del juego en la seguridad y el monitoreo de redes modernas. Esta charla te mostrará ejemplos reales de cómo Cilium permite controlar el tráfico de red de forma precisa y proteger tus sistemas frente a amenazas sin afectar el rendimiento. También aprenderás a implementar políticas de seguridad flexibles y a obtener una visibilidad completa del tráfico en entornos de microservicios.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Jon Rodriguez A.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            17:30 h - 50 min
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
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">18:20 h - 50 min</p>
                <p>Proteger las cargas de trabajo de Kubernetes: del código al clúster.</p>
                <p>Álvaro Revuelta M.</p>

                <button onClick={diezShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={diezS} 
                    onHide={diezHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Proteger las cargas de trabajo de Kubernetes: del código al clúster</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Esta charla se centra en proteger las cargas de trabajo de Kubernetes y recorrer todo el proceso; desde la codificación hasta la implementación. Cubre la protección de imágenes de contenedores, la configuración de políticas y la garantía de una comunicación segura entre microservicios. Además de escanear continuamente en busca de vulnerabilidades descubiertas recientemente.
                    <br />
                    <br />
                    Los asistentes aprenderán a utilizar herramientas como Kube-hunter y Trivy para gestionar vulnerabilidades y garantizar que sus clústeres permanezcan seguros a lo largo del tiempo.
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
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">19:10 h - 50 min</p>
                <p>Istio Ambient Mesh: Sidecar vs Sidecar-less como si tuviera 10 años.</p>
                <p>Antonio Berben</p>

                <button onClick={onceShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={onceS} 
                    onHide={onceHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Istio Ambient Mesh: Sidecar vs Sidecar-less como si tuviera 10 años</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    En esta charla explicaremos en un inglés sencillo y sin palabras de moda la diferencia entre el modelo con Sidecar y el modelo sin Sidecar.
                    <br />
                    <br />
                    Para Service Meshes, el modelo sidecar era la única forma viable de garantizar que la malla pudiera tomar el control de la red de aplicaciones.
                    <br />
                    <br />
                    Con la evolución de Kubernetes, esa afirmación ha quedado obsoleta.
                    <br />
                    <br />
                    Hoy, Istio Service Mesh ha traído la alternativa. Un modelo que reduce la cantidad de recursos necesarios para hacer posible la malla y elimina la sensación de que Istio está ahí.
                    <br />
                    <br />
                    Con Istio Ambient Mesh, el usuario que implementa una carga de trabajo en Kubernetes no nota que la aplicación es parte de una malla. Es totalmente transparente.
                    <br />
                    <br />
                    Conclusiones clave:
                    <br />
                    - Concepto de malla de servicios.
                    <br />
                    - Concepto de sidecar.
                    <br />
                    - Concepto de Sidecar-less.
                    <br />
                    - Desafíos resueltos por el modo sin Sidecar en comparación con el modo Sidecar.
                    <br />
                    - Istio Ambient Mesh y sus componentes.
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

          {/* Juan V. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroTD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
                <p className="card-text">20:00 h - 30 min</p>
                <p>Un puente entre MLOps y DevOps con OpenShift AI.</p>
                <p>Juan Vicente Herrera Ruiz de Alejo</p>

                <button onClick={quartoShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={quartoS} 
                    onHide={quartoHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Navegando por el caos: un enfoque holístico para la gestión de incidentes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Red Hat OpenShift AI (RHOAI) es una plataforma para que científicos de datos, profesionales de IA, desarrolladores, ingenieros de aprendizaje automático y equipos de operaciones prototipen, construyan, implementen y monitoreen modelos de IA. Mostraremos como usarla en una demo en vivo.
                    <br />
                    <br />
                    Una de las principales dificultades a las que se enfrentan los proyectos de IA es la brecha entre la ciencia de datos y la ingeniería. Los equipos de ingeniería y operaciones no siempre están familiarizados con las complejidades de la inteligencia artificial, la ciencia de datos y el aprendizaje automático. Del mismo modo, los científicos de datos a veces carecen de los recursos de ingeniería y la experiencia para crear, implementar y monitorear modelos en entornos de nube modernos.
                    <br />
                    <br />
                    Las operaciones de aprendizaje automático (MLOps) ayudan a las organizaciones a resolver este desafío. MLOps se inspira en los principios de DevOps y aporta muchos de los beneficios de DevOps a los proyectos de IA, optimizando todo el ciclo de vida de los modelos de ML.
                    <br />
                    <br />
                    Operacionalizar el ciclo de vida del ML: Muchas organizaciones luchan por llevar sus modelos de IA más allá de las etapas de capacitación porque los equipos que entrenan estos modelos carecen de las herramientas para implementar, entregar y mantener sistemas basados ​​en IA en producción. Para resolver este problema, RHOAI proporciona herramientas como entornos de trabajo estables, canales de integración y despliegue continuos (CI/CD) y marcos de servicio de modelos.
                    <br />
                    <br />
                    Con estas herramientas, los usuarios pueden poner en funcionamiento sus flujos de trabajo de aprendizaje automático y lograr reproducibilidad, impulsar la automatización, una mejor colaboración, ahorro de costos y una mejor gobernanza y cumplimiento.
                    <br />
                    <br />
                    Entornos de trabajo de aprendizaje automático complejos: Los profesionales de la IA a menudo luchan por integrar y mantener la gran cantidad de herramientas, bibliotecas y versiones necesarias para la ciencia de datos y el aprendizaje automático, incluido el importante esfuerzo necesario para configurar el soporte y los controladores de GPU y mantenerlos actualizados. RHOAI proporciona a los científicos de datos entornos de trabajo listos para usar que están preconfigurados con bibliotecas y herramientas estándar de IA/ML.
                    <br />
                    <br />
                    Se mostrará como ejecutar en la plataforma trainings y tests de sencillos modelos (LLMs) en una demo en tiempo real.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Juan V. H. Ruiz de Alejo</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            20:00 h - 30 min
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
                <h5 className="card-title"><span className='heading'>Lugar: </span>Salón Actos</h5>
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

export default EventSchedule;

