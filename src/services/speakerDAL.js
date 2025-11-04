/**
 * Data Access Layer (DAL) for Speaker and Talk data
 * Normalizes and exposes data from schedule.json
 * 
 * @typedef {Object} Talk
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} speaker
 * @property {string[]} speakers
 * @property {string} timeRaw
 * @property {string} timeISO
 * @property {Date} startTime
 * @property {number} durationMinutes
 * @property {string} durationHuman
 * @property {string} room
 * @property {string} type
 * @property {'main'|'hyperscalers'|'bsides'} track
 * 
 * @typedef {Object} Speaker
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} [title]
 * @property {string} [company]
 * @property {string} [bio]
 * @property {string} [image]
 * @property {Talk[]} talks
 * @property {Object} [social]
 * @property {string} [social.twitter]
 * @property {string} [social.linkedin]
 * @property {string} [social.github]
 * @property {string} [social.website]
 */

import scheduleData from '../data/schedule2025.json';
import speakersMetadata from '../data/speakers.json';

/**
 * Generate a URL-friendly slug from a name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

/**
 * Parse talk data and normalize it
 */
function normalizeTalk(talkData, index) {
  const speakers = talkData.speaker.split(',').map(s => s.trim());
  
  return {
    id: `talk-${index}`,
    title: talkData.talk,
    description: talkData.description,
    speaker: talkData.speaker,
    speakers: speakers,
    timeRaw: talkData.timeRaw,
    timeISO: talkData.timeISO,
    startTime: new Date(talkData.timeISO),
    durationMinutes: talkData.durationMinutes,
    durationHuman: talkData.durationHuman,
    room: talkData.room,
    type: talkData.type,
    track: talkData.track
  };
}

/**
 * Get all talks from the schedule
 */
export function getAllTalks() {
  return scheduleData.map((talk, index) => normalizeTalk(talk, index));
}

/**
 * Get talks by track
 */
export function getTalksByTrack(track) {
  return getAllTalks().filter(talk => talk.track === track);
}

/**
 * Get speaker metadata by name
 */
function getSpeakerMetadata(name) {
  return speakersMetadata.find(s => s.name === name) || {
    name: name,
    bio: '',
    image: 'xops.png' // default placeholder
  };
}

/**
 * Get all unique speakers with their talks
 */
export function getAllSpeakers() {
  const talks = getAllTalks();
  const speakersMap = new Map();

  // Aggregate talks by speaker
  talks.forEach(talk => {
    talk.speakers.forEach(speakerName => {
      if (!speakersMap.has(speakerName)) {
        const metadata = getSpeakerMetadata(speakerName);
        const slug = generateSlug(speakerName);
        
        speakersMap.set(speakerName, {
          id: slug,
          slug: slug,
          name: speakerName,
          title: metadata.title,
          company: metadata.company,
          bio: metadata.bio,
          image: metadata.image,
          social: metadata.social,
          talks: []
        });
      }
      
      speakersMap.get(speakerName).talks.push(talk);
    });
  });

  // Sort talks by start time for each speaker
  speakersMap.forEach(speaker => {
    speaker.talks.sort((a, b) => a.startTime - b.startTime);
  });

  return Array.from(speakersMap.values());
}

/**
 * Get speaker by ID (slug)
 */
export function getSpeaker(id) {
  const speakers = getAllSpeakers();
  return speakers.find(speaker => speaker.id === id || speaker.slug === id);
}

/**
 * Get speakers by track
 * Returns speakers who have at least one talk in the specified track
 */
export function getSpeakersByTrack(track) {
  const speakers = getAllSpeakers();
  return speakers.filter(speaker => 
    speaker.talks.some(talk => talk.track === track)
  );
}

/**
 * Get all unique tracks
 */
export function getAllTracks() {
  const talks = getAllTalks();
  const tracks = new Set(talks.map(talk => talk.track));
  return Array.from(tracks);
}

/**
 * Search speakers by name or company
 */
export function searchSpeakers(query) {
  if (!query) return getAllSpeakers();
  
  const lowerQuery = query.toLowerCase();
  const speakers = getAllSpeakers();
  
  return speakers.filter(speaker => 
    speaker.name.toLowerCase().includes(lowerQuery) ||
    (speaker.company && speaker.company.toLowerCase().includes(lowerQuery)) ||
    (speaker.title && speaker.title.toLowerCase().includes(lowerQuery))
  );
}
