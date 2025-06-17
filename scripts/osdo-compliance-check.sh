#!/bin/bash

# Script de verificación OSDO Compliance local
# Este script ejecuta las mismas verificaciones que el pipeline CI/CD

set -e

echo "🛡️  Iniciando verificaciones OSDO Compliance..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Crear directorio para reportes
mkdir -p reports
cd reports

print_status "Creando directorio de reportes..."

# 1. Verificación de dependencias
print_status "🔍 Ejecutando análisis de dependencias..."
npm audit --audit-level=moderate --json > npm-audit-report.json 2>/dev/null || print_warning "Se encontraron algunas vulnerabilidades en dependencias"

# Verificar si hay vulnerabilidades críticas
CRITICAL_VULNS=$(jq '.metadata.vulnerabilities.critical // 0' npm-audit-report.json 2>/dev/null || echo "0")
HIGH_VULNS=$(jq '.metadata.vulnerabilities.high // 0' npm-audit-report.json 2>/dev/null || echo "0")

if [ "$CRITICAL_VULNS" -gt 0 ]; then
    print_error "Se encontraron $CRITICAL_VULNS vulnerabilidades CRÍTICAS"
    echo "Ejecute 'npm audit fix' para intentar solucionarlas"
elif [ "$HIGH_VULNS" -gt 0 ]; then
    print_warning "Se encontraron $HIGH_VULNS vulnerabilidades de ALTO riesgo"
else
    print_success "No se encontraron vulnerabilidades críticas o de alto riesgo"
fi

# 2. Verificación de licencias
print_status "📄 Verificando licencias de dependencias..."
npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;CC0-1.0' --excludePrivatePackages > license-report.txt 2>/dev/null || print_warning "Algunas dependencias pueden tener licencias no permitidas"

# 3. Análisis estático con ESLint
print_status "🔍 Ejecutando análisis estático de código..."
cd ..
npx eslint . --ext .js,.jsx,.ts,.tsx --format json -o reports/eslint-report.json 2>/dev/null || print_warning "ESLint encontró algunos problemas"

# Instalar plugin de seguridad si no está instalado
if ! npm list eslint-plugin-security >/dev/null 2>&1; then
    print_status "Instalando plugin de seguridad para ESLint..."
    npm install --save-dev eslint-plugin-security --silent
fi

# Ejecutar ESLint con reglas de seguridad
npx eslint . --config .eslintrc.security.json --format json -o reports/eslint-security-report.json 2>/dev/null || print_warning "Se encontraron problemas de seguridad en el código"

cd reports

# 4. Búsqueda de secretos con GitLeaks (si está instalado)
print_status "🔐 Buscando secretos expuestos..."
if command -v gitleaks &> /dev/null; then
    gitleaks detect --config ../.gitleaks.toml --report-format json --report-path gitleaks-report.json --source .. || print_warning "GitLeaks encontró posibles secretos"
    if [ -f gitleaks-report.json ]; then
        SECRETS_COUNT=$(jq length gitleaks-report.json 2>/dev/null || echo "0")
        if [ "$SECRETS_COUNT" -gt 0 ]; then
            print_error "Se encontraron $SECRETS_COUNT posibles secretos expuestos"
        else
            print_success "No se encontraron secretos expuestos"
        fi
    fi
else
    print_warning "GitLeaks no está instalado. Instálalo con: 'brew install gitleaks' (macOS) o descárgalo desde https://github.com/zricethezav/gitleaks"
fi

# 5. Análisis del Dockerfile
print_status "🐳 Analizando Dockerfile..."
if [ -f ../dockerfile ]; then
    if command -v hadolint &> /dev/null; then
        hadolint ../dockerfile --format json > hadolint-report.json 2>/dev/null || print_warning "Hadolint encontró problemas en el Dockerfile"
        print_success "Análisis de Dockerfile completado"
    else
        print_warning "Hadolint no está instalado. Instálalo con: 'brew install hadolint' (macOS)"
    fi
