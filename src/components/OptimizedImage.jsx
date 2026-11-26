import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * 
 * Provides automatic image format selection (AVIF -> WebP -> fallback)
 * with lazy loading and intersection observer support for better Core Web Vitals.
 * 
 * Features:
 * - Automatic format selection based on browser support
 * - Lazy loading with Intersection Observer
 * - Responsive image loading with srcset
 * - Loading placeholder support
 * - LCP optimization with fetchpriority
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError,
  placeholder = null,
  // Fuentes alternativas YA resueltas por el bundler (imports explicitos).
  //
  // Antes se derivaban del nombre del fichero con
  // `src.replace(/\.(jpg|jpeg|png|gif)$/, '')`, lo que produce URLs rotas:
  // Vite hashea cada asset por separado, asi que un `xops.png` importado
  // llega como `/assets/xops-D73UKbcv.png` y el replace genera
  // `/assets/xops-D73UKbcv.avif`, que NO existe (el real es
  // `/assets/xops-BBQ8ixat.avif`). Con el <source> avif en 404, el
  // navegador no cae al <img> fallback y el logo NO SE VE (naturalWidth 0).
  // Era el bug que Antonio vio el 26-nov-2026.
  avifSrc = null,
  webpSrc = null,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef(null);

  // Get different image format URLs
  const getImageSources = () => {
    if (!src) return { avif: null, webp: null, fallback: null };

    // Si el llamante pasa las alternativas ya resueltas (imports explicitos),
    // se usan tal cual: el bundler knows el hash correcto de cada asset.
    if (avifSrc && webpSrc) {
      return { avif: avifSrc, webp: webpSrc, fallback: src, extension: 'png' };
    }

    // Si NO se le pasan las alternativas, no se derivan: un nombre con hash de
    // Vite no permite saber el hash del AVIF/WebP, y una URL derivada
    // inexistente hace que el navegador NO caiga al <img> de reserva (la
    // imagen no se ve). Sin alternativas, se sirve solo el original.
    return {
      avif: null,
      webp: null,
      fallback: src,
      extension: src.match(/\.(jpg|jpeg|png|gif)$/i)?.[1] || 'png'
    };
  };

  const sources = getImageSources();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager' || !imgRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading slightly before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, loading]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoaded(true); // Consider loaded even on error to remove placeholder
    if (onError) onError(e);
  };

  const imgStyle = {
    ...style,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <div style={containerStyle} ref={imgRef}>
      {!isLoaded && placeholder && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {placeholder}
        </div>
      )}
      
      {isInView && (
        <picture>
          {/* AVIF format - best compression. Solo si la URL existe: un <source>
              en 404 hace que el navegador no cargue el <img> de reserva. */}
          {sources.avif && (
            <source
              type="image/avif"
              srcSet={sources.avif}
              sizes={sizes}
            />
          )}

          {/* WebP format - good compression with wide support */}
          {sources.webp && (
            <source
              type="image/webp"
              srcSet={sources.webp}
              sizes={sizes}
            />
          )}
          
          {/* Fallback to original format */}
          <img
            src={sources.fallback}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={imgStyle}
            loading={loading}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  priority: PropTypes.bool,
  sizes: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.node,
  avifSrc: PropTypes.string,
  webpSrc: PropTypes.string,
};

export default OptimizedImage;
