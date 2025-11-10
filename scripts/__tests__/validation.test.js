/**
 * Tests for data validation schemas
 */

import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Ajv
const ajv = new Ajv({ allErrors: true, verbose: true, strict: true });
addFormats(ajv);

// Load schemas
const talkSchema = JSON.parse(
  readFileSync(join(__dirname, '../../schemas/talk.schema.json'), 'utf-8')
);
const speakerSchema = JSON.parse(
  readFileSync(join(__dirname, '../../schemas/speaker.schema.json'), 'utf-8')
);

const validateTalk = ajv.compile(talkSchema);
const validateSpeaker = ajv.compile(speakerSchema);

describe('Speaker Schema Validation', () => {
  it('should validate a valid speaker', () => {
    const validSpeaker = {
      id: 'test_speaker_1',
      slug: 'john-doe',
      name: 'John Doe',
      bio: 'Software engineer and speaker',
      photoUrl: 'https://example.com/photo.jpg',
      socials: [
        {
          platform: 'twitter',
          url: 'https://twitter.com/johndoe'
        }
      ],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateSpeaker(validSpeaker);
    expect(valid).toBe(true);
  });

  it('should fail validation when required fields are missing', () => {
    const invalidSpeaker = {
      id: 'test_speaker_1',
      name: 'John Doe',
      // missing slug, bio, photoUrl, socials, updatedAt, version
    };

    const valid = validateSpeaker(invalidSpeaker);
    expect(valid).toBe(false);
    expect(validateSpeaker.errors).toBeDefined();
    expect(validateSpeaker.errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with invalid photoUrl format', () => {
    const invalidSpeaker = {
      id: 'test_speaker_1',
      slug: 'john-doe',
      name: 'John Doe',
      bio: 'Software engineer',
      photoUrl: 'not-a-valid-url',
      socials: [],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateSpeaker(invalidSpeaker);
    expect(valid).toBe(false);
    expect(validateSpeaker.errors.some(err => err.instancePath === '/photoUrl')).toBe(true);
  });

  it('should fail validation with invalid slug pattern', () => {
    const invalidSpeaker = {
      id: 'test_speaker_1',
      slug: 'John_Doe', // Should be lowercase with hyphens
      name: 'John Doe',
      bio: 'Software engineer',
      photoUrl: 'https://example.com/photo.jpg',
      socials: [],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateSpeaker(invalidSpeaker);
    expect(valid).toBe(false);
    expect(validateSpeaker.errors.some(err => err.instancePath === '/slug')).toBe(true);
  });

  it('should validate speaker with optional fields', () => {
    const speakerWithOptionals = {
      id: 'test_speaker_1',
      slug: 'john-doe',
      name: 'John Doe',
      bio: 'Software engineer',
      photoUrl: 'https://example.com/photo.jpg',
      socials: [],
      company: 'Tech Corp',
      title: 'Senior Engineer',
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateSpeaker(speakerWithOptionals);
    expect(valid).toBe(true);
  });
});

describe('Talk Schema Validation', () => {
  it('should validate a valid talk', () => {
    const validTalk = {
      id: 'talk_1',
      slug: 'intro-to-devops',
      title: 'Introduction to DevOps',
      abstract: 'A comprehensive introduction to DevOps practices',
      track: 'main',
      room: 'Room A',
      day: '2025-11-21',
      startTime: '2025-11-21T09:00:00+01:00',
      endTime: '2025-11-21T10:00:00+01:00',
      speakerIds: ['speaker_1'],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateTalk(validTalk);
    expect(valid).toBe(true);
  });

  it('should fail validation when required fields are missing', () => {
    const invalidTalk = {
      id: 'talk_1',
      title: 'Introduction to DevOps',
      // missing multiple required fields
    };

    const valid = validateTalk(invalidTalk);
    expect(valid).toBe(false);
    expect(validateTalk.errors).toBeDefined();
    expect(validateTalk.errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with invalid day format', () => {
    const invalidTalk = {
      id: 'talk_1',
      slug: 'intro-to-devops',
      title: 'Introduction to DevOps',
      abstract: 'A comprehensive introduction to DevOps practices',
      track: 'main',
      room: 'Room A',
      day: '21-11-2025', // Wrong format
      startTime: '2025-11-21T09:00:00+01:00',
      endTime: '2025-11-21T10:00:00+01:00',
      speakerIds: ['speaker_1'],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateTalk(invalidTalk);
    expect(valid).toBe(false);
    expect(validateTalk.errors.some(err => err.instancePath === '/day')).toBe(true);
  });

  it('should fail validation with empty speakerIds array', () => {
    const invalidTalk = {
      id: 'talk_1',
      slug: 'intro-to-devops',
      title: 'Introduction to DevOps',
      abstract: 'A comprehensive introduction to DevOps practices',
      track: 'main',
      room: 'Room A',
      day: '2025-11-21',
      startTime: '2025-11-21T09:00:00+01:00',
      endTime: '2025-11-21T10:00:00+01:00',
      speakerIds: [], // Empty array
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateTalk(invalidTalk);
    expect(valid).toBe(false);
    expect(validateTalk.errors.some(err => err.instancePath === '/speakerIds')).toBe(true);
  });

  it('should validate talk with optional fields', () => {
    const talkWithOptionals = {
      id: 'talk_1',
      slug: 'intro-to-devops',
      title: 'Introduction to DevOps',
      abstract: 'A comprehensive introduction to DevOps practices',
      track: 'main',
      room: 'Room A',
      day: '2025-11-21',
      startTime: '2025-11-21T09:00:00+01:00',
      endTime: '2025-11-21T10:00:00+01:00',
      speakerIds: ['speaker_1'],
      type: 'keynote',
      duration: 60,
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateTalk(talkWithOptionals);
    expect(valid).toBe(true);
  });

  it('should validate talk with multiple speakers', () => {
    const talkWithMultipleSpeakers = {
      id: 'talk_1',
      slug: 'intro-to-devops',
      title: 'Introduction to DevOps',
      abstract: 'A comprehensive introduction to DevOps practices',
      track: 'main',
      room: 'Room A',
      day: '2025-11-21',
      startTime: '2025-11-21T09:00:00+01:00',
      endTime: '2025-11-21T10:00:00+01:00',
      speakerIds: ['speaker_1', 'speaker_2', 'speaker_3'],
      updatedAt: '2025-11-04T10:00:00Z',
      version: '1.0'
    };

    const valid = validateTalk(talkWithMultipleSpeakers);
    expect(valid).toBe(true);
  });
});

describe('Generated Data Validation', () => {
  it('should validate all generated speakers', () => {
    const scheduleData = JSON.parse(
      readFileSync(join(__dirname, '../../data/schedule.json'), 'utf-8')
    );

    scheduleData.speakers.forEach((speaker, index) => {
      const valid = validateSpeaker(speaker);
      if (!valid) {
        console.error(`Speaker ${index} validation errors:`, validateSpeaker.errors);
      }
      expect(valid).toBe(true);
    });
  });

  it('should validate all generated talks', () => {
    const scheduleData = JSON.parse(
      readFileSync(join(__dirname, '../../data/schedule.json'), 'utf-8')
    );

    scheduleData.talks.forEach((talk, index) => {
      const valid = validateTalk(talk);
      if (!valid) {
        console.error(`Talk ${index} validation errors:`, validateTalk.errors);
      }
      expect(valid).toBe(true);
    });
  });

  it('should have correct data counts', () => {
    const scheduleData = JSON.parse(
      readFileSync(join(__dirname, '../../data/schedule.json'), 'utf-8')
    );

    expect(scheduleData.speakers).toBeDefined();
    expect(scheduleData.talks).toBeDefined();
    expect(Array.isArray(scheduleData.speakers)).toBe(true);
    expect(Array.isArray(scheduleData.talks)).toBe(true);
    expect(scheduleData.speakers.length).toBeGreaterThan(0);
    expect(scheduleData.talks.length).toBeGreaterThan(0);
  });
});
