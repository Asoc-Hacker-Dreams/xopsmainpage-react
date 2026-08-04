import React from 'react';
import { useTranslation } from 'react-i18next';
import antonioB from "../assets/speakers/antonioB.png";
import felipeV from "../assets/speakers/felipeV.png";
import juanV from "../assets/speakers/juanV.jpg";
import giselaT from "../assets/speakers/giselaT.png";
import shaniA from "../assets/speakers/shaniA.png";
import alejandroH from "../assets/speakers/alejandroH.png";
import albertoM from "../assets/speakers/albertoM.png";
import pabloS from "../assets/speakers/pabloS.png";
import carlosV from "../assets/speakers/carlosV.png";
import maniG from "../assets/speakers/maniG.png";
import cleyraU from "../assets/speakers/cleyraU.png";
import saraS from "../assets/speakers/saraS.png";
import christianC from "../assets/speakers/christianC.jpeg";
import rossanaS from "../assets/speakers/rossanaS.png";
import dachiG from "../assets/speakers/dachiG.png";
import carlosP from "../assets/speakers/carlosP.png";
import patriciaR from "../assets/speakers/patriciaR.png";
import almudenaZ from "../assets/speakers/almudenaZ.png";
import veronicaR from "../assets/speakers/veronicaR.png";
import toniG from "../assets/speakers/toniG.png";
import ignacioD from "../assets/speakers/ignacioD.png";
import jeffF from "../assets/speakers/jeffF.png";
import juarezJ from "../assets/speakers/juarezJ.png";
import joseC from "../assets/speakers/joseC.png";
import joseG from "../assets/speakers/joseG.png";
import davidA from "../assets/speakers/davidA.png";
import luisG from "../assets/speakers/luisG.png";
import dreg from "../assets/speakers/dreg.jpeg";
import albertoL from "../assets/speakers/albertoL.jpg";
import davidS from "../assets/speakers/davidS.png";
import awsLogo from "../assets/logos/aws-logo.png";
import suseLogo from "../assets/logos/suse-logo.png";
import redhatLogo from "../assets/logos/redhat-logo.png";
import microsoftLogo from "../assets/logos/microsoft-logo.png";
import digitaloceanLogo from "../assets/logos/digialocean-logo.png";

import SpeakerCardHome from "./SpeakerCardHome";

