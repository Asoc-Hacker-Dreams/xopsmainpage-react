import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaTwitter, FaLinkedin, FaWhatsapp, FaFacebook, FaLink, FaCheck } from 'react-icons/fa';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'buttons' | 'icons';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'X-Ops Conference',
  description = 'Únete a la revolución X-Ops! Conferencia sobre DevOps, DevSecOps, ML Ops, AI Ops y transformación digital en Madrid.',
  image,
  hashtags = ['XOps', 'DevOps', 'Madrid', 'TechConference'],
  className = '',
  size = 'md',
  variant = 'buttons',
}) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(h => encodeURIComponent(h)).join(',');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform];
    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      shareUrl,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    trackShareEvent(platform);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShareEvent('clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        trackShareEvent('native');
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const canNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (variant === 'icons') {
    return (
      <div className={`share-buttons-icons ${className}`}>
        <OverlayTrigger placement="top" overlay={<Tooltip>Compartir en Twitter</Tooltip>}>
          <button
            className="share-icon-btn twitter"
            onClick={() => handleShare('twitter')}
            aria-label="Compartir en Twitter"
          >
            <FaTwitter size={iconSizes[size]} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Compartir en LinkedIn</Tooltip>}>
          <button
            className="share-icon-btn linkedin"
            onClick={() => handleShare('linkedin')}
            aria-label="Compartir en LinkedIn"
          >
            <FaLinkedin size={iconSizes[size]} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Compartir en WhatsApp</Tooltip>}>
          <button
            className="share-icon-btn whatsapp"
            onClick={() => handleShare('whatsapp')}
            aria-label="Compartir en WhatsApp"
          >
            <FaWhatsapp size={iconSizes[size]} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>{copied ? '¡Copiado!' : 'Copiar enlace'}</Tooltip>}>
          <button
            className="share-icon-btn copy"
            onClick={handleCopyLink}
            aria-label="Copiar enlace"
          >
            {copied ? <FaCheck size={iconSizes[size]} /> : <FaLink size={iconSizes[size]} />}
          </button>
        </OverlayTrigger>

        {canNativeShare && (
          <OverlayTrigger placement="top" overlay={<Tooltip>Compartir</Tooltip>}>
            <button
              className="share-icon-btn native"
              onClick={handleNativeShare}
              aria-label="Compartir"
            >
              <span style={{ fontSize: iconSizes[size] }}>📤</span>
            </button>
          </OverlayTrigger>
        )}

        <style>{`
          .share-buttons-icons {
            display: inline-flex;
            gap: 0.5rem;
          }
          .share-icon-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #495057;
          }
          .share-icon-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .share-icon-btn.twitter:hover {
            background: #1da1f2;
            border-color: #1da1f2;
            color: white;
          }
          .share-icon-btn.linkedin:hover {
            background: #0077b5;
            border-color: #0077b5;
            color: white;
          }
          .share-icon-btn.whatsapp:hover {
            background: #25d366;
            border-color: #25d366;
            color: white;
          }
          .share-icon-btn.copy:hover {
            background: #6c757d;
            border-color: #6c757d;
            color: white;
          }
          .share-icon-btn.native:hover {
            background: #6c757d;
            border-color: #6c757d;
            color: white;
          }
          [data-theme="dark"] .share-icon-btn {
            background: #343a40;
            border-color: #495057;
            color: #f8f9fa;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`share-buttons d-flex flex-wrap gap-2 ${className}`}>
      <Button
        variant="outline-primary"
        size={size}
        onClick={() => handleShare('twitter')}
        className="d-flex align-items-center gap-2"
      >
        <FaTwitter />
        <span className="d-none d-sm-inline">Twitter</span>
      </Button>

      <Button
        variant="outline-primary"
        size={size}
        onClick={() => handleShare('linkedin')}
        className="d-flex align-items-center gap-2"
      >
        <FaLinkedin />
        <span className="d-none d-sm-inline">LinkedIn</span>
      </Button>

      <Button
        variant="outline-success"
        size={size}
        onClick={() => handleShare('whatsapp')}
        className="d-flex align-items-center gap-2"
      >
        <FaWhatsapp />
        <span className="d-none d-sm-inline">WhatsApp</span>
      </Button>

      <Button
        variant="outline-secondary"
        size={size}
        onClick={handleCopyLink}
        className="d-flex align-items-center gap-2"
      >
        {copied ? <FaCheck /> : <FaLink />}
        <span className="d-none d-sm-inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
      </Button>

      {canNativeShare && (
        <Button
          variant="outline-dark"
          size={size}
          onClick={handleNativeShare}
          className="d-flex align-items-center gap-2"
        >
          📤
          <span className="d-none d-sm-inline">Compartir</span>
        </Button>
      )}
    </div>
  );
};

function trackShareEvent(platform: string): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      event_category: 'engagement',
      event_label: platform,
      method: platform,
    });
  }
}

export default ShareButtons;
