import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/xops.png";
import { Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'; //agrego NavDropdown para hacer submenús
import ScrollHandler from './ScrollHandler';
import { usePWA } from './hooks/usePWA';
import PWAInstallBanner from './components/PWAInstallBanner';
import Home from './pages/Home';
import Organizer from './pages/Organizer';  // Este es el Organizer principal
import Sponsor from './pages/Sponsor';
import Home2024 from './pages/archive/2024/Home2024';
import Organizer2024 from './pages/archive/2024/Organizer2024';  // Este es el Organizer2024
import Home2023 from './pages/archive/2023/Home2023';
import Organizer2023 from './pages/archive/2023/Organizer2023';    // Este es el Organizer2023
import Events2023 from './pages/archive/2023/Events2023';    // Este es el Events2023
import Events2024 from './pages/archive/2024/Events2024'; 
import SpeakersSection2023 from './pages/archive/2023/SpeakersSection2023';
import SpeakersSection2024 from './pages/archive/2024/SpeakersSection2024';
import Sponsor2024 from './pages/archive/2024/Sponsor2024';
import Sponsor2023 from './pages/archive/2023/Sponsor2023';
import './styles/Custom.css';
import './styles/PricingTable.css';
function App() {
  const { canPrompt, promptInstall } = usePWA();

  const handleInstallClick = async () => {
    const result = await promptInstall();
    console.log('Install prompt result:', result);
  };


   return (
    <>

<ScrollHandler />
<div className="root home-main-section">
        <Navbar bg="light" expand="lg" className='header'>
        <Navbar.Brand style={{ marginTop: '-35px'}} className='text-white font-weight-bold'>X-OPS CONFERENCE</Navbar.Brand>
        <img src={logo} alt="Jane Doe" style={{ height: '51px', width: '56px', marginTop: '-35px'}} />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='toggle'/>
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto ">
             <Link className='links px-4 font-weight-bold text-white' to="/#events" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>EVENTO</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/#ponentes" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>PONENTES</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Sponsor#patrocinio"  style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>PATROCINADORES</Link>
                <Link className='links px-4 font-weight-bold text-white' to="/Organizer#organizr" style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}>ORGANIZADORES</Link>
          
       
      {/* Menú EVENTOS ANTERIORES */}  
      <NavDropdown
  title={<span>EVENTOS<br />ANTERIORES</span>}
  className='links px-4 font-weight-bold custom-white-dropdown'
  style={{ marginTop: '10px', marginBottom: '10px', textDecoration: 'none' }}
>
  {/* Título X-OPS 2024 */}
  <div className="submenu-title">X-OPS 2024</div>
  <NavDropdown.Item as={Link} to="/archive/2024/SpeakersSection2024">Ponentes</NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/archive/2024/Sponsor2024">Patrocinio y<br />Colaboradores</NavDropdown.Item>

  <NavDropdown.Divider />

  {/* Título Aldea DevSecOps 2023 */}
  <div className="submenu-title">Aldea DevSecOps 2023</div>
  <NavDropdown.Item as={Link} to="/archive/2023/SpeakersSection2023">Ponentes</NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/archive/2023/Sponsor2023">Patrocinio y<br />Colaboradores</NavDropdown.Item>
</NavDropdown>

            </Nav>
        <a href="https://www.eventbrite.ch/e/entradas-x-ops-conference-madrid-2025-1306767269079" className="button menu-btn" style={{ textDecoration: 'none', width: "110px", paddingLeft: "1%", marginTop: "-2%" }}>
            ENTRADAS
        </a>

        </Navbar.Collapse>
    </Navbar>

    <div className='Hero-section d-flex align-items-center justify-content-center text-center'>
      <div className="d-flex align-items-center justify-content-center text-center text-white py-5">
        <div className="container">
            <h1 className="display-4 font-weight-bold">¡ÚNETE A LA REVOLUCIÓN X-OPS!</h1>
            <p className="lead">El mundo de las IT está cambiando. Únete a nosotros en la X-Ops Conference, donde descubrirás cómo la tecnología y las personas adecuadas están impulsando el cambio.        </p>
            <p className="lead">Fecha: Noviembre 2025 </p>
            <div className="mt-4 mx-4">
            <a href="https://www.eventbrite.ch/e/entradas-x-ops-conference-madrid-2025-1306767269079" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">Compra tu entrada</a>
                <Link className="btn mx-2 my-2 bg-color text-white btn-lg mr-3" to="/#events">Ver agenda</Link>
             <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=EaWMGDgsSEi09sqLCPLFFUHOFUdEMtRPqJBa35Bh2thURUtLTkZURlhTRFFJUlZDTTk5ODcyNTFBMi4u&embed=true"className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">Hazte voluntario</a> 
             <a href="https://sessionize.com/xops-conference-2025/" className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">CFP</a>
             {canPrompt && (
               <button onClick={handleInstallClick} className="btn mx-2 my-2 bg-color text-white btn-lg mr-3">
                 📱 Instalar App
               </button>
             )}
            </div>
        </div>
    </div>

    </div>

      </div>


      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Organizer" element={<Organizer />} /> {/* Organizador principal */}
          <Route path="/Sponsor" element={<Sponsor />} />
                        
          {/* 2024 */}
          <Route path="archive/2024/Home2024" element={<Home2024 />} /> 
          <Route path="/archive/2024/Events2024" element={<Events2024 />} />
          <Route path="/archive/2024/SpeakersSection2024" element={<SpeakersSection2024 />} />
          <Route path="/archive/2024/Sponsor2024" element={<Sponsor2024 />} />
          <Route path="archive/2024/Organizer2024" element={<Organizer2024 />} />

          {/* 2023 */}
          <Route path="archive/2023/Home2023" element={<Home2023 />} />
          <Route path="/archive/2023/Events2023" element={<Events2023 />} />
          <Route path="/archive/2023/SpeakersSection2023" element={<SpeakersSection2023 />} />
          <Route path="/archive/2023/Sponsor2023" element={<Sponsor2023 />} />
          <Route path="archive/2023/Organizer2023" element={<Organizer2023 />} />

      </Routes>


    <footer className="bg-black text-white footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className='heading'>Dirección</h5>
            <p>Universidad Rey Juan Carlos campus Móstoles</p>
            <p>Av. del Alcalde de Móstoles, s/n, 28933 Móstoles, Madrid</p>
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
        <p>&copy; 2025 - X-Ops Conference Madrid</p>
        <p>Teléfono: <a href="tel:+34744644873" className="text-white">+34744644873</a> / <a href="tel:+34693814098" className="text-white">+34693814098</a></p>
      </div>
    </footer>
   
    {/* PWA Install Banner */}
    <PWAInstallBanner />
    
    </>
  )
}

export default App
