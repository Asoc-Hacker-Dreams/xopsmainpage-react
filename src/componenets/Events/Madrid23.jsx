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
      <h2 className="text-center margin-top">Madrid; Sabado 23 de Noviembre de 2024</h2>
      <div className="container mt-5">
        <div className="row">

          {/* Openint Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardBernabeuD">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Inicio:</span>Salon Actos</h5>
                <p className="card-text">10:00 AM - 30 min</p>
                <p>Establecer el tono del evento y dar la bienvenida a los asistentes.</p>
              </div>
            </div>
          </div>

          {/* Santiago C. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardcuatroT">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Taller:</span>Salon Actos</h5>
                <p className="card-text">10:30 PM - 50 min</p>
                <p>El Futuro de las Operaciones con Agentes de IA: De la Automatización a la Autonomía.</p>
                <p>Santiago Castro Vilabella</p>

                <button onClick={tercerShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={tercerS} 
                    onHide={tercerHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>El Futuro de las Operaciones con Agentes de IA: De la Automatización a la Autonomía.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    En esta charla descubriremos cómo los agentes de inteligencia artificial están llegando para transformar no solo el ámbito de las operaciones, sino todas las áreas de una organización. Desde la gestión automatizada de proyectos hasta la mejora de la eficiencia operativa, los agentes están creando nuevas oportunidades para escalar, mejorar procesos y reducir costes. A través de ejemplos prácticos, veremos cómo se pueden crear y personalizar agentes con herramientas accesibles, y su potencial para convertirse en colaboradores clave en el futuro del trabajo.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Santiago Castro Vilabella</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                                10:30 PM - 50 min
                            </p>
                        </div>
                    </Modal.Footer>
                </Modal>

              </div>
            </div>
          </div>

          {/* Gabriela G. Evento */}
          <div className="col-md-6 mb-4">
            <div className="card cardmanzanares">
              <div className="overlay"></div>
              <div className="card-body text-white">
                <h5 className="card-title"><span className='heading'>Taller:</span>Salon Actos</h5>
                <p className="card-text">11:20 PM - 50 min</p>
                <p>SDLC con OWASP.</p>
                <p>Gabriela García</p>

                <button onClick={sestoShow} className="button menu-btn">Más Detalles</button>

                <Modal 
                    show={sestoS} 
                    onHide={sestoHid} 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>SDLC con OWASP</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Discutimos cómo integrar la seguridad en cada etapa del SDLC, desde la planificación hasta el mantenimiento, para crear aplicaciones robustas y seguras utilizando las directrices, elementos y software de OWASP para crear un "framework" propio de seguridad para desarrolladores.
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <p className="card-text" style={{ textAlign: 'left', margin: '0', padding: '0' }}>Gabriela García
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="card-text" style={{ margin: '0', padding: '0' }}>
                            11:20 PM - 50 min
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
                <h5 className="card-title"><span className='heading'>Taller:</span>Salon Actos</h5>
                <p className="card-text">13:40 PM - 40 min</p>
                <p>Closing.</p>
                <p>End...</p>
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

