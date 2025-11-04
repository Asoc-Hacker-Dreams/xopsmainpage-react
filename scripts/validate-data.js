#!/usr/bin/env node

/**
 * Validation script for X-Ops Conference data
 * Validates talks and speakers against JSON schemas
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Ajv with strict mode
const ajv = new Ajv({ 
  allErrors: true, 
  verbose: true,
  strict: true
});
addFormats(ajv);

// Load schemas
const talkSchema = JSON.parse(
  readFileSync(join(__dirname, '../schemas/talk.schema.json'), 'utf-8')
);
const speakerSchema = JSON.parse(
  readFileSync(join(__dirname, '../schemas/speaker.schema.json'), 'utf-8')
);

// Compile validators
const validateTalk = ajv.compile(talkSchema);
const validateSpeaker = ajv.compile(speakerSchema);

// Load data
let scheduleData;
try {
  scheduleData = JSON.parse(
    readFileSync(join(__dirname, '../data/schedule.json'), 'utf-8')
  );
} catch (error) {
  console.error('❌ Error loading data/schedule.json:', error.message);
  process.exit(1);
}

// Validation results
let hasErrors = false;
const errors = {
  talks: [],
  speakers: []
};

// Validate speakers
console.log('\n📋 Validating speakers...');
if (scheduleData.speakers && Array.isArray(scheduleData.speakers)) {
  scheduleData.speakers.forEach((speaker, index) => {
    const valid = validateSpeaker(speaker);
    if (!valid) {
      hasErrors = true;
      errors.speakers.push({
        index,
        id: speaker.id || `speaker-${index}`,
        errors: validateSpeaker.errors
      });
      console.error(`❌ Speaker ${index + 1} (${speaker.name || 'unknown'}): Validation failed`);
      validateSpeaker.errors.forEach(err => {
        console.error(`   - ${err.instancePath || '/'}: ${err.message}`);
        if (err.params) {
          console.error(`     Params: ${JSON.stringify(err.params)}`);
        }
      });
    }
  });
  
  if (errors.speakers.length === 0) {
    console.log(`✅ All ${scheduleData.speakers.length} speakers validated successfully`);
  } else {
    console.error(`❌ ${errors.speakers.length} speaker(s) failed validation`);
  }
} else {
  console.error('❌ No speakers array found in schedule.json');
  hasErrors = true;
}

// Validate talks
console.log('\n📋 Validating talks...');
if (scheduleData.talks && Array.isArray(scheduleData.talks)) {
  scheduleData.talks.forEach((talk, index) => {
    const valid = validateTalk(talk);
    if (!valid) {
      hasErrors = true;
      errors.talks.push({
        index,
        id: talk.id || `talk-${index}`,
        errors: validateTalk.errors
      });
      console.error(`❌ Talk ${index + 1} (${talk.title || 'unknown'}): Validation failed`);
      validateTalk.errors.forEach(err => {
        console.error(`   - ${err.instancePath || '/'}: ${err.message}`);
        if (err.params) {
          console.error(`     Params: ${JSON.stringify(err.params)}`);
        }
      });
    }
  });
  
  if (errors.talks.length === 0) {
    console.log(`✅ All ${scheduleData.talks.length} talks validated successfully`);
  } else {
    console.error(`❌ ${errors.talks.length} talk(s) failed validation`);
  }
} else {
  console.error('❌ No talks array found in schedule.json');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ VALIDATION FAILED');
  console.error(`   Speakers with errors: ${errors.speakers.length}`);
  console.error(`   Talks with errors: ${errors.talks.length}`);
  process.exit(1);
} else {
  console.log('✅ VALIDATION PASSED');
  console.log(`   Speakers validated: ${scheduleData.speakers?.length || 0}`);
  console.log(`   Talks validated: ${scheduleData.talks?.length || 0}`);
  console.log('='.repeat(60));
  process.exit(0);
}
