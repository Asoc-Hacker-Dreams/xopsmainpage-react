/**
 * Generate a unique ID for a talk based on speaker, time, and room
 * @param {Object} talk - The talk object
 * @returns {string} Unique talk ID
 */
export function generateTalkId(talk) {
  return `${talk.speaker}-${talk.timeISO}-${talk.room}`.replace(/\s+/g, '-').toLowerCase();
}

/**
 * Group talks by day and room
 * @param {Array} talks - Array of talk objects
 * @returns {Object} Grouped talks { day: { room: [talks] } }
 */
export function groupTalksByDayAndRoom(talks) {
  const grouped = {};

  talks.forEach(talk => {
    const date = talk.timeISO.split('T')[0]; // Extract date part
    const room = talk.room || 'General';

    if (!grouped[date]) {
      grouped[date] = {};
    }
    if (!grouped[date][room]) {
      grouped[date][room] = [];
    }

    grouped[date][room].push({
      ...talk,
      id: generateTalkId(talk),
    });
  });

  // Sort talks within each room by time
  Object.keys(grouped).forEach(date => {
    Object.keys(grouped[date]).forEach(room => {
      grouped[date][room].sort((a, b) => 
        new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime()
      );
    });
  });

  return grouped;
}

/**
 * Group talks by day only (for My Agenda view)
 * @param {Array} talks - Array of talk objects
 * @returns {Object} Grouped talks { day: [talks] }
 */
export function groupTalksByDay(talks) {
  const grouped = {};

  talks.forEach(talk => {
    const date = talk.timeISO.split('T')[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push({
      ...talk,
      id: generateTalkId(talk),
    });
  });

  // Sort talks within each day by time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => 
      new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime()
    );
  });

  return grouped;
}

/**
 * Check if two talks overlap in time
 * @param {Object} talk1 - First talk
 * @param {Object} talk2 - Second talk
 * @returns {boolean} True if talks overlap
 */
export function talksOverlap(talk1, talk2) {
  if (talk1.room === talk2.room) {
    return false; // Same room means they can't overlap (different times)
  }

  const start1 = new Date(talk1.timeISO).getTime();
  const end1 = start1 + (talk1.durationMinutes * 60 * 1000);
  const start2 = new Date(talk2.timeISO).getTime();
  const end2 = start2 + (talk2.durationMinutes * 60 * 1000);

  return (start1 < end2 && start2 < end1);
}

/**
 * Detect conflicts in a list of favorite talks
 * @param {Array} talks - Array of talk objects
 * @returns {Set} Set of talk IDs that have conflicts
 */
export function detectConflicts(talks) {
  const conflicts = new Set();

  for (let i = 0; i < talks.length; i++) {
    for (let j = i + 1; j < talks.length; j++) {
      if (talksOverlap(talks[i], talks[j])) {
        conflicts.add(generateTalkId(talks[i]));
        conflicts.add(generateTalkId(talks[j]));
      }
    }
  }

  return conflicts;
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Viernes, 21 de Noviembre")
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Format time for display
 * @param {string} timeISO - ISO time string
 * @returns {string} Formatted time (e.g., "09:30")
 */
export function formatTime(timeISO) {
  const time = timeISO.split('T')[1];
  return time || timeISO;
}
