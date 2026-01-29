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

  // ============================================
  // DETECTION VALIDATION (Purple Team)
  // ============================================
  {
    id: 'dv1',
    category: 'Detection Validation',
    question: 'Do you perform regular atomic tests to validate log capture?',
    description: 'Purple team testing using frameworks like Atomic Red Team to verify logs are generated for simulated attacks.',
  },
  {
    id: 'dv2',
    category: 'Detection Validation',
    question: 'Are detection rules tested against simulated attacks before production deployment?',
    description: 'New detection rules should be validated with controlled test cases before going live.',
  },
  {
    id: 'dv3',
    category: 'Detection Validation',
    question: 'Do you measure time-to-detect (TTD) for validated test cases?',
    description: 'Tracking detection latency helps identify performance issues and SLA compliance.',
  },
  {
    id: 'dv4',
    category: 'Detection Validation',
    question: 'Are log field completeness and quality regularly audited?',
    description: 'Validating that expected fields (user, IP, hostname, etc.) are present and properly parsed.',
  },
  {
    id: 'dv5',
    category: 'Detection Validation',
    question: 'Do you have a schedule for recurring detection validation tests?',
    description: 'Regular testing (monthly/quarterly) ensures continued detection efficacy after changes.',
  },
  {
    id: 'dv6',
    category: 'Detection Validation',
    question: 'Are test results documented and tracked over time?',
    description: 'Maintaining a history of test results enables trend analysis and regression detection.',
  },
  {
    id: 'dv7',
    category: 'Detection Validation',
    question: 'Do you validate detection coverage against the MITRE ATT&CK framework?',
    description: 'Mapping tests to ATT&CK techniques provides comprehensive coverage measurement.',
  },
  {
    id: 'dv8',
    category: 'Detection Validation',
    question: 'Are failed validation tests tracked through remediation?',
    description: 'Gaps identified through testing should be tracked until resolved with re-validation.',
  },
  {
    id: 'dv9',
    category: 'Detection Validation',
    question: 'Do you validate that alerts reach the SOC within expected timeframes?',
    description: 'End-to-end testing from attack execution to analyst notification.',
  },
  {
    id: 'dv10',
    category: 'Detection Validation',
    question: 'Are validation results shared with stakeholders and used for prioritization?',
    description: 'Test results should inform logging program improvements and resource allocation.',
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

// Default tags for log sources
export const defaultTagOptions = [
  { value: 'critical-asset', label: 'Critical Asset', color: 'red' },
  { value: 'compliance-required', label: 'Compliance Required', color: 'purple' },
  { value: 'pci-dss', label: 'PCI-DSS', color: 'blue' },
  { value: 'hipaa', label: 'HIPAA', color: 'blue' },
  { value: 'sox', label: 'SOX', color: 'blue' },
  { value: 'gdpr', label: 'GDPR', color: 'blue' },
  { value: 'cloud', label: 'Cloud', color: 'cyan' },
  { value: 'on-prem', label: 'On-Premise', color: 'gray' },
  { value: 'legacy', label: 'Legacy', color: 'orange' },
  { value: 'new', label: 'New', color: 'green' },
  { value: 'high-volume', label: 'High Volume', color: 'yellow' },
  { value: 'low-volume', label: 'Low Volume', color: 'gray' },
  { value: 'needs-review', label: 'Needs Review', color: 'orange' },
  { value: 'validated', label: 'Validated', color: 'green' },
  { value: 'deprecated', label: 'Deprecated', color: 'red' },
];

// Compliance frameworks
export const complianceFrameworks = [
  { 
    id: 'pci-dss', 
    name: 'PCI-DSS', 
    description: 'Payment Card Industry Data Security Standard',
    requirements: [
      { id: 'pci-10.1', name: '10.1', description: 'Implement audit trails to link all access to system components to each individual user' },
      { id: 'pci-10.2', name: '10.2', description: 'Implement automated audit trails for all system components' },
      { id: 'pci-10.3', name: '10.3', description: 'Record audit trail entries for all system components for each event' },
      { id: 'pci-10.5', name: '10.5', description: 'Secure audit trails so they cannot be altered' },
      { id: 'pci-10.7', name: '10.7', description: 'Retain audit trail history for at least one year' },
    ]
  },
  { 
    id: 'hipaa', 
    name: 'HIPAA', 
    description: 'Health Insurance Portability and Accountability Act',
    requirements: [
      { id: 'hipaa-164.312-b', name: '164.312(b)', description: 'Audit controls - hardware, software, and/or procedural mechanisms to record and examine activity' },
      { id: 'hipaa-164.308-a1', name: '164.308(a)(1)', description: 'Security Management Process - implement policies and procedures' },
      { id: 'hipaa-164.312-d', name: '164.312(d)', description: 'Person or entity authentication' },
    ]
  },
  { 
    id: 'sox', 
    name: 'SOX', 
    description: 'Sarbanes-Oxley Act',
    requirements: [
      { id: 'sox-302', name: 'Section 302', description: 'Corporate responsibility for financial reports' },
      { id: 'sox-404', name: 'Section 404', description: 'Management assessment of internal controls' },
    ]
  },
  { 
    id: 'nist-csf', 
    name: 'NIST CSF', 
    description: 'NIST Cybersecurity Framework',
    requirements: [
      { id: 'nist-de.ae', name: 'DE.AE', description: 'Anomalies and Events - Anomalous activity is detected' },
      { id: 'nist-de.cm', name: 'DE.CM', description: 'Security Continuous Monitoring' },
      { id: 'nist-pr.ds', name: 'PR.DS', description: 'Data Security - Information is protected' },
      { id: 'nist-rs.an', name: 'RS.AN', description: 'Analysis - Investigation and forensics conducted' },
    ]
  },
];

// Onboarding checklist steps
export const onboardingSteps = [
  {
    id: 'identify',
    title: 'Identify Source',
    description: 'Define the log source and its characteristics',
    fields: ['name', 'category', 'description', 'logType'],
  },
  {
    id: 'ownership',
    title: 'Assign Ownership',
    description: 'Determine who is responsible for this log source',
    fields: ['ownerTeam', 'ownerContact', 'criticalityTier'],
  },
  {
    id: 'compliance',
    title: 'Compliance & Tags',
    description: 'Tag for compliance requirements and categorization',
    fields: ['tags', 'retention'],
  },
  {
    id: 'technical',
    title: 'Technical Configuration',
    description: 'Document collection method and requirements',
    fields: ['collectionMethod', 'networkRequirements', 'credentials'],
  },
  {
    id: 'validation',
    title: 'Validation Plan',
    description: 'Plan for validating log collection',
    fields: ['validationPlan', 'expectedFields', 'sampleQuery'],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review all information and create the source',
    fields: [],
  },
];

// Log type options
export const logTypeOptions = [
  { value: 'syslog', label: 'Syslog' },
  { value: 'windows-event', label: 'Windows Event Log' },
  { value: 'json', label: 'JSON' },
  { value: 'cef', label: 'CEF (Common Event Format)' },
  { value: 'leef', label: 'LEEF (Log Event Extended Format)' },
  { value: 'csv', label: 'CSV' },
  { value: 'xml', label: 'XML' },
  { value: 'netflow', label: 'NetFlow/IPFIX' },
  { value: 'pcap', label: 'PCAP' },
  { value: 'api', label: 'API/Webhook' },
  { value: 'database', label: 'Database Query' },
  { value: 'file', label: 'Flat File' },
  { value: 'cloud-native', label: 'Cloud Native' },
  { value: 'other', label: 'Other' },
];

// Criticality tier options
export const criticalityTierOptions = [
  { value: 'tier-1', label: 'Tier 1 - Critical', description: 'Business critical systems, core security infrastructure' },
  { value: 'tier-2', label: 'Tier 2 - High', description: 'Important production systems, key applications' },
  { value: 'tier-3', label: 'Tier 3 - Medium', description: 'Standard business systems' },
  { value: 'tier-4', label: 'Tier 4 - Low', description: 'Development, test, non-critical systems' },
];

// Retention period options
export const retentionOptions = [
  { value: '7d', label: '7 Days' },
  { value: '14d', label: '14 Days' },
  { value: '30d', label: '30 Days' },
  { value: '60d', label: '60 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '180 Days (6 months)' },
  { value: '365d', label: '365 Days (1 year)' },
  { value: '730d', label: '730 Days (2 years)' },
  { value: '1825d', label: '5 Years' },
  { value: '2555d', label: '7 Years' },
  { value: 'custom', label: 'Custom' },
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
  { id: 'name', label: 'Source Name', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'logType', label: 'Log Type', visible: true },
  { id: 'criticalityTier', label: 'Criticality Tier', visible: true },
  { id: 'ownerTeam', label: 'Owner Team', visible: true },
  { id: 'ownerContact', label: 'Owner Contact', visible: false },
  { id: 'retention', label: 'Retention', visible: false },
  { id: 'description', label: 'Description', visible: false },
  { id: 'notes', label: 'Notes', visible: false },
  { id: 'lastUpdated', label: 'Last Updated', visible: false },
];

// ============================================
// VALIDATION TEST LIBRARY (Purple Team)
// ============================================
export const validationTestLibrary = [
  // Initial Access
  {
    id: 'vt-t1078-001',
    name: 'Valid Account - Local Account Login',
    tactic: 'Initial Access',
    technique: 'T1078.001',
    techniqueName: 'Valid Accounts: Default Accounts',
    description: 'Test detection of successful authentication using local accounts',
    expectedLogSources: ['Windows Security', 'Linux Auth', 'PAM'],
    testProcedure: 'Authenticate using a local account and verify login event is captured',
    expectedFields: ['username', 'source_ip', 'logon_type', 'timestamp'],
  },
  {
    id: 'vt-t1078-002',
    name: 'Valid Account - Domain Account Login',
    tactic: 'Initial Access',
    technique: 'T1078.002',
    techniqueName: 'Valid Accounts: Domain Accounts',
    description: 'Test detection of successful domain authentication',
    expectedLogSources: ['Windows Security', 'Active Directory', 'Domain Controller'],
    testProcedure: 'Authenticate using domain credentials and verify event 4624 is logged',
    expectedFields: ['username', 'domain', 'source_ip', 'logon_type', 'workstation'],
  },
  {
    id: 'vt-t1110-001',
    name: 'Brute Force - Password Guessing',
    tactic: 'Initial Access',
    technique: 'T1110.001',
    techniqueName: 'Brute Force: Password Guessing',
    description: 'Test detection of multiple failed login attempts',
    expectedLogSources: ['Windows Security', 'Linux Auth', 'Azure AD', 'Okta'],
    testProcedure: 'Attempt 10+ failed logins against a test account within 5 minutes',
    expectedFields: ['username', 'source_ip', 'failure_reason', 'timestamp'],
  },
  {
    id: 'vt-t1566-001',
    name: 'Phishing - Spearphishing Attachment',
    tactic: 'Initial Access',
    technique: 'T1566.001',
    techniqueName: 'Phishing: Spearphishing Attachment',
    description: 'Test detection of malicious email attachment delivery',
    expectedLogSources: ['Email Gateway', 'Microsoft 365', 'Exchange'],
    testProcedure: 'Send test email with EICAR attachment and verify detection',
    expectedFields: ['sender', 'recipient', 'subject', 'attachment_name', 'verdict'],
  },

  // Execution
  {
    id: 'vt-t1059-001',
    name: 'PowerShell Execution',
    tactic: 'Execution',
    technique: 'T1059.001',
    techniqueName: 'Command and Scripting Interpreter: PowerShell',
    description: 'Test logging of PowerShell command execution',
    expectedLogSources: ['Windows PowerShell', 'Sysmon', 'EDR'],
    testProcedure: 'Execute encoded PowerShell command and verify ScriptBlock logging (4104)',
    expectedFields: ['command_line', 'script_block', 'user', 'parent_process'],
  },
  {
    id: 'vt-t1059-003',
    name: 'Windows Command Shell',
    tactic: 'Execution',
    technique: 'T1059.003',
    techniqueName: 'Command and Scripting Interpreter: Windows Command Shell',
    description: 'Test logging of cmd.exe execution',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Execute suspicious cmd commands and verify process creation logging',
    expectedFields: ['command_line', 'user', 'parent_process', 'process_id'],
  },
  {
    id: 'vt-t1204-002',
    name: 'User Execution - Malicious File',
    tactic: 'Execution',
    technique: 'T1204.002',
    techniqueName: 'User Execution: Malicious File',
    description: 'Test detection of user executing suspicious file',
    expectedLogSources: ['Sysmon', 'EDR', 'Antivirus'],
    testProcedure: 'Execute EICAR test file and verify process creation and AV alert',
    expectedFields: ['file_path', 'file_hash', 'user', 'verdict'],
  },

  // Persistence
  {
    id: 'vt-t1053-005',
    name: 'Scheduled Task Creation',
    tactic: 'Persistence',
    technique: 'T1053.005',
    techniqueName: 'Scheduled Task/Job: Scheduled Task',
    description: 'Test detection of scheduled task creation',
    expectedLogSources: ['Windows Security', 'Sysmon', 'Task Scheduler'],
    testProcedure: 'Create scheduled task via schtasks.exe and verify event 4698',
    expectedFields: ['task_name', 'command', 'user', 'trigger'],
  },
  {
    id: 'vt-t1547-001',
    name: 'Registry Run Keys',
    tactic: 'Persistence',
    technique: 'T1547.001',
    techniqueName: 'Boot or Logon Autostart Execution: Registry Run Keys',
    description: 'Test detection of registry autorun modifications',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Add value to HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    expectedFields: ['registry_key', 'registry_value', 'user', 'process'],
  },
  {
    id: 'vt-t1136-001',
    name: 'Create Local Account',
    tactic: 'Persistence',
    technique: 'T1136.001',
    techniqueName: 'Create Account: Local Account',
    description: 'Test detection of new local account creation',
    expectedLogSources: ['Windows Security', 'Linux Auth'],
    testProcedure: 'Create new local user via net user command and verify event 4720',
    expectedFields: ['new_username', 'created_by', 'timestamp'],
  },
  {
    id: 'vt-t1543-003',
    name: 'Windows Service Creation',
    tactic: 'Persistence',
    technique: 'T1543.003',
    techniqueName: 'Create or Modify System Process: Windows Service',
    description: 'Test detection of new service installation',
    expectedLogSources: ['Windows System', 'Sysmon', 'EDR'],
    testProcedure: 'Create new service via sc.exe and verify event 7045',
    expectedFields: ['service_name', 'service_path', 'user', 'start_type'],
  },

  // Privilege Escalation
  {
    id: 'vt-t1548-002',
    name: 'UAC Bypass',
    tactic: 'Privilege Escalation',
    technique: 'T1548.002',
    techniqueName: 'Abuse Elevation Control Mechanism: Bypass UAC',
    description: 'Test detection of UAC bypass techniques',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Execute fodhelper UAC bypass and verify elevation event',
    expectedFields: ['process', 'integrity_level', 'parent_process'],
  },
  {
    id: 'vt-t1068',
    name: 'Exploitation for Privilege Escalation',
    tactic: 'Privilege Escalation',
    technique: 'T1068',
    techniqueName: 'Exploitation for Privilege Escalation',
    description: 'Test detection of privilege escalation exploitation',
    expectedLogSources: ['EDR', 'Sysmon', 'Windows Security'],
    testProcedure: 'Execute known priv-esc test (e.g., PrintNightmare simulation)',
    expectedFields: ['process', 'user', 'target_privilege', 'exploit_indicator'],
  },

  // Defense Evasion
  {
    id: 'vt-t1070-001',
    name: 'Clear Windows Event Logs',
    tactic: 'Defense Evasion',
    technique: 'T1070.001',
    techniqueName: 'Indicator Removal: Clear Windows Event Logs',
    description: 'Test detection of event log clearing',
    expectedLogSources: ['Windows Security', 'Windows System', 'Sysmon'],
    testProcedure: 'Clear Security event log and verify event 1102 is generated',
    expectedFields: ['log_name', 'user', 'timestamp'],
  },
  {
    id: 'vt-t1562-001',
    name: 'Disable Windows Defender',
    tactic: 'Defense Evasion',
    technique: 'T1562.001',
    techniqueName: 'Impair Defenses: Disable or Modify Tools',
    description: 'Test detection of security tool tampering',
    expectedLogSources: ['Windows Defender', 'Sysmon', 'EDR'],
    testProcedure: 'Attempt to disable Defender and verify tamper alert',
    expectedFields: ['tool_name', 'action', 'user', 'process'],
  },
  {
    id: 'vt-t1027',
    name: 'Obfuscated PowerShell',
    tactic: 'Defense Evasion',
    technique: 'T1027',
    techniqueName: 'Obfuscated Files or Information',
    description: 'Test detection of obfuscated script execution',
    expectedLogSources: ['PowerShell', 'Sysmon', 'EDR'],
    testProcedure: 'Execute base64 encoded PowerShell and verify decoded logging',
    expectedFields: ['encoded_command', 'decoded_content', 'user'],
  },

  // Credential Access
  {
    id: 'vt-t1003-001',
    name: 'LSASS Memory Dump',
    tactic: 'Credential Access',
    technique: 'T1003.001',
    techniqueName: 'OS Credential Dumping: LSASS Memory',
    description: 'Test detection of LSASS memory access',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Access LSASS process memory (e.g., procdump, mimikatz simulation)',
    expectedFields: ['target_process', 'source_process', 'access_rights', 'user'],
  },
  {
    id: 'vt-t1003-003',
    name: 'NTDS.dit Access',
    tactic: 'Credential Access',
    technique: 'T1003.003',
    techniqueName: 'OS Credential Dumping: NTDS',
    description: 'Test detection of AD database access',
    expectedLogSources: ['Windows Security', 'Sysmon', 'EDR'],
    testProcedure: 'Attempt to copy NTDS.dit via VSS and verify detection',
    expectedFields: ['file_path', 'user', 'process'],
  },
  {
    id: 'vt-t1558-003',
    name: 'Kerberoasting',
    tactic: 'Credential Access',
    technique: 'T1558.003',
    techniqueName: 'Steal or Forge Kerberos Tickets: Kerberoasting',
    description: 'Test detection of Kerberos ticket requests for SPNs',
    expectedLogSources: ['Windows Security', 'Domain Controller'],
    testProcedure: 'Request TGS tickets for service accounts and verify event 4769',
    expectedFields: ['service_name', 'encryption_type', 'user', 'client_ip'],
  },

  // Discovery
  {
    id: 'vt-t1087-001',
    name: 'Local Account Discovery',
    tactic: 'Discovery',
    technique: 'T1087.001',
    techniqueName: 'Account Discovery: Local Account',
    description: 'Test detection of local account enumeration',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Run net user command and verify process logging',
    expectedFields: ['command_line', 'user', 'process'],
  },
  {
    id: 'vt-t1087-002',
    name: 'Domain Account Discovery',
    tactic: 'Discovery',
    technique: 'T1087.002',
    techniqueName: 'Account Discovery: Domain Account',
    description: 'Test detection of AD user enumeration',
    expectedLogSources: ['Domain Controller', 'Windows Security', 'Sysmon'],
    testProcedure: 'Run net user /domain and verify LDAP query logging',
    expectedFields: ['command_line', 'user', 'ldap_query'],
  },
  {
    id: 'vt-t1046',
    name: 'Network Service Discovery',
    tactic: 'Discovery',
    technique: 'T1046',
    techniqueName: 'Network Service Discovery',
    description: 'Test detection of port scanning activity',
    expectedLogSources: ['Firewall', 'IDS/IPS', 'EDR', 'Zeek'],
    testProcedure: 'Run nmap scan against test targets and verify detection',
    expectedFields: ['source_ip', 'dest_ip', 'ports', 'scan_type'],
  },

  // Lateral Movement
  {
    id: 'vt-t1021-001',
    name: 'Remote Desktop Protocol',
    tactic: 'Lateral Movement',
    technique: 'T1021.001',
    techniqueName: 'Remote Services: Remote Desktop Protocol',
    description: 'Test detection of RDP lateral movement',
    expectedLogSources: ['Windows Security', 'Windows TerminalServices', 'Firewall'],
    testProcedure: 'RDP to test system and verify logon event 4624 type 10',
    expectedFields: ['source_ip', 'dest_host', 'user', 'logon_type'],
  },
  {
    id: 'vt-t1021-002',
    name: 'SMB/Windows Admin Shares',
    tactic: 'Lateral Movement',
    technique: 'T1021.002',
    techniqueName: 'Remote Services: SMB/Windows Admin Shares',
    description: 'Test detection of admin share access',
    expectedLogSources: ['Windows Security', 'Sysmon', 'Firewall'],
    testProcedure: 'Access C$ or ADMIN$ share and verify event 5140/5145',
    expectedFields: ['source_ip', 'share_name', 'user', 'access_type'],
  },
  {
    id: 'vt-t1047',
    name: 'WMI Remote Execution',
    tactic: 'Lateral Movement',
    technique: 'T1047',
    techniqueName: 'Windows Management Instrumentation',
    description: 'Test detection of WMI-based remote execution',
    expectedLogSources: ['Windows Security', 'Sysmon', 'WMI Logs'],
    testProcedure: 'Execute command via wmic /node and verify WMI logging',
    expectedFields: ['source_host', 'dest_host', 'command', 'user'],
  },
  {
    id: 'vt-t1021-006',
    name: 'PSExec / Remote Services',
    tactic: 'Lateral Movement',
    technique: 'T1021.006',
    techniqueName: 'Remote Services: Windows Remote Management',
    description: 'Test detection of PSExec-style remote execution',
    expectedLogSources: ['Windows Security', 'Sysmon', 'EDR'],
    testProcedure: 'Use PSExec to execute command on remote system',
    expectedFields: ['source_host', 'dest_host', 'service_name', 'user'],
  },

  // Collection
  {
    id: 'vt-t1560-001',
    name: 'Archive via Utility',
    tactic: 'Collection',
    technique: 'T1560.001',
    techniqueName: 'Archive Collected Data: Archive via Utility',
    description: 'Test detection of data archiving for exfiltration',
    expectedLogSources: ['Sysmon', 'EDR', 'DLP'],
    testProcedure: 'Create password-protected archive of sensitive files',
    expectedFields: ['archive_tool', 'file_path', 'user', 'file_size'],
  },
  {
    id: 'vt-t1114-002',
    name: 'Email Collection - Remote',
    tactic: 'Collection',
    technique: 'T1114.002',
    techniqueName: 'Email Collection: Remote Email Collection',
    description: 'Test detection of mailbox access',
    expectedLogSources: ['Exchange', 'Microsoft 365', 'Email Gateway'],
    testProcedure: 'Access mailbox via EWS/Graph API and verify audit log',
    expectedFields: ['mailbox', 'accessor', 'operation', 'client_ip'],
  },

  // Command and Control
  {
    id: 'vt-t1071-001',
    name: 'Web Protocol C2',
    tactic: 'Command and Control',
    technique: 'T1071.001',
    techniqueName: 'Application Layer Protocol: Web Protocols',
    description: 'Test detection of HTTP/S-based C2 traffic',
    expectedLogSources: ['Proxy', 'Firewall', 'DNS', 'EDR'],
    testProcedure: 'Generate simulated C2 beacon traffic to known test domain',
    expectedFields: ['dest_domain', 'dest_ip', 'user_agent', 'bytes_out'],
  },
  {
    id: 'vt-t1071-004',
    name: 'DNS Tunneling',
    tactic: 'Command and Control',
    technique: 'T1071.004',
    techniqueName: 'Application Layer Protocol: DNS',
    description: 'Test detection of DNS-based data exfiltration',
    expectedLogSources: ['DNS', 'Firewall', 'EDR'],
    testProcedure: 'Send encoded data via DNS TXT queries and verify detection',
    expectedFields: ['query_name', 'query_type', 'source_ip', 'response_size'],
  },
  {
    id: 'vt-t1105',
    name: 'Ingress Tool Transfer',
    tactic: 'Command and Control',
    technique: 'T1105',
    techniqueName: 'Ingress Tool Transfer',
    description: 'Test detection of tool download to compromised host',
    expectedLogSources: ['Proxy', 'Sysmon', 'EDR', 'Firewall'],
    testProcedure: 'Download file via certutil/PowerShell and verify logging',
    expectedFields: ['url', 'file_path', 'user', 'process'],
  },

  // Exfiltration
  {
    id: 'vt-t1048-003',
    name: 'Exfiltration Over Unencrypted Protocol',
    tactic: 'Exfiltration',
    technique: 'T1048.003',
    techniqueName: 'Exfiltration Over Alternative Protocol: Unencrypted',
    description: 'Test detection of data exfiltration via FTP/HTTP',
    expectedLogSources: ['Firewall', 'Proxy', 'DLP', 'Zeek'],
    testProcedure: 'Upload test file via FTP/HTTP POST and verify detection',
    expectedFields: ['dest_ip', 'protocol', 'bytes_out', 'file_name'],
  },
  {
    id: 'vt-t1567-002',
    name: 'Exfiltration to Cloud Storage',
    tactic: 'Exfiltration',
    technique: 'T1567.002',
    techniqueName: 'Exfiltration Over Web Service: Exfiltration to Cloud Storage',
    description: 'Test detection of uploads to cloud storage',
    expectedLogSources: ['Proxy', 'CASB', 'DLP', 'Firewall'],
    testProcedure: 'Upload file to Dropbox/OneDrive/Google Drive and verify logging',
    expectedFields: ['service', 'file_name', 'user', 'bytes_out'],
  },

  // Impact
  {
    id: 'vt-t1486',
    name: 'Data Encrypted for Impact',
    tactic: 'Impact',
    technique: 'T1486',
    techniqueName: 'Data Encrypted for Impact',
    description: 'Test detection of ransomware-like encryption activity',
    expectedLogSources: ['EDR', 'Sysmon', 'File Integrity Monitoring'],
    testProcedure: 'Run encryption simulation on test files and verify detection',
    expectedFields: ['file_count', 'extension_change', 'process', 'user'],
  },
  {
    id: 'vt-t1490',
    name: 'Inhibit System Recovery',
    tactic: 'Impact',
    technique: 'T1490',
    techniqueName: 'Inhibit System Recovery',
    description: 'Test detection of backup/recovery sabotage',
    expectedLogSources: ['Sysmon', 'Windows Security', 'EDR'],
    testProcedure: 'Execute vssadmin delete shadows and verify process logging',
    expectedFields: ['command_line', 'user', 'process'],
  },
];
