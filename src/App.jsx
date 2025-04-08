import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/xops.png";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'; //agrego NavDropdown para hacer submenús
import ScrollHandler from './ScrollHandler';
import Home from './pages/Home';
import Organizer from './pages/Organizer';  // Este es el Organizer principal
import Sponsor from './pages/Sponsor';
import Home2024 from './pages/archive/2024/Home2024';
import Organizer2024 from './pages/archive/2024/Organizer2024';  // Este es el Organizer2024
import Home2023 from './pages/archive/2023/Home2023';
import Organizer2023 from './pages/archive/2023/Organizer2023';    // Este es el Organizer2023
import Events2023 from './pages/archive/2023/Events2023';    // Este es el Events2023
import Events2024 from './pages/archive/2024/Events2024'; 
import './styles/Custom.css';
import './styles/PricingTable.css';
function App() {




  return (
    <>
<Router basename="/">
<ScrollHandler />
<div className="root home-main-section">
        <Navbar bg="light" expand="lg" className='header'>
        <Navbar.Brand className='text-white font-weight-bold'>XOPS CONFERENCE</Navbar.Brand>
        <img src={logo} alt="Jane Doe" style={{ height: '51px', width: '56px' }} />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='toggle'/>
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
            <Link className='links px-4 font-weight-bold text-white' to="/#events" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>EVENTO</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/#ponentes" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>PONENTES</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Sponsor#patrocinio"  style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>CONVIERTETE EN PATROCINADOR</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Organizer#organizr" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>ORGANIZADORES</Link>
                <NavDropdown id="basic-nav-dropdown" className='links px-4 font-weight-bold text-white' style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>EVENTOS ANTERIORES
  {/* Submenú XOPS 2024 */}
                  <NavDropdown title="XOPS 2024" id="basic-nav-dropdown-2024">
                    <NavDropdown.Item as={Link} to="/archive/2024/Events2024">Eventos 2024</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/archive/2024/Organizer2024">Organizadores 2024</NavDropdown.Item>
                  </NavDropdown>

                <NavDropdown.Divider /> {/* Divisor entre 2024 y 2023 */}

  {/* Submenú XOPS 2023 */}
                  <NavDropdown title="XOPS 2023" id="basic-nav-dropdown-2023">
                    <NavDropdown.Item as={Link} to="/archive/2023/Events2023">Eventos 2023</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/archive/2023/Organizer2023">Organizadores 2023</NavDropdown.Item>
                  </NavDropdown>
                </NavDropdown>                                            
            </Nav>
        <a href="https://www.eventbrite.es/e/entradas-xops-conference-1049115200807?aff=oddtdtcreator" className="button menu-btn" style={{ textDecoration: 'none' }}>
            TICKETS
        </a>

        </Navbar.Collapse>
    </Navbar>

    <div className='Hero-section d-flex align-items-center justify-content-center text-center'>
      <div className="d-flex align-items-center justify-content-center text-center text-white py-5">
        <div className="container">
            <h1 className="display-4 font-weight-bold">¡ÚNETE A LA REVOLUCIÓN X-OPS!</h1>
            <p className="lead">El mundo de las IT está cambiando. Únete a nosotros en la X-Ops Conference, donde descubrirás cómo la tecnología y las personas adecuadas están impulsando el cambio.        </p>
            <p className="lead">Fecha: Noviembre 2024 </p>
            <div className="mt-4 mx-4">
            <a href="https://www.eventbrite.es/e/entradas-xops-conference-1049115200807?aff=oddtdtcreator" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">Compra tu entrada</a>
                <Link className="btn mx-2  my-2 btn-outline-light btn-lg" to="/#events">Ver agenda</Link>
            </div>
        </div>
    </div>

    </div>

      </div>


      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Organizer" element={<Organizer />} /> {/* Organizador principal */}
          <Route path="/Sponsor" element={<Sponsor />} />
          <Route path="archive/2024/Home2024" element={<Home2024 />} />
          <Route path="archive/2024/Organizer2024" element={<Organizer2024 />} /> {/* Organizador 2024 */}
          <Route path="archive/2023/Home2023" element={<Home2023 />} />
          <Route path="archive/2023/Organizer2023" element={<Organizer2023 />} /> {/* Organizador 2023 */}
          <Route path="/archive/2023/Events2023" element={<Events2023 />} /> {/* Eventos 2023 */}
          <Route path="/archive/2024/Events2024" element={<Events2024 />} /> {/* Eventos 2023 */}
        </Routes>


    <footer className="bg-black text-white footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Dirección</h5>
            <p>Universidad Politécnica de Madrid</p>
            <p>M-40, Puente de Vallecas, 28031 Madrid.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Contactos</h5>
            <p>Email: <a href="mailto:info@xopsconference.com" className="text-white">info@xopsconference.com</a></p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Enlaces</h5>
            <ul className="list-unstyled">

            <Nav className="mx-auto ">
            <Link className="text-white" to="/#events" style={{textDecoration: 'none' }}>Evento</Link>
            </Nav>
              <li><a href="https://xopsconference.com" target="_blank" rel="noopener noreferrer" className="text-white">www.xopsconference.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-3">
        <p>&copy; 2024 - X-Ops Conference Madrid</p>
        <p>Teléfono: <a href="tel:+34744644873" className="text-white">+34744644873</a> / <a href="tel:+34693814098" className="text-white">+34693814098</a></p>
      </div>
    </footer>
    </Router>
    </>
  )
}

export default App
