import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/xops.png";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import Organizers from './componenets/Organizers';   
import Sponsor from './pages/Sponsor';
import './styles/Custom.css'; 
import './styles/PricingTable.css'; 
function App() {
  

  const scrollToEvents = () => {
    const element = document.getElementById('events');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

  const scrollToPatrocinio = () => {
    const element = document.getElementById('patrocinio');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const scrollToPonentes = () => {

    ponentes
    
    const element = document.getElementById('ponentes');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

  return (
    <>
<Router basename="/xops">
<div className="root home-main-section">
        <Navbar bg="light" expand="lg" className='header'>
        <Navbar.Brand href="#home" className='text-white font-weight-bold'>XOPS CONFERENCE</Navbar.Brand>
        <img src={logo} alt="Jane Doe" style={{ height: '51px', width: '56px' }} />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
            <Link onClick={scrollToEvents} className='links px-4 font-weight-bold text-white' to="/" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>EVENTO</Link>
                <Link onClick={scrollToPonentes} className='links px-4 font-weight-bold text-white' to="/" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>PONENTES</Link>
                <Link onClick={scrollToPatrocinio} className='links px-4 font-weight-bold text-white' to="Sponsor" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>CONVIERTE PATROCINADOR</Link>
                <Link className='links px-4 font-weight-bold text-white' to="Organizers" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>ORGANIZADORES</Link>
                <Nav.Link className='links px-4 font-weight-bold text-white' href="#tickets"></Nav.Link>
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
                <a onClick={scrollToEvents} className="btn mx-2  my-2 btn-outline-light btn-lg">Descubre más</a>
            </div>
        </div>
    </div>

    </div>

      </div>


    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Organizers" element={<Organizers />} />
        <Route path="/Sponsor" element={<Sponsor />} />
      </Routes>


    <footer className="bg-black text-white footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Dirección</h5>
            <p>Universidad Politecnica de Madrid</p>
            <p>M-40, Puente de Vallecas, 28031 Madrid.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Contactos</h5>
            <p>Email: <a href="mailto:info@xopsconference.com" className="text-white">info@xopsconference.com</a></p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Enlaces</h5>
            <ul className="list-unstyled">
              <li onClick={scrollToEvents} className="text-white">Evento</li>
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