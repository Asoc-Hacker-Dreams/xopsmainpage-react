/**
 * Example usage of the Agenda DAL
 * This demonstrates how to use the agenda data access layer
 */

import { initializeAgenda, getAgenda, clearAgenda } from './agendaDAL.js';
import scheduleData from '../data/schedule2025.json';

// Example 1: Initialize the agenda with schedule data
async function loadAgenda() {
  console.log('Loading agenda into IndexedDB...');
  await initializeAgenda(scheduleData);
  console.log(`✓ Loaded ${scheduleData.length} agenda items`);
}

// Example 2: Get all agenda items (sorted by time)
async function getAllItems() {
  const items = await getAgenda();
  console.log(`\nAll agenda items (${items.length} total):`);
  items.slice(0, 3).forEach(item => {
    console.log(`  - ${item.startTime}: ${item.talk} (${item.room})`);
  });
  console.log('  ...');
}

// Example 3: Get items for a specific day
async function getDay1Items() {
  const items = await getAgenda({ day: '2025-11-21' });
  console.log(`\nDay 1 items (${items.length} total):`);
  items.slice(0, 3).forEach(item => {
    console.log(`  - ${item.startTime}: ${item.talk}`);
  });
}

// Example 4: Get items for a specific track
async function getTrackItems() {
  const items = await getAgenda({ track: 'main' });
  console.log(`\nMain track items (${items.length} total):`);
  items.slice(0, 3).forEach(item => {
    console.log(`  - ${item.startTime}: ${item.talk}`);
  });
}

// Example 5: Get items for a specific room
async function getRoomItems() {
  const items = await getAgenda({ room: 'Aula magna' });
  console.log(`\nAula magna items (${items.length} total):`);
  items.slice(0, 3).forEach(item => {
    console.log(`  - ${item.startTime}: ${item.talk}`);
  });
}

// Example 6: Combine multiple filters
async function getCombinedFilters() {
  const items = await getAgenda({ 
    day: '2025-11-21', 
    track: 'main' 
  });
  console.log(`\nDay 1 + Main track items (${items.length} total):`);
  items.forEach(item => {
    console.log(`  - ${item.startTime}: ${item.talk}`);
  });
}

// Example 7: Clean up
async function cleanup() {
  console.log('\nCleaning up...');
  await clearAgenda();
  console.log('✓ Agenda cleared');
}

// Run all examples
export async function runExamples() {
  try {
    await loadAgenda();
    await getAllItems();
    await getDay1Items();
    await getTrackItems();
    await getRoomItems();
    await getCombinedFilters();
    await cleanup();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run examples
// runExamples();

export default {
  loadAgenda,
  getAllItems,
  getDay1Items,
  getTrackItems,
  getRoomItems,
  getCombinedFilters,
  cleanup,
  runExamples
};
