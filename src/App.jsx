import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/xops.png";
import bgMain from "./assets/bg-main.jpg";
import { BsCalendar3, BsChevronDown } from 'react-icons/bs';
import { Route, Routes, Link, NavLink, Navigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import ScrollHandler from './ScrollHandler';
import { usePWA } from './hooks/usePWA';
import AddToHomeScreen from './components/AddToHomeScreen';
import { ConsentProvider } from './contexts/ConsentContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import CookiePreferencesManager from './components/CookiePreferencesManager';
import ScriptManager from './components/ScriptManager';
import Analytics from './components/Analytics';
import Home from './pages/Home';
import Organizer from './pages/Organizer';
import Speakers2023 from './pages/archive/2023/Speakers2023';
import Speakers2024 from './pages/archive/2024/Speakers2024';
import Sponsor2024 from './pages/archive/2024/Sponsor2024';
import Events2024 from './pages/archive/2024/Events2024';
import Speakers2025 from './pages/archive/2025/Speakers2025';
import Sponsor2025 from './pages/archive/2025/Sponsor2025';
import Events2025 from './pages/archive/2025/Events2025';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfService from './pages/TermsOfService';
import Agenda from './pages/Agenda';
import SpeakerPage from './pages/Speaker';
import MyAgenda from './pages/MyAgenda';
import Tickets from './pages/Tickets';
import TicketSuccess from './pages/TicketSuccess';
import PostEventPage from './pages/PostEventPage';
import AnalyticsPage from './pages/Analytics';
import NotFound from './components/NotFound';
import TicketModal from './components/TicketModal';
import SophiaHome from './pages/sophia/SophiaHome';
import SophiaPostulate from './pages/sophia/SophiaPostulate';
import SophiaAbout from './pages/sophia/SophiaAbout';
import SophiaPostulateStatus from './pages/sophia/SophiaPostulateStatus';
import WalletLogin from './pages/wallet/WalletLogin';
import WalletDashboard from './pages/wallet/WalletDashboard';
import CheckoutSuccess from './pages/tickets/CheckoutSuccess';
import CheckoutCancel from './pages/tickets/CheckoutCancel';
import XOpsHome from './pages/tickets/XOpsHome';
import XOpsEventDetail from './pages/tickets/XOpsEventDetail';
import StartupPack from './pages/StartupPack';
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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
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
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <Analytics />
      <ScriptManager />
      <CookieConsentBanner />

<ScrollHandler />
<div className="root home-main-section">
        <Navbar expand="lg" className='header'>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="X-Ops Logo" style={{ height: '51px', width: '56px', marginRight: '15px' }} />
          <span className='text-white font-weight-bold navbar-brand-text'>X-OPS CONFERENCE</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='navbar-toggler-custom'/>
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto">
                <NavLink className={({ isActive }) => `links px-4 fw-bold text-white${isActive ? ' nav-link-active' : ''}`} to="/#summit" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.summit')}</NavLink>
                <NavLink className={({ isActive }) => `links px-4 fw-bold text-white${isActive ? ' nav-link-active' : ''}`} to="/#ponentes" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.speakers')}</NavLink>
                <NavLink className={({ isActive }) => `links px-4 fw-bold text-white${isActive ? ' nav-link-active' : ''}`} to="/#ediciones" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.editions')}</NavLink>
                <NavLink className={({ isActive }) => `links px-4 fw-bold text-white${isActive ? ' nav-link-active' : ''}`} to="/#patrocinio" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>{t('nav.sponsor')}</NavLink>

      {/* Menú EVENTOS ANTERIORES */}
      <NavDropdown
        title={t('nav.previousEvents')}
        className='links px-4 fw-bold custom-white-dropdown'
        style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}
      >
        {/* X-Ops 2025 */}
        <div className="submenu-title">{t('archive.xops2025')}</div>
        <NavDropdown.Item as={Link} to="/archive/2025/Speakers2025">{t('archive.speakers')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2025/Events2025">{t('archive.agenda')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2025/Sponsor2025">{t('archive.sponsorCollab')}</NavDropdown.Item>

        <NavDropdown.Divider />

        {/* Título X-OPS 2024 */}
        <div className="submenu-title">{t('archive.xops2024')}</div>
        <NavDropdown.Item as={Link} to="/archive/2024/Speakers2024">{t('archive.speakers')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2024/Events2024">{t('archive.agenda')}</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/archive/2024/Sponsor2024">{t('archive.sponsorCollab')}</NavDropdown.Item>

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
          
          <button
            className="button menu-btn"
            style={{ textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: "10px", cursor: 'pointer' }}
            onClick={() => setShowTicketModal(true)}
          >
            {t('nav.tickets')}
          </button>
        </div>

        </Navbar.Collapse>
    </Navbar>

    <section
      id="main-content"
      className="site-hero"
      style={{ backgroundImage: `url(${bgMain})` }}
      aria-label={t('hero.title')}
    >
      <div className="site-hero__overlay" aria-hidden="true" />
      <div className="site-hero__content">
        <h1 className="site-hero__title">{t('hero.title')}</h1>
        <p className="site-hero__tagline">{t('hero.description')}</p>
        <p className="site-hero__date">
          <BsCalendar3 aria-hidden="true" />
          <span>{t('hero.date')}</span>
        </p>
        <div className="site-hero__ctas">
          <button
            className="btn-hero-primary"
            onClick={() => setShowTicketModal(true)}
          >
            {t('hero.buyTicket')}
          </button>
          <Link to="/#summit" className="btn-hero-secondary">
            {t('hero.viewAgenda')}
          </Link>
        </div>
        {canPrompt && (
          <button onClick={handleInstallClick} className="site-hero__install">
            {t('hero.installApp')}
          </button>
        )}
      </div>
      <div className="site-hero__scroll" aria-hidden="true">
        <BsChevronDown />
      </div>
    </section>

      </div>


      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Organizer" element={<Organizer />} />
          <Route path="/Organizadores" element={<Organizer />} />
          <Route path="/Team" element={<Organizer />} />
          <Route path="/Equipo" element={<Organizer />} />

          {/* Single-page site: Summit and Sponsor now live as anchored
              sections on Home. These routes redirect old bookmarks/links
              rather than 404ing them. */}
          <Route path="/Sponsor" element={<Navigate to="/#patrocinio" replace />} />
          <Route path="/Patrocina" element={<Navigate to="/#patrocinio" replace />} />
          <Route path="/summit" element={<Navigate to="/#summit" replace />} />
          <Route path="/Summit" element={<Navigate to="/#summit" replace />} />

          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/success" element={<TicketSuccess />} />

          <Route path="/#ponentes" element={<Home />} />

          {/* 2025 */}
          <Route path="/archive/2025/Speakers2025" element={<Speakers2025 />} />
          <Route path="/archive/2025/Events2025" element={<Events2025 />} />
          <Route path="/archive/2025/Sponsor2025" element={<Sponsor2025 />} />

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

          /* Post-Event */
          <Route path="/post-event" element={<PostEventPage />} />

          {/* Analytics Dashboard */}
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Privacy Policy */}
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/politica-de-cookies" element={<CookiePolicy />} />
          <Route path="/terminos-de-servicio" element={<TermsOfService />} />
          
          {/* Sophia Metapolis routes */}
          <Route path="/sophia" element={<SophiaHome />} />
          <Route path="/sophia/about" element={<SophiaAbout />} />
          <Route path="/sophia/postulate" element={<SophiaPostulate />} />
          <Route path="/sophia/postulate/status" element={<SophiaPostulateStatus />} />
          
          {/* Wallet routes */}
          <Route path="/wallet/login" element={<WalletLogin />} />
          <Route path="/wallet" element={<WalletDashboard />} />
          
          {/* Checkout routes */}
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          
          {/* X-Ops public ticket pages */}
          <Route path="/events/x-ops-conference-dubai-2026" element={<XOpsEventDetail />} />
          <Route path="/events/x-ops-conference-dubai-2026/buy" element={<Tickets />} />

          <Route path="/startup-pack" element={<StartupPack />} />
          <Route path="/startup-pack-application" element={<StartupPack />} />
          
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

              <li><Link className="text-white" to="/#events" style={{textDecoration: 'none'}}>{t('nav.event')}</Link></li>
              <li><NavLink className="text-white" to="/Organizer#organizr" style={{textDecoration: 'none'}}>{t('nav.organizers')}</NavLink></li>
              <li><a href="https://forms.office.com/Pages/ResponsePage.aspx?id=EaWMGDgsSEi09sqLCPLFFUHOFUdEMtRPqJBa35Bh2thURUtLTkZURlhTRFFJUlZDTTk5ODcyNTFBMi4u&embed=true" target="_blank" rel="noopener noreferrer" className="text-white" style={{textDecoration: 'none'}}>{t('nav.volunteer')}</a></li>
              <li><a href="https://sessionize.com/x-ops-conference-mad-2026/" target="_blank" rel="noopener noreferrer" className="text-white" style={{textDecoration: 'none'}}>{t('hero.cfp')}</a></li>
              <li><a href="https://xopsconference.com" target="_blank" rel="noopener noreferrer" className="text-white">www.xopsconference.com</a></li>
              <li><Link to="/politica-de-privacidad" className="text-white" style={{textDecoration: 'none'}}>{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/politica-de-cookies" className="text-white" style={{textDecoration: 'none'}}>Política de Cookies</Link></li>
              <li><Link to="/terminos-de-servicio" className="text-white" style={{textDecoration: 'none'}}>Términos de Servicio</Link></li>
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

    {/* Ticket Purchase Modal */}
    <TicketModal show={showTicketModal} onHide={() => setShowTicketModal(false)} />
    </>
   </ConsentProvider>
  </HelmetProvider>
  );
}

export default App;
