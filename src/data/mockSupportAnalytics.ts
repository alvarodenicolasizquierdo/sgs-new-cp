// Mock data for Support Analytics / Admin Dashboard

export interface SupportQuery {
  id: string;
  query: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  page: string;
  confidence: 'high' | 'medium' | 'low';
  wasAnswered: boolean;
  wasEscalated: boolean;
  escalationType?: 'email' | 'form';
  responseTime?: number; // milliseconds
  helpful?: boolean; // user feedback
}

export interface UnansweredQuestion {
  id: string;
  query: string;
  count: number;
  lastAsked: Date;
  category: string;
  suggestedAnswer?: string;
  status: 'pending' | 'in_review' | 'answered';
}

export interface ConfidenceMetric {
  date: string;
  high: number;
  medium: number;
  low: number;
  total: number;
}

// Sample support queries
export const mockSupportQueries: SupportQuery[] = [
  {
    id: 'sq-001',
    query: 'How do I create a rush test request?',
    timestamp: new Date('2026-02-04T09:15:00'),
    userId: 'u-001',
    userName: 'Sarah Chen',
    userRole: 'Manager',
    page: '/tests',
    confidence: 'high',
    wasAnswered: true,
    wasEscalated: false,
    responseTime: 850,
    helpful: true
  },
  {
    id: 'sq-002',
    query: 'Can I export inspection data to Excel?',
    timestamp: new Date('2026-02-04T10:22:00'),
    userId: 'u-002',
    userName: 'James Miller',
    userRole: 'Inspector',
    page: '/inspections',
    confidence: 'medium',
    wasAnswered: true,
    wasEscalated: false,
    responseTime: 920,
    helpful: true
  },
  {
    id: 'sq-003',
    query: 'How do I configure SSO for my team?',
    timestamp: new Date('2026-02-04T11:05:00'),
    userId: 'u-003',
    userName: 'Emma Watson',
    userRole: 'Admin',
    page: '/settings',
    confidence: 'low',
    wasAnswered: false,
    wasEscalated: true,
    escalationType: 'email',
    responseTime: 1200
  },
  {
    id: 'sq-004',
    query: 'What is the difference between Base and Bulk testing?',
    timestamp: new Date('2026-02-04T13:30:00'),
    userId: 'u-004',
    userName: 'Li Wei',
    userRole: 'Viewer',
    page: '/tests',
    confidence: 'high',
    wasAnswered: true,
    wasEscalated: false,
    responseTime: 780,
    helpful: true
  },
  {
    id: 'sq-005',
    query: 'How do I integrate with our ERP system?',
    timestamp: new Date('2026-02-04T14:45:00'),
    userId: 'u-005',
    userName: 'Michael Brown',
    userRole: 'Admin',
    page: '/settings',
    confidence: 'low',
    wasAnswered: false,
    wasEscalated: true,
    escalationType: 'form',
    responseTime: 1500
  },
  {
    id: 'sq-006',
    query: 'Why is my supplier showing as non-compliant?',
    timestamp: new Date('2026-02-04T15:10:00'),
    userId: 'u-006',
    userName: 'Anna Schmidt',
    userRole: 'Manager',
    page: '/suppliers',
    confidence: 'medium',
    wasAnswered: true,
    wasEscalated: false,
    responseTime: 880,
    helpful: false
  },
  {
    id: 'sq-007',
    query: 'How do I set up automated report scheduling?',
    timestamp: new Date('2026-02-04T16:00:00'),
    userId: 'u-007',
    userName: 'Carlos Rodriguez',
    userRole: 'Manager',
    page: '/analytics',
    confidence: 'medium',
    wasAnswered: true,
    wasEscalated: false,
    responseTime: 950
  },
  {
    id: 'sq-008',
    query: 'Can I bulk upload components via API?',
    timestamp: new Date('2026-02-04T16:30:00'),
    userId: 'u-008',
    userName: 'David Kim',
    userRole: 'Admin',
    page: '/components',
    confidence: 'low',
    wasAnswered: false,
    wasEscalated: true,
    escalationType: 'form',
    responseTime: 1100
  }
];

// Unanswered questions that need attention
export const mockUnansweredQuestions: UnansweredQuestion[] = [
  {
    id: 'uq-001',
    query: 'How do I configure SSO/SAML authentication?',
    count: 12,
    lastAsked: new Date('2026-02-04T11:05:00'),
    category: 'general',
    status: 'in_review',
    suggestedAnswer: 'SSO configuration requires enterprise plan. Contact sales@example.com for setup assistance.'
  },
  {
    id: 'uq-002',
    query: 'Can I integrate with SAP ERP?',
    count: 8,
    lastAsked: new Date('2026-02-04T14:45:00'),
    category: 'general',
    status: 'pending'
  },
  {
    id: 'uq-003',
    query: 'How do I set up webhook notifications?',
    count: 6,
    lastAsked: new Date('2026-02-03T10:20:00'),
    category: 'general',
    status: 'pending'
  },
  {
    id: 'uq-004',
    query: 'Is there a mobile app for inspectors?',
    count: 15,
    lastAsked: new Date('2026-02-04T09:00:00'),
    category: 'general',
    status: 'in_review',
    suggestedAnswer: 'Mobile app is currently in beta. Request access through Settings > Beta Features.'
  },
  {
    id: 'uq-005',
    query: 'How do I create custom test templates?',
    count: 4,
    lastAsked: new Date('2026-02-02T15:30:00'),
    category: 'testing',
    status: 'answered'
  },
  {
    id: 'uq-006',
    query: 'Can I bulk import suppliers from CSV?',
    count: 7,
    lastAsked: new Date('2026-02-04T08:15:00'),
    category: 'suppliers',
    status: 'pending'
  }
];

// Confidence metrics over time
export const mockConfidenceMetrics: ConfidenceMetric[] = [
  { date: '2026-01-29', high: 45, medium: 30, low: 15, total: 90 },
  { date: '2026-01-30', high: 52, medium: 28, low: 12, total: 92 },
  { date: '2026-01-31', high: 48, medium: 32, low: 18, total: 98 },
  { date: '2026-02-01', high: 55, medium: 25, low: 10, total: 90 },
  { date: '2026-02-02', high: 60, medium: 22, low: 8, total: 90 },
  { date: '2026-02-03', high: 58, medium: 28, low: 14, total: 100 },
  { date: '2026-02-04', high: 50, medium: 35, low: 15, total: 100 },
];

// Summary statistics
export const mockSupportStats = {
  totalQueries: 847,
  answeredQueries: 756,
  escalatedQueries: 91,
  avgConfidence: 78,
  avgResponseTime: 920, // ms
  helpfulRate: 89, // percentage
  topCategories: [
    { name: 'Testing', count: 234 },
    { name: 'Suppliers', count: 189 },
    { name: 'Inspections', count: 156 },
    { name: 'Reports', count: 142 },
    { name: 'General', count: 126 },
  ],
  peakHours: [
    { hour: '9 AM', queries: 89 },
    { hour: '10 AM', queries: 112 },
    { hour: '11 AM', queries: 95 },
    { hour: '2 PM', queries: 105 },
    { hour: '3 PM', queries: 98 },
  ]
};
