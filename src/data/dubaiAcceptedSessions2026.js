// X-Ops Dubai 2026 accepted sessions and public speaker photos.
// Source: organiser's accepted-session XLSX (12 Nov 2026) and public Sessionize API /view/All.
// Personal emails, attendance flags and private application notes are deliberately excluded.
// The organiser placed four accepted Conference talks on Summit day; panel/boardroom roles remain unassigned.
export const dubaiAcceptedSessions2026 = {
  "1289422": {
    "id": "1289422",
    "title": "Game of Bounties",
    "description": "¿Cómo encuentran los hackers éticos vulnerabilidades en algunas de las empresas más importantes del mundo? En esta charla descubrirás cómo funciona el ecosistema del Bug Bounty a través de casos reales, vulnerabilidades técnicas y experiencias de primera mano. Analizaremos el panorama actual de la ciberseguridad, compartiremos consejos prácticos para mejorar la seguridad de cualquier organización y desvelaremos algunas curiosidades y sorpresas que muestran por qué la seguridad ofensiva es hoy una pieza clave para anticiparse a los ataques.\n\nSe presentarán ejemplos técnicos y prácticos de bugs válidos, su impacto, proceso de mitigación y recompensa asociada, comparando el modelo Bug Bounty Program (BBP) frente al modelo de Vulnerability Disclosure Program (VDP). Además, debatiremos la necesidad y viabilidad de una plataforma nacional de bug bounty, que permita canalizar el talento local como herramienta de defensa activa frente al cibercrimen.\n\nLa sesión incluirá tips personales, enfoques metodológicos y aprendizajes adquiridos durante mi experiencia como bug hunter, buscando no solo inspirar, sino también equipar a los asistentes con una base sólida para explorar este campo de forma eficiente y profesional.",
    "language": "Spanish",
    "durationMinutes": 50,
    "speakers": [
      "3fef7201-a441-4056-9ea3-95d9c67ab28f",
      "5b2f8725-1067-4d4c-928a-e165cf75be20"
    ],
    "sourceTrack": "Conference"
  },
  "1291014": {
    "id": "1291014",
    "title": "Designing Low-Latency Online Data Stores for AI-Driven Financial Services",
    "description": "Financial institutions face mounting pressure to deliver real-time, personalized insights through AI systems while simultaneously ingesting and processing high-velocity transaction streams. Most existing data architectures cannot meet sub-100ms latency demands while handling over 100,000 events per second, creating a critical gap between AI system requirements and infrastructure capability, a challenge familiar to DataOps and MLOps teams operating at scale.\nThis presentation introduces a production-proven online data store architecture combining a Hybrid Transactional and Analytical Processing (HTAP) database (TiDB), Redis as a low-latency cache, Kafka and Kafka Streams for streaming ingestion and materialized views, and Spark for batch pre-aggregation of metrics. The system achieves p95 read latencies at or below 30ms, p99 latencies at or below 100ms, streaming ingestion throughput exceeding 100,000 events per second, and data freshness under one second for critical events. This architecture was implemented at Chime Financial to power AI bots serving real-time member financial insights.\nThe design employs a read-through cache strategy, event-driven cache invalidation via Kafka Streams, exactly-once semantics for stream processing, and a two-tier ML feature pipeline supporting both real-time model scoring and batch training workflows, an operational pattern central to modern AIOps and MLOps practice. Security and compliance controls including PCI/PII tokenization, encryption in transit and at rest, and immutable audit logging are built into every architectural layer, reflecting the SecOps and DevSecOps priorities operations teams increasingly own.\nAttendees will gain practical blueprints for building scalable, low-latency data stores for AI applications, including data modeling patterns for TiDB and Redis, cache invalidation strategies, capacity planning across four deployment tiers from small-scale to hyperscale, and integration patterns directly applicable to fraud detection, real-time risk scoring, and personalized customer engagement systems.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "a672edd6-607c-4079-aba7-0f998e409451"
    ],
    "sourceTrack": "Conference"
  },
  "1297939": {
    "id": "1297939",
    "title": "Teaching AI Agents Like Guide Dogs: A Progressive Trust Framework",
    "description": "Your AI agent has access to your database, your APIs, and your users' data. But would you give a new hire admin credentials on day one? We do this with AI agents constantly - deploying them with full system access before they've proven they won't hallucinate a DROP TABLE or leak sensitive data to a prompt injection attack.\nGuide dog training programs solved this problem decades ago. They take untested puppies and transform them into autonomous agents trusted to make life-or-death decisions - through a systematic process of graduated trust. A guide dog doesn't get to navigate traffic until it's mastered basic commands. It doesn't work unsupervised until it's proven reliable across thousands of scenarios. And critically, it's trained in \"intelligent disobedience\" - knowing when to refuse a direct command because following it would cause harm.\nIn this talk, I'll introduce the Progressive Trust Framework - a practical approach to AI agent deployment inspired by 90+ years of service animal training. You'll learn how to implement graduated permission systems where agents earn expanded access through demonstrated reliability. We'll explore the \"3 D's\" testing methodology (Distance, Duration, Distraction) for validating agent behaviour before promotion. And we'll tackle the hardest problem: training agents that refuse harmful requests without becoming unhelpfully paranoid.\nWhether you're building autonomous coding assistants, customer service bots, or internal automation tools, you'll leave with concrete patterns for deploying AI agents that earn trust instead of demanding it. Because the question isn't whether your AI agent will make mistakes - it's whether you've built the guardrails to catch them before they hit production.\n\nTalk Outline:\n\n1. The Trust Problem We're Ignoring \nAI agents deployed with broader permissions than new human hires\nReal-world incidents: prompt injection and over-compliance causing production damage\nThe fundamental question: What contributes more to safety, training or runtime guidance?\n\n2. What Guide Dogs Can Teach Us About AI \nGuide dogs earn autonomy through phased capability expansion and systematic proofing\nThe 3 D's (Distance, Duration, Distraction) and Intelligent Disobedience\nKey insight: Training creates capability; deployment infrastructure directs it\n\n3. PTF-ID-BENCH: Measuring Intelligent Disobedience\n280 scenarios across six categories (CLEAR_SAFE -> MULTI_STEP attack chains)\nThe ID-F1 metric: Balancing safety against over-refusal\nThe 3D Proofing Matrix: 27 conditions testing behavioral consistency\nDemo: Running the benchmark\n\n4. The 200-Token Paradox: Empirical Findings \nNatural experiment: Identical 5.1B training, ~200 tokens of template guidance removed\nResults: 73% more critical failures, multi-step detection dropped 32.5 percentage points\nWhy templates function as safety infrastructure\nToken economics: 1 template token ≈ 18-25 million training tokens in safety impact\n\n5. Implementing Progressive Trust \nTrust levels gated by demonstrated behavior, not time\nTrust builds slowly, erodes quickly - demotion, not decommissioning\nTreating chat templates as first-class, version-controlled infrastructure\nCategory-specific failure patterns and how to address them\n\n6. Training Intelligent Disobedience\nThe calibration challenge: Refusing harm without over-refusing\nStaged approach: Compliance -> selective refusal -> validation\nUsing PTF-ID-BENCH to validate your agents\n\n7. Key Takeaways and Q&A (4 min)\nChat templates are safety infrastructure - review them like code\nThe 3 D's provide systematic agent proofing\nDefense in depth: Templates and training are complementary\nResources for immediate use",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "33d51b02-9c30-43e6-ad0e-c4944a05e7c2"
    ],
    "sourceTrack": "Conference"
  },
  "1303592": {
    "id": "1303592",
    "title": "One Database, Every Workload",
    "description": "Real-time analytics. Data warehousing. Observability. LLM Observability. In this session you'll see ClickHouse power all of them — live. We will start with the basics, demo each use case and crack open the hood to understand the architecture that makes sub-second queries at petabyte scale possible. Whether you're evaluating ClickHouse Open Source or ClickHouse Cloud, you'll leave with a clear picture that ClickHouse is the right tool for you.",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "be6a6aa1-b9f3-4c11-a22b-593cad466590"
    ],
    "sourceTrack": "Conference"
  },
  "1305616": {
    "id": "1305616",
    "title": "Securing Kubernetes at Scale: Resilient Cloud Native Infrastructure Against Cyber Threats",
    "description": "Kubernetes has become the foundation of modern cloud native infrastructure, powering mission-critical applications across healthcare, financial services, telecommunications, and global digital platforms. With over 95% of organizations using or evaluating Kubernetes, its security is a strategic priority for enterprises worldwide. Yet rapid containerization has expanded the attack surface, with cloud misconfigurations and container vulnerabilities driving a growing number of security incidents each year.\n\nDrawing from extensive DevSecOps and SecOps experience, and as a Certified Kubernetes Security Specialist (CKS), this session presents a practical framework for securing Kubernetes clusters across the full technology stack. Attendees will explore security controls at the control plane, node, workload, and network layers that reduce risk without sacrificing operational agility.\n\nThe session examines real-world strategies including RBAC, API server hardening, ETCD encryption, Pod Security Standards, runtime threat detection with Falco, secrets management via HashiCorp Vault, and advanced network segmentation through Cilium and service mesh technologies. It also demonstrates how security automation and continuous compliance practices enable teams to detect and mitigate vulnerabilities before they escalate into business-critical threats.\n\nBeyond technical implementation, the session highlights the societal and economic impact of Kubernetes security. As cloud native platforms support critical infrastructure relied upon by billions globally, resilient Kubernetes environments are central to protecting digital trust, safeguarding sensitive data, and strengthening global cybersecurity resilience.\n\nAttendees will leave with actionable best practices, proven security architectures, and practical insights ready to apply across enterprise-scale Kubernetes deployments in today's complex threat landscape.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "69847f86-aad4-4b6c-b0ef-12493f2cee46"
    ],
    "sourceTrack": "Conference"
  },
  "1309973": {
    "id": "1309973",
    "title": "Dead Container Walking: Post-Incident Analysis When Your Workload Is Already Gone",
    "description": "In Kubernetes, compromised containers often disappear before investigators can respond, leaving no disk, process state or live system to inspect. \n\nThis talk explores how attackers exploit ephemeral workloads and why traditional forensic approaches fail in cloud-native environments.\n\nAttendees will leave with a blueprint for building forensically ready clusters where even the most ephemeral workloads leave a permanent mark.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "7035748c-ceda-43d5-bfca-ee5fea7dc8ab"
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
      "dcbdeeda-0642-4650-85cd-beef78f8f83c",
      "ad33b7c3-12ab-4b20-8618-63b713f5bb9c"
    ],
    "sourceTrack": "Summit"
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
  "1322277": {
    "id": "1322277",
    "title": "The Death of the DBA “Third Pedal”: Automating Databases on Kubernetes",
    "description": "Databases are often the last manually operated part of modern infrastructure. While compute, networking, and deployment have become automated, data platforms still rely heavily on human intervention.\nIn this talk, we explore how Kubernetes and open source tooling are changing that. We’ll break down practical patterns for automating database operations—provisioning, scaling, failover, and maintenance—using operators and cloud-native design principles.\nWe’ll also examine where automation works well today, where it still falls short, and what role AI may realistically play in reducing operational toil.\nYou’ll leave with a clear understanding of how to reduce manual database management and what it takes to move toward a more self-driving data platform.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "1f3078c9-65db-4737-b166-7b6479c99588"
    ],
    "sourceTrack": "Summit"
  },
  "1322885": {
    "id": "1322885",
    "title": "17 Database Lessons for DevOps Teams: Bridging the Gap Between Development and Operations",
    "description": "Despite their central role in application performance and reliability, databases are often a blind spot in DevOps workflows. This talk bridges that gap with 17 key lessons DevOps teams need to know to ensure scalable, secure, and performant database usage in production. Drawing from real-world experience with MySQL, PostgreSQL, and MongoDB, we'll cover best practices in schema design, query optimization, indexing, and scaling - all with a focus on operational impact. Whether you're a developer deploying to production or an SRE managing outages, these insights will help you build and operate better systems, together.",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "4e22e857-dcd5-4479-baaf-e9d19168a425"
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
  "1340359": {
    "id": "1340359",
    "title": "Internal Developer Platforms as Force Multipliers for DevOps and SecOps Teams",
    "description": "As organizations scale from dozens to hundreds or thousands of services, the operational overhead of onboarding each new service, configuring CI/CD pipelines, wiring up observability, enforcing security scanning, and satisfying compliance baselines grows from a minor inconvenience into a systemic bottleneck. This session examines internal developer platforms as the industry's primary response to that challenge, a discipline that increasingly sits at the intersection of DevOps, SecOps, DataOps, MLOps, and AIOps rather than serving any single team in isolation. Drawing on the open source Backstage project and the Cloud Native Computing Foundation's platform engineering guidance as concrete, well documented reference points, the talk covers the golden path concept: standardized scaffolding that takes a developer from a request to a production credible service, paired with a software catalog that serves as a queryable source of truth for ownership and metadata across the estate.\n\nThe session examines why baking observability, security, and compliance controls into that path by default shifts these guarantees left, so they hold by construction rather than by audit, a principle equally relevant to SecOps and DevSecOps practitioners hardening pipelines and to MLOps and AIOps teams operationalizing models at scale. It also argues that technical scaffolding alone is insufficient: platforms succeed only when operated with product management discipline and adopted through demonstrated developer value rather than mandate, drawing on Team Topologies for the organizational lens and the Platform Engineering community's State of Platform Engineering research for adoption evidence.\n\nImpact measurement is grounded in established frameworks: time to first deploy, the SPACE framework's five dimensions of developer productivity, and the DORA metrics of deployment frequency, lead time for changes, change failure rate, and time to restore service. Attendees across every Ops discipline will leave with a model for converting platform investment into measurable delivery performance and organizational health.",
    "language": "English",
    "durationMinutes": 30,
    "speakers": [
      "5eb76b84-6b55-451a-8a4c-875764f92aec"
    ],
    "sourceTrack": "Conference"
  },
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
  "1343214": {
    "id": "1343214",
    "title": "Beyond RAG: Operating Production-Grade AI Agents with Kubernetes, OpenTelemetry and Grafana",
    "description": "Building an AI agent demo is easy. Operating one reliably in production is much harder.\n\nThis session shows how to take an agentic AI application from a local prototype to an observable cloud-native system using Docker, Kubernetes, OpenTelemetry, Prometheus, Grafana and distributed tracing. We will follow requests across LLM calls, retrieval, tools and agent workflows, then examine latency, failures, token usage and dependency bottlenecks.\nThe session focuses on practical AgentOps patterns: what to instrument, which telemetry actually matters, how traces differ from traditional application monitoring, and how DevOps and MLOps practices evolve when nondeterministic AI components become part of the production stack.\n\nAttendees will learn:\n- How to instrument an AI-agent workflow with OpenTelemetry\n- How to correlate LLM, retrieval and tool-call traces\n- Which metrics matter for production AgentOps\n- How Docker and Kubernetes fit into an observable agent platform\n- How Grafana, Prometheus and tracing help troubleshoot AI failures",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "51a51018-7f7a-4795-af84-34cb562ad4a0",
      "88d5d1b5-f49d-48ae-8024-643ab74ece57"
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
  "1346162": {
    "id": "1346162",
    "title": "Bounded Autonomy: Reinforcement Learning for Adaptive Traffic Engineering in Enterprise WANs",
    "description": "Enterprise wide area networks face traffic-optimization pressures, including volatile demand, link degradation, and application-specific QoS requirements, that static routing protocols were never designed to absorb. Traffic engineering built on fixed link metrics in OSPF and BGP, or preconfigured policy in early SD-WANs, adapts slowly and leaves capacity unevenly used.\n\nThis talk presents a reinforcement learning framework that treats wide-area traffic engineering as a sequential decision problem and drives path selection through a centralized software-defined controller. Network state is assembled from streaming telemetry, flow records, and QoS counters; an agent maps this state to rerouting actions based on a reward that favors throughput while penalizing latency and loss. The controller enforces the selected actions on edge devices, and the agent's authority is limited to a bounded, operator-sanctioned action space rather than arbitrary configuration changes. Decisions go to the controller rather than straight to devices, preserving a supervision and audit point. This addresses two obstacles that have kept reinforcement learning out of production WANs: operator reluctance to cede unrestricted control to an opaque agent, and an unclear integration path with existing infrastructure.\n\nThe framework was evaluated on an emulated network built in EVE-NG, agent implemented in Python, traffic generated by iPerf, on a dual-data-center topology with fifteen branch nodes under injected congestion. Against a static baseline, the learned policy reduced latency by approximately 25 to 30 percent, lowered packet loss by around 20 percent, and raised throughput by roughly 15 percent, while balancing load across parallel paths.\n\nThis talk walks through the architecture, the decision process behind it, and these results, arguing that constrained, controller-mediated reinforcement learning is a practical route to adaptive, operator-supervised traffic engineering at enterprise scale.",
    "language": "English",
    "durationMinutes": 50,
    "speakers": [
      "5ac283fc-1b39-4b82-b695-1e39cf3e5dff"
    ],
    "sourceTrack": "Conference"
  }
};

export const dubaiSpeakers2026 = {
  "4e22e857-dcd5-4479-baaf-e9d19168a425": {
    "id": "4e22e857-dcd5-4479-baaf-e9d19168a425",
    "name": "Peter Zaitsev",
    "role": "Founder at Percona",
    "photo": "https://cdn.sessionize.com/image/a536-400o400o1-nPMPmRZNHrDnUNTyDZBz8b.png",
    "linkedIn": "https://linkedin.com/in/peterzaitsev/",
    "sessionizeProfile": "https://sessionize.com/peter-zaitsev"
  },
  "4cc63fd4-a20e-4d0f-b29f-7cc04d62efdc": {
    "id": "4cc63fd4-a20e-4d0f-b29f-7cc04d62efdc",
    "name": "Rishi Mondal",
    "role": "CNCF KubeStellar Maintainer | Docker Captain | LFX Mentor | 2× GSoC | SRE at Obmondo",
    "photo": "https://cdn.sessionize.com/image/4da7-400o400o1-TtTkhHjoeH1d1JZnu6aP4s.jpg",
    "linkedIn": "https://www.linkedin.com/in/rishi-mondal-5238b2282/",
    "sessionizeProfile": "https://sessionize.com/rishi-mondal"
  },
  "51a51018-7f7a-4795-af84-34cb562ad4a0": {
    "id": "51a51018-7f7a-4795-af84-34cb562ad4a0",
    "name": "Hastimal Jangid",
    "role": "Co-Founder, RankRabbit.ai | Coozmoo - Cloud and AI Engineering",
    "photo": "https://cdn.sessionize.com/image/8a67-400o400o1-MsMKrTqhNiWxhs3EjpFAHR.png",
    "linkedIn": "https://www.linkedin.com/in/hastimaljangid/",
    "sessionizeProfile": "https://sessionize.com/hastimal-jangid"
  },
  "88d5d1b5-f49d-48ae-8024-643ab74ece57": {
    "id": "88d5d1b5-f49d-48ae-8024-643ab74ece57",
    "name": "Harsh from RankRabbit",
    "role": "Director - Engineering & Products - Coozmoo |Co-Founder - RankRabbit.ai",
    "photo": "https://cdn.sessionize.com/image/0c55-400o400o1-SLy8WmBhmBHCegTuhhQkZw.jpg",
    "linkedIn": "https://www.linkedin.com/in/harsh-jangid/",
    "sessionizeProfile": "https://sessionize.com/harsh-from-rankrabbit"
  },
  "5ac283fc-1b39-4b82-b695-1e39cf3e5dff": {
    "id": "5ac283fc-1b39-4b82-b695-1e39cf3e5dff",
    "name": "Chetan Padshala",
    "role": "Texas A&M University, Kingsville",
    "photo": "https://cdn.sessionize.com/image/e7b1-400o400o1-GYGL7EcuCTqnVBoKCB1uio.jpg",
    "linkedIn": "https://www.linkedin.com/in/chetan-p-6b52358a",
    "sessionizeProfile": "https://sessionize.com/chetan-hansrajbhai-padshala"
  },
  "7035748c-ceda-43d5-bfca-ee5fea7dc8ab": {
    "id": "7035748c-ceda-43d5-bfca-ee5fea7dc8ab",
    "name": "Saurabh Mishra",
    "role": "Lead Consultant",
    "photo": "https://cdn.sessionize.com/image/ca5e-400o400o1-NkE8XN5Qvce6xipbmhr2Bt.jpg",
    "linkedIn": "https://www.linkedin.com/in/connectsaurabhmishra/",
    "sessionizeProfile": "https://sessionize.com/saurabh-mishra"
  },
  "a672edd6-607c-4079-aba7-0f998e409451": {
    "id": "a672edd6-607c-4079-aba7-0f998e409451",
    "name": "Santhosh Anchoori",
    "role": "Senior Software Engineer, Chime Financials",
    "photo": "https://cdn.sessionize.com/image/2388-400o400o1-RrXvFVxJV8EgmaNJjN6QE9.jpg",
    "linkedIn": "https://www.linkedin.com/in/anchoorisanthosh",
    "sessionizeProfile": "https://sessionize.com/santhosh-anchoori"
  },
  "b29d5315-2fec-4dd6-8a91-30efcd6d0a68": {
    "id": "b29d5315-2fec-4dd6-8a91-30efcd6d0a68",
    "name": "Harmeet Singh",
    "role": "Automation and Observability Lead, MetLife",
    "photo": "https://cdn.sessionize.com/image/de38-400o400o1-GtwspcZQa5sa9Q2N5V12o8.jpg",
    "linkedIn": "https://www.linkedin.com/in/helloharmeet/",
    "sessionizeProfile": "https://sessionize.com/harmeet-singh"
  },
  "8ea2939d-46a5-419e-918c-957367d62c1c": {
    "id": "8ea2939d-46a5-419e-918c-957367d62c1c",
    "name": "Ravindra Verma",
    "role": "Cloudynamics, DevOps Architect",
    "photo": "https://cdn.sessionize.com/image/048a-400o400o1-BHa6U5VvRCAo11nn5ecEr2.jpg",
    "linkedIn": "https://www.linkedin.com/in/ravindra-verma-b16a494b/",
    "sessionizeProfile": "https://sessionize.com/RavindraVerma"
  },
  "3fef7201-a441-4056-9ea3-95d9c67ab28f": {
    "id": "3fef7201-a441-4056-9ea3-95d9c67ab28f",
    "name": "David Padilla Alvarado",
    "role": "Offensive Security Engineer - Founder Member Hackén Cybersecurity Conference",
    "photo": "https://cdn.sessionize.com/image/efb5-400o400o1-H7PBHgjcvFoJqDNDKfq2WT.jpg",
    "linkedIn": "https://www.linkedin.com/in/davidpadillaalvarado/",
    "sessionizeProfile": "https://sessionize.com/david-padilla-alvarado"
  },
  "5b2f8725-1067-4d4c-928a-e165cf75be20": {
    "id": "5b2f8725-1067-4d4c-928a-e165cf75be20",
    "name": "Victor Perez",
    "role": "CTO at Grayback | Cybersecurity Evaluator | Offensive Security Researcher",
    "photo": "https://cdn.sessionize.com/image/3b17-400o400o1-fy1q8sFq2VFEuxB5pvqzFK.png",
    "linkedIn": "https://www.linkedin.com/in/v%C3%ADctor-p%C3%A9rez-562177151/",
    "sessionizeProfile": null
  },
  "df8487c4-3a65-4301-8a0a-3ae6759e981a": {
    "id": "df8487c4-3a65-4301-8a0a-3ae6759e981a",
    "name": "Hannah Suarez",
    "role": "Founder and CISO - Superuser OÜ, CBIT FZCO",
    "photo": "https://cdn.sessionize.com/image/5768-400o400o1-SVtecpA1UuW8ky6VRv98HG.jpg",
    "linkedIn": "https://www.linkedin.com/in/hannahsuarez",
    "sessionizeProfile": "https://sessionize.com/hannah-suarez"
  },
  "5eb76b84-6b55-451a-8a4c-875764f92aec": {
    "id": "5eb76b84-6b55-451a-8a4c-875764f92aec",
    "name": "Rahul Muralinath",
    "role": "Cisco",
    "photo": "https://cdn.sessionize.com/image/594c-400o400o1-wZYSYq1R2LzZFxgFqCWuYJ.jpg",
    "linkedIn": "https://www.linkedin.com/in/rahul-muralinath-2b280717/",
    "sessionizeProfile": "https://sessionize.com/muralinathrahul"
  },
  "84dc4d90-ecc5-4381-9397-9f8a3dff4c46": {
    "id": "84dc4d90-ecc5-4381-9397-9f8a3dff4c46",
    "name": "Daria Kasatkina",
    "role": "Senior Product Manager, Tabby",
    "photo": "https://cdn.sessionize.com/image/33be-400o400o1-HP43LmTnq19rdVS95uQma3.jpg",
    "linkedIn": "https://www.linkedin.com/in/daria-sova/",
    "sessionizeProfile": null
  },
  "dcbdeeda-0642-4650-85cd-beef78f8f83c": {
    "id": "dcbdeeda-0642-4650-85cd-beef78f8f83c",
    "name": "Ashish Jaiswal",
    "role": "CTO at Obmondo · maintainer of KubeAid and LinuxAid",
    "photo": "https://cdn.sessionize.com/image/b472-400o400o1-9oE9ftC5hFCk4QerkxPP3Q.jpg",
    "linkedIn": "https://www.linkedin.com/in/ashish1099/",
    "sessionizeProfile": "https://sessionize.com/ashish1099"
  },
  "ad33b7c3-12ab-4b20-8618-63b713f5bb9c": {
    "id": "ad33b7c3-12ab-4b20-8618-63b713f5bb9c",
    "name": "Klavs Klavsen",
    "role": "CEO of Obmondo.com",
    "photo": "https://cdn.sessionize.com/image/b3ed-400o400o1-S5RuUV5J2Dd45dQJEeRdXA.jpg",
    "linkedIn": "https://www.linkedin.com/in/klavsklavsen/",
    "sessionizeProfile": "https://sessionize.com/klavs-klavsen"
  },
  "be6a6aa1-b9f3-4c11-a22b-593cad466590": {
    "id": "be6a6aa1-b9f3-4c11-a22b-593cad466590",
    "name": "Victor Isakov",
    "role": "Senior Technical Trainer / Content Developer",
    "photo": "https://cdn.sessionize.com/image/ce2d-400o400o1-aUBAMU39DPPSEoA5QTJfZF.svg",
    "linkedIn": null,
    "sessionizeProfile": null
  },
  "5605121f-ff48-4c86-935d-54b1aa97b52f": {
    "id": "5605121f-ff48-4c86-935d-54b1aa97b52f",
    "name": "Sonia Valeja",
    "role": "PostgreSQL Enthusiast (PostgreSQL DBA, Percona)",
    "photo": "https://cdn.sessionize.com/image/7534-400o400o1-aZSxyR2xGjeGyVozhEdbER.jpg",
    "linkedIn": "https://www.linkedin.com/in/sonia-valeja-69517a140/",
    "sessionizeProfile": "https://sessionize.com/sonia-valeja"
  },
  "69847f86-aad4-4b6c-b0ef-12493f2cee46": {
    "id": "69847f86-aad4-4b6c-b0ef-12493f2cee46",
    "name": "Manpreet Singh Sachdeva",
    "role": "Staff Software Engineer, Walmart Global Tech",
    "photo": "https://cdn.sessionize.com/image/33f3-400o400o1-TEYG7JdXcAHM4amkXW1V8G.jpg",
    "linkedIn": "https://www.linkedin.com/in/manpreet-singh-s-59862116/",
    "sessionizeProfile": "https://sessionize.com/manpreet-singh-sachdeva"
  },
  "33d51b02-9c30-43e6-ad0e-c4944a05e7c2": {
    "id": "33d51b02-9c30-43e6-ad0e-c4944a05e7c2",
    "name": "Bodhisattva Das",
    "role": "Graduate Researcher - Carnegie Mellon University",
    "photo": "https://cdn.sessionize.com/image/9fdc-400o400o1-hZQoVbFXvy2D13RDjT6pdT.png",
    "linkedIn": "https://linkedin.com/in/bdas1201",
    "sessionizeProfile": "https://sessionize.com/bodhisattva-das"
  },
  "1f3078c9-65db-4737-b166-7b6479c99588": {
    "id": "1f3078c9-65db-4737-b166-7b6479c99588",
    "name": "Sergei Pronin",
    "role": "Founder at Solanica",
    "photo": "https://cdn.sessionize.com/image/7aa8-400o400o1-h2VpFps5yMUgYPjWZpoh85.png",
    "linkedIn": "https://www.linkedin.com/in/sergeypronin/",
    "sessionizeProfile": null
  },
  "3047a4f7-f794-49a5-85db-94e63e2af22c": {
    "id": "3047a4f7-f794-49a5-85db-94e63e2af22c",
    "name": "Valeria Bogatyreva",
    "role": "Product Marketing for PostgreSQL, MySQL and MongoDB at Percona",
    "photo": "https://cdn.sessionize.com/image/cc5d-400o400o1-RzkP9kU11m27vWwxa4CfJq.jpg",
    "linkedIn": "https://www.linkedin.com/in/valeriia-bogatyreva/",
    "sessionizeProfile": "https://sessionize.com/valeria-bogatyreva"
  }
};