// Speakers of the 2025 edition. Order here defines the "Speaker NN" numbering
// rendered by SpeakerCardHome (index + 1).
//
// PENDING: none of these speakers have `linkedin` / `twitter` URLs yet.
// SpeakerCardHome only renders social icons when those fields are present,
// so add real profile URLs here as they become available — do not invent
// placeholder links.
const speakers = [
  {
    name: 'Luis Guirigay',
    role: 'Worldwide Head of Cloud Infrastructure Solutions at AWS',
    roleLogo: awsLogo,
    roleLogoAlt: 'AWS',
    img: luisG,
    bio: "A passionate leader with expertise in training and managing high-performing teams of technical professionals to achieve strategic goals and visions. Published Author and Speaker at over 90 conferences across all continents. Proven track record in developing and leading strategic programs around Technology and Business. Skilled in building value-based transformational strategies and delivering world-class technical services. In-depth knowledge of architecture, data centers, and Cloud with a solid history of innovation and success defining engineering roadmaps and detailed customer requirements.",
    talk: null,
    keynote: 'KeyNote: TRACK de AWS',
  },
  {
    name: 'Rossana Suarez',
    role: 'Roxs🔥| Tech Lead DevOps @naranjax | Roxs.Fest 2025 | AWS Hero⭐| Docker Captain🐳 | DevOps Ambassador⭐|DevOps🔥| DevSecOps🔥|Content Creator blog.295devops.com| Developer👩‍💻|Mentor👩‍🏫 🇻🇪🇦🇷',
    img: rossanaS,
    bio: "Soy Roxs, Software Engineer apasionada por la tecnología y la innovación. Como DevOps, GitLab HERO, AWS HERO y Docker Captain, busco empoderar a la comunidad tech y fomentar la colaboración. Creo firmemente que 'No se puede crecer si no estás dispuesto a saltar a la zona de peligro', y vivo cada desafío profesional con esa mentalidad. Exploradora de nuevas fronteras en el desarrollo y la automatización, mi objetivo es impactar positivamente y ayudar a otros a alcanzar su máximo potencial.",
    talk: 'Migración inteligente: Containeriza tu aplicación heredada con MCP',
  },
  {
    name: 'Juan Vicente Herrera Ruiz de Alejo',
    role: 'Cloud Architect - Red Hat',
    roleLogo: redhatLogo,
    roleLogoAlt: 'Red Hat',
    img: juanV,
    bio: 'Cloud Architect en Red Hat, co-organizador de Madrid Devops y Devopsdays Madrid y profesor de Cloud Computing en Universidad Pontificia de Comillas',
    talk: 'Secure by Design: Integrando Threat Modeling en el Ciclo de Vida MLOps con OpenShift AI',
  },
  {
    name: 'Shani Adadi Kazaz',
    role: 'Senior Containers & Serverless GTM Specialist - AWS',
    roleLogo: awsLogo,
    roleLogoAlt: 'AWS',
    img: shaniA,
    bio: "I started my career as a software developer and later expanded into roles as a Technical Account Manager and Business Developer for Containers and Serverless technologies. Today, I help companies build platforms that are resilient, self-healing, and built to last. I'm passionate about innovation, emerging cloud-native technologies, and enabling builders to succeed, and I thrive on turning transformative ideas into practical, scalable solutions.",
    talk: 'Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure',
  },
  {
    name: 'Alejandro de la Hoz Martin',
    role: 'Red Hat Senior Consultant',
    roleLogo: redhatLogo,
    roleLogoAlt: 'Red Hat',
    img: alejandroH,
    bio: 'Mas de 17 años trabajando en el sector TI y soy un enamorado de la methodologias y filosofias DevOps. Soy Javero por naturaleza, pero me encanta Python y la automatización.',
    talk: 'De 0 a 100 con Ansible en AWX',
  },
  {
    name: 'Alberto Morgante',
    role: 'SUSE - Principal Telco Edge Engineer',
    roleLogo: suseLogo,
    roleLogoAlt: 'SUSE',
    img: albertoM,
    bio: "I'm an engineer passionate about cloud, development and new technologies. I'm always looking for new challenges in order to improve myself everyday!!!",
    talk: 'Automated Baremetal deployment with CAPI + ClusterClass',
  },
  {
    name: 'Pablo Sánchez Carmona',
    role: 'Senior Network Specialist Solutions Architect, AWS',
    roleLogo: awsLogo,
    roleLogoAlt: 'AWS',
    img: pabloS,
    bio: 'Pablo es arquitecto de soluciones especializado en redes en AWS, donde se ha especializado en Infraestructura como Código (IaC), para enseñar a clientes de AWS cómo poder simplificar la creación, gestión y securización de redes complejas en AWS.',
    talk: 'Shift Left, Scale Right - Securizando la infraestructura de AWS a escala con DevSecOps',
  },
  {
    name: 'Antonio Berben',
    role: 'Solo.io - Principal Solutions Engineer',
    img: antonioB,
    bio: 'Antonio is a Principal Solutions Engineer at Solo.io, where he works on learning from the users and helping them to walk the path towards full Service Mesh adoption. He is a CNCF Organizer (KCD Spain, CNCF Iberia) and contributes to open-source projects. His career path coming from development, makes him always put the Developers always at first. His philosophy: "Developers create the business. The rest we are here only to make their life easier" His biggest concern is: How to speed up the development lifecycle. That is one of the reasons why he is an enthusiast of Service Mesh',
    talk: 'De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras',
  },
  {
    name: 'Felipe Vicens',
    role: 'AI for everyone, open, scalable, from cloud to edge',
    img: felipeV,
    bio: 'Felipe is a Telco Cloud Architect with over a decade of experience, focused on building infrastructure that supports any workload, from network functions to AI. A committed open-source advocate, he specializes in Telco Cloud, Edge, and AI to enable resilient, scalable operations.',
    talk: 'De Becario en formación a Agente Épico. Evolución de la IA en Infraestructuras Críticas Seguras',
  },
  {
    name: 'Carlos Villanúa',
    role: 'Traefik Labs - Solutions Architect',
    img: carlosV,
    bio: 'Carlos Villanúa Fernández es Solutions Architect en Traefik Labs. Se dedica a ayudar a equipos a exponer APIs y servicios de forma segura, automatizada y escalable, utilizando tecnologías como Kubernetes, Traefik, OpenTelemetry, OPA, Keycloak... Le gusta trabajar con infraestructuras como código para evitar tareas manuales y asegurar despliegues rápidos y fiables. Carlos disfruta compartiendo su experiencia en eventos y comunidades tecnológicas, siempre buscando soluciones prácticas y sencillas. Fuera del trabajo, le encanta pasar tiempo con su familia, cacharrear con domótica, salir en bici, practicar kayak y dedicarse a la jardinería, especialmente cultivando verduras en su huerto.',
    talk: '$Git It Done: API Management as Code (The DevOps & Platform Team Dream)',
  },
  {
    name: 'Mani Ghelichkhani',
    role: 'Senior Cloud Operations Architect en Amazon Web Services (AWS)',
    roleLogo: awsLogo,
    roleLogoAlt: 'AWS',
    img: maniG,
    bio: 'Computer Engineer with extensive experience in IT system administration and operation of critical services. In addition to keeping systems up and running, provides analytical and communication skills to manage teams, improve processes and assist in general business activities.',
    talk: 'Modernizing EKS workloads: Performance & Cost at Scale with Graviton and Karpenter',
  },
  {
    name: 'Cleyra Uzcategui',
    role: 'Software Engineer at JP Morgan & Chase Co.',
    roleSecondary: 'Women Techmakers Ambassador',
    img: cleyraU,
    bio: 'Cleyra is a Venezuelan Software Engineer based in United Kingdom. Her passion for web development and user experience have led her to focus her career on creating products that are easy to use and accessible to everyone. She is also a promoter of diversity and inclusion in the tech industry and is always looking for ways to promote equal opportunity and representation, in her role as Women Techmakers ambassador, Women Developer Academy Mentor, Google Developers Group organiser and in her role as Affiliate Professor at University of Glasgow.',
    talk: "Web UI: What's New and What's Next",
  },
  {
    name: 'Sara San Luís Rodríguez',
    role: 'AI Team Lead @ MDW | Microsoft AI MVP',
    img: saraS,
    bio: 'Passionate about science since childhood, I studied Mathematics at the University of Santiago de Compostela, I completed these studies with a Master in Statistics and Operational Research. The latter allowed me to enter the world of AI and ML, fields in which I am currently working as AI Team Lead @MDW.',
    talk: 'Implementando un sistema de Machine Learning observable en la nube',
  },
  {
    name: 'Christian Carballo Lozano',
    role: 'Artificial Intelligence Engineer at Plain Concepts | Microsoft MVP in AI',
    img: christianC,
    bio: 'Christian Carballo Lozano is a Mathematician building Machine Learning and AI solutions at Plain Concepts and a Microsoft MVP in AI.',
    talk: 'Implementando un sistema de Machine Learning observable en la nube',
  },
  {
    name: 'Dachi Gogotchuri',
    role: null,
    img: dachiG,
    bio: "Founder of Arcasiles Group and Platform Engineering Lead at Nationale Nederlanden Spain, shaping platforms, communities, and the future through real innovation. I'm Dachi Gogotchuri. I work at Nationale Nederlanden where I enjoy creating and managing projects. Arcasiles Group founder: https://arcasiles.com. Past Microsoft MVP (2015 – 2020). I blog about coding & life: https://soydachi.com",
    talk: 'IA generativa en DevSecOps: automatización inteligente de pipelines',
  },
  {
    name: 'Carlos Polop',
    role: 'Co-Founder HackTricks Training',
    img: carlosP,
    bio: 'Carlos has a degree in Telecommunications Engineering with a Master in Cybersecurity. He has worked mainly as Penetration Tester and Red Teamer for several companies and has several relevant certifications in the field of cybersecurity such as OSCP, OSWE, CRTP, eMAPT, eWPTXv2, OSMR, ARTE, GRTE… He was captain of the Spanish team in the ECSC2021 and member of Team Europe for the ICSC2022. And he has spoken at several international conferences such as DEFCON31 and several ROOTEDCONs. Since he started learning cybersecurity he has tried to share his knowledge with the infosec community by publishing open source tools such as https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite and writing a free hacking book that anyone can consult at https://book.hacktricks.xyz.',
    talk: 'GCP Vulnerabilities & Features of Offensive Engineers',
  },
  {
    name: 'Patricia Rodríguez Vaquero',
    role: 'Senior Data Engineer - MDW | Microsoft MVP',
    img: patriciaR,
    bio: "Certified Azure Data Engineer. With 5 years of experience in Microsoft Azure services (Microsoft Fabric, Azure Synapse Analytics, ADF, Azure Databricks, Python, T-SQL, Spark, etc), I bring passion, dedication, and a drive to master Microsoft technologies. Beyond work, I consider myself honest, perseverant, curious, and a committed lifelong learner. I'm an animal and nature lover, an avid traveler, and an active participant in community events. ATTITUDE IS THE KEY TO SUCCESS!",
    talk: 'Microsoft Fabric meets AI: Building real-world business solutions',
  },
  {
    name: 'Almudena Zhou Ramírez López',
    role: 'Senior AI Engineer - MDW',
    img: almudenaZ,
    bio: "Hi, I'm Almudena Zhou, an AI Engineer certified in Azure (AI-102, DP-100) and GenAI Databricks. I love exploring new technologies and enjoy working on projects where AI and software development come together. My experience includes building and deploying machine learning models, experimenting with generative AI, and applying innovative tools to real-world challenges. I'm always curious to learn, swap ideas, and connect with others who share a passion for technology!",
    talk: 'Microsoft Fabric meets AI: Building real-world business solutions',
  },
  {
    name: 'Verónica Rivas Remiseiro',
    role: 'Microsoft MVP M365 copilot - Tech & Lead Projects - Cybersecurity & AI',
    img: veronicaR,
    bio: "A computer engineer with over 25 years of experience, my profession has fascinated me since I was a child, providing me with wonderful professional and personal experiences. I enjoy building teams, sharing with them, growing together, and executing projects with the greatest possible success. Currently undergoing a process of change, returning to my technological roots, constantly learning, and trying out new technologies like AI, which fascinates me. Author of my first book based on personal events with a stowaway named Alzheimer's, in homage to the woman who helped me become who I am today. Passionate about my life, my profession, and technology.",
    talk: 'Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps',
  },
  {
    name: 'Toni Granell',
    role: 'Microsoft MVP & MVS #powerplatform advocate. Speaker. Evangelista Senior en Tecnologías Microsoft. Power User. Miembro de Dynamic Communities & Power Platform Mallorca. Colaboratólogo. Flautista de Hamelin',
    img: toniG,
    bio: 'He participado en más de 200 proyectos de implantación de soluciones basadas en Dynamics CRM & Dynamics 365. Speaker de Microsoft en diversos eventos, destacando el lanzamiento de CRM 3.0 presentando el primer caso de éxito (SPAMINA). Diversos casos de éxito publicados por Microsoft de proyectos llevados a cabo desde Amauta, destacando Cámara de Comercio de Valencia, Fermax y Marie Claire. Participación en eventos internacionales relacionados con Microsoft: ExtremeCRM, Extreme365, Summit EMEA CRM/UG, Microsoft Convergence, Microsoft World Partner Conference, Microsoft Inspire, Microsoft Business Application Summit, Microsoft DIRECTIONS.',
    talk: 'Análisis Predictivo con Copilot: Anticipando Problemas en Entornos AIOps',
  },
  {
    name: 'Ignacio Dominguez',
    role: 'Co-Funder Hacktricks Training, Cloud Secuirty Engineer @ Circle',
    img: ignacioD,
    bio: 'Ignacio Dominguez is a Cloud Security Engineer with over 6 years of experience securing cloud-native environments. He currently works at Circle as a Lead Cloud Security Engineer, where he focuses on protecting infrastructure at scale. Ignacio is also the co-founder of HackTricks Training, a platform offering high-quality Cloud Security certifications. His main areas of interest include hacking CI/CD systems, securing cloud platforms (especially AWS), and breaking into (and defending) Kubernetes environments.',
    talk: 'Hacking CI/CD Pipelines',
  },
  {
    name: 'Jeff Fan',
    role: 'Senior Solutions Architect - DigitalOcean',
    roleLogo: digitaloceanLogo,
    roleLogoAlt: 'DigitalOcean',
    img: jeffF,
    bio: 'I am a Solutions Architect at DigitalOcean, where he designs and optimizes K8s-based GPU infrastructure for gen-AI workloads, with a focus on LLM inference and cost-efficient scaling. Before joining DigitalOcean, he helped build and run mission-critical systems for several large German enterprises. Jeff now distills complex cloud and AI concepts into clear, practical guidance—publishing articles that turn deep technical challenges into straightforward, actionable steps for engineering teams.',
    talk: 'Make Rival GPUs Play Nice—Slash Latency 45 % Without Buying More Cards',
  },
  {
    name: 'Jose Gómez-Sellés',
    role: 'Product Lead for VictoriaMetrics Cloud',
    img: joseG,
    bio: "Jose is the Product Lead for VictoriaMetrics Cloud, focusing on Observability and Sustainability through projects like OpenTelemetry, distributed tracing, and power monitoring. His background spans roles as Software Architect, Tech Lead, and Product Owner in the Telecommunications industry, where agile practices, CI, testing, and observability have been core principles. With a PhD in Computational Materials Engineering, he combines scientific curiosity with a pragmatic mindset. Outside work, he's a C++ enthusiast, metal keyboardist, simracer, and Associate Professor of Physics at the Complutense University of Madrid.",
    talk: 'Scale Your Monitoring Solution With the VictoriaMetrics Ecosystem',
  },
  {
    name: 'Juarez Junior',
    role: 'Software Architect / Engineer, Solution Architect, Developer Advocate',
    img: juarezJ,
    bio: 'My name is Juarez Barbosa Junior. I have held senior leadership roles in software engineering and developer relations, focusing on developer audiences, subject matter experts, customers, and business partners. I have also acted as a mentor for Microsoft for Startups, having worked with startup founders, accelerators, incubators, mentors, and venture capitalists. I am a Sr Principal Developer Evangelist and Director of Developer Evangelism at Oracle. Previously, I was an Azure Developer Relations Lead – Director of Developer Relations at Microsoft. I have extensive experience with large enterprise systems and environments with companies like Oracle, Microsoft, IBM, Unisys, Nokia, Accenture, and a few medium-sized companies and startups (two as a founder).',
    talk: 'Automating Database CI/CD with Oracle DB Operator, GitHub Actions, and Liquibase',
  },
  {
    name: 'José Enrique Calderón Sanz',
    role: 'Lead Software Engineer at JP Morgan Chase',
    img: joseC,
    bio: 'Jose is an accomplished Venezuelan Lead Software Engineer based in the U.K., with a decade of experience driving cutting-edge software solutions. Jose is consistently seeking opportunities to advance equal access and representation in the tech industry, as Google Developer Group organiser, Ignite JAVA/Spring Community of Practice lead and in his role as Affiliate Professor at University of Glasgow. As speaker, Jose has a passion for demystifying complex concepts and making technology accessible to all through dynamic and engaging talks. He is also known for his captivating and interactive presentations on a wide range of technology subjects.',
    talk: 'Evolutionary Architecture: the art of making decisions',
  },
  {
    name: 'David Amorín García',
    role: 'MDW - Analista de Inteligencia Empresarial',
    img: davidA,
    bio: 'Me llamo David Amorin Garcia, tengo 32 años y me dedico a la comunicación desde los 15. Como amante de las tecnologías y de transmitir conocimiento, me gradué en Teatro a la par que me formaba en aspectos relacionados con el SEO y los datos. Aproveché durante varios años la ventana que me ofrecía YouTube y Twitch para mostrar las aptitudes que iba adquiriendo y compartirlas con la audiencia. A principios de 2022 decidí entrar en el mundo empresarial para aportar todo lo que había aprendido durante todos estos años y así poder ayudar a los demás.',
    talk: 'Estrategias de Visualización de Datos para Comunicadores: Contando Historias con Números',
  },
  {
    name: 'Gisela Torres',
    role: 'Sr. Global Blackbelt - Developer Audience @Microsoft',
    roleLogo: microsoftLogo,
    roleLogoAlt: 'Microsoft',
    img: giselaT,
    bio: 'Sr. Global Blackbelt - Developer Audience @Microsoft | Microsoft Azure MVP 2010&2011 | Lemoncode 🍋 teacher| Blogger at https://www.returngis.net',
    talk: 'Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering',
  },
  {
    name: 'David Reguera García',
    role: null,
    img: dreg,
    bio: 'Experto en seguridad ofensiva y hardware hacking con amplia experiencia en investigación y desarrollo de técnicas avanzadas de ciberseguridad.',
    talk: 'Offensive Hardware Hacking I+D+I VS Conceptos y filosofia devops/devsecops',
  },
  {
    name: 'Alberto Lobato',
    role: null,
    img: albertoL,
    bio: 'Experto en ciberseguridad para entornos de Tecnología Operativa (OT) con experiencia en el sector ferroviario y cumplimiento de normativas IEC 62443.',
    talk: 'Ciberseguridad y OT. ¿Friends or enemies?',
  },
  {
    name: 'David Sastre',
    role: 'Staff Product Security Engineer at Nexthink',
    img: davidS,
    bio: 'David Sastre cuenta con una amplia experiencia profesional en seguridad y arquitectura de la nube. Actualmente, trabaja como Staff Product Security Engineer en Nexthink. Trabajó como Principal Product Security Engineer en Red Hat durante 7 años, donde lideró iniciativas en seguridad de productos y adopción de datos abiertos enlazados para mejorar la gestión de amenazas y vulnerabilidades. Ha desempeñado roles destacados como Senior Product Security Engineer y Cloud and DevOps Senior Architect. Con más de 7 años de experiencia, sus habilidades abarcan desde Information Security, Red Hat Enterprise Linux (RHEL), y OpenShift hasta Network Security, Threat Modeling, y ciberseguridad.',
    talk: 'Unikernels: The Next Frontier',
  },
];

const SpeakersSection = () => {
  const { t } = useTranslation();
  return (
    <>
      <section id="ponentes" className="speaker-section ">
        <div className="container margin-top">
          <h2 className="text-center">{t('speakers.title')}</h2>
          <p className="text-center speakers-edition-label">{t('speakers.edition2025Label')}</p>

          <div className="speaker-cards margin-top">
            {speakers.map((speaker, index) => (
              <SpeakerCardHome key={speaker.name} speaker={speaker} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SpeakersSection;
