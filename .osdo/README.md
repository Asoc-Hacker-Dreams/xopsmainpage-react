# OSDO Testing & Security Pipeline

Este documento describe la implementación completa del pipeline OSDO (Open SecDevOps) para la aplicación React de X-Ops Conference.

## 🧪 Testing Infrastructure

### Configuración de Tests

- **Framework**: Vitest con React Testing Library
- **Cobertura**: V8 Coverage con thresholds del 70%
- **Entornos**: jsdom para simulación DOM
- **Tipos de test**: Unitarios, integración y cobertura

### Tests Implementados

#### Tests Unitarios
- `src/App.test.jsx` - Tests del componente principal
- `src/components/Benefits.test.jsx` - Tests del componente Benefits

#### Tests de Integración
- `src/test/integration.test.jsx` - Tests de navegación y flujos completos

#### Configuración
- `vitest.config.js` - Configuración principal de Vitest
- `src/test/setup.js` - Setup y mocks globales

### Comandos de Testing

```bash
# Tests básicos
npm run test                # Ejecutar tests en modo watch
npm run test:run            # Ejecutar tests una vez
npm run test:coverage       # Ejecutar con reporte de cobertura
npm run test:ui             # Interfaz visual de Vitest

# Tests específicos
npm run test:unit           # Solo tests unitarios
npm run test:integration    # Solo tests de integración

# Scripts OSDO
npm run osdo:test           # Script completo OSDO de testing
```

## 🛡️ Security Pipeline

### Jobs del Workflow OSDO

1. **🧪 Testing & Quality Assurance**
   - Instalación de dependencias de testing
   - Ejecución de tests unitarios y de integración
   - Generación de reportes de cobertura

2. **🔍 Dependency Security Scan (SCA)**
   - npm audit para vulnerabilidades
   - Snyk analysis
   - License compliance check

3. **🛡️ Static Application Security Testing (SAST)**
   - ESLint con reglas de seguridad
   - CodeQL analysis
   - Análisis estático personalizado

4. **🔐 Secrets Detection**
   - GitLeaks - Detección de secretos en commits
   - Semgrep - Análisis de patrones de seguridad
   - TruffleHog - Verificación de secretos

5. **🏗️ Secure Build & SBOM**
   - Generación de SBOM (Software Bill of Materials)
   - Build seguro
   - Verificación de integridad

6. **📊 Compliance Report**
   - Reporte consolidado de todos los análisis
   - Comentarios automáticos en PRs
   - Artefactos de evidencia

7. **🚦 Security Quality Gate**
   - Evaluación de vulnerabilidades críticas
   - Control de calidad de seguridad
   - Bloqueo por vulnerabilidades críticas

### Herramientas de Seguridad

- **GitLeaks**: Detección de secretos en historial Git
- **Semgrep**: Análisis estático de patrones de seguridad
- **TruffleHog**: Verificación de secretos con alta precisión
- **Snyk**: Análisis de vulnerabilidades en dependencias
- **CodeQL**: Análisis estático avanzado de GitHub
- **ESLint Security**: Reglas de seguridad para JavaScript/React

## 📊 Reportes y Métricas

### Reportes Generados

- **Test Report**: HTML con resultados detallados
- **Coverage Report**: HTML, JSON, LCOV
- **Security Reports**: JSON con vulnerabilidades y secretos
- **SBOM**: JSON/XML con lista de componentes
- **Compliance Report**: Markdown con status general

### Thresholds de Calidad

```javascript
coverage: {
  thresholds: {
    lines: 70,        // 70% cobertura de líneas
    functions: 70,    // 70% cobertura de funciones
    branches: 70,     // 70% cobertura de ramas
    statements: 70    // 70% cobertura de declaraciones
  }
}
```

### Quality Gates

- ❌ **FAIL**: Vulnerabilidades críticas encontradas
- ⚠️ **WARNING**: Secretos detectados (no bloquea)
- ✅ **PASS**: Sin vulnerabilidades críticas

## 🚀 Ejecución Local

### Prerrequisitos

```bash
# Instalar dependencias
npm install

# Verificar configuración
./.osdo/verify-setup.sh
```

### Testing Local

```bash
# Tests completos con cobertura
npm run test:coverage

# Scripts OSDO individuales
npm run osdo:test    # Testing completo
npm run osdo:sca     # Security Component Analysis
npm run osdo:sast    # Static Application Security Testing
```

### Análisis de Seguridad Local

```bash
# Audit de dependencias
npm run security:audit

# Verificación de licencias
npm run security:license-check

# Análisis estático con ESLint
npm run security:eslint

# Generación de SBOM
npm run sbom:generate
```

## 📁 Estructura de Archivos

```
.osdo/
├── tools/
│   ├── test-runner.sh      # Script principal de testing
│   ├── sca.sh              # Security Component Analysis
│   ├── sast.sh             # Static Application Security Testing
│   └── verify-setup.sh     # Verificación de configuración
└── results/                # Directorio de reportes (generado)
    ├── coverage/           # Reportes de cobertura
    ├── test-report.html    # Reporte HTML de tests
    └── *.json              # Reportes en JSON

src/
├── test/
│   ├── setup.js            # Configuración global de tests
│   └── integration.test.jsx # Tests de integración
├── App.test.jsx            # Tests del componente App
└── components/
    └── Benefits.test.jsx   # Tests del componente Benefits

.github/workflows/
└── osdo-compliance.yml     # Workflow principal OSDO
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Requeridas para workflow
SNYK_TOKEN=your_snyk_token_here
```

### Personalización de Thresholds

Editar `vitest.config.js` para ajustar umbrales de cobertura:

```javascript
thresholds: {
  lines: 80,      // Aumentar a 80%
  functions: 80,
  branches: 75,
  statements: 80
}
```

### Exclusiones de Análisis

En `vitest.config.js`:

```javascript
exclude: [
  'node_modules/',
  'dist/',
  '.osdo/',
  'public/',
  '**/*.config.js'
]
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [OSDO Framework](https://osdo.org/)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

## 🎯 Próximos Pasos

1. Configurar `SNYK_TOKEN` en GitHub Secrets
2. Ejecutar el workflow completo en un PR
3. Revisar y ajustar thresholds según necesidades
4. Expandir cobertura de tests según análisis de coverage
5. Integrar con herramientas adicionales de seguridad si es necesario
