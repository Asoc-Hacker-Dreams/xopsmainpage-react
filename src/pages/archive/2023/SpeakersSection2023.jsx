import agaB from "../../../assets/speakers/agaB.png";
import alejandroA from "../../../assets/speakers/alejandroA.png";
import alvaroR from "../../../assets/speakers/alvaroR.png";
import antonioB from "../../../assets/speakers/antonioB.png";
import gabrielaG from "../../../assets/speakers/gabrielaG.jpg";
import juanV from "../../../assets/speakers/juanV.jpg";
import natalieG from "../../../assets/speakers/natalieG.jpg";
import oscarC from "../../../assets/speakers/oscarC.png";
import pabloG from "../../../assets/speakers/pabloG.jpg";
import santiagoC from "../../../assets/speakers/santiagoC.jpg";
import davidS from "../../../assets/speakers/davidS.png";   
import oszi from "../../../assets/speakers/oszi.jpg";   /*agrego las fotos del 2023*/
import gomezSantos from "../../../assets/speakers/gomezSantos.png"; 
import faria from "../../../assets/speakers/faria.jpeg"; 
import chorenRuiz from "../../../assets/speakers/chorenRuiz.jpeg";
import rodriguezBerzosa from "../../../assets/speakers/rodriguezBerzosa.png";
import reynaldo from "../../../assets/speakers/reynaldo.png";
import rafael from "../../../assets/speakers/rafael.jpg";
import eun from "../../../assets/speakers/eun.jpg";
import joseLuis from "../../../assets/speakers/joseLuis.jpg";
import davidC from "../../../assets/speakers/davidC.jpg";

import AnimationWrapper from "../../../components/AnimationWrapper";

