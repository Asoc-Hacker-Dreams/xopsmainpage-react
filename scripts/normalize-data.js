#!/usr/bin/env node

/**
 * Script to normalize schedule data and generate speakers.json and talks.json
 * from the existing schedule2025.json file
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to create slug from name
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper to create ID from name
function createId(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Helper to calculate end time
function calculateEndTime(startTime, durationMinutes) {
  // Parse the time components
  const match = startTime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})$/);
  if (!match) {
    throw new Error(`Invalid startTime format: ${startTime}`);
  }
  
  const [, date, hours, minutes, seconds, offset] = match;
  
  // Calculate end time in minutes
  const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
  const endMinutes = startMinutes + durationMinutes;
  
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  
  // Handle day overflow (if end time goes past midnight)
  let endDate = date;
  if (endHours >= 24) {
    const d = new Date(date);
    d.setDate(d.getDate() + Math.floor(endHours / 24));
    endDate = d.toISOString().split('T')[0];
  }
  
  const finalHours = endHours % 24;
  
  return `${endDate}T${String(finalHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}:${seconds}${offset}`;
}

// Read the original schedule
const scheduleFile = join(__dirname, '../src/data/schedule2025.json');
const schedule = JSON.parse(readFileSync(scheduleFile, 'utf-8'));

// Extract unique speakers
const speakersMap = new Map();
const talks = [];
const updatedAt = new Date().toISOString();

schedule.forEach((item, index) => {
  const speakerName = item.speaker;
  const speakerId = createId(speakerName);
  const speakerSlug = slugify(speakerName);
  
  // Add speaker if not exists
  if (!speakersMap.has(speakerId)) {
    speakersMap.set(speakerId, {
      id: speakerId,
      slug: speakerSlug,
      name: speakerName,
      bio: item.description || `Speaker at X-Ops Conference 2025`,
      photoUrl: `https://xopsconference.com/images/speakers/${speakerSlug}.jpg`,
      socials: [],
      updatedAt: updatedAt,
      version: "1.0"
    });
  }

  // Create talk
  const talkId = `talk_${index + 1}`;
  const talkSlug = slugify(item.talk);
  
  // Parse date from timeISO (format: "2025-11-21T09:30")
  const startTime = item.timeISO ? `${item.timeISO}:00+01:00` : `${item.timeRaw.replace(' ', 'T')}+01:00`;
  const day = item.timeISO ? item.timeISO.split('T')[0] : item.timeRaw.split(' ')[0];
  const endTime = calculateEndTime(startTime, item.durationMinutes);

  talks.push({
    id: talkId,
    slug: talkSlug,
    title: item.talk,
    abstract: item.description,
    track: item.track || 'main',
    room: item.room,
    day: day,
    startTime: startTime,
    endTime: endTime,
    speakerIds: [speakerId],
    type: item.type || 'talk',
    duration: item.durationMinutes,
    updatedAt: updatedAt,
    version: "1.0"
  });
});

// Convert speakers map to array
const speakers = Array.from(speakersMap.values());

// Write normalized data
const dataDir = join(__dirname, '../data');
writeFileSync(
  join(dataDir, 'speakers.json'),
  JSON.stringify(speakers, null, 2)
);
writeFileSync(
  join(dataDir, 'talks.json'),
  JSON.stringify(talks, null, 2)
);

// Create schedule.json that references both
const schedule_normalized = {
  version: "1.0",
  updatedAt: updatedAt,
  speakers: speakers,
  talks: talks
};

writeFileSync(
  join(dataDir, 'schedule.json'),
  JSON.stringify(schedule_normalized, null, 2)
);

console.log(`✅ Generated ${speakers.length} speakers`);
console.log(`✅ Generated ${talks.length} talks`);
console.log(`✅ Created normalized data in /data directory`);
