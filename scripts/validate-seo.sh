#!/bin/bash

echo "🔍 Validando problemas de SEO en X-Ops Conference..."

# Verificar el sitemap
echo "📄 Verificando sitemap.xml..."
if [ -f "public/sitemap.xml" ]; then
    echo "✅ sitemap.xml existe"
    # Validar formato XML
    if xmllint --noout public/sitemap.xml 2>/dev/null; then
        echo "✅ sitemap.xml tiene formato XML válido"
    else
        echo "❌ sitemap.xml tiene formato XML inválido"
    fi
else
    echo "❌ sitemap.xml no existe"
fi

# Verificar robots.txt
echo "🤖 Verificando robots.txt..."
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt existe"
    if grep -q "Sitemap:" public/robots.txt; then
        echo "✅ robots.txt contiene referencia al sitemap"
    else
        echo "❌ robots.txt no referencia el sitemap"
    fi
else
    echo "❌ robots.txt no existe"
fi

# Verificar componente SEO
echo "🎯 Verificando componente SEO..."
if [ -f "src/components/SEO.jsx" ]; then
    echo "✅ Componente SEO existe"
    if grep -q "og:title" src/components/SEO.jsx; then
        echo "✅ Open Graph tags implementados"
    fi
    if grep -q "twitter:card" src/components/SEO.jsx; then
        echo "✅ Twitter Cards implementados"
    fi
else
    echo "❌ Componente SEO no existe"
fi

# Verificar hook dinámico
echo "🔄 Verificando SEO dinámico..."
if [ -f "src/hooks/useDynamicSEO.js" ]; then
    echo "✅ Hook useDynamicSEO existe"
else
    echo "❌ Hook useDynamicSEO no implementado"
fi

echo "📊 Validación SEO completada"
