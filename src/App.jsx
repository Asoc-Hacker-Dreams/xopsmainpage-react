import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/xops.png";
import { Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import ScrollHandler from './ScrollHandler';
import { usePWA } from './hooks/usePWA';
import AddToHomeScreen from './components/AddToHomeScreen';
import { ConsentProvider } from './contexts/ConsentContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import CookiePreferencesManager from './components/CookiePreferencesManager';
import ScriptManager from './components/ScriptManager';
import Home from './pages/Home';
import Organizer from './pages/Organizer';
import Sponsor from './pages/Sponsor';
import Summit from './pages/Summit';
import Speakers2023 from './pages/archive/2023/Speakers2023';
import Speakers2024 from './pages/archive/2024/Speakers2024';
import Sponsor2024 from './pages/archive/2024/Sponsor2024';
import Events2024 from './pages/archive/2024/Events2024';
import Speakers2025 from './pages/archive/2025/Speakers2025';
import Events2025 from './pages/archive/2025/Events2025';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Agenda from './pages/Agenda';
import SpeakerPage from './pages/Speaker';
import MyAgenda from './pages/MyAgenda';
import Tickets from './pages/Tickets';
import TicketSuccess from './pages/TicketSuccess';
import NotFound from './components/NotFound';
import './styles/Custom.css';
import './styles/PricingTable.css';
import './styles/Summit.css';
import './styles/theme.css';
import './i18n'; // Import i18n configuration
import { HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const { canPrompt, promptInstall } = usePWA();
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleInstallClick = async () => {
    const result = await promptInstall();
    console.log('Install prompt result:', result);
  };

  const handleShowCookiePreferences = () => {
    setShowCookiePreferences(true);
  };

  const handleCloseCookiePreferences = () => {
    setShowCookiePreferences(false);
  };

  return (
  <HelmetProvider>
    <ConsentProvider>
      <>
      <ScriptManager />
      <CookieConsentBanner />

<ScrollHandler />
<div className="root home-main-section">
        <Navbar bg="light" expand="lg" className='header'>
        <div className="d-flex align-items-center">
          <img src={logo} alt="X-Ops Logo" style={{ height: '51px', width: '56px', marginRight: '15px' }} />
          <Navbar.Brand className='text-white font-weight-bold navbar-brand-text'>X-OPS CONFERENCE</Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='navbar-toggler-custom'/>
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
              <Link className='links px-4 font-weight-bold text-white' to="/#events" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.event')}</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/#ponentes" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.speakers')}</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Sponsor#patrocinio"  style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.sponsor')}</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Organizer#organizr" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.organizers')}</Link>
          
        
      {/* Menú EVENTOS ANTERIORES */}  
      <NavDropdown
        title={<span dangerouslySetInnerHTML={{ __html: t('nav.previousEvents') }} />}
        className='links px-4 font-weight-bold custom-white-dropdown'
        style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}
      >
        {/* Título X-OPS 2024 */}
        <div className="submenu-title">{t('archive.xops2024')}</div>
        <NavDropdown.Item as={Link} to="/archive/2024/Speakers2024">{t('archive.speakers')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2024/Events2024">{t('archive.agenda')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2024/Sponsor2024"><span dangerouslySetInnerHTML={{ __html: t('archive.sponsorCollab') }} /></NavDropdown.Item>

        <NavDropdown.Divider />

        {/* Título Aldea DevSecOps 2023 */}
        <div className="submenu-title">{t('archive.aldea2023')}</div>
        <NavDropdown.Item as={Link} to="/archive/2023/Speakers2023">{t('archive.speakers')}</NavDropdown.Item>
      </NavDropdown>
            </Nav>
            
        <div className="d-flex align-items-center">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage} 
            className="language-toggle"
            aria-label={t('language.label')}
            title={t('language.label')}
          >
            {t('language.switch')}
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={t('theme.toggle')}
            title={t('theme.toggle')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <a href="/summit#tickets" className="button menu-btn" style={{ textDecoration: 'none', width: "110px", paddingLeft: "1%", marginTop: "-2%", marginLeft: "10px" }}>
            {t('nav.tickets')}
          </a>
        </div>

        </Navbar.Collapse>
    </Navbar>

    <div className='Hero-section d-flex align-items-center justify-content-center text-center'>
      <div className="d-flex align-items-center justify-content-center text-center text-white py-5">
        <div className="container">
            <h1 className="display-4 font-weight-bold">{t('hero.title')}</h1>
            <p className="lead">{t('hero.description')}</p>
            <p className="lead">{t('hero.date')}</p>
            <div className="mt-4 mx-4">
            <a href="/summit#tickets" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">{t('hero.buyTicket')}</a>
                <Link className="btn mx-2 my-2 bg-color text-white btn-lg mr-3" to="/#events">{t('hero.viewAgenda')}</Link>
             <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=EaWMGDgsSEi09sqLCPLFFUHOFUdEMtRPqJBa35Bh2thURUtLTkZURlhTRFFJUlZDTTk5ODcyNTFBMi4u&embed=true"className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">{t('nav.volunteer')}</a> 
             <a href="https://sessionize.com/xops-conference-2025/" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">{t('hero.cfp')}</a>
             {canPrompt && (
               <button onClick={handleInstallClick} className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">
                 {t('hero.installApp')}
               </button>
             )}
            </div>
        </div>
    </div>

    </div>

      </div>


      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Organizer" element={<Organizer />} />
          <Route path="/Organizadores" element={<Organizer />} />
          <Route path="/Team" element={<Organizer />} />
          <Route path="/Equipo" element={<Organizer />} />

          <Route path="/Sponsor" element={<Sponsor />} />
          <Route path="/Patrocina" element={<Sponsor />} />

          {/* X-Ops Summit 2026 */}
          <Route path="/summit" element={<Summit />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/success" element={<TicketSuccess />} />
          <Route path="/Summit" element={<Summit />} />

          <Route path="/#ponentes" element={<Home />} />

          {/* 2025 */}
          <Route path="/archive/2025/Speakers2025" element={<Speakers2025 />} />
          <Route path="/archive/2025/Events2025" element={<Events2025 />} />

          {/* 2024 */}
          <Route path="/archive/2024/Speakers2024" element={<Speakers2024 />} />
          <Route path="/archive/2024/Events2024" element={<Events2024 />} />
          <Route path="/archive/2024/Sponsor2024" element={<Sponsor2024 />} />

          {/* 2023 */}
          <Route path="/archive/2023/Speakers2023" element={<Speakers2023 />} />
          
          {/* Agenda, Speaker, MyAgenda */}
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/speaker/:id" element={<SpeakerPage />} />
          <Route path="/mi-agenda" element={<MyAgenda />} />

          {/* Privacy Policy */}
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          
          <Route path="*" element={<NotFound />} />

      </Routes>


    <footer className="bg-black text-white footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className='heading'>{t('footer.address')}</h5>
            <p>{t('footer.addressLine1')}</p>
            <p>{t('footer.addressLine2')}</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>{t('footer.contacts')}</h5>
            <p>Email: <a href="mailto:info@xopsconference.com" className="text-white">info@xopsconference.com</a></p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className='heading'>{t('footer.links')}</h5>
            <ul className="list-unstyled">

            <Nav className="mx-auto ">
            <Link className="text-white" to="/#events" style={{textDecoration: 'none' }}>{t('nav.event')}</Link>
            </Nav>
              <li><a href="https://xopsconference.com" target="_blank" rel="noopener noreferrer" className="text-white">www.xopsconference.com</a></li>
              <li><Link to="/politica-de-privacidad" className="text-white" style={{textDecoration: 'none'}}>{t('footer.privacyPolicy')}</Link></li>
              <li>
                <button 
                  onClick={handleShowCookiePreferences}
                  className="btn btn-link text-white p-0"
                  style={{ textDecoration: 'none', fontSize: 'inherit' }}
                >
                  {t('footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-3">
        <p>{t('footer.copyright')}</p>
        <p>Teléfono: <a href="tel:+34744644873" className="text-white">+34744644873</a> / <a href="tel:+34693814098" className="text-white">+34693814098</a></p>
      </div>
    </footer>
   
    {/* Add to Home Screen Banner */}
    <AddToHomeScreen />
    
    {/* Cookie Preferences Manager */}
    <CookiePreferencesManager 
      show={showCookiePreferences} 
      onHide={handleCloseCookiePreferences} 
    />
    </>
   </ConsentProvider>
  </HelmetProvider>
  );
}

export default App;
