import { useState, useEffect, useCallback } from 'react';
import { db } from '../storage/idb/db';

// Mock attendee data for demo
const MOCK_ATTENDEES = [
  {
    id: 'att-001',
    name: 'María García',
    company: 'TechCorp',
    role: 'CTO',
    bio: 'Expert in cloud architecture and DevOps transformation',
    interests: ['DevOps', 'Cloud', 'Kubernetes'],
  },
  {
    id: 'att-002',
    name: 'Carlos Ruiz',
    company: 'SecureSoft',
    role: 'Security',
    bio: 'Cybersecurity specialist with 10+ years experience',
    interests: ['Security', 'DevSecOps', 'Compliance'],
  },
  {
    id: 'att-003',
    name: 'Ana López',
    company: 'InnovateTech',
    role: 'Developer',
    bio: 'Full-stack developer passionate about clean code',
    interests: ['React', 'Node.js', 'Testing'],
  },
  {
    id: 'att-004',
    name: 'David Martín',
    company: 'CloudFirst',
    role: 'DevOps',
    bio: 'Infrastructure as code enthusiast',
    interests: ['Terraform', 'AWS', 'CI/CD'],
  },
  {
    id: 'att-005',
    name: 'Laura Sánchez',
    company: 'DataDriven',
    role: 'Manager',
    bio: 'Engineering manager focused on team productivity',
    interests: ['Agile', 'Leadership', 'Metrics'],
  },
  {
    id: 'att-006',
    name: 'Pablo Fernández',
    company: 'TechCorp',
    role: 'Developer',
    bio: 'Backend specialist in microservices',
    interests: ['Microservices', 'Go', 'gRPC'],
  },
  {
    id: 'att-007',
    name: 'Elena Torres',
    company: 'StartUp Labs',
    role: 'CEO',
    bio: 'Founder building the future of developer tools',
    interests: ['Startups', 'Fundraising', 'Product'],
  },
  {
    id: 'att-008',
    name: 'Miguel Ángel Serrano',
    company: 'BigEnterprise',
    role: 'CTO',
    bio: 'Leading digital transformation in enterprise',
    interests: ['Digital Transformation', 'Architecture', 'Strategy'],
  },
];

export function useAttendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendees = async () => {
      try {
        // For now, use mock data - in production would fetch from API/DB
        setAttendees(MOCK_ATTENDEES);
      } catch (error) {
        console.error('Error loading attendees:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAttendees();
  }, []);

  return { attendees, loading };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = useCallback(async () => {
    try {
      const allMeetings = await db.meetings.toArray();
      setMeetings(allMeetings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const scheduleMeeting = useCallback(async (meetingData) => {
    const id = `mtg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meeting = {
      ...meetingData,
      id,
      status: 'scheduled',
    };
    await db.meetings.add(meeting);
    await loadMeetings();
    return id;
  }, [loadMeetings]);

  const cancelMeeting = useCallback(async (id) => {
    await db.meetings.delete(id);
    await loadMeetings();
  }, [loadMeetings]);

  const updateStatus = useCallback(async (id, status) => {
    await db.meetings.update(id, { status });
    await loadMeetings();
  }, [loadMeetings]);

  return { meetings, loading, scheduleMeeting, cancelMeeting, updateStatus };
}
