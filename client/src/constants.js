// Assessment questions aligned with NIST CSF for logging maturity evaluation
export const assessmentQuestions = [
  // ============================================
  // IDENTIFY (ID) - Asset Management & Risk Assessment
  // ============================================
  {
    id: 'id1',
    category: 'Identify (CSF)',
    question: 'Do you maintain a comprehensive inventory of all log sources in your environment?',
    description: 'CSF ID.AM-1: Physical devices and systems are inventoried. This includes servers, network devices, applications, cloud services, and security tools.',
  },
  {
    id: 'id2',
    category: 'Identify (CSF)',
    question: 'Are log sources classified by criticality and data sensitivity?',
    description: 'CSF ID.AM-5: Resources are prioritized based on their classification, criticality, and business value.',
  },
  {
    id: 'id3',
    category: 'Identify (CSF)',
    question: 'Have you identified regulatory and compliance requirements for logging?',
    description: 'CSF ID.GV-3: Legal and regulatory requirements regarding cybersecurity are understood and managed (PCI-DSS, HIPAA, SOX, GDPR).',
  },
  {
    id: 'id4',
    category: 'Identify (CSF)',
    question: 'Is there a risk assessment that identifies logging gaps?',
    description: 'CSF ID.RA-1: Asset vulnerabilities are identified and documented, including blind spots in logging coverage.',
  },
  {
    id: 'id5',
    category: 'Identify (CSF)',
    question: 'Are data flows mapped to understand where logs should be collected?',
    description: 'CSF ID.AM-3: Communication and data flows are mapped to identify logging points.',
  },

  // ============================================
  // PROTECT (PR) - Data Security & Access Control
  // ============================================
  {
    id: 'pr1',
    category: 'Protect (CSF)',
    question: 'Are logs protected from unauthorized modification or deletion?',
    description: 'CSF PR.DS-1: Data-at-rest is protected. Log integrity is crucial for forensic investigations and compliance.',
  },
  {
    id: 'pr2',
    category: 'Protect (CSF)',
    question: 'Is access to log data restricted based on roles and responsibilities?',
    description: 'CSF PR.AC-4: Access permissions are managed using least privilege principles.',
  },
  {
    id: 'pr3',
    category: 'Protect (CSF)',
    question: 'Are logs encrypted in transit and at rest?',
    description: 'CSF PR.DS-2: Data-in-transit is protected using encryption for log shipping and storage.',
  },
  {
    id: 'pr4',
    category: 'Protect (CSF)',
    question: 'Is log storage capacity monitored and managed proactively?',
    description: 'CSF PR.DS-4: Adequate capacity to ensure availability is maintained, preventing log loss.',
  },
  {
    id: 'pr5',
    category: 'Protect (CSF)',
    question: 'Are logs being stored for an appropriate retention period?',
    description: 'CSF PR.IP-4: Backups of information are conducted and maintained. Retention should meet regulatory requirements (90 days to 1+ years).',
  },
  {
    id: 'pr6',
    category: 'Protect (CSF)',
    question: 'Is there a documented process for onboarding new log sources?',
    description: 'CSF PR.IP-1: Configuration management processes are established to ensure consistent log collection.',
  },

  // ============================================
  // DETECT (DE) - SIEM Configuration & Monitoring
  // ============================================
  {
    id: 'de1',
    category: 'Detect (CSF)',
    question: 'Do you have a SIEM or centralized log analysis platform deployed?',
    description: 'CSF DE.AE-3: Event data are aggregated and correlated from multiple sources and sensors.',
  },
  {
    id: 'de2',
    category: 'Detect (CSF)',
    question: 'Are logs normalized to a consistent format for analysis?',
    description: 'CSF DE.AE-3: Log normalization enables effective correlation and reduces analysis complexity.',
  },
  {
    id: 'de3',
    category: 'Detect (CSF)',
    question: 'Is timestamp synchronization (NTP) enforced across all log sources?',
    description: 'CSF DE.AE-1: A baseline of network operations is established. Accurate timestamps are critical for event correlation.',
  },
  {
    id: 'de4',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for credential-based attacks (brute force, credential stuffing)?',
    description: 'CSF DE.CM-1: The network is monitored for authentication anomalies and failed login patterns.',
  },
  {
    id: 'de5',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for privilege escalation attempts?',
    description: 'CSF DE.CM-3: Personnel activity is monitored for unauthorized privilege changes.',
  },
  {
    id: 'de6',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for lateral movement indicators?',
    description: 'CSF DE.CM-1: Network monitoring detects unusual internal traffic patterns (RDP, SMB, WMI, PSExec).',
  },
  {
    id: 'de7',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for data exfiltration patterns?',
    description: 'CSF DE.CM-1: Monitoring for unusual outbound data transfers, DNS tunneling, or cloud storage uploads.',
  },
  {
    id: 'de8',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for malware indicators (execution, persistence)?',
    description: 'CSF DE.CM-4: Malicious code is detected through process execution, file creation, and registry changes.',
  },
  {
    id: 'de9',
    category: 'Detect (CSF)',
    question: 'Is there a process for tuning detection rules to reduce false positives?',
    description: 'CSF DE.DP-5: Detection processes are continuously improved based on feedback.',
  },
  {
    id: 'de10',
    category: 'Detect (CSF)',
    question: 'Are SIEM correlation rules using threat intelligence feeds?',
    description: 'CSF DE.AE-2: Detected events are analyzed to understand attack targets and methods using current threat data.',
  },
  {
    id: 'de11',
    category: 'Detect (CSF)',
    question: 'Is user and entity behavior analytics (UEBA) enabled for anomaly detection?',
    description: 'CSF DE.AE-1: Baseline behavior is established to detect deviations indicating compromise.',
  },
  {
    id: 'de12',
    category: 'Detect (CSF)',
    question: 'Are SIEM dashboards configured for real-time security monitoring?',
    description: 'CSF DE.DP-4: Event detection information is communicated to appropriate parties via dashboards.',
  },

  // ============================================
  // RESPOND (RS) - Response Planning & Analysis
  // ============================================
  {
    id: 'rs1',
    category: 'Respond (CSF)',
    question: 'Are logs readily accessible for incident investigation within SLA?',
    description: 'CSF RS.AN-1: Notifications from detection systems are investigated. Analysts should access logs within minutes.',
  },
  {
    id: 'rs2',
    category: 'Respond (CSF)',
    question: 'Can you correlate logs across different sources for a single incident?',
    description: 'CSF RS.AN-3: Forensics are performed to understand the full scope using correlated data.',
  },
  {
    id: 'rs3',
    category: 'Respond (CSF)',
    question: 'Do you have documented playbooks for log-based investigation?',
    description: 'CSF RS.RP-1: Response plan is executed during or after an event using documented procedures.',
  },
  {
    id: 'rs4',
    category: 'Respond (CSF)',
    question: 'Can analysts quickly pivot between related log events during investigation?',
    description: 'CSF RS.AN-2: The impact of incidents is understood through efficient log navigation.',
  },
  {
    id: 'rs5',
    category: 'Respond (CSF)',
    question: 'Are there automated response actions triggered by log events?',
    description: 'CSF RS.MI-2: Incidents are mitigated through SOAR integration and automated containment.',
  },

  // ============================================
  // RECOVER (RC) - Recovery & Improvements
  // ============================================
  {
    id: 'rc1',
    category: 'Recover (CSF)',
    question: 'Are logging capabilities regularly reviewed and assessed?',
    description: 'CSF RC.IM-1: Recovery plans incorporate lessons learned, including logging gaps discovered.',
  },
  {
    id: 'rc2',
    category: 'Recover (CSF)',
    question: 'Is there a process to identify and address logging gaps after incidents?',
    description: 'CSF RC.IM-2: Recovery strategies are updated based on post-incident analysis.',
  },
  {
    id: 'rc3',
    category: 'Recover (CSF)',
    question: 'Is there an owner responsible for the logging program?',
    description: 'CSF RC.CO-3: Recovery activities are communicated to stakeholders with clear ownership.',
  },
  {
    id: 'rc4',
    category: 'Recover (CSF)',
    question: 'Do you have documented logging policies and standards?',
    description: 'CSF ID.GV-1: Organizational security policy is established and communicated.',
  },

  // ============================================
  // INCIDENT RESPONSE READINESS
  // ============================================
  {
    id: 'ir1',
    category: 'IR Readiness',
    question: 'Can you detect and investigate unauthorized access to user accounts?',
    description: 'Requires: Authentication logs, failed login attempts, account lockouts, unusual login times/locations.',
  },
  {
    id: 'ir2',
    category: 'IR Readiness',
    question: 'Can you detect and investigate ransomware or destructive malware incidents?',
    description: 'Requires: File system logs, process execution, registry changes, volume shadow copy deletions, mass file modifications.',
  },
  {
    id: 'ir3',
    category: 'IR Readiness',
    question: 'Can you detect and investigate business email compromise (BEC)?',
    description: 'Requires: Email gateway logs, mailbox audit logs, forwarding rule changes, OAuth app consents.',
  },
  {
    id: 'ir4',
    category: 'IR Readiness',
    question: 'Can you detect and investigate data theft or exfiltration?',
    description: 'Requires: DLP logs, cloud storage access, USB device logs, large outbound transfers, DNS query logs.',
  },
  {
    id: 'ir5',
    category: 'IR Readiness',
    question: 'Can you detect and investigate insider threat activity?',
    description: 'Requires: User activity logs, file access patterns, after-hours access, bulk downloads, print logs.',
  },
  {
    id: 'ir6',
    category: 'IR Readiness',
    question: 'Can you detect and investigate network intrusion or APT activity?',
    description: 'Requires: Firewall logs, IDS/IPS alerts, DNS logs, proxy logs, endpoint detection logs, C2 beacon patterns.',
  },
  {
    id: 'ir7',
    category: 'IR Readiness',
    question: 'Can you detect and investigate cloud service compromise?',
    description: 'Requires: Cloud audit logs (AWS CloudTrail, Azure Activity, GCP Audit), IAM changes, resource modifications.',
  },
  {
    id: 'ir8',
    category: 'IR Readiness',
    question: 'Can you detect and investigate supply chain or third-party compromise?',
    description: 'Requires: Application logs, API access logs, vendor VPN logs, service account activity.',
  },
  {
    id: 'ir9',
    category: 'IR Readiness',
    question: 'Can you detect and investigate denial of service attacks?',
    description: 'Requires: Network flow data, firewall logs, load balancer logs, application performance logs.',
  },
  {
    id: 'ir10',
    category: 'IR Readiness',
    question: 'Can you detect and investigate web application attacks (SQLi, XSS)?',
    description: 'Requires: WAF logs, web server access logs, application error logs, database query logs.',
  },
  {
    id: 'ir11',
    category: 'IR Readiness',
    question: 'Can you reconstruct a full attack timeline from initial access to impact?',
    description: 'Requires: Correlated logs across network, endpoint, identity, and application layers with consistent timestamps.',
  },
  {
    id: 'ir12',
    category: 'IR Readiness',
    question: 'Can you identify all affected systems and accounts during an incident?',
    description: 'Requires: Asset inventory integration, user-to-device mapping, network topology awareness in logs.',
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
