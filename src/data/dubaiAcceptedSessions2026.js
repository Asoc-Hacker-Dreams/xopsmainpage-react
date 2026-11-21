// Public Dubai 2026 single-day (30 Nov) accepted-session details. Only the 10 talks in the confirmed jornada única agenda are kept (Antonio, 24-nov).
// Public Dubai 2026 accepted-session details and speaker photos + biographies.
// Source: organiser's 12 Nov 2026 accepted-session export plus the public Sessionize /view/All feed.
// Private emails and attendance flags intentionally excluded; panel roles have not been assigned.
export const dubaiAcceptedSessions2026 = {
  "1341342": {
    "id": "1341342",
    "title": "Non-engineers in production: when product managers write database migrations with coding agents",
    "description": "At Tabby, product managers contribute to production code and write database migrations with coding agents. Daria follows one change from idea to merged pull request, mistakes included, and shows where the line sits between what a PM ships and what stays with engineering.\n\nFor ops teams this raises two practical questions: how to review changes from people who do not read code fluently, and how to keep database migrations safe. The talk answers both from day-to-day practice.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "84dc4d90-ecc5-4381-9397-9f8a3dff4c46"
    ],
    "sourceTrack": "Summit"
  },
  "1319799": {
    "id": "1319799",
    "title": "Your platform team has no story, and that's why you have no budget",
    "description": "Platform teams are product teams that never got a product marketer. They have users (internal developers), a competitor (every team building it themselves, or going straight to AWS), a buyer (the CFO or CTO) and a renewal - the annual budget cycle. They run all of that on zero positioning, zero segmentation, and zero proof. So at budget time they walk in with a list of things they did, and a vendor walks into the same meeting with a story about what a business gets. The vendor wins. Not because the platform is worse, but because it was never positioned.\n\nMy talk teaches four GTM frameworks, each translated into a platform-team artifact they can build on Monday.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "3047a4f7-f794-49a5-85db-94e63e2af22c"
    ],
    "sourceTrack": "Conference"
  },
  "1318615": {
    "id": "1318615",
    "title": "Detect, Decide, Report: Automating CRA's 24-Hour Vulnerability Response with Elastic and Ansible",
    "description": "Starting September 2026, the EU Cyber Resilience Act requires software manufacturers to detect and report actively exploited vulnerabilities within 24 hours. \n\nThis session walks through a working automation setup built on Elastic and Ansible: every build generates a live SBOM, streamed into Elasticsearch and enriched against CISA's KEV catalog and EPSS scores, visualized in Kibana. \n\nWhen a detection rule fires, the system checks context and either triggers a scoped Ansible playbook or routes to an engineer. Every action is logged, thereby producing a compliance report draft automatically.\n\nAttendees will leave with:\n\n1. A reference architecture diagram and source code on GitHub\n2. Ansible roles for SBOM generation, KEV/EPSS enrichment, and remediation\n3. A working example turning logs into a compliance report draft\n4. An honest look at where automation is safe, and where judgment matters",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "b29d5315-2fec-4dd6-8a91-30efcd6d0a68"
    ],
    "sourceTrack": "Conference"
  },
  "1315380": {
    "id": "1315380",
    "title": "One Binary, Any Cloud: Sovereign Kubernetes with Cluster API and GitOps",
    "description": "Every managed Kubernetes offering solves the same problem the same way: you hand the control plane to someone else. That is convenient — until data-residency rules, an audit, or an exit clause force the uncomfortable question: could we run this ourselves, in-region, on our own hardware, tomorrow?\n\nThis talk shows how we answered \"yes\" with KubeAid, an open-source application platform for Kubernetes, and its single-binary orchestrator, kubeaid-cli. The CLI starts a throwaway K3D management cluster on your laptop, installs Cluster API, provisions the target on AWS, Azure, Hetzner or plain bare metal, then pivots every Cluster API object onto the new cluster with clusterctl move so it manages itself — and the laptop cluster is discarded. From that moment everything is GitOps: one general.yaml is rendered into a config repository you own, and Argo CD reconciles the complete KubeAid platform — Cilium, cert-manager, kube-prometheus, Rook-Ceph, Velero, Sealed Secrets, and the rest of the stack your applications need — on top of upstream defaults you override only where you genuinely differ.\n\nWe will set up a cluster live, from an empty directory to a self-managing Kubernetes cluster with the KubeAid platform reconciled by Argo CD. Then we will cover what most talks skip: day two. We will walk through how the same binary reports backup status across the cluster — Velero for workloads and volumes, CloudNativePG for databases — how recovery works when a cluster has to be rebuilt from nothing but its Git repository and its backups, and how the cluster is compliance-ready from day one rather than hardened afterwards: admission policies enforced by Kyverno, continuous vulnerability scanning with Trivy Operator, runtime security with Tetragon, secrets encrypted in Git with Sealed Secrets, access centralised through SSO, and every platform change landing as a reviewable commit — defaults that map to ISO 27001:2022 and cover GDPR and NIS2 goals out of the box.\n\nYou will leave with a reproducible recipe for an application platform whose entire definition lives in a repository you control — backed up, recoverable, compliant, auditable, portable across providers, and not tied to any single vendor, including the one that wrote it.\n\nTakeaways:\n- How Cluster API's management-cluster pivot removes the \"who manages the manager\" problem\n- A GitOps layout where one YAML drives provisioning, the application platform and its backup policy, and drift is impossible by design\n- How backup health and recovery are built into the platform, and what that means for your exit strategy\n- What \"compliance-ready from day one\" looks like in practice: policies, scanning, runtime security and access control as platform defaults, mapped to ISO 27001, GDPR and NIS2",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "dcbdeeda-0642-4650-85cd-beef78f8f83c"
    ],
    "sourceTrack": "Summit"
  },
  "1339445": {
    "id": "1339445",
    "title": "From ML Chaos to AIOps Maturity: Building Production-Ready AI Systems",
    "description": "You've trained a great model. It passes validation tests. Your data scientists are confident. Then you deploy it to production and everything breaks.\n\nThis is the reality organisations face when they treat AI operations as an afterthought. The gap between data science and operations is where most AI projects fail, not because the ML is bad, but because the ops aren't ready.\n\nIn this talk, we'll navigate the journey from chaos to maturity, building a comprehensive AIOps discipline that covers:\n\nThe infrastructure problem: Why traditional DevOps assumptions break with ML workloads. How to right-size Kubernetes clusters for GPUs, manage memory constraints, and control costs across AWS, Azure, and GCP.\n\nThe visibility problem: You can't operate what you can't see. We'll build observability into data pipelines, model inference services, and automated retraining loops, collecting the right metrics, logs, and traces to spot problems before users do.\n\nThe reliability problem: Model drift isn't a data science problem; it's an ops problem. We'll explore failure modes unique to AI systems and architectural patterns for graceful degradation, circuit breaking, and recovery.\n\nThe governance problem: How do you version models like code? How do you know if a deployment improved or broke things? We'll apply GitOps principles to the ML lifecycle.\n\nThe cost problem: Without discipline, AI workloads destroy cloud budgets. Practical strategies for resource allocation, spot instances, and multi-cloud optimisation.\n\nUsing patterns that work across all major cloud providers, we'll walk through scenarios and design decisions that turn operational chaos into predictable, scalable systems.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "8ea2939d-46a5-419e-918c-957367d62c1c"
    ],
    "sourceTrack": "Conference"
  },
  "1321418": {
    "id": "1321418",
    "title": "Guardians of the Data Galaxy",
    "description": "An expansion and update to a Bsides keynote talk in 2023 (https://www.superuser.space/latest-news-blog/bsides-berlin-2023-keynote), we take a look at the current challenges in 2026 in the information security \"galaxy\" and defending it to be ready for 2027. In this talk, she uses her experience this year alone on what it is like being a part of a major digital transformation project in the telecommunications industry working within GRC, learning more on AI from the LLM engineer perspective (to go beyond the AI slop), and what it is like implementing ISO 27001:2022 at startups that have recently started introducing AI.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "df8487c4-3a65-4301-8a0a-3ae6759e981a"
    ],
    "sourceTrack": "Summit"
  },
  "1343214": {
    "id": "1343214",
    "title": "Beyond RAG: Operating Production-Grade AI Agents with Kubernetes, OpenTelemetry and Grafana",
    "description": "Building an AI agent demo is easy. Operating one reliably in production is much harder.\n\nThis session shows how to take an agentic AI application from a local prototype to an observable cloud-native system using Docker, Kubernetes, OpenTelemetry, Prometheus, Grafana and distributed tracing. We will follow requests across LLM calls, retrieval, tools and agent workflows, then examine latency, failures, token usage and dependency bottlenecks.\nThe session focuses on practical AgentOps patterns: what to instrument, which telemetry actually matters, how traces differ from traditional application monitoring, and how DevOps and MLOps practices evolve when nondeterministic AI components become part of the production stack.\n\nAttendees will learn:\n- How to instrument an AI-agent workflow with OpenTelemetry\n- How to correlate LLM, retrieval and tool-call traces\n- Which metrics matter for production AgentOps\n- How Docker and Kubernetes fit into an observable agent platform\n- How Grafana, Prometheus and tracing help troubleshoot AI failures",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "a86f13c6-b7de-4362-848e-145e02aeae60"
    ],
    "sourceTrack": "Conference"
  },
  "1345297": {
    "id": "1345297",
    "title": "Agents Are the New Containers: Packaging AI Agents and Their Guardrails as OCI Kits",
    "description": "Every team I talk to is running AI coding agents now. Almost none of them can tell me what those agents are allowed to touch.\n\nWe solved this problem for software years ago. You build an image, push it, run it anywhere, and it behaves the same way. Agents skipped all of that. An agent today is a prompt, some tools, and whatever access the machine it lands on happens to have. The security rules live in a doc the agent will never read.\n\nDocker's new Kits fix that in a way that feels familiar. A Kit is a normal OCI image that holds the agent, its tools and the rules for what it can reach. You build and ship it like any container, and the rules go with it. Docker has also said it will submit the Kits spec to CNCF, so this isn't meant to stay a one-vendor thing.\n\nIn this session I'll build a Kit live and run it in three places:\n\n- On my laptop with Docker Sandboxes (sbx). The agent gets its own microVM with its own kernel, a network allow-list, and no real credentials inside, because a host proxy adds them on the way out.\n- In CI, with sbx as the agent runtime in GitHub Agentic Workflows.\n- In Docker Cloud Sandboxes, launched in September 2026, where the agent keeps going after I close the laptop.\n\nI'll also connect MCP tools through the sbx gateway, with policies that decide which servers and tool calls are allowed.\n\nThe demo is simple: one Kit, three places, same rules. The agent tries to talk to a server it shouldn't, and it gets blocked all three times.\n\nI'll be honest about the gaps too. Sandboxes won't stop prompt injection, won't catch bad code that looks fine, and won't stop you from widening the allow-list \"just for today\".\n\nYou'll walk out knowing how to package, ship and control AI agents the same way you already handle containers.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "4cc63fd4-a20e-4d0f-b29f-7cc04d62efdc"
    ],
    "sourceTrack": "Conference"
  },
  "1317552": {
    "id": "1317552",
    "title": "Open-Source PostgreSQL: Managing Cost, Flexibility, and Vendor Risk",
    "description": "PostgreSQL is increasingly considered by organizations seeking to reduce database licensing costs, modernize legacy platforms, and gain greater control over their technology strategy. However, adopting an open-source database does not automatically eliminate cost, complexity, or vendor dependency.\n\nThe real business decision extends beyond choosing PostgreSQL. Organizations must determine how it will be deployed, operated, supported, secured, and governed. While PostgreSQL can reduce dependence on proprietary licensing, infrastructure costs, cloud consumption, migration effort, specialist skills, operational support, and business-continuity requirements must still be considered. Moving to a managed PostgreSQL service may simplify operations, but provider-specific features can introduce a different form of vendor lock-in.\n\nThis session presents a practical, decision-oriented framework for evaluating PostgreSQL across three strategic dimensions: cost, flexibility, and vendor risk. It compares self-managed, vendor-supported, and cloud-managed operating models and explains how each affects total cost of ownership, operational responsibility, portability, resilience, and long-term control.\n\nAttendees will leave with a balanced perspective on where PostgreSQL can create business value, which costs are commonly underestimated, and how organizations can benefit from open source without transferring dependency from one vendor to another.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "5605121f-ff48-4c86-935d-54b1aa97b52f"
    ],
    "sourceTrack": "Conference"
  },
  "1289422": {
    "id": "1289422",
    "title": "Game of Bounties",
    "description": "¿Cómo encuentran los hackers éticos vulnerabilidades en algunas de las empresas más importantes del mundo? En esta charla descubrirás cómo funciona el ecosistema del Bug Bounty a través de casos reales, vulnerabilidades técnicas y experiencias de primera mano. Analizaremos el panorama actual de la ciberseguridad, compartiremos consejos prácticos para mejorar la seguridad de cualquier organización y desvelaremos algunas curiosidades y sorpresas que muestran por qué la seguridad ofensiva es hoy una pieza clave para anticiparse a los ataques.\n\nSe presentarán ejemplos técnicos y prácticos de bugs válidos, su impacto, proceso de mitigación y recompensa asociada, comparando el modelo Bug Bounty Program (BBP) frente al modelo de Vulnerability Disclosure Program (VDP). Además, debatiremos la necesidad y viabilidad de una plataforma nacional de bug bounty, que permita canalizar el talento local como herramienta de defensa activa frente al cibercrimen.\n\nLa sesión incluirá tips personales, enfoques metodológicos y aprendizajes adquiridos durante mi experiencia como bug hunter, buscando no solo inspirar, sino también equipar a los asistentes con una base sólida para explorar este campo de forma eficiente y profesional.",
    "language": "Spanish",
    "durationMinutes": 50,
    "speakers": [
      "3fef7201-a441-4056-9ea3-95d9c67ab28f"
    ],
    "sourceTrack": "Conference"
  }
};