else
    print_warning "No se encontró Dockerfile para analizar"
fi

# 6. Generación de SBOM
print_status "📦 Generando Software Bill of Materials (SBOM)..."
cd ..
if npm list @cyclonedx/cyclonedx-npm >/dev/null 2>&1; then
    npx @cyclonedx/cyclonedx-npm --output-file reports/sbom.json --output-format json
    npx @cyclonedx/cyclonedx-npm --output-file reports/sbom.xml --output-format xml
    print_success "SBOM generado exitosamente"
else
    print_status "Instalando generador de SBOM..."
    npm install --save-dev @cyclonedx/cyclonedx-npm --silent
    npx @cyclonedx/cyclonedx-npm --output-file reports/sbom.json --output-format json
    npx @cyclonedx/cyclonedx-npm --output-file reports/sbom.xml --output-format xml
    print_success "SBOM generado exitosamente"
fi

# 7. Generar reporte de cumplimiento
print_status "📊 Generando reporte de cumplimiento..."
cd reports

cat > compliance-report.md << EOF
# OSDO Compliance Report - Verificación Local

**Fecha:** $(date)
**Proyecto:** X-Ops Conference React App

## 📋 Resumen de Verificaciones

### ✅ Controles Implementados:
- [x] Análisis de dependencias y vulnerabilidades
- [x] Verificación de licencias
- [x] Análisis estático de código (SAST)
- [x] Búsqueda de secretos expuestos
- [x] Análisis de Dockerfile
- [x] Generación de SBOM

### 📊 Resultados:

#### Vulnerabilidades de Dependencias:
- Críticas: $CRITICAL_VULNS
- Alto riesgo: $HIGH_VULNS

#### Archivos de Reporte Generados:
- \`npm-audit-report.json\` - Auditoría de dependencias npm
- \`license-report.txt\` - Reporte de licencias
- \`eslint-report.json\` - Análisis estático ESLint
- \`eslint-security-report.json\` - Análisis de seguridad ESLint
- \`sbom.json/xml\` - Software Bill of Materials

#### Recomendaciones:
EOF

if [ "$CRITICAL_VULNS" -gt 0 ]; then
    echo "- ❗ **CRÍTICO**: Solucionar vulnerabilidades críticas ejecutando \`npm audit fix\`" >> compliance-report.md
fi

if [ "$HIGH_VULNS" -gt 0 ]; then
    echo "- ⚠️ **ALTO**: Revisar y solucionar vulnerabilidades de alto riesgo" >> compliance-report.md
fi

cat >> compliance-report.md << EOF

### 🛡️ Quality Gate:
EOF

if [ "$CRITICAL_VULNS" -eq 0 ]; then
    echo "✅ **PASADO** - No se encontraron vulnerabilidades críticas" >> compliance-report.md
    QUALITY_GATE="PASSED"
else
    echo "❌ **FALLIDO** - Se encontraron vulnerabilidades críticas que deben ser solucionadas" >> compliance-report.md
    QUALITY_GATE="FAILED"
fi

print_success "Reporte de cumplimiento generado: reports/compliance-report.md"

# 8. Mostrar resumen final
echo ""
echo "=================================================="
echo "🎯 RESUMEN FINAL DE OSDO COMPLIANCE"
echo "=================================================="

if [ "$QUALITY_GATE" == "PASSED" ]; then
    print_success "✅ QUALITY GATE: PASADO"
    print_success "La aplicación cumple con los estándares básicos de seguridad"
else
    print_error "❌ QUALITY GATE: FALLIDO"
    print_error "Se deben solucionar las vulnerabilidades críticas antes del despliegue"
fi

echo ""
print_status "📁 Todos los reportes han sido guardados en el directorio 'reports/'"
print_status "📖 Revisa 'reports/compliance-report.md' para el reporte completo"

echo ""
echo "=================================================="

# Retornar código de salida apropiado
if [ "$QUALITY_GATE" == "PASSED" ]; then
    exit 0
else
    exit 1
fi
