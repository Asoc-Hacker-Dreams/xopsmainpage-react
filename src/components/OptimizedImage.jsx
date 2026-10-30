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
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef(null);

  // Get different image format URLs
  const getImageSources = () => {
    if (!src) return { avif: null, webp: null, fallback: null };
    
    const basePath = src.replace(/\.(jpg|jpeg|png|gif)$/i, '');
    const extension = src.match(/\.(jpg|jpeg|png|gif)$/i)?.[1] || 'png';
    
    return {
      avif: `${basePath}.avif`,
      webp: `${basePath}.webp`,
      fallback: src,
      extension
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
          {/* AVIF format - best compression */}
          <source
            type="image/avif"
            srcSet={sources.avif}
            sizes={sizes}
          />
          
          {/* WebP format - good compression with wide support */}
          <source
            type="image/webp"
            srcSet={sources.webp}
            sizes={sizes}
          />
          
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
};

export default OptimizedImage;