export const dubaiSpeakers2026 = {
  "4cc63fd4-a20e-4d0f-b29f-7cc04d62efdc": {
    "id": "4cc63fd4-a20e-4d0f-b29f-7cc04d62efdc",
    "name": "Rishi Mondal",
    "role": "CNCF KubeStellar Maintainer | Docker Captain | LFX Mentor | 2× GSoC | SRE at Obmondo",
    "photo": "https://cdn.sessionize.com/image/4da7-400o400o1-TtTkhHjoeH1d1JZnu6aP4s.jpg",
    "linkedIn": "https://www.linkedin.com/in/rishi-mondal-5238b2282/",
    "sessionizeProfile": "https://sessionize.com/rishi-mondal",
    "bio": "Rishi Mondal is a SRE at Obmondo , CNCF KubeStellar Maintainer, and Docker Captain . A Linux Foundation Mentor, GSoC Mentor at CNCF, and OWASP Mentor he uniquely progressed from LFX Mentee to Maintainer to Mentor within a single year. A regular cloud-native speaker at multiple events across Asia . he was personally featured by the CNCF CEO at Kubecon India for community impact . Harvard HPAIR Delegate and LIFT Scholar."
  },
  "a86f13c6-b7de-4362-848e-145e02aeae60": {
    "id": "a86f13c6-b7de-4362-848e-145e02aeae60",
    "name": "Jay Prajapat",
    "role": "VP of Engineering & Technology, RankRabbitAI",
    "photo": "/speakers/jay-prajapat-profile.png",
    "linkedIn": "https://www.linkedin.com/in/jayy-p/",
    "bio": "Jay Prajapat is a technology leader and engineer with 15 years of experience taking software products from concept to MVP and scaling them into production-ready platforms.\n\nAt RankRabbitAI, Jay leads engineering initiatives focused on building AI-powered applications and production-grade agentic AI systems. His current interests and contributions include agentic AI architectures, developing intelligent agents using Google's Agent Development Kit (ADK), and advancing AI evaluation practices to improve agent reliability, quality, observability, and performance. He is also engaged with the broader AI ecosystem through contributions and involvement with the Agentic AI Foundation (AAIF).\n\nHis engineering philosophy is simple: the right boundaries matter more than the right buzzwords, and a system you cannot observe is a system you cannot trust.\n\nJay is a Certified SAFe Practitioner, an active mentor to fellow engineers, and is based in Ahmedabad, India."
  },
  "b29d5315-2fec-4dd6-8a91-30efcd6d0a68": {
    "id": "b29d5315-2fec-4dd6-8a91-30efcd6d0a68",
    "name": "Harmeet Singh",
    "role": "Automation and Observability Lead, MetLife",
    "photo": "https://cdn.sessionize.com/image/de38-400o400o1-GtwspcZQa5sa9Q2N5V12o8.jpg",
    "linkedIn": "https://www.linkedin.com/in/helloharmeet/",
    "sessionizeProfile": "https://sessionize.com/harmeet-singh",
    "bio": "Harmeet Singh is the Automation and Observability Lead at MetLife, leading engineering teams building automation and observability platforms across the EMEA region. His work sits at the intersection of infrastructure automation, security observability, and compliance across regulated European environments. Over the past decade, he has worked in platform engineering and large-scale infrastructure automation, focused on systems that reduce manual intervention and improve operational reliability."
  },
  "8ea2939d-46a5-419e-918c-957367d62c1c": {
    "id": "8ea2939d-46a5-419e-918c-957367d62c1c",
    "name": "Ravindra Verma",
    "role": "Cloudynamics, DevOps Architect",
    "photo": "https://cdn.sessionize.com/image/048a-400o400o1-BHa6U5VvRCAo11nn5ecEr2.jpg",
    "linkedIn": "https://www.linkedin.com/in/ravindra-verma-b16a494b/",
    "sessionizeProfile": "https://sessionize.com/RavindraVerma",
    "bio": "Founder at Cloudynamics with hands-on experience in DevOps and SRE. Specialises in building and operating cloud-native systems, agentic AI pipelines, and production-grade reliability engineering. Passionate about sharing real-world lessons from the infrastructure and AI trenches."
  },
  "3fef7201-a441-4056-9ea3-95d9c67ab28f": {
    "id": "3fef7201-a441-4056-9ea3-95d9c67ab28f",
    "name": "David Padilla Alvarado",
    "role": "Offensive Security Engineer - Founder Member Hackén Cybersecurity Conference",
    "photo": "https://cdn.sessionize.com/image/efb5-400o400o1-H7PBHgjcvFoJqDNDKfq2WT.jpg",
    "linkedIn": "https://www.linkedin.com/in/davidpadillaalvarado/",
    "sessionizeProfile": "https://sessionize.com/david-padilla-alvarado",
    "bio": "Offensive Security Engineer | Founder Member at @Hackén Cybersecurity Congress | x3 Cybersecurity Master Degree | x8 CVE | MBA | OSCP | CRTO | BSCP | PNPT | eWPT | eCPPTv2 | eJPT | CAP | CSX | CCNA | x8 Hall of Fame"
  },
  "df8487c4-3a65-4301-8a0a-3ae6759e981a": {
    "id": "df8487c4-3a65-4301-8a0a-3ae6759e981a",
    "name": "Hannah Suarez",
    "role": "Founder and CISO - Superuser OÜ, CBIT FZCO",
    "photo": "https://cdn.sessionize.com/image/5768-400o400o1-SVtecpA1UuW8ky6VRv98HG.jpg",
    "linkedIn": "https://www.linkedin.com/in/hannahsuarez",
    "sessionizeProfile": "https://sessionize.com/hannah-suarez",
    "bio": "Hannah Suarez has worked in the information security industry for nearly a decade spanning roles in the software, entertainment, telecommunications and aviation industries. She brings forward a unique insight as a global cyber security entrepreneur that has worked in several countries, who is also a career-changer from the creative industries. \n\nHannah Suarez has previously spoken on cybersecurity in Germany, including the Berlin Bsides 2023 keynote at https://www.superuser.space/latest-news-blog/bsides-berlin-2023-keynote"
  },
  "84dc4d90-ecc5-4381-9397-9f8a3dff4c46": {
    "id": "84dc4d90-ecc5-4381-9397-9f8a3dff4c46",
    "name": "Daria Kasatkina",
    "role": "Senior Product Manager, Tabby",
    "photo": "https://cdn.sessionize.com/image/33be-400o400o1-HP43LmTnq19rdVS95uQma3.jpg",
    "linkedIn": "https://www.linkedin.com/in/daria-sova/",
    "sessionizeProfile": null,
    "bio": "Daria Kasatkina is a Senior Product Manager at Tabby, the Gulf's first fintech unicorn. She leads Tabby's in-house CRM platform, which replaces several third-party tools for back-office teams with one system built for AI automation. Before Tabby she built products at Avito, Tinkoff Bank and Modulbank, including LLM-based tools for customer support at Avito. She runs vibe-coding workshops for non-technical professionals and writes on HackerNoon about AI-first product work and experimentation on small user bases."
  },
  "dcbdeeda-0642-4650-85cd-beef78f8f83c": {
    "id": "dcbdeeda-0642-4650-85cd-beef78f8f83c",
    "name": "Ashish Jaiswal",
    "role": "CTO at Obmondo · maintainer of KubeAid and LinuxAid",
    "photo": "https://cdn.sessionize.com/image/b472-400o400o1-9oE9ftC5hFCk4QerkxPP3Q.jpg",
    "linkedIn": "https://www.linkedin.com/in/ashish1099/",
    "sessionizeProfile": "https://sessionize.com/ashish1099",
    "bio": "Ashish Jaiswal is CTO at Obmondo, a Danish company and member of DOSL (Danish Open Source Suppliers) that runs self-hosted Kubernetes and Linux infrastructure for organisations that need to keep control of their own platforms, and leads a team of 40+ there. Ashish has worked in infrastructure since 2011, spent part of that time at Red Hat, and has been with Obmondo since 2015, rising from engineer to team lead to CTO. Ashish maintains KubeAid, the open-source GitOps application platform for Kubernetes, kubeaid-cli, its single-binary cluster orchestrator, and LinuxAid for Linux configuration management. Ashish brings deep experience in system design and architecture, with a strong focus on engineering mindset: reasoning a design through and catching its errors before anything is deployed. Day to day that means architecture reviews, pulling clusters out of hyperscalers and onto bare metal, and building an AIOps layer so operations need fewer humans at three in the morning. Ashish writes about Kubernetes, Go and self-hosted LLMs at ashish1099.me, is ashish1099 on GitHub, and is a proud father."
  },
  "5605121f-ff48-4c86-935d-54b1aa97b52f": {
    "id": "5605121f-ff48-4c86-935d-54b1aa97b52f",
    "name": "Sonia Valeja",
    "role": "PostgreSQL Enthusiast (PostgreSQL DBA, Percona)",
    "photo": "https://cdn.sessionize.com/image/7534-400o400o1-aZSxyR2xGjeGyVozhEdbER.jpg",
    "linkedIn": "https://www.linkedin.com/in/sonia-valeja-69517a140/",
    "sessionizeProfile": "https://sessionize.com/sonia-valeja",
    "bio": "Sonia Valeja has been passionate about data and databases since her university days. She began working with PostgreSQL since the year 2012 at her first company and has taken on various roles, including PostgreSQL DBA, PL/pgSQL Developer, Database Lead, and Migration Lead. She is the co-author of PostgreSQL for JobSeekers, published in June 2023, and has created a LinkedIn Learning course on PostgreSQL’s backup tool, pgBackRest, which was launched in April 2024."
  },
  "3047a4f7-f794-49a5-85db-94e63e2af22c": {
    "id": "3047a4f7-f794-49a5-85db-94e63e2af22c",
    "name": "Valeria Bogatyreva",
    "role": "Product Marketing for PostgreSQL, MySQL and MongoDB at Percona",
    "photo": "https://cdn.sessionize.com/image/cc5d-400o400o1-RzkP9kU11m27vWwxa4CfJq.jpg",
    "linkedIn": "https://www.linkedin.com/in/valeriia-bogatyreva/",
    "sessionizeProfile": "https://sessionize.com/valeria-bogatyreva",
    "bio": "Valeria works closely with community users of PostgreSQL, MySQL and MongoDB, analyzing their adoption patterns and demonstrating the transformative value open source databases bring to businesses. Her understanding of the technical and business aspects of multi-model database capabilities and extensibility helps her articulate its benefits to C-level executives and other key stakeholders."
  }
};