const SpeakersSection2023 = () => {
  return (
    <>
      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">Conoce a Nuestros Ponentes</h2>

          <div className="speaker-cards margin-top">

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={agaB} alt="Aga Bielak" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Aga Bielak</h3>
                  <p>
                    <strong>Google - Especialista técnico en soluciones en la nube.</strong> 
                  </p>
                  <p>
                    Aga es un experto en la nube y Kubernetes con 7 años de experiencia. Nominada como Mejor Mujer en Computación en la Nube en Polonia en 2023, se dedica a romper barreras e inspirar a jóvenes talentos en TI.
                  </p>
                  <p>
                    <strong>Scaling AI Workloads with Kubernetes: Orchestrating Success.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <img src={alejandroA} alt="Alejandro Acosta" style={{ height: '250px', width: '280px' }} />
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Alejandro Acosta</h3>
                  <p>
                    <strong>Ingeniero de software y mentor de carrera.</strong>
                  </p>
                  <p>
                    Por más de 20 años, he estado trabajando en la industria de tecnología y de código abierto.
                    <br />
                    Después de mudarme a Silicon Valley en 2015, logré un aumento significativo en mi compensación, saltando de $130k a $1M en total.
                    <br />
                    A lo largo de mi carrera, he participado en más de 1000 entrevistas de trabajo con empresas líderes en tecnología como Amazon, Facebook, Google y Microsoft.
                    <br />
                    Puedo aprovechar mi experiencia y conocimiento para ayudarte a ahorrar tiempo y evitar errores comunes en tu propia carrera.
                    <br />
                    Como mentor, he ayudado con éxito a otros Ingenieros de Software a conseguir puestos en empresas de primera categoría como Amazon, Twitter, Uber y Google.
                  </p>
                  <p>
                    <strong>Descubre y aplica la estrategia que utilizan xOPS para mejorar de trabajo.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={alvaroR} alt="Álvaro Revuelta M" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Álvaro Revuelta M.</h3>
                  <p>
                    <strong>Systems Developer.</strong>
                  </p>
                  <p>
                    Graduado en Ing Informática por la UPM y Master en Data Engineering por Uppsala.
                    <br />
                    <br />
                    Trabajo desarrollando infraestructura en entornos cloud y con un enfoque especial en seguridad.
                  </p>
                  <p>
                    <strong>Proteger las cargas de trabajo de Kubernetes: del código al clúster.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={antonioB} alt="Antonio Berben" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Antonio Berben</h3>
                  <p>
                    <strong>Principal Solutions Engineer.</strong>
                  </p>
                  <p>
                    Antonio es ingeniero principal de soluciones en Solo.io, donde trabaja para aprender de los usuarios y ayudarlos a recorrer el camino hacia la adopción total de Service Mesh.
                    <br />
                    Es organizador de CNCF (KCD España, CNCF Iberia) y contribuye a proyectos de código abierto.
                    <br />
                    Su trayectoria profesional procedente del desarrollo le hace poner siempre a los desarrolladores en primer lugar. Su filosofía: “Los desarrolladores crean el negocio. El resto estamos aquí sólo para hacerles la vida más fácil”
                    <br />
                    Su mayor preocupación es: cómo acelerar el ciclo de vida del desarrollo. Ésa es una de las razones por las que es un entusiasta de Service Mesh.
                  </p>
                  <p>
                    <strong>Istio Ambient Mesh: Sidecar vs Sidecar-less como si tuviera 10 años.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={gabrielaG} alt="Gabriela García" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Gabriela García</h3>
                  <p>
                    <strong>Desarrollador de software de seguridad | Instructor de codificación y ciberseguridad | Entusiasta de la piratería de hardware.</strong>
                  </p>
                  <p>
                    Profesora universitaria y mentora en programas de maestría, especializada en ciberseguridad y programación. Además de docente, y speaker en conferencias de ciberseguridad como RootedCON, DEFCON o BlackHat es desarrolladora de software con un enfoque particular en el desarrollo seguro y participa activamente en la organización de comunidades de hackers, tanto en España como a nivel global. Como profesional independiente, tiene el privilegio de colaborar con una amplia gama de clientes, tanto locales como internacionales, a quienes ofrece soluciones personalizadas de desarrollo y ciberseguridad. Está plenamente comprometida con la promoción de un mundo digital más seguro y accesible para todos.
                  </p>
                  <p>
                    <strong>SDLC con OWASP.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={juanV} alt="Juan Vicente Herrera Ruiz de Alejo" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Juan Vicente Herrera Ruiz de Alejo</h3>
                  <p>
                    <strong>Cloud Architect.</strong>
                  </p>
                  <p>
                    Cloud Architect en Red Hat, co-organizador de Madrid Devops y Devopsdays Madrid y profesor asociado de Cloud Computing en la Universidad Pontificia de Comillas.
                  </p>
                  <p>
                    <strong>Un puente entre MLOps y DevOps con OpenShift AI.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={natalieG} alt="Natalie Godec" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Natalie Godec</h3>
                  <p>
                    <strong>Arquitecto de la nube | Experto en desarrollo de Google en la nube | Innovador campeón de GCP.</strong>
                  </p>
                  <p>
                    Ingeniero de sistemas/infraestructura convertido en arquitecto de la nube, con debilidad por las plataformas de datos y la seguridad. GDE (Google Dev Expert) en la nube, embajadora de Women TechMakers y oradora tecnológica experimentada.
                    <br />
                    <br />
                    Hablo inglés, ucraniano y francés (y un poquito de italiano) y resido en Londres, Reino Unido.
                    <br />
                    <br />
                    Mis charlas y entrevistas anteriores (algunas de ellas):
                    <br />
                    <a href="https://www.youtube.com/playlist?list=PLS3g1K3mnmajt5Eu3nNaAiMK3hXjVRRNL" target="_blank" rel="noopener noreferrer">https://www.youtube.com/playlist?list=PLS3g1K3mnmajt5Eu3nNaAiMK3hXjVRRNL</a>
                  </p>
                  <p>
                    <strong>Creación de una plataforma de datos nativa de la nube teniendo en cuenta la seguridad.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={oscarC} alt="Oscar Cortes Bracho" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Oscar Cortes Bracho</h3>
                  <p>
                    <strong>Arquitecto en la nube.</strong>
                  </p>
                  <p>
                    Ingeniero Electronico, Cloud / Software Architect.
                    <br />
                    <br />
                    AWSCommunityBuilder - serverless.
                  </p>
                  <p>
                    <strong>Ambientes efímeros con Serverless y Custom Resources.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={pabloG} alt="Pablo Gómez-Caldito" style={{ height: '250px', width: '280px' }}/>
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Pablo Gómez-Caldito</h3>
                  <p>
                    <strong>DevOps Engineer.</strong>
                  </p>
                  <p>
                    Soy Pablo Gómez-Caldito, me encanta construir herramientas, productos e infraestructura utilizando software. Mi experiencia laboral es principalmente en SRE, incrementando la confiabilidad de los servicios online e implementando la filosofía DevOps en las organizaciones. También publico proyectos de software de código abierto y me divierto aprendiendo sobre seguridad de la información.
                  </p>
                  <p>
                    <strong>Instalación de Whonix en QEMU/KVM.</strong><br/>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={santiagoC} alt="Santiago Castro Vilabella" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>Santiago Castro Vilabella</h3>
                  <p>
                    <strong>Inteligencia Artificial - Experto en Tecnología.</strong>
                  </p>
                  <p>
                    Graduado en Ingeniería Electrónica Industrial y Automática y Máster en Inteligencia Artificial. Desde que finalicé mis estudios no he parado de formarme en las últimas tendencias, descubriendo mi pasión por la innovación y la tecnología. Llevo más de 5 años dedicado a la Inteligencia Artificial, trabajando como Ingeniero de IA en diversas empresas. Actualmente trabajo en Telefónica como Technology Expert y la Inteligencia Artificial Generativa forma parte de mi día a día.
                  </p>
                  <p>
                    <strong>El Futuro de las Operaciones con Agentes de IA: De la Automatización a la Autonomía.</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={davidS} alt="David Sastre" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-right" duration={1500}>
                  <h3>David Sastre</h3>
                  <p>
                    <strong>Principal Product Security Engineer at Red Hat</strong>
                  </p>
                  <p>
                    David Sastre cuenta con una amplia experiencia profesional en seguridad y arquitectura de la nube. Actualmente, trabaja como Principal Product Security Engineer en Red Hat, donde ha liderado iniciativas en seguridad de productos y adopción de datos abiertos enlazados para mejorar la gestión de amenazas y vulnerabilidades.
                  </p>
                  <p>
                    Ha desempeñado roles destacados como Senior Product Security Engineer y Cloud and DevOps Senior Architect. Con más de 7 años de experiencia, sus habilidades abarcan desde Information Security, Red Hat Enterprise Linux (RHEL), y OpenShift hasta Network Security, Threat Modeling, y ciberseguridad.
                  </p>
                  <p>
                    <strong>Adopting Linked Open Data in Product Security: a Modular Knowledge Graph</strong>
                  </p>
                </AnimationWrapper>
              </div>
            </div>
{/*agrego ponentes 2023*/}

<div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={joseLuis} alt="joseLuis" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>José Luis Navarro Adam</h3>
                  <p>
                    <strong>Wazuh como estrategia de ciberseguridad</strong> 
                  </p>
                  <p>
                  Esta es la charla sobre WAZUH, Qué es, para qué sirve, qué funciones tiene, y sobre todo, cómo puede salvarnos ante un posible ataque cibernético detectando y neutralizando posibles intrusiones en nuestra red. Si quieres saber cómo proteger tu empresa, esta es tu sesión de la World Party 2023!
                  </p>
                  <p>
                    <strong>El taller de WAZUH, paso a paso</strong>
                  </p>
                  <p>
                  Este es el taller de mi charla sobre WAZUH. Un auténtico HOWTO paso a paso.  Si quieres saber cómo proteger tu empresa, esta es tu sesión de la World Party 2023!
                  </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={reynaldo} alt="reynaldo" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Reynaldo Cordero</h3>
                  <p>
                    <strong>Instalación de HaskellKatas</strong> 
                  </p>
                  <p>
                  Se realizará la instalación de un entorno de katas de programación con HASKELL mediante un script de BASH en un sistema 100% software libre y completamente hackeable.
                  </p>
                  <p>
                    <strong>El lenguaje de programación Haskell en la educación</strong>
                  </p>
                  <p>
                  Se explicará cómo se puede utilizar el lenguaje de programación Haskell con fines educativos  de calidad, para manejar elementos de programación, de matemáticas, de lógica y de expresión de ideas mediante el propio lenguaje hablado y de cómo realizar experimentos sobre la marcha que resulten atractivos y estimulantes y fáciles de relacionar, algo que denominaremos como HaskellKatas.
                 </p>
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={davidC} alt="davidC" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>David Carrasco</h3>
                  <p>
                    <strong>The easy game for IoT, esphome with salt</strong> 
                  </p>
                  <p>
                  La charla se mostrara una solución sencilla hecha en Python para interactuar mediante protocolo MQTT con un dispositivo esp32 y un xiaomi Mi Plant.
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={gabrielaG} alt="gabrielaG" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Gabriela García</h3>
                  <p>
                    <strong>Katana Coding: protección y ofuscación de código</strong> 
                  </p>
                  <p>
                  'Katana Coding': la seguridad y ofuscación de código cobran vida al estilo Kill Bill. Adéntrate en técnicas letales de protección y desvela secretos de código al ritmo de espadas samurái. ¡Sé el guerrero digital que domina el arte del código seguro!
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>
           
            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={eun} alt="eun" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Eun Young Cho</h3>
                  <p>
                    <strong>Blockchain IRL: la cara AMAble</strong> 
                  </p>
                  <p>
                  Actualmente Blockchain es más conocido por la especulación, las estafas y el hype de los medios que el potencial que tiene esta tecnología. Esto es porque está muy ligado a los criptoactivos y que con ello ha surgido otra forma de economía.
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div> 

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={rafael} alt="rafael" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Rafael Hernampérez</h3>
                  <p>
                    <strong>Introducción al Desarrollo Seguro</strong> 
                  </p>
                  <p>
                  "Nadie está a salvo de ataques, pero prepararse anticipadamente contra ellos reducirá considerablemente las sorpresas y los costes derivados de sus consecuencias. 
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div> 

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={juanV} alt="juanV" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Juán Vicente Herrera</h3>
                  <p>
                    <strong>Practical Threat Modeling</strong> 
                  </p>
                  <p>
                  David Sastre y Juan Vicente Herrera de Red Hat, nos van a hablar de como empezar en el mundo del "Threat Modelling".
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={rodriguezBerzosa} alt="rodriguezBerzosa" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Luis Rodriguez</h3>
                  <p>
                    <strong>The Dream of Secure CI/CD Pipelines</strong> 
                  </p>
                  <p>
                  In a world where automation and the cloud reign supreme, modern Continuous Integration/Continuous Deployment and build systems have become the crown jewels of software development. But, as with any valuable treasure, they also attract unwanted attention from cyber adversaries. The potential vulnerabilities in CI/CD pipelines are no secret; they include excessive privileges, leaked secrets, vulnerable plugins and pipeline code, weak authentication, and a distinct lack of auditing. These weaknesses have been exploited in the past and the present, leading to data breaches and security nightmares. The session will show the latest techniques and principles to make resilient and secure your entire Software Development Lifecycle.
                   </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={chorenRuiz} alt="chorenRuiz" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Matias Choren</h3>
                  <p>
                    <strong>Lo que no es Windows es Unix</strong> 
                  </p>
                  <p>
                  En esta charla vamos a hablar de que es Unix, cómo nació el proyecto GNU, cómo define Software Libre la GPL, qué diferencia hay con el Software de Código Abierto, el concepto de CopyLeft (izquierdo de copia), algunas otras licencias libres y su impacto en el mundo actual de la tecnología
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={faria} alt="faria" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Daniel Faria</h3>
                  <p>
                    <strong>Entendiendo la proeza: Conociendo el PS4JB Como funciona el HACK de PS4</strong> 
                  </p>
                  <p>
                  - Una definicion propia de Hacker, alguien que sabe mucho de un tema que lo domina bien y puede hacer cosas impresionante.
- HACK = Proeza
- El PS4JB: Como funciona (se meciona el origen, el error  CVE-2018-4386)
- sleirsgoevy; Quien unio la piezas
- TheFlow: quien consiguio el exploit (Sony le pago por el trabajo)
- El cambio de vision de Sony despues del caso de Geohot
</p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={gomezSantos} alt="gomezSantos" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Javier Gómez</h3>
                  <p>
                    <strong>There is a wormhole in my Kafka</strong> 
                  </p>
                  <p>
                  Seguro que te ha tocado pegarte con Kafka en alguna ocasión, y si eres de los pocos que no, estoy más que convencido de que en algún momento lo has oído mencionar. Quizás un escalofrío recorrió tu cuerpo al oír ese nombre, o te parecía que lo susurraban los sauces de un cementerio cuando pasabas por ahí cerca.
Pues tranquilo, porque Kafka puede dar miedo, pero nosotros te traemos un par de anécdotas para que deje de asustarte tanto.
¿Y qué es lo que traemos? Pues dos situaciones bastante distintas en las que tuvimos que exprimir Kafka al máximo para avanzar.
La primera fue realizar la migración de todos los nodos de Kafka a nodos nuevos… ¡¡sin pérdida de servicio!!, y la segunda cómo nos organizamos cuando nos vimos obligados a abrir un agujero de seguridad… de la forma menos peligrosa posible. Pues tanto si conoces bien a Kafka como si apenas sabes que existe, apúntate, que vas a disfrutar de lo que traemos.
</p>
                    
                </AnimationWrapper>
              </div>
            </div>

            <div className="speaker1 d-flex justify-around margin-top">
              <div className="speaker-img">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <img src={oszi} alt="oszi" style={{ height: '250px', width: '280px' }} />
                </AnimationWrapper>
              </div>
              <div className="speaker-content">
                <AnimationWrapper animation="fade-left" duration={1500}>
                  <h3>Agustín Osorio</h3>
                  <p>
                    <strong></strong> 
                  </p>
                  <p>
                  </p>
                    
                </AnimationWrapper>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default SpeakersSection2023;