# Update Summary - Speakers and Agenda for X-Ops Conference 2025

## Changes Made

### 1. Speakers Section (`src/components/SpeakersSection.jsx`)
**Status:** ✅ Complete

Updated with 22 new speakers for the 2025 conference:

1. Gisela Torres - "Desarrolladores/DBA/Data scientists más felices y productivos con Platform Engineering"
2. Shani Adadi Kazaz - "Kubernetes as a Platform: From infrastructure as code to API-driven infrastructure"
3. Alejandro de la Hoz Martin - "De 0 a 100 con Ansible en AWX"
4. Alberto Morgante - "Automated Baremetal deployment with CAPI + ClusterClass"
5. Guillermo Ruiz - "Autoscaling Kubernetes Like a Pro: A Hands-On Karpenter Workshop"
6. Antonio Berben, Felipe Vicens - "De Becario en formación a Agente Épico"
7. Carlos Villanúa - "$Git It Done: API Management as Code"
8. Mani Ghelichkhani - "Modernizing EKS workloads"
9. Cleyra Uzcategui - "Web UI: What's New and What's Next"
10. Sara San Luís Rodríguez, Christian Carballo Lozano - "Implementando un sistema de Machine Learning observable"
11. Rossana Suarez - "Migración inteligente: Containeriza tu aplicación heredada con MCP"
12. Dachi Gogotchuri - "IA generativa en DevSecOps"
13. Carlos Polop - "GCP Vulnerabilities & Features of Offensive Engineers"
14. Patricia Rodríguez Vaquero, Almudena Zhou Ramírez López - "Microsoft Fabric meets AI"
15. Juan Vicente Herrera Ruiz de Alejo - "Secure by Design: Integrando Threat Modeling en MLOps"
16. Verónica Rivas Remiseiro, Toni Granell - "Análisis Predictivo con Copilot"
17. Ignacio Dominguez - "Hacking CI/CD Pipelines"
18. Jeff Fan - "Make Rival GPUs Play Nice—Slash Latency 45%"
19. Alkin Tezuysal - "Unified Observability: Leveraging ClickHouse"
20. Juarez Junior - "Automating Database CI/CD"
21. José Enrique Calderón Sanz - "Evolutionary Architecture: the art of making decisions"
22. David Amorín García - "Estrategias de Visualización de Datos para Comunicadores"

**Notes:** 
- All speakers use placeholder images (`xops.png`) for now
- Image placeholders maintain the same 250x280px dimensions
- Photos can be updated later by replacing placeholder with actual speaker images

### 2. Events Component (`src/components/Events/Events.jsx`)
**Status:** ✅ Complete

- Uncommented and activated the agenda view
- Enabled date toggle buttons for Friday (21/11/2025) and Saturday (22/11/2025)
- Connected Madrid22 and Madrid23 components

### 3. Friday Schedule (`src/components/Events/Madrid22.jsx`)
**Status:** ✅ Complete

Full schedule for Friday, November 21, 2025:
- Registration: 9:00h
- Opening: 10:00h
- 11 conference talks throughout the day
- Closing: 16:40h

### 4. Saturday Schedule (`src/components/Events/Madrid23.jsx`)
**Status:** ✅ Complete

Full schedule for Saturday, November 22, 2025:
- Opening: 9:30h
- 11 conference talks and workshops
- Including 1 workshop (Guillermo Ruiz - 110 minutes)
- Closing: 17:40h

### 5. Data File (`src/data/schedule2025.json`)
**Status:** ✅ Complete

Created JSON file with all speaker and schedule information for future use.

## Testing Results

- ✅ Build successful: `npm run build`
- ✅ No new lint errors introduced
- ✅ Preview server runs without errors
- ✅ All components render correctly

## Next Steps (For Future)

1. **Replace placeholder images**: Update speaker images in `src/assets/speakers/` directory
2. **Update speaker bios**: Add detailed biographies if needed
3. **Add talk descriptions**: Expand modal content with full talk descriptions
4. **Update meta tags**: Verify SEO meta tags are accurate

## Files Modified

- `src/components/SpeakersSection.jsx` - Complete rewrite with new speakers
- `src/components/Events/Events.jsx` - Activated agenda view
- `src/components/Events/Madrid22.jsx` - Complete Friday schedule
- `src/components/Events/Madrid23.jsx` - Complete Saturday schedule
- `src/data/schedule2025.json` - New data file (created)
