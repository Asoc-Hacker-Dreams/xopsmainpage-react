#!/bin/bash

echo "🚀 Generando HTML estático para mejor SEO..."

# Crear directorio de pre-renderizado
mkdir -p dist/prerendered

# URLs a pre-renderizar
URLS=(
  "/"
  "/ponentes"
  "/agenda"
  "/organizers"
  "/patrocinadores"
  "/faq"
  "/colaboradores"
)

# Build normal
echo "📦 Building aplicación..."
npm run build

echo "🔧 Generando HTML estático para cada ruta..."

# Para cada URL, crear una versión HTML estática
for url in "${URLS[@]}"; do
  # Crear directorio si no existe
  if [ "$url" = "/" ]; then
    target_dir="dist"
    filename="index.html"
  else
    target_dir="dist${url}"
    mkdir -p "$target_dir"
    filename="index.html"
  fi
  
  echo "📄 Generando HTML para $url -> $target_dir/$filename"
  
  # Copiar el index.html base y modificar las meta tags
  if [ "$url" = "/" ]; then
    # Para la home, usar el index.html original
    echo "✅ Home page ya tiene HTML estático"
  else
    # Para otras rutas, copiar y modificar
    cp dist/index.html "$target_dir/$filename"
    
    # Modificar title y meta description según la ruta
    case $url in
      "/ponentes")
        sed -i 's/<title>.*<\/title>/<title>Ponentes DevOps Madrid 2025 | Speakers X-Ops Conference - Expertos DevSecOps<\/title>/' "$target_dir/$filename"
        sed -i 's/content="[^"]*" name="description"/content="Conoce a los expertos internacionales en DevOps, DevSecOps, AIOps y MLOps que participarán en X-Ops Conference 2025. Líderes técnicos y profesionales de élite." name="description"/' "$target_dir/$filename"
        ;;
      "/agenda")
        sed -i 's/<title>.*<\/title>/<title>Agenda DevOps Conference Madrid 2025 | Programa X-Ops - Charlas DevSecOps<\/title>/' "$target_dir/$filename"
        sed -i 's/content="[^"]*" name="description"/content="Programa completo de charlas, talleres y keynotes sobre DevOps, DevSecOps, AIOps y MLOps en Madrid. 21-22 noviembre 2025, Universidad Rey Juan Carlos." name="description"/' "$target_dir/$filename"
        ;;
      "/patrocinadores")
        sed -i 's/<title>.*<\/title>/<title>Patrocinio DevOps Conference Madrid | Sponsors X-Ops 2025 - Marketing Tecnológico<\/title>/' "$target_dir/$filename"
        sed -i 's/content="[^"]*" name="description"/content="Conviértete en patrocinador de X-Ops Conference 2025. Conecta con más de 600 profesionales de DevOps, DevSecOps, AIOps y MLOps. Oportunidades de marketing tech." name="description"/' "$target_dir/$filename"
        ;;
      "/faq")
        sed -i 's/<title>.*<\/title>/<title>FAQ Patrocinadores DevOps | Preguntas Sponsors X-Ops Madrid 2025<\/title>/' "$target_dir/$filename"
        sed -i 's/content="[^"]*" name="description"/content="Encuentra respuestas sobre patrocinio, stands, charlas técnicas, canales de comunicación y beneficios de la X-Ops Conference 2025 en Madrid." name="description"/' "$target_dir/$filename"
        ;;
    esac
    
    echo "✅ HTML estático generado para $url"
  fi
done

echo "🎉 Pre-renderizado completado!"
echo "📊 Archivos generados:"
find dist -name "index.html" -type f | sort

echo ""
echo "📋 Para validar el SEO:"
echo "1. Usar herramientas como Lighthouse o PageSpeed Insights"
echo "2. Verificar meta tags específicas en cada ruta"
echo "3. Comprobar structured data con Google Rich Results Test"
