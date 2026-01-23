# Logwise

A modern, browser-based Security Log Source Tracker for managing and documenting your SIEM log inventory with compliance framework mappings.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

Logwise helps security teams maintain a comprehensive inventory of their log sources flowing into SIEM platforms. It provides visibility into log source status, ownership, compliance coverage, and detection capabilities—all in a single, easy-to-use interface.

## Features

### 📊 Log Source Management
- Track all your security log sources in one place
- Record source details including name, description, owner, and contact information
- Monitor log volume and retention periods
- Track destination platforms (Azure Sentinel, Cribl Stream, Azure Data Explorer, etc.)

### 🚦 Status Tracking
- **Active** - Log sources currently ingesting data
- **Planned** - Sources scheduled for future onboarding
- **Blocked** - Sources with identified blockers preventing ingestion
- **Deprecated** - Legacy sources being phased out

### 🎯 Compliance Framework Mapping
Map each log source to industry-standard security frameworks:
- **MITRE ATT&CK** - Tactics and Techniques coverage
- **NIST Cybersecurity Framework (CSF)** - Functions and Categories
- **ISO 27001** - Control domains

### 📈 Dashboard & Analytics
- Visual overview of log source health and status
- Compliance coverage metrics
- Tier distribution breakdown
- Quick identification of gaps in detection coverage

### 🔍 Search & Filtering
- Filter by status, log type, destination, and compliance frameworks
- Full-text search across all log source attributes
- Sort by various fields

### 📤 Export Capabilities
- Export inventory to **CSV** for spreadsheet analysis
- Export to **JSON** for programmatic use
- Generate **PDF reports** for stakeholder presentations

### 💾 Data Persistence
- All data stored locally in your browser (localStorage)
- Import/export functionality for backup and sharing
- No server required—runs entirely client-side

## Getting Started

### Quick Start

1. Download or clone this repository
2. Open `logwise.html` in any modern web browser
3. Start adding your log sources!

```bash
git clone https://github.com/xevuhl/Logwise.git
cd Logwise
# Open logwise.html in your browser
```

### No Installation Required

Logwise is a single HTML file containing all necessary code. Simply open it in your browser—no build process, no dependencies to install, no server to configure.

## Usage

### Adding a Log Source

1. Click the **"+ Add Source"** button
2. Fill in the log source details:
   - **Name** - Descriptive name (e.g., "Azure AD Sign-in Logs")
   - **Description** - What the log source provides
   - **Status** - Current integration status
   - **Destination** - Where logs are sent
   - **Log Type** - Category (Authentication, Endpoint, Network, etc.)
   - **Owner** - Responsible team or individual
   - **Tier** - Priority level (1-3)
   - **Volume** - Expected daily event volume
   - **Retention** - How long logs are kept
3. Map to compliance frameworks (MITRE, NIST CSF, ISO 27001)
4. Add any relevant notes
5. Save the log source

### Managing Log Sources

- **Edit** - Click on any log source to modify its details
- **Delete** - Remove log sources no longer needed
- **Filter** - Use the filter options to focus on specific sources
- **Search** - Find sources by name, description, or other attributes

### Exporting Data

Use the export buttons to:
- **CSV** - Spreadsheet-compatible format
- **JSON** - Full data export with all fields
- **PDF** - Formatted report for sharing

## Log Types

Logwise supports common security log categories:
- Authentication
- Endpoint
- Network
- Firewall
- Email
- Cloud
- DNS
- Proxy
- Application
- And more...

## Supported Destinations

Pre-configured destinations include:
- Azure Sentinel
- Azure Data Explorer
- Cribl Stream
- Splunk
- Custom destinations

## Browser Compatibility

Logwise works in all modern browsers:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

## Data Privacy

- **100% Client-Side** - All data stays in your browser
- **No External Connections** - No data is sent to any server
- **Local Storage** - Data persists in your browser's localStorage
- **Export Anytime** - Full data portability via export features

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [JetBrains Mono](https://www.jetbrains.com/lp/mono/) font

---

**Logwise** - Simplifying SIEM log source management for security teams.
