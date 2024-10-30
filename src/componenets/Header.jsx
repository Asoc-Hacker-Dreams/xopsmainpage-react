import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from "../assets/xops.png";

const Header = () => {

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

    const scrollToEvents = () => {

        ponentes
        
        const element = document.getElementById('events');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <Router>
        <Navbar bg="light" expand="lg" className='header'>
        <Navbar.Brand href="#home" className='text-white font-weight-bold'>XOPS CONFERENCE</Navbar.Brand>
        <img src={logo} alt="Jane Doe" style={{ height: '51px', width: '56px' }} />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
            <Nav.Link onClick={scrollToEvents} className='links px-4 font-weight-bold text-white' href="#inicio">EVENTO</Nav.Link>
                <Nav.Link onClick={scrollToPonentes} className='links px-4 font-weight-bold text-white' href="#inicio">PONENTES</Nav.Link>
                <Nav.Link onClick={scrollToPatrocinio} className='links px-4 font-weight-bold text-white ' href="#vuélvete-patrocinador">CONVIERTE PATROCINADOR</Nav.Link>
                <Nav.Link className='links px-4 font-weight-bold text-white' href="#tickets"></Nav.Link>
            </Nav>
        <a href="https://www.eventbrite.es/e/entradas-xops-conference-1049115200807?aff=oddtdtcreator" class="button menu-btn">
            Tickets
        </a>
        </Navbar.Collapse>
    </Navbar>
    </Router>
    );
};

export default Header;
