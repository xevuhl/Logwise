// Assessment questions for logging maturity evaluation
export const assessmentQuestions = [
  {
    id: 'q1',
    category: 'Collection',
    question: 'Do you have a comprehensive inventory of all log sources in your environment?',
    description: 'This includes servers, network devices, applications, cloud services, and security tools.',
  },
  {
    id: 'q2',
    category: 'Collection',
    question: 'Are logs being collected from all critical systems and applications?',
    description: 'Critical systems include domain controllers, firewalls, VPN concentrators, email gateways, and key business applications.',
  },
  {
    id: 'q3',
    category: 'Collection',
    question: 'Do you have a process for onboarding new log sources?',
    description: 'A defined process ensures new systems are properly integrated into your logging infrastructure.',
  },
  {
    id: 'q4',
    category: 'Storage',
    question: 'Are logs being stored for an appropriate retention period?',
    description: 'Retention should meet regulatory requirements and support incident investigation needs (typically 90 days to 1 year minimum).',
  },
  {
    id: 'q5',
    category: 'Storage',
    question: 'Is log storage capacity monitored and managed?',
    description: 'Proactive monitoring prevents log loss due to storage exhaustion.',
  },
  {
    id: 'q6',
    category: 'Storage',
    question: 'Are logs protected from unauthorized modification or deletion?',
    description: 'Log integrity is crucial for forensic investigations and compliance.',
  },
  {
    id: 'q7',
    category: 'Analysis',
    question: 'Do you have a SIEM or log analysis platform in place?',
    description: 'Centralized analysis enables correlation and detection across multiple sources.',
  },
  {
    id: 'q8',
    category: 'Analysis',
    question: 'Are detection rules/alerts configured for common attack patterns?',
    description: 'Examples include brute force attacks, privilege escalation, and lateral movement.',
  },
  {
    id: 'q9',
    category: 'Analysis',
    question: 'Is there a process for tuning and updating detection rules?',
    description: 'Regular tuning reduces false positives and improves detection accuracy.',
  },
  {
    id: 'q10',
    category: 'Response',
    question: 'Are logs readily accessible for incident investigation?',
    description: 'Analysts should be able to quickly search and analyze logs during an incident.',
  },
  {
    id: 'q11',
    category: 'Response',
    question: 'Do you have documented procedures for log-based investigation?',
    description: 'Runbooks and playbooks help ensure consistent and thorough investigations.',
  },
  {
    id: 'q12',
    category: 'Response',
    question: 'Can you correlate logs across different sources for a single incident?',
    description: 'Cross-source correlation is essential for understanding the full scope of an incident.',
  },
  {
    id: 'q13',
    category: 'Governance',
    question: 'Is there an owner responsible for the logging program?',
    description: 'Clear ownership ensures accountability and continuous improvement.',
  },
  {
    id: 'q14',
    category: 'Governance',
    question: 'Do you have documented logging policies and standards?',
    description: 'Policies define what should be logged, retention requirements, and access controls.',
  },
  {
    id: 'q15',
    category: 'Governance',
    question: 'Are logging capabilities regularly reviewed and assessed?',
    description: 'Regular assessments identify gaps and drive improvements.',
  },
];

// Status options for log sources
export const statusOptions = [
  { value: 'collected', label: 'Collected', color: 'green' },
  { value: 'partial', label: 'Partial', color: 'yellow' },
  { value: 'planned', label: 'Planned', color: 'blue' },
  { value: 'not-collected', label: 'Not Collected', color: 'gray' },
  { value: 'blocked', label: 'Blocked', color: 'red' },
];

// Category options for log sources
export const categoryOptions = [
  'Network',
  'Endpoint',
  'Application',
  'Cloud',
  'Identity',
  'Security',
  'Database',
  'Email',
  'Web',
  'Other',
];

// Assessment response options
export const assessmentResponseOptions = [
  { value: 'yes', label: 'Yes', score: 2 },
  { value: 'partial', label: 'Partial', score: 1 },
  { value: 'no', label: 'No', score: 0 },
  { value: 'na', label: 'N/A', score: null },
];

// Default columns for the inventory table
export const defaultColumns = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'integration', label: 'Integration', visible: true },
  { id: 'criticality', label: 'Criticality', visible: true },
  { id: 'owner', label: 'Owner', visible: false },
  { id: 'notes', label: 'Notes', visible: false },
  { id: 'lastUpdated', label: 'Last Updated', visible: false },
];
