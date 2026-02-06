import { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  FileWarning,
  Printer,
  ChevronDown,
  ChevronRight,
  Building2,
  Lock,
  Activity,
  Eye,
  Settings,
  Database,
  FileDown,
  Crosshair,
  Presentation
} from 'lucide-react';
import { 
  assessmentQuestions, 
  complianceFrameworks, 
  statusOptions,
  criticalityTierOptions,
  defaultTagOptions,
  validationTestLibrary
} from '../constants';

function Reports({ sources, assessments, validationTests }) {
  const [activeReport, setActiveReport] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showReportPreview, setShowReportPreview] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSources = sources.length;
    const collectedSources = sources.filter(s => s.status === 'collected').length;
    const partialSources = sources.filter(s => s.status === 'partial').length;
    const plannedSources = sources.filter(s => s.status === 'planned').length;
    const notCollectedSources = sources.filter(s => s.status === 'not-collected').length;
    const blockedSources = sources.filter(s => s.status === 'blocked').length;

    // Coverage percentage
    const coveragePercent = totalSources > 0 
      ? Math.round(((collectedSources + partialSources * 0.5) / totalSources) * 100) 
      : 0;

    // Assessment maturity score
    const answeredQuestions = Object.entries(assessments || {}).filter(([_, v]) => v.response && v.response !== 'na');
    const totalScore = answeredQuestions.reduce((sum, [_, v]) => {
      if (v.response === 'yes') return sum + 2;
      if (v.response === 'partial') return sum + 1;
      return sum;
    }, 0);
    const maxScore = answeredQuestions.length * 2;
    const maturityScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Category breakdown
    const categoryBreakdown = {};
    sources.forEach(s => {
      const cat = s.category || 'Uncategorized';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { total: 0, collected: 0, partial: 0, planned: 0, notCollected: 0, blocked: 0 };
      }
      categoryBreakdown[cat].total++;
      if (s.status === 'collected') categoryBreakdown[cat].collected++;
      else if (s.status === 'partial') categoryBreakdown[cat].partial++;
      else if (s.status === 'planned') categoryBreakdown[cat].planned++;
      else if (s.status === 'blocked') categoryBreakdown[cat].blocked++;
      else categoryBreakdown[cat].notCollected++;
    });

    // Criticality breakdown
    const criticalityBreakdown = {};
    criticalityTierOptions.forEach(tier => {
      const tierSources = sources.filter(s => s.criticalityTier === tier.value);
      const tierCollected = tierSources.filter(s => s.status === 'collected' || s.status === 'partial').length;
      criticalityBreakdown[tier.value] = {
        label: tier.label,
        total: tierSources.length,
        collected: tierCollected,
        coverage: tierSources.length > 0 ? Math.round((tierCollected / tierSources.length) * 100) : 0
      };
    });

    // Validation test results - properly merge library with saved results
    const tests = validationTests || [];
    const totalLibraryTests = validationTestLibrary.length;
    
    // Create a map of saved results by testId
    const resultsMap = {};
    tests.forEach(t => {
      resultsMap[t.testId] = t;
    });
    
    // Categorize tests
    const passedTests = tests.filter(t => t.logCaptured && t.detectionFired).length;
    const partialTests = tests.filter(t => t.logCaptured && !t.detectionFired).length;
    const failedTests = tests.filter(t => !t.logCaptured).length;
    const notTestedCount = totalLibraryTests - tests.length;
    const detectionRate = tests.length > 0 ? Math.round((passedTests / tests.length) * 100) : 0;
    const testCoverage = totalLibraryTests > 0 ? Math.round((tests.length / totalLibraryTests) * 100) : 0;

    // Tactic coverage from validation library (for reporting purposes)
    const tacticCategories = {};
    validationTestLibrary.forEach(libTest => {
      const tactic = libTest.tactic;
      if (!tacticCategories[tactic]) {
        tacticCategories[tactic] = { total: 0, tested: 0, passed: 0, partial: 0, failed: 0 };
      }
      tacticCategories[tactic].total++;
      
      const result = resultsMap[libTest.id];
      if (result) {
        tacticCategories[tactic].tested++;
        if (result.logCaptured && result.detectionFired) tacticCategories[tactic].passed++;
        else if (result.logCaptured) tacticCategories[tactic].partial++;
        else tacticCategories[tactic].failed++;
      }
    });

    return {
      totalSources,
      collectedSources,
      partialSources,
      plannedSources,
      notCollectedSources,
      blockedSources,
      coveragePercent,
      maturityScore,
      categoryBreakdown,
      criticalityBreakdown,
      totalLibraryTests,
      passedTests,
      partialTests,
      failedTests,
      notTestedCount,
      detectionRate,
      testCoverage,
      tacticCategories,
      resultsMap
    };
  }, [sources, assessments, validationTests]);

  // Assessment scores by category
  const assessmentByCategory = useMemo(() => {
    const categories = {};
    assessmentQuestions.forEach(q => {
      const cat = q.category;
      if (!categories[cat]) {
        categories[cat] = { questions: [], answered: 0, score: 0, maxScore: 0 };
      }
      categories[cat].questions.push(q);
      
      const response = assessments?.[q.id];
      if (response?.response && response.response !== 'na') {
        categories[cat].answered++;
        categories[cat].maxScore += 2;
        if (response.response === 'yes') categories[cat].score += 2;
        else if (response.response === 'partial') categories[cat].score += 1;
      }
    });
    return categories;
  }, [assessments]);

  // Gap analysis
  const gaps = useMemo(() => {
    const sourceGaps = sources.filter(s => 
      s.status === 'not-collected' || s.status === 'blocked' || s.status === 'planned'
    );
    
    const assessmentGaps = assessmentQuestions.filter(q => {
      const response = assessments?.[q.id];
      return !response?.response || response.response === 'no' || response.response === 'partial';
    });

    // Validation gaps - tests that failed or weren't run
    const tests = validationTests || [];
    const resultsMap = {};
    tests.forEach(t => { resultsMap[t.testId] = t; });
    
    const validationGaps = validationTestLibrary.filter(libTest => {
      const result = resultsMap[libTest.id];
      // Gap if: not tested, or tested but failed (no log captured)
      return !result || !result.logCaptured;
    }).map(libTest => ({
      ...libTest,
      result: resultsMap[libTest.id] || null
    }));
    
    // Partial detections (log captured but no alert)
    const partialDetections = validationTestLibrary.filter(libTest => {
      const result = resultsMap[libTest.id];
      return result && result.logCaptured && !result.detectionFired;
    }).map(libTest => ({
      ...libTest,
      result: resultsMap[libTest.id]
    }));

    return { sourceGaps, assessmentGaps, validationGaps, partialDetections };
  }, [sources, assessments, validationTests]);

  // Compliance mapping
  const complianceStatus = useMemo(() => {
    return complianceFrameworks.map(framework => {
      const tagValue = framework.id;
      const taggedSources = sources.filter(s => (s.tags || []).includes(tagValue));
      const collectedTagged = taggedSources.filter(s => s.status === 'collected' || s.status === 'partial').length;
      
      return {
        ...framework,
        sourcesTagged: taggedSources.length,
        sourcesCollected: collectedTagged,
        coverage: taggedSources.length > 0 ? Math.round((collectedTagged / taggedSources.length) * 100) : null
      };
    });
  }, [sources]);

  const handlePrint = () => {
    setShowReportPreview(true);
  };

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      report: activeReport,
      metrics,
      gaps,
      complianceStatus,
      sources: sources.map(s => ({
        name: s.name,
        category: s.category,
        status: s.status,
        criticalityTier: s.criticalityTier,
        tags: s.tags
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logwise-${activeReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csvContent = '';
    
    if (activeReport === 'coverage' || activeReport === 'executive') {
      // Export sources as CSV
      csvContent = 'Name,Category,Status,Criticality,Owner,Log Type,Retention,Tags\n';
      sources.forEach(s => {
        csvContent += `"${s.name || ''}","${s.category || ''}","${s.status || ''}","${s.criticalityTier || ''}","${s.ownerTeam || ''}","${s.logType || ''}","${s.retention || ''}","${(s.tags || []).join('; ')}"\n`;
      });
    } else if (activeReport === 'gap') {
      // Export gaps as CSV
      csvContent = 'Type,Name,Category,Status/Response,Details\n';
      gaps.sourceGaps.forEach(s => {
        csvContent += `"Source Gap","${s.name}","${s.category || ''}","${s.status}",""\n`;
      });
      gaps.assessmentGaps.forEach(q => {
        const response = assessments?.[q.id];
        csvContent += `"Assessment Gap","${q.question}","${q.category}","${response?.response || 'Not answered'}",""\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logwise-${activeReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPresentation = () => {
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const title = getReportTitle();
    
    // Build slides HTML
    const slides = buildPresentationSlides(activeReport, title, reportDate, metrics, gaps, sources, assessmentByCategory);
    
    // Build full HTML document
    const htmlContent = buildPresentationHTML(title, slides);

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logwise-${activeReport}-presentation-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to build presentation slides HTML
  function buildPresentationSlides(reportType, title, reportDate, metrics, gaps, sources, assessmentByCategory) {
    let slides = '';
    
    // Title slide
    slides += '<div class="slide title-slide">';
    slides += '<div class="logo">LOGWISE</div>';
    slides += '<h1>' + title + '</h1>';
    slides += '<div class="subtitle">Security Log Source Coverage Analysis</div>';
    slides += '<div class="meta">';
    slides += '<span>📅 ' + reportDate + '</span>';
    slides += '<span>📊 ' + sources.length + ' Log Sources</span>';
    slides += '<span>🎯 ' + metrics.coveragePercent + '% Coverage</span>';
    slides += '</div></div>';
    
    // Key metrics slide
    slides += '<div class="slide">';
    slides += '<div class="slide-header"><h2>Key Performance Indicators</h2>';
    slides += '<div class="subtitle">Overall security logging posture at a glance</div></div>';
    slides += '<div class="slide-content"><div class="metrics-grid">';
    
    const coverageColor = metrics.coveragePercent >= 80 ? 'green' : metrics.coveragePercent >= 50 ? 'yellow' : 'red';
    slides += '<div class="metric-card ' + coverageColor + '">';
    slides += '<div class="value">' + metrics.coveragePercent + '%</div>';
    slides += '<div class="label">Log Coverage</div></div>';
    
    const maturityColor = metrics.maturityScore >= 80 ? 'green' : metrics.maturityScore >= 50 ? 'yellow' : 'red';
    slides += '<div class="metric-card ' + maturityColor + '">';
    slides += '<div class="value">' + metrics.maturityScore + '%</div>';
    slides += '<div class="label">Maturity Score</div></div>';
    
    slides += '<div class="metric-card blue">';
    slides += '<div class="value">' + sources.length + '</div>';
    slides += '<div class="label">Total Sources</div></div>';
    
    slides += '<div class="metric-card purple">';
    slides += '<div class="value">' + metrics.collectedSources + '</div>';
    slides += '<div class="label">Collected</div></div>';
    
    slides += '</div></div>';
    slides += '<div class="slide-footer"><div class="brand">Logwise</div><div>Generated: ' + reportDate + '</div></div>';
    slides += '</div>';
    
    // Gap summary slide
    if (gaps.sourceGaps.length > 0 || gaps.assessmentGaps.length > 0) {
      slides += '<div class="slide">';
      slides += '<div class="slide-header"><h2>Coverage Gaps Summary</h2>';
      slides += '<div class="subtitle">Areas requiring attention</div></div>';
      slides += '<div class="slide-content">';
      
      slides += '<div class="callout danger">';
      slides += '<h4>⚠️ Key Gaps Identified</h4><ul>';
      if (gaps.sourceGaps.length > 0) {
        slides += '<li>' + gaps.sourceGaps.length + ' log sources not being collected</li>';
      }
      if (gaps.assessmentGaps.length > 0) {
        slides += '<li>' + gaps.assessmentGaps.length + ' assessment questions need attention</li>';
      }
      const criticalGaps = gaps.sourceGaps.filter(s => s.criticalityTier === 'critical' || s.criticalityTier === 'high');
      if (criticalGaps.length > 0) {
        slides += '<li>' + criticalGaps.length + ' high/critical priority gaps</li>';
      }
      slides += '</ul></div>';
      
      slides += '</div>';
      slides += '<div class="slide-footer"><div class="brand">Logwise</div><div>Generated: ' + reportDate + '</div></div>';
      slides += '</div>';
    }
    
    // Questions/closing slide
    slides += '<div class="slide title-slide">';
    slides += '<h1>Questions?</h1>';
    slides += '<div class="subtitle">Security Log Source Coverage Analysis</div>';
    slides += '<div style="margin-top: 60px;">';
    slides += '<div class="callout success" style="display: inline-block; text-align: left;">';
    slides += '<h4>📧 Next Steps</h4><ul>';
    slides += '<li>Review identified gaps and prioritize remediation</li>';
    slides += '<li>Schedule follow-up for blocked source resolution</li>';
    slides += '<li>Plan validation testing for untested techniques</li>';
    slides += '</ul></div></div></div>';
    
    return slides;
  }

  // Helper function to build full presentation HTML
  function buildPresentationHTML(title, slidesContent) {
    let html = '<!DOCTYPE html><html lang="en"><head>';
    html += '<meta charset="UTF-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '<title>Logwise - ' + title + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';
    html += '<style>PRESENTATION_STYLES_PLACEHOLDER</style>';
    html += '</head><body><div class="presentation">';
    html += slidesContent;
    html += '</div></body></html>';
    
    // Inject actual styles
    const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; }
    .presentation { max-width: 1280px; margin: 0 auto; padding: 40px 20px; }
    .slide { background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; padding: 60px; margin-bottom: 40px; min-height: 720px; display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(148, 163, 184, 0.1); }
    .slide::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899); }
    .slide.title-slide { justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); }
    .title-slide .logo { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; letter-spacing: 2px; }
    .title-slide h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .title-slide .subtitle { font-size: 24px; color: #94a3b8; margin-bottom: 60px; }
    .title-slide .meta { display: flex; gap: 40px; font-size: 14px; color: #64748b; }
    .slide-header { margin-bottom: 40px; }
    .slide-header h2 { font-size: 36px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .slide-header .subtitle { font-size: 16px; color: #94a3b8; }
    .slide-content { flex: 1; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px; }
    .metric-card { background: rgba(30, 41, 59, 0.8); border-radius: 16px; padding: 32px; text-align: center; border: 1px solid rgba(148, 163, 184, 0.1); position: relative; overflow: hidden; }
    .metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .metric-card.green::before { background: linear-gradient(90deg, #10b981, #059669); }
    .metric-card.yellow::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .metric-card.red::before { background: linear-gradient(90deg, #ef4444, #dc2626); }
    .metric-card.blue::before { background: linear-gradient(90deg, #3b82f6, #6366f1); }
    .metric-card.purple::before { background: linear-gradient(90deg, #8b5cf6, #a855f7); }
    .metric-card .value { font-size: 48px; font-weight: 800; line-height: 1; margin-bottom: 8px; }
    .metric-card.green .value { color: #10b981; }
    .metric-card.yellow .value { color: #f59e0b; }
    .metric-card.red .value { color: #ef4444; }
    .metric-card.blue .value { color: #3b82f6; }
    .metric-card.purple .value { color: #8b5cf6; }
    .metric-card .label { font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
    .callout { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0; }
    .callout.danger { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
    .callout.success { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); }
    .callout h4 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #f59e0b; }
    .callout.danger h4 { color: #ef4444; }
    .callout.success h4 { color: #10b981; }
    .callout ul { list-style: none; padding: 0; }
    .callout li { padding: 8px 0; padding-left: 20px; position: relative; color: #e2e8f0; font-size: 14px; }
    .callout li::before { content: '→'; position: absolute; left: 0; color: #f59e0b; }
    .callout.danger li::before { color: #ef4444; }
    .callout.success li::before { color: #10b981; }
    .slide-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(148, 163, 184, 0.1); margin-top: auto; font-size: 12px; color: #64748b; }
    .slide-footer .brand { font-weight: 600; background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    @media print { body { background: white; color: #1e293b; } .slide { break-after: page; box-shadow: none; border: 1px solid #e2e8f0; background: white; } }
    @page { size: landscape; margin: 0.5in; }
    `;
    
    return html.replace('PRESENTATION_STYLES_PLACEHOLDER', styles);
  }

  const reportTypes = [
    { 
      id: 'executive', 
      label: 'Executive Summary', 
      icon: Building2,
      description: 'High-level overview of security posture, key metrics, and strategic recommendations',
      color: 'blue'
    },
    { 
      id: 'validation', 
      label: 'Detection Validation', 
      icon: Crosshair,
      description: 'MITRE ATT&CK detection test results and coverage by tactic',
      color: 'purple'
    },
    { 
      id: 'gap', 
      label: 'Gap Analysis', 
      icon: AlertTriangle,
      description: 'Identified coverage gaps, missing sources, and remediation priorities',
      color: 'orange'
    },
    { 
      id: 'coverage', 
      label: 'Inventory Report', 
      icon: Database,
      description: 'Complete log source inventory with status and category breakdown',
      color: 'green'
    }
  ];

  const getReportTitle = () => {
    const type = reportTypes.find(r => r.id === activeReport);
    return type?.label || 'Report';
  };

  // If no report is selected, show the tile selection view
  if (!activeReport) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Reports</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select a report to generate comprehensive security coverage insights</p>
        </div>

        {/* Report Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map(type => (
            <ReportTile 
              key={type.id}
              report={type}
              metrics={metrics}
              onClick={() => setActiveReport(type.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Report Preview Modal */}
      {showReportPreview && (
        <ReportPreviewModal
          reportType={activeReport}
          reportTitle={getReportTitle()}
          metrics={metrics}
          gaps={gaps}
          sources={sources}
          assessments={assessments}
          assessmentByCategory={assessmentByCategory}
          complianceStatus={complianceStatus}
          onClose={() => setShowReportPreview(false)}
        />
      )}

      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {(() => {
                const type = reportTypes.find(r => r.id === activeReport);
                const Icon = type?.icon || FileText;
                return <Icon className="h-5 w-5 text-primary-500" />;
              })()}
              {getReportTitle()}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {reportTypes.find(r => r.id === activeReport)?.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
            title="Export as HTML Presentation"
          >
            <Presentation className="h-3.5 w-3.5" />
            Slides
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
            title="Export as CSV"
          >
            <FileDown className="h-3.5 w-3.5" />
            CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
          >
            <Printer className="h-3.5 w-3.5" />
            Generate Report
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded print:hidden"
            title="Export as JSON"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 p-6 print:shadow-none print:border-none">
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Logwise Security Report</h1>
          <p className="text-gray-600">Generated: {new Date().toLocaleString()}</p>
        </div>

        {activeReport === 'executive' && (
          <ExecutiveSummary 
            metrics={metrics} 
            assessmentByCategory={assessmentByCategory}
            gaps={gaps}
          />
        )}
        
        {activeReport === 'validation' && (
          <ValidationReport 
            metrics={metrics}
            gaps={gaps}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        
        {activeReport === 'gap' && (
          <GapAnalysis 
            gaps={gaps}
            metrics={metrics}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}

        {activeReport === 'coverage' && (
          <CoverageDetails 
            metrics={metrics}
            sources={sources}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
      </div>
    </div>
  );
}

// Report Tile Component
function ReportTile({ report, metrics, onClick }) {
  const Icon = report.icon;
  
  const colorClasses = {
    blue: {
      accent: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
      icon: 'text-cyan-600 dark:text-cyan-400',
      badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
    },
    purple: {
      accent: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-500/10 dark:bg-violet-400/10',
      icon: 'text-violet-600 dark:text-violet-400',
      badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
    },
    orange: {
      accent: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10 dark:bg-amber-400/10',
      icon: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    },
    green: {
      accent: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    }
  };

  const colors = colorClasses[report.color] || colorClasses.blue;

  // Get a preview metric for each report type
  const getPreviewMetric = () => {
    switch (report.id) {
      case 'executive':
        return { label: 'Overall Coverage', value: `${metrics.coveragePercent}%` };
      case 'validation':
        return { label: 'Detection Rate', value: `${metrics.detectionRate}%` };
      case 'gap':
        return { label: 'Open Gaps', value: metrics.notCollectedSources + metrics.blockedSources };
      case 'coverage':
        return { label: 'Total Sources', value: metrics.totalSources };
      default:
        return null;
    }
  };

  const previewMetric = getPreviewMetric();

  return (
    <button
      onClick={onClick}
      className="group relative p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-left transition-all hover:shadow-md overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${colors.accent} opacity-80`} />
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        {previewMetric && (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge}`}>
            {previewMetric.label}: {previewMetric.value}
          </span>
        )}
      </div>
      
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {report.label}
      </h3>
      
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {report.description}
      </p>
      
      <div className="mt-4 flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
        View Report
        <ChevronRight className="h-4 w-4 ml-1" />
      </div>
    </button>
  );
}

function ExecutiveSummary({ metrics, assessmentByCategory, gaps }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary-500" />
        Executive Summary
      </h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Log Coverage"
          value={`${metrics.coveragePercent}%`}
          icon={Target}
          color={metrics.coveragePercent >= 80 ? 'green' : metrics.coveragePercent >= 50 ? 'yellow' : 'red'}
        />
        <MetricCard
          label="Maturity Score"
          value={`${metrics.maturityScore}%`}
          icon={TrendingUp}
          color={metrics.maturityScore >= 80 ? 'green' : metrics.maturityScore >= 50 ? 'yellow' : 'red'}
        />
        <MetricCard
          label="Detection Rate"
          value={`${metrics.detectionRate}%`}
          icon={Shield}
          color={metrics.detectionRate >= 80 ? 'green' : metrics.detectionRate >= 50 ? 'yellow' : 'red'}
        />
        <MetricCard
          label="Active Sources"
          value={`${metrics.collectedSources}/${metrics.totalSources}`}
          icon={Activity}
          color="blue"
        />
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Source Collection Status</h4>
          <div className="space-y-2">
            <StatusBar label="Collected" value={metrics.collectedSources} total={metrics.totalSources} color="green" />
            <StatusBar label="Partial" value={metrics.partialSources} total={metrics.totalSources} color="yellow" />
            <StatusBar label="Planned" value={metrics.plannedSources} total={metrics.totalSources} color="blue" />
            <StatusBar label="Not Collected" value={metrics.notCollectedSources} total={metrics.totalSources} color="gray" />
            <StatusBar label="Blocked" value={metrics.blockedSources} total={metrics.totalSources} color="red" />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Security Assessment by Function</h4>
          <div className="space-y-2">
            {Object.entries(assessmentByCategory).map(([cat, data]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 truncate">{cat}</span>
                <span className={`font-medium ${
                  data.maxScore > 0 && (data.score / data.maxScore) >= 0.8 ? 'text-green-600' :
                  data.maxScore > 0 && (data.score / data.maxScore) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {data.maxScore > 0 ? `${Math.round((data.score / data.maxScore) * 100)}%` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      {(gaps.sourceGaps.length > 0 || gaps.assessmentGaps.length > 0 || gaps.validationGaps.length > 0) && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Priority Actions Required
          </h4>
          <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
            {gaps.sourceGaps.filter(s => s.status === 'blocked').length > 0 && (
              <li>• <strong>{gaps.sourceGaps.filter(s => s.status === 'blocked').length} blocked log sources</strong> require escalation to resolve collection issues</li>
            )}
            {gaps.sourceGaps.filter(s => s.status === 'not-collected').length > 0 && (
              <li>• <strong>{gaps.sourceGaps.filter(s => s.status === 'not-collected').length} unmonitored sources</strong> need onboarding to SIEM</li>
            )}
            {gaps.validationGaps.filter(g => !g.result).length > 0 && (
              <li>• <strong>{gaps.validationGaps.filter(g => !g.result).length} detection tests</strong> have not been executed</li>
            )}
            {gaps.partialDetections && gaps.partialDetections.length > 0 && (
              <li>• <strong>{gaps.partialDetections.length} partial detections</strong> - logs captured but no alerts configured</li>
            )}
            {Object.entries(metrics.criticalityBreakdown).map(([tier, data]) => {
              if (data.total > 0 && data.coverage < 80 && (tier === 'tier-1' || tier === 'tier-2')) {
                return <li key={tier}>• <strong>{data.label}</strong> coverage is {data.coverage}% - prioritize high-criticality sources</li>;
              }
              return null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function ValidationReport({ metrics, gaps, expandedSections, toggleSection }) {
  // Group tests by tactic for better organization
  const testsByTactic = useMemo(() => {
    const grouped = {};
    validationTestLibrary.forEach(test => {
      if (!grouped[test.tactic]) {
        grouped[test.tactic] = [];
      }
      const result = metrics.resultsMap[test.id];
      grouped[test.tactic].push({
        ...test,
        result,
        status: !result ? 'not-tested' : 
                (result.logCaptured && result.detectionFired) ? 'passed' :
                result.logCaptured ? 'partial' : 'failed'
      });
    });
    return grouped;
  }, [metrics.resultsMap]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Crosshair className="h-5 w-5 text-purple-500" />
        Detection Validation Report
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{metrics.totalLibraryTests}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Tests</div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{metrics.passedTests}</div>
          <div className="text-xs text-green-600 dark:text-green-300">Passed</div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 text-center">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{metrics.partialTests}</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-300">Partial (Log Only)</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-center">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">{metrics.failedTests}</div>
          <div className="text-xs text-red-600 dark:text-red-300">Failed</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{metrics.notTestedCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Not Tested</div>
        </div>
      </div>

      {/* Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Detection Rate</h4>
            <span className={`text-lg font-bold ${
              metrics.detectionRate >= 80 ? 'text-green-600' : 
              metrics.detectionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>{metrics.detectionRate}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                metrics.detectionRate >= 80 ? 'bg-green-500' : 
                metrics.detectionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.detectionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {metrics.passedTests} of {metrics.passedTests + metrics.partialTests + metrics.failedTests} tested scenarios have working detections
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Test Coverage</h4>
            <span className={`text-lg font-bold ${
              metrics.testCoverage >= 80 ? 'text-green-600' : 
              metrics.testCoverage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>{metrics.testCoverage}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                metrics.testCoverage >= 80 ? 'bg-green-500' : 
                metrics.testCoverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.testCoverage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {metrics.totalLibraryTests - metrics.notTestedCount} of {metrics.totalLibraryTests} tests in library have been executed
          </p>
        </div>
      </div>

      {/* Validation Coverage by Tactic */}
      <CollapsibleSection
        title="Validation Coverage by Tactic"
        icon={Activity}
        isExpanded={expandedSections['tacticCoverage'] !== false}
        onToggle={() => toggleSection('tacticCoverage')}
      >
        <div className="space-y-3">
          {Object.entries(metrics.tacticCategories).map(([tactic, data]) => {
            const testedPct = data.total > 0 ? Math.round((data.tested / data.total) * 100) : 0;
            const passedPct = data.tested > 0 ? Math.round((data.passed / data.tested) * 100) : 0;
            
            return (
              <div key={tactic} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tactic}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">{data.tested}/{data.total} tested</span>
                    <span className={`font-medium ${
                      passedPct >= 80 ? 'text-green-600' : passedPct >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{data.tested > 0 ? `${passedPct}% passing` : 'No tests run'}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${(data.passed / data.total) * 100}%` }} />
                  <div className="bg-yellow-500 h-full" style={{ width: `${(data.partial / data.total) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(data.failed / data.total) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-green-600 dark:text-green-400">● {data.passed} passed</span>
                  <span className="text-yellow-600 dark:text-yellow-400">● {data.partial} partial</span>
                  <span className="text-red-600 dark:text-red-400">● {data.failed} failed</span>
                  <span className="text-gray-500">● {data.total - data.tested} not tested</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Failed Tests - Priority Fix */}
      {gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).length > 0 && (
        <CollapsibleSection
          title={`Failed Tests - No Log Capture (${gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).length})`}
          icon={XCircle}
          isExpanded={expandedSections['failedTests']}
          onToggle={() => toggleSection('failedTests')}
        >
          <div className="space-y-2">
            {gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).map(test => (
              <div key={test.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {test.technique} • {test.tactic}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-medium">
                  Failed
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Partial Detections - Need Alert Rules */}
      {gaps.partialDetections && gaps.partialDetections.length > 0 && (
        <CollapsibleSection
          title={`Partial Detections - Need Alert Rules (${gaps.partialDetections.length})`}
          icon={AlertTriangle}
          isExpanded={expandedSections['partialTests']}
          onToggle={() => toggleSection('partialTests')}
        >
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              These tests show that logs are being captured correctly, but no detection rules are firing. 
              Consider creating SIEM alerts for these techniques.
            </p>
          </div>
          <div className="space-y-2">
            {gaps.partialDetections.map(test => (
              <div key={test.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {test.technique} • {test.tactic}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-medium">
                  Log Only
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Not Tested */}
      {gaps.validationGaps.filter(g => !g.result).length > 0 && (
        <CollapsibleSection
          title={`Not Yet Tested (${gaps.validationGaps.filter(g => !g.result).length})`}
          icon={Clock}
          isExpanded={expandedSections['notTested']}
          onToggle={() => toggleSection('notTested')}
        >
          <div className="space-y-2">
            {gaps.validationGaps.filter(g => !g.result).slice(0, 15).map(test => (
              <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {test.technique} • {test.tactic}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  Not Tested
                </span>
              </div>
            ))}
            {gaps.validationGaps.filter(g => !g.result).length > 15 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 p-2">
                ...and {gaps.validationGaps.filter(g => !g.result).length - 15} more tests not yet executed
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Passed Tests */}
      <CollapsibleSection
        title={`Passed Tests (${metrics.passedTests})`}
        icon={CheckCircle}
        isExpanded={expandedSections['passedTests']}
        onToggle={() => toggleSection('passedTests')}
      >
        {metrics.passedTests === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
            No tests have passed yet. Run validation tests to see results here.
          </div>
        ) : (
          <div className="space-y-2">
            {Object.values(testsByTactic).flat().filter(t => t.status === 'passed').map(test => (
              <div key={test.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {test.technique} • {test.tactic}
                    {test.result?.testedAt && (
                      <span className="ml-2">• Tested: {new Date(test.result.testedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">
                  Passed
                </span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

function GapAnalysis({ gaps, metrics, expandedSections, toggleSection }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        Gap Analysis Report
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">{gaps.sourceGaps.length}</div>
          <div className="text-sm text-red-600 dark:text-red-300">Source Gaps</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{gaps.assessmentGaps.length}</div>
          <div className="text-sm text-orange-600 dark:text-orange-300">Assessment Gaps</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{gaps.validationGaps.length}</div>
          <div className="text-sm text-yellow-600 dark:text-yellow-300">Validation Gaps</div>
        </div>
      </div>

      {/* Source Gaps */}
      <CollapsibleSection
        title={`Log Source Gaps (${gaps.sourceGaps.length})`}
        icon={FileWarning}
        isExpanded={expandedSections['sourceGaps']}
        onToggle={() => toggleSection('sourceGaps')}
      >
        {gaps.sourceGaps.length === 0 ? (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All log sources are being collected!
          </div>
        ) : (
          <div className="space-y-2">
            {gaps.sourceGaps.map(source => (
              <div key={source.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{source.category}</div>
                </div>
                <StatusBadge status={source.status} />
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Assessment Gaps */}
      <CollapsibleSection
        title={`Assessment Gaps (${gaps.assessmentGaps.length})`}
        icon={FileText}
        isExpanded={expandedSections['assessmentGaps']}
        onToggle={() => toggleSection('assessmentGaps')}
      >
        {gaps.assessmentGaps.length === 0 ? (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All assessment questions answered positively!
          </div>
        ) : (
          <div className="space-y-2">
            {gaps.assessmentGaps.slice(0, 10).map(q => (
              <div key={q.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="text-sm text-gray-900 dark:text-white">{q.question}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{q.category}</div>
              </div>
            ))}
            {gaps.assessmentGaps.length > 10 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ...and {gaps.assessmentGaps.length - 10} more
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Validation Gaps */}
      <CollapsibleSection
        title={`Validation Gaps (${gaps.validationGaps.length})`}
        icon={Shield}
        isExpanded={expandedSections['validationGaps']}
        onToggle={() => toggleSection('validationGaps')}
      >
        {gaps.validationGaps.length === 0 ? (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All validation tests passing!
          </div>
        ) : (
          <div className="space-y-2">
            {gaps.validationGaps.map(test => (
              <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{test.technique} - {test.tactic}</div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  test.result === 'fail' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                }`}>
                  {test.result || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

function CoverageDetails({ metrics, sources, expandedSections, toggleSection }) {
  // Group sources by status for the inventory report
  const sourcesByStatus = {
    collected: sources.filter(s => s.status === 'collected'),
    partial: sources.filter(s => s.status === 'partial'),
    planned: sources.filter(s => s.status === 'planned'),
    'not-collected': sources.filter(s => s.status === 'not-collected'),
    blocked: sources.filter(s => s.status === 'blocked'),
  };

  // Group sources by category
  const sourcesByCategory = {};
  sources.forEach(s => {
    const cat = s.category || 'Uncategorized';
    if (!sourcesByCategory[cat]) sourcesByCategory[cat] = [];
    sourcesByCategory[cat].push(s);
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-500" />
        Log Source Inventory Report
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{sourcesByStatus.collected.length}</div>
          <div className="text-xs text-green-600 dark:text-green-300">Collected</div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 text-center">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{sourcesByStatus.partial.length}</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-300">Partial</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{sourcesByStatus.planned.length}</div>
          <div className="text-xs text-blue-600 dark:text-blue-300">Planned</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">{sourcesByStatus['not-collected'].length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Not Collected</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-center">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">{sourcesByStatus.blocked.length}</div>
          <div className="text-xs text-red-600 dark:text-red-300">Blocked</div>
        </div>
      </div>

      {/* Active Log Sources (Collected + Partial) */}
      <CollapsibleSection
        title={`Active Log Sources (${sourcesByStatus.collected.length + sourcesByStatus.partial.length})`}
        icon={CheckCircle}
        isExpanded={expandedSections['activeSources'] !== false}
        onToggle={() => toggleSection('activeSources')}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Source Name</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Category</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Criticality</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Owner</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Retention</th>
              </tr>
            </thead>
            <tbody>
              {[...sourcesByStatus.collected, ...sourcesByStatus.partial].map(source => (
                <SourceTableRow key={source.id} source={source} />
              ))}
              {sourcesByStatus.collected.length + sourcesByStatus.partial.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No active log sources
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* Sources by Category */}
      <CollapsibleSection
        title="Sources by Category"
        icon={PieChart}
        isExpanded={expandedSections['byCategory']}
        onToggle={() => toggleSection('byCategory')}
      >
        <div className="space-y-4">
          {Object.entries(sourcesByCategory).sort((a, b) => b[1].length - a[1].length).map(([cat, catSources]) => {
            const collected = catSources.filter(s => s.status === 'collected' || s.status === 'partial').length;
            const coverage = catSources.length > 0 ? Math.round((collected / catSources.length) * 100) : 0;
            
            return (
              <div key={cat} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{collected}/{catSources.length}</span>
                    <span className={`text-sm font-medium ${
                      coverage >= 80 ? 'text-green-600' : coverage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{coverage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all ${
                      coverage >= 80 ? 'bg-green-500' : coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${coverage}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {catSources.map(s => (
                    <span 
                      key={s.id}
                      className={`px-2 py-0.5 text-xs rounded ${
                        s.status === 'collected' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        s.status === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        s.status === 'planned' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        s.status === 'blocked' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Coverage by Criticality */}
      <CollapsibleSection
        title="Coverage by Criticality Tier"
        icon={BarChart3}
        isExpanded={expandedSections['byCriticality']}
        onToggle={() => toggleSection('byCriticality')}
      >
        <div className="space-y-3">
          {Object.entries(metrics.criticalityBreakdown).map(([tier, data]) => (
            <div key={tier} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{data.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{data.collected}/{data.total} sources</span>
                  <span className={`text-sm font-medium ${
                    data.coverage >= 80 ? 'text-green-600' : data.coverage >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{data.coverage}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    data.coverage >= 80 ? 'bg-green-500' : data.coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${data.coverage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Full Inventory Table */}
      <CollapsibleSection
        title={`Complete Inventory (${sources.length} sources)`}
        icon={Database}
        isExpanded={expandedSections['fullInventory']}
        onToggle={() => toggleSection('fullInventory')}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Source Name</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Category</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Criticality</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Owner</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Log Type</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Retention</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Tags</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(source => (
                <SourceTableRow key={source.id} source={source} showAllColumns />
              ))}
              {sources.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No log sources in inventory
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* Validation Tactic Coverage */}
      {Object.keys(metrics.tacticCategories).length > 0 && (
        <CollapsibleSection
          title="Validation by Tactic"
          icon={Activity}
          isExpanded={expandedSections['tactics']}
          onToggle={() => toggleSection('tactics')}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(metrics.tacticCategories).map(([cat, data]) => {
              const coverage = data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0;
              return (
                <div key={cat} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">{cat}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                      <div 
                        className={`h-full ${
                          coverage >= 80 ? 'bg-green-500' : coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{data.passed}/{data.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

function SourceTableRow({ source, showAllColumns }) {
  const statusConfig = {
    collected: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    partial: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    planned: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'not-collected': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
    blocked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const criticalityLabels = {
    'tier-1': 'Tier 1',
    'tier-2': 'Tier 2',
    'tier-3': 'Tier 3',
    'tier-4': 'Tier 4',
  };

  const logTypeLabels = {
    'syslog': 'Syslog',
    'windows-event': 'Windows Event',
    'json': 'JSON',
    'cef': 'CEF',
    'leef': 'LEEF',
    'csv': 'CSV',
    'xml': 'XML',
    'netflow': 'NetFlow',
    'pcap': 'PCAP',
    'api': 'API',
    'database': 'Database',
    'file': 'Flat File',
    'cloud-native': 'Cloud Native',
  };

  const retentionLabels = {
    '7d': '7 Days',
    '14d': '14 Days',
    '30d': '30 Days',
    '60d': '60 Days',
    '90d': '90 Days',
    '180d': '6 Months',
    '365d': '1 Year',
    '730d': '2 Years',
    '1825d': '5 Years',
    '2555d': '7 Years',
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="py-2 px-2 font-medium text-gray-900 dark:text-white">{source.name}</td>
      <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{source.category || '-'}</td>
      <td className="py-2 px-2">
        <span className={`px-2 py-0.5 text-xs rounded capitalize ${statusConfig[source.status] || statusConfig['not-collected']}`}>
          {source.status?.replace('-', ' ') || 'Unknown'}
        </span>
      </td>
      <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
        {criticalityLabels[source.criticalityTier] || '-'}
      </td>
      <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{source.ownerTeam || '-'}</td>
      {showAllColumns && (
        <>
          <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
            {logTypeLabels[source.logType] || source.logType || '-'}
          </td>
          <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
            {retentionLabels[source.retention] || source.retention || '-'}
          </td>
          <td className="py-2 px-2">
            {source.tags && source.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {source.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {tag}
                  </span>
                ))}
                {source.tags.length > 2 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                    +{source.tags.length - 2}
                  </span>
                )}
              </div>
            ) : '-'}
          </td>
        </>
      )}
      {!showAllColumns && (
        <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
          {retentionLabels[source.retention] || source.retention || '-'}
        </td>
      )}
    </tr>
  );
}

// Helper Components
function MetricCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  };

  return (
    <div className={`p-4 rounded border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusBar({ label, value, total, color }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-400',
    red: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 dark:text-gray-400 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
        <div className={`h-full ${colorClasses[color]}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    collected: { label: 'Collected', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    partial: { label: 'Partial', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    planned: { label: 'Planned', class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    'not-collected': { label: 'Not Collected', class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400' },
    blocked: { label: 'Blocked', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  };

  const c = config[status] || config['not-collected'];
  return <span className={`px-2 py-0.5 text-xs rounded ${c.class}`}>{c.label}</span>;
}

function CollapsibleSection({ title, icon: Icon, isExpanded, onToggle, children }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{title}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

// Report Preview Modal - Generates professional formatted reports
function ReportPreviewModal({ 
  reportType, 
  reportTitle, 
  metrics, 
  gaps, 
  sources, 
  assessments,
  assessmentByCategory, 
  complianceStatus, 
  onClose 
}) {
  const reportRef = useRef(null);
  const generatedDate = new Date().toLocaleString();
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    const printContent = reportRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logwise - ${reportTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: #f8fafc;
          }
          
          .report-container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          
          /* Header with gradient */
          .report-header {
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            color: white;
            padding: 40px;
            position: relative;
            overflow: hidden;
          }
          
          .report-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 400px;
            height: 400px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
          }
          
          .report-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }
          
          .report-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          
          .report-header .subtitle {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 500;
            position: relative;
            z-index: 1;
          }
          
          .report-header .meta {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
            display: flex;
            gap: 30px;
            font-size: 13px;
            opacity: 0.85;
            position: relative;
            z-index: 1;
          }
          
          .report-body {
            padding: 40px;
          }
          
          /* Section styling */
          .section {
            margin-bottom: 35px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .section-title .icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
          }
          
          /* Enhanced metric cards */
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          
          .metric-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
          }
          
          .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #06b6d4, #8b5cf6);
          }
          
          .metric-card.green::before { background: linear-gradient(90deg, #10b981, #059669); }
          .metric-card.yellow::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
          .metric-card.red::before { background: linear-gradient(90deg, #ef4444, #dc2626); }
          .metric-card.blue::before { background: linear-gradient(90deg, #3b82f6, #2563eb); }
          
          .metric-card .value {
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
          }
          
          .metric-card.green .value { background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; background-clip: text; }
          .metric-card.yellow .value { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); -webkit-background-clip: text; background-clip: text; }
          .metric-card.red .value { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); -webkit-background-clip: text; background-clip: text; }
          .metric-card.blue .value { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; background-clip: text; }
          
          .metric-card .label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
          }
          
          /* Enhanced tables */
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 13px;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          
          th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 14px 16px;
            text-align: left;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
          }
          
          tr:last-child td { border-bottom: none; }
          tr:nth-child(even) { background: #fafbfc; }
          
          /* Status badges */
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .status-badge::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }
          
          .status-collected { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #047857; }
          .status-collected::before { background: #059669; }
          .status-partial { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #b45309; }
          .status-partial::before { background: #d97706; }
          .status-planned { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1d4ed8; }
          .status-planned::before { background: #2563eb; }
          .status-not-collected { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #475569; }
          .status-not-collected::before { background: #64748b; }
          .status-blocked { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #b91c1c; }
          .status-blocked::before { background: #dc2626; }
          
          /* Findings box */
          .finding-box {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 25px 0;
            position: relative;
          }
          
          .finding-box::before {
            content: '⚠️';
            position: absolute;
            top: -12px;
            left: 20px;
            background: white;
            padding: 0 8px;
            font-size: 20px;
          }
          
          .finding-box h4 {
            font-size: 14px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 12px;
          }
          
          .finding-box ul {
            list-style: none;
            padding: 0;
          }
          
          .finding-box li {
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
            font-size: 13px;
            color: #78350f;
            border-bottom: 1px solid rgba(252, 211, 77, 0.3);
          }
          
          .finding-box li:last-child { border-bottom: none; }
          
          .finding-box li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #d97706;
            font-weight: bold;
          }
          
          /* Progress bars */
          .progress-bar {
            height: 10px;
            background: #e2e8f0;
            border-radius: 5px;
            overflow: hidden;
          }
          
          .progress-bar .fill {
            height: 100%;
            border-radius: 5px;
            transition: width 0.3s ease;
          }
          
          .progress-bar .fill.green { background: linear-gradient(90deg, #10b981, #059669); }
          .progress-bar .fill.yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
          .progress-bar .fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }
          .progress-bar .fill.blue { background: linear-gradient(90deg, #3b82f6, #2563eb); }
          .progress-bar .fill.gray { background: linear-gradient(90deg, #94a3b8, #64748b); }
          
          /* Footer */
          .report-footer {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 25px 40px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #64748b;
          }
          
          .report-footer .brand {
            font-weight: 600;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          /* Summary cards for gap analysis */
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          
          .summary-card {
            padding: 24px;
            border-radius: 12px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .summary-card.red {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fecaca;
          }
          
          .summary-card.yellow {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fde68a;
          }
          
          .summary-card .number {
            font-size: 42px;
            font-weight: 700;
            line-height: 1;
          }
          
          .summary-card.red .number { color: #dc2626; }
          .summary-card.yellow .number { color: #d97706; }
          
          .summary-card .desc {
            font-size: 13px;
            font-weight: 500;
            margin-top: 8px;
          }
          
          .summary-card.red .desc { color: #991b1b; }
          .summary-card.yellow .desc { color: #92400e; }
          
          @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getStatusClass = (status) => {
    const classes = {
      collected: 'status-collected',
      partial: 'status-partial',
      planned: 'status-planned',
      'not-collected': 'status-not-collected',
      blocked: 'status-blocked',
    };
    return classes[status] || 'status-not-collected';
  };

  const criticalityLabels = {
    'tier-1': 'Tier 1 - Critical',
    'tier-2': 'Tier 2 - High',
    'tier-3': 'Tier 3 - Medium',
    'tier-4': 'Tier 4 - Low',
  };

  const getGradeLabel = (percent) => {
    if (percent >= 90) return 'Excellent';
    if (percent >= 80) return 'Good';
    if (percent >= 70) return 'Fair';
    if (percent >= 50) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{reportTitle}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Preview and print your professionally formatted report</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-lg text-sm font-medium shadow-lg shadow-cyan-500/25"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          {/* Inline styles for preview */}
          <style dangerouslySetInnerHTML={{ __html: `
            .report-container {
              max-width: 850px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1e293b;
            }
            .report-header {
              background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
              color: white;
              padding: 40px;
              position: relative;
              overflow: hidden;
            }
            .report-header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -20%;
              width: 400px;
              height: 400px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
            }
            .report-header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 8px;
              position: relative;
              z-index: 1;
            }
            .report-header .subtitle {
              font-size: 18px;
              opacity: 0.9;
              font-weight: 500;
              position: relative;
              z-index: 1;
            }
            .report-header .meta {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.2);
              display: flex;
              gap: 30px;
              font-size: 13px;
              opacity: 0.85;
              position: relative;
              z-index: 1;
            }
            .report-body {
              padding: 40px;
            }
            .section {
              margin-bottom: 35px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e2e8f0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .section-title .icon {
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 30px;
            }
            .metric-card {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              border: 1px solid #e2e8f0;
              position: relative;
              overflow: hidden;
            }
            .metric-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #06b6d4, #8b5cf6);
            }
            .metric-card.green::before { background: linear-gradient(90deg, #10b981, #059669); }
            .metric-card.yellow::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
            .metric-card.red::before { background: linear-gradient(90deg, #ef4444, #dc2626); }
            .metric-card.blue::before { background: linear-gradient(90deg, #3b82f6, #2563eb); }
            .metric-card .value {
              font-size: 36px;
              font-weight: 700;
              background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              line-height: 1.2;
            }
            .metric-card.green .value { background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
            .metric-card.yellow .value { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
            .metric-card.red .value { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
            .metric-card.blue .value { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
            .metric-card .label {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 8px;
            }
            .report-container table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              font-size: 13px;
              margin-bottom: 20px;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }
            .report-container th {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 14px 16px;
              text-align: left;
              font-weight: 600;
              color: #475569;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #e2e8f0;
            }
            .report-container td {
              padding: 12px 16px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
            }
            .report-container tr:last-child td { border-bottom: none; }
            .report-container tr:nth-child(even) { background: #fafbfc; }
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            .status-collected { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #047857; }
            .status-partial { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #b45309; }
            .status-planned { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1d4ed8; }
            .status-not-collected { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #475569; }
            .status-blocked { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #b91c1c; }
            .finding-box {
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              border: 1px solid #fcd34d;
              border-radius: 12px;
              padding: 20px 24px;
              margin: 25px 0;
              position: relative;
            }
            .finding-box h4 {
              font-size: 14px;
              font-weight: 600;
              color: #92400e;
              margin-bottom: 12px;
            }
            .finding-box ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .finding-box li {
              padding: 8px 0;
              padding-left: 24px;
              position: relative;
              font-size: 13px;
              color: #78350f;
              border-bottom: 1px solid rgba(252, 211, 77, 0.3);
            }
            .finding-box li:last-child { border-bottom: none; }
            .finding-box li::before {
              content: '→';
              position: absolute;
              left: 0;
              color: #d97706;
              font-weight: bold;
            }
            .progress-bar {
              height: 10px;
              background: #e2e8f0;
              border-radius: 5px;
              overflow: hidden;
            }
            .progress-bar .fill {
              height: 100%;
              border-radius: 5px;
            }
            .progress-bar .fill.green { background: linear-gradient(90deg, #10b981, #059669); }
            .progress-bar .fill.yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
            .progress-bar .fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }
            .progress-bar .fill.blue { background: linear-gradient(90deg, #3b82f6, #2563eb); }
            .progress-bar .fill.gray { background: linear-gradient(90deg, #94a3b8, #64748b); }
            .report-footer {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 25px 40px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #64748b;
            }
            .report-footer .brand {
              font-weight: 600;
              background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 30px;
            }
            .summary-card {
              padding: 24px;
              border-radius: 12px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .summary-card.red {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              border: 1px solid #fecaca;
            }
            .summary-card.yellow {
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              border: 1px solid #fde68a;
            }
            .summary-card.green {
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
              border: 1px solid #bbf7d0;
            }
            .summary-card .number {
              font-size: 42px;
              font-weight: 700;
              line-height: 1;
            }
            .summary-card.red .number { color: #dc2626; }
            .summary-card.yellow .number { color: #d97706; }
            .summary-card.green .number { color: #16a34a; }
            .summary-card .desc {
              font-size: 13px;
              font-weight: 500;
              margin-top: 8px;
            }
            .summary-card.red .desc { color: #991b1b; }
            .summary-card.yellow .desc { color: #92400e; }
            .summary-card.green .desc { color: #166534; }
          `}} />
          <div ref={reportRef} className="report-container">
            {/* Report Header */}
            <div className="report-header">
              <h1>Logwise Security Report</h1>
              <div className="subtitle">{reportTitle}</div>
              <div className="meta">
                <span>📅 {reportDate}</span>
                <span>📊 {sources.length} Log Sources</span>
                <span>🎯 {metrics.coveragePercent}% Coverage</span>
              </div>
            </div>

            <div className="report-body">
              {/* Executive Summary Report */}
              {reportType === 'executive' && (
                <>
                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📈</span>
                      Key Performance Indicators
                    </div>
                    <div className="metrics-grid">
                      <div className={`metric-card ${metrics.coveragePercent >= 80 ? 'green' : metrics.coveragePercent >= 50 ? 'yellow' : 'red'}`}>
                        <div className="value">{metrics.coveragePercent}%</div>
                        <div className="label">Log Coverage</div>
                      </div>
                      <div className={`metric-card ${metrics.maturityScore >= 80 ? 'green' : metrics.maturityScore >= 50 ? 'yellow' : 'red'}`}>
                        <div className="value">{metrics.maturityScore}%</div>
                        <div className="label">Maturity Score</div>
                      </div>
                      <div className={`metric-card ${metrics.detectionRate >= 80 ? 'green' : metrics.detectionRate >= 50 ? 'yellow' : 'red'}`}>
                        <div className="value">{metrics.detectionRate}%</div>
                        <div className="label">Detection Rate</div>
                      </div>
                      <div className="metric-card blue">
                        <div className="value">{metrics.collectedSources}/{metrics.totalSources}</div>
                        <div className="label">Active Sources</div>
                      </div>
                    </div>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📊</span>
                      Source Status Distribution
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Percentage</th>
                          <th style={{ width: '40%' }}>Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: 'Collected', count: metrics.collectedSources, color: 'green' },
                          { label: 'Partial', count: metrics.partialSources, color: 'yellow' },
                          { label: 'Planned', count: metrics.plannedSources, color: 'blue' },
                          { label: 'Not Collected', count: metrics.notCollectedSources, color: 'gray' },
                          { label: 'Blocked', count: metrics.blockedSources, color: 'red' },
                        ].map(row => (
                          <tr key={row.label}>
                            <td style={{ fontWeight: 500 }}>{row.label}</td>
                            <td>{row.count}</td>
                            <td>{metrics.totalSources > 0 ? Math.round((row.count / metrics.totalSources) * 100) : 0}%</td>
                            <td>
                              <div className="progress-bar">
                                <div 
                                  className={`fill ${row.color}`}
                                  style={{ width: `${metrics.totalSources > 0 ? (row.count / metrics.totalSources) * 100 : 0}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">✅</span>
                      Assessment Scores by Category
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Score</th>
                          <th>Grade</th>
                          <th style={{ width: '40%' }}>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(assessmentByCategory).map(([cat, data]) => {
                          const percent = data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0;
                          return (
                            <tr key={cat}>
                              <td style={{ fontWeight: 500 }}>{cat}</td>
                              <td>{percent}%</td>
                              <td>
                                <span style={{ 
                                  color: percent >= 80 ? '#059669' : percent >= 50 ? '#d97706' : '#dc2626',
                                  fontWeight: 600
                                }}>
                                  {getGradeLabel(percent)}
                                </span>
                              </td>
                              <td>
                                <div className="progress-bar">
                                  <div 
                                    className={`fill ${percent >= 80 ? 'green' : percent >= 50 ? 'yellow' : 'red'}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {(gaps.sourceGaps.length > 0 || gaps.assessmentGaps.length > 0 || gaps.validationGaps.length > 0) && (
                    <div className="finding-box">
                      <h4>Key Findings & Recommendations</h4>
                      <ul>
                        {gaps.sourceGaps.length > 0 && (
                          <li><strong>{gaps.sourceGaps.length} log sources</strong> are not yet collecting data and require immediate attention</li>
                        )}
                        {gaps.assessmentGaps.length > 0 && (
                          <li><strong>{gaps.assessmentGaps.length} assessment questions</strong> have been identified as gaps in your security posture</li>
                        )}
                        {gaps.validationGaps.length > 0 && (
                          <li><strong>{gaps.validationGaps.length} validation tests</strong> have failed or are pending review</li>
                        )}
                        {Object.entries(metrics.criticalityBreakdown).map(([tier, data]) => {
                          if (data.total > 0 && data.coverage < 80) {
                            return <li key={tier}><strong>{data.label}</strong> coverage is at {data.coverage}%, below the recommended 80% target</li>;
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Gap Analysis Report */}
              {reportType === 'gap' && (
                <>
                  <div className="section">
                    <div className="section-title">
                      <span className="icon">🔍</span>
                      Gap Summary Overview
                    </div>
                    <div className="summary-cards">
                      <div className="summary-card red">
                        <div className="number">{gaps.sourceGaps.length}</div>
                        <div className="desc">Source Gaps</div>
                      </div>
                      <div className="summary-card yellow">
                        <div className="number">{gaps.assessmentGaps.length}</div>
                        <div className="desc">Assessment Gaps</div>
                      </div>
                      <div className="summary-card yellow">
                        <div className="number">{gaps.validationGaps.length}</div>
                        <div className="desc">Validation Gaps</div>
                      </div>
                    </div>
                  </div>

                  {gaps.sourceGaps.length > 0 && (
                    <div className="section">
                      <div className="section-title">
                        <span className="icon">📁</span>
                        Log Source Gaps ({gaps.sourceGaps.length})
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>Source Name</th>
                            <th>Category</th>
                            <th>Current Status</th>
                            <th>Criticality</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gaps.sourceGaps.map(source => (
                            <tr key={source.id}>
                              <td style={{ fontWeight: 500 }}>{source.name}</td>
                              <td>{source.category || '-'}</td>
                              <td><span className={`status-badge ${getStatusClass(source.status)}`}>{source.status?.replace('-', ' ')}</span></td>
                              <td>{criticalityLabels[source.criticalityTier] || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {gaps.assessmentGaps.length > 0 && (
                    <div className="section">
                      <div className="section-title">
                        <span className="icon">📋</span>
                        Assessment Gaps ({gaps.assessmentGaps.length})
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Category</th>
                            <th>Current Response</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gaps.assessmentGaps.slice(0, 20).map(q => {
                            const response = assessments?.[q.id];
                            return (
                              <tr key={q.id}>
                                <td>{q.question}</td>
                                <td>{q.category}</td>
                                <td style={{ fontWeight: 500, color: '#dc2626' }}>{response?.response || 'Not answered'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {gaps.assessmentGaps.length > 20 && (
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '15px', fontStyle: 'italic' }}>
                          📝 {gaps.assessmentGaps.length - 20} additional assessment gaps not shown in this summary
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Inventory Report */}
              {reportType === 'coverage' && (
                <>
                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📦</span>
                      Inventory Status Summary
                    </div>
                    <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                      <div className="metric-card green">
                        <div className="value">{sources.filter(s => s.status === 'collected').length}</div>
                        <div className="label">Collected</div>
                      </div>
                      <div className="metric-card yellow">
                        <div className="value">{sources.filter(s => s.status === 'partial').length}</div>
                        <div className="label">Partial</div>
                      </div>
                      <div className="metric-card blue">
                        <div className="value">{sources.filter(s => s.status === 'planned').length}</div>
                        <div className="label">Planned</div>
                      </div>
                      <div className="metric-card">
                        <div className="value" style={{ color: '#64748b' }}>{sources.filter(s => s.status === 'not-collected').length}</div>
                        <div className="label">Not Collected</div>
                      </div>
                      <div className="metric-card red">
                        <div className="value">{sources.filter(s => s.status === 'blocked').length}</div>
                        <div className="label">Blocked</div>
                      </div>
                    </div>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📊</span>
                      Coverage by Category
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Total</th>
                          <th>Collecting</th>
                          <th>Coverage</th>
                          <th style={{ width: '30%' }}>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metrics.categoryBreakdown).sort((a, b) => b[1].total - a[1].total).map(([cat, data]) => {
                          const collecting = data.collected + data.partial;
                          const coverage = data.total > 0 ? Math.round((collecting / data.total) * 100) : 0;
                          return (
                            <tr key={cat}>
                              <td style={{ fontWeight: 500 }}>{cat}</td>
                              <td>{data.total}</td>
                              <td>{collecting}</td>
                              <td>
                                <span style={{ 
                                  color: coverage >= 80 ? '#059669' : coverage >= 50 ? '#d97706' : '#dc2626',
                                  fontWeight: 600
                                }}>
                                  {coverage}%
                                </span>
                              </td>
                              <td>
                                <div className="progress-bar">
                                  <div 
                                    className={`fill ${coverage >= 80 ? 'green' : coverage >= 50 ? 'yellow' : 'red'}`}
                                    style={{ width: `${coverage}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📋</span>
                      Complete Log Source Inventory ({sources.length} sources)
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Source Name</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Criticality</th>
                          <th>Owner</th>
                          <th>Retention</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sources.map(source => (
                          <tr key={source.id}>
                            <td style={{ fontWeight: 500 }}>{source.name}</td>
                            <td>{source.category || '-'}</td>
                            <td><span className={`status-badge ${getStatusClass(source.status)}`}>{source.status?.replace('-', ' ')}</span></td>
                            <td>{criticalityLabels[source.criticalityTier]?.split(' - ')[0] || '-'}</td>
                            <td>{source.ownerTeam || '-'}</td>
                            <td>{source.retention || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Validation Report */}
              {reportType === 'validation' && (
                <>
                  <div className="section">
                    <div className="section-title">
                      <span className="icon">🎯</span>
                      Detection Validation Summary
                    </div>
                    <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                      <div className="metric-card">
                        <div className="value" style={{ color: '#475569' }}>{metrics.totalLibraryTests}</div>
                        <div className="label">Total Tests</div>
                      </div>
                      <div className="metric-card green">
                        <div className="value">{metrics.passedTests}</div>
                        <div className="label">Passed</div>
                      </div>
                      <div className="metric-card yellow">
                        <div className="value">{metrics.partialTests}</div>
                        <div className="label">Partial</div>
                      </div>
                      <div className="metric-card red">
                        <div className="value">{metrics.failedTests}</div>
                        <div className="label">Failed</div>
                      </div>
                      <div className="metric-card">
                        <div className="value" style={{ color: '#94a3b8' }}>{metrics.notTestedCount}</div>
                        <div className="label">Not Tested</div>
                      </div>
                    </div>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">📊</span>
                      Detection Performance Metrics
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 500, color: '#475569' }}>Detection Rate</span>
                          <span style={{ 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: metrics.detectionRate >= 80 ? '#059669' : metrics.detectionRate >= 50 ? '#d97706' : '#dc2626'
                          }}>{metrics.detectionRate}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`fill ${metrics.detectionRate >= 80 ? 'green' : metrics.detectionRate >= 50 ? 'yellow' : 'red'}`}
                            style={{ width: `${metrics.detectionRate}%` }}
                          />
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                          Percentage of tested scenarios with working detections
                        </p>
                      </div>
                      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 500, color: '#475569' }}>Test Coverage</span>
                          <span style={{ 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: metrics.testCoverage >= 80 ? '#059669' : metrics.testCoverage >= 50 ? '#d97706' : '#dc2626'
                          }}>{metrics.testCoverage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`fill ${metrics.testCoverage >= 80 ? 'green' : metrics.testCoverage >= 50 ? 'yellow' : 'red'}`}
                            style={{ width: `${metrics.testCoverage}%` }}
                          />
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                          Percentage of test library that has been executed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="section">
                    <div className="section-title">
                      <span className="icon">�</span>
                      Validation Coverage by Tactic
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Tactic</th>
                          <th>Passed</th>
                          <th>Partial</th>
                          <th>Failed</th>
                          <th>Not Tested</th>
                          <th style={{ width: '25%' }}>Detection Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metrics.tacticCategories || {}).map(([tactic, data]) => {
                          const detectionPct = data.tested > 0 ? Math.round((data.passed / data.tested) * 100) : 0;
                          return (
                            <tr key={tactic}>
                              <td style={{ fontWeight: 500 }}>{tactic}</td>
                              <td style={{ color: '#059669', fontWeight: 500 }}>{data.passed}</td>
                              <td style={{ color: '#d97706', fontWeight: 500 }}>{data.partial}</td>
                              <td style={{ color: '#dc2626', fontWeight: 500 }}>{data.failed}</td>
                              <td style={{ color: '#64748b' }}>{data.total - data.tested}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="progress-bar" style={{ flex: 1 }}>
                                    <div 
                                      className={`fill ${detectionPct >= 80 ? 'green' : detectionPct >= 50 ? 'yellow' : 'red'}`}
                                      style={{ width: `${detectionPct}%` }}
                                    />
                                  </div>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 600,
                                    color: data.tested === 0 ? '#94a3b8' : detectionPct >= 80 ? '#059669' : detectionPct >= 50 ? '#d97706' : '#dc2626',
                                    minWidth: '35px'
                                  }}>
                                    {data.tested > 0 ? `${detectionPct}%` : '-'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Failed Tests Section */}
                  {gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).length > 0 && (
                    <div className="section">
                      <div className="section-title">
                        <span className="icon">❌</span>
                        Failed Tests - No Log Capture ({gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).length})
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Technique</th>
                            <th>Tactic</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gaps.validationGaps.filter(g => g.result && !g.result.logCaptured).map(test => (
                            <tr key={test.id}>
                              <td style={{ fontWeight: 500 }}>{test.name}</td>
                              <td>{test.technique}</td>
                              <td>{test.tactic}</td>
                              <td><span className="status-badge status-blocked">Failed</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Partial Detections Section */}
                  {gaps.partialDetections && gaps.partialDetections.length > 0 && (
                    <div className="section">
                      <div className="section-title">
                        <span className="icon">⚠️</span>
                        Partial Detections - Need Alert Rules ({gaps.partialDetections.length})
                      </div>
                      <div className="finding-box">
                        <h4>Action Required</h4>
                        <ul>
                          <li>These tests captured logs successfully but no SIEM alerts are configured</li>
                          <li>Consider creating detection rules for these techniques</li>
                        </ul>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Technique</th>
                            <th>Tactic</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gaps.partialDetections.map(test => (
                            <tr key={test.id}>
                              <td style={{ fontWeight: 500 }}>{test.name}</td>
                              <td>{test.technique}</td>
                              <td>{test.tactic}</td>
                              <td><span className="status-badge status-partial">Log Only</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Passed Tests Section */}
                  {metrics.passedTests > 0 && (
                    <div className="section">
                      <div className="section-title">
                        <span className="icon">✅</span>
                        Passed Tests ({metrics.passedTests})
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Technique</th>
                            <th>Tactic</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationTestLibrary.filter(test => {
                            const result = metrics.resultsMap[test.id];
                            return result && result.logCaptured && result.detectionFired;
                          }).map(test => (
                            <tr key={test.id}>
                              <td style={{ fontWeight: 500 }}>{test.name}</td>
                              <td>{test.technique}</td>
                              <td>{test.tactic}</td>
                              <td><span className="status-badge status-collected">Passed</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Report Footer */}
            <div className="report-footer">
              <div><span className="brand">Logwise</span> Security Log Source Tracker</div>
              <div>Generated: {generatedDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
