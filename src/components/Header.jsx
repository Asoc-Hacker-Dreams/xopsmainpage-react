import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from "../assets/xops.png";
import { useTranslation } from 'react-i18next';

const Header = ({ theme, toggleTheme, toggleLanguage }) => {
    const { t, i18n } = useTranslation();

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

    const handleToggleLanguage = () => {
        if (toggleLanguage) {
            toggleLanguage();
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
            <Nav.Link onClick={scrollToEvents} className='links px-4 font-weight-bold text-white' href="#inicio">{t('nav.event')}</Nav.Link>
                <Nav.Link onClick={scrollToPonentes} className='links px-4 font-weight-bold text-white' href="#inicio">{t('nav.speakers')}</Nav.Link>
                <Nav.Link onClick={scrollToPatrocinio} className='links px-4 font-weight-bold text-white ' href="#vuélvete-patrocinador">{t('nav.becomeSponsor')}</Nav.Link>
                <Nav.Link className='links px-4 font-weight-bold text-white' href="#tickets"></Nav.Link>
                
            </Nav>
        <div className="d-flex align-items-center">
          {/* Language Toggle */}
          <button 
            onClick={handleToggleLanguage} 
            className="language-toggle"
            aria-label={t('language.label')}
            title={t('language.label')}
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
          
          {/* Theme Toggle */}
          {toggleTheme && (
            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              aria-label={t('theme.toggle')}
              title={t('theme.toggle')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          )}
          
          <a href="/summit#tickets" className="button menu-btn">
            {t('nav.tickets')}
          </a>
        </div>
        </Navbar.Collapse>
    </Navbar>
    );
};

export default Header;
