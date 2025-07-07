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
        const element = document.getElementById('ponentes');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToEvents = () => {
        const element = document.getElementById('events');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <Navbar bg="light" expand="lg" className='header'>
        <div className="d-flex align-items-center">
            <img src={logo} alt="X-OPS Conference Logo" style={{ height: '51px', width: '56px', marginRight: '15px' }} />
            <Navbar.Brand href="#home" className='text-white font-weight-bold navbar-brand-text'>X-OPS CONFERENCE</Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler-custom" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
            <Nav.Link onClick={scrollToEvents} className='links px-4 font-weight-bold text-white' href="#inicio">EVENTO</Nav.Link>
                <Nav.Link onClick={scrollToPonentes} className='links px-4 font-weight-bold text-white' href="#inicio">PONENTES</Nav.Link>
                <Nav.Link onClick={scrollToPatrocinio} className='links px-4 font-weight-bold text-white ' href="#vuélvete-patrocinador">CONVIERTETE EN PATROCINADOR</Nav.Link>
                <Nav.Link className='links px-4 font-weight-bold text-white' href="#tickets"></Nav.Link>
                
            </Nav>
        <a href="https://www.eventbrite.es/e/entradas-xops-conference-1049115200807?aff=oddtdtcreator" className="button menu-btn">
            Tickets
        </a>
        </Navbar.Collapse>
    </Navbar>
    );
};

export default Header;
