import PropTypes from 'prop-types';
import { useState } from 'react';

const DubaiSpeakerPortrait = ({ speaker, large = false }) => {
  const [imageError, setImageError] = useState(false);
  const initials = speaker.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <span className={`dubai-portrait${large ? ' dubai-portrait--large' : ''}`}>
      {speaker.photo && !imageError ? (
        <img
          src={speaker.photo}
          alt={speaker.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="dubai-portrait__fallback" aria-label={speaker.name}>{initials}</span>
      )}
    </span>
  );
};

DubaiSpeakerPortrait.propTypes = {
  speaker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
  }).isRequired,
  large: PropTypes.bool,
};

export default DubaiSpeakerPortrait;
