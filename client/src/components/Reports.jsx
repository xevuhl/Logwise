import { useState, useMemo } from 'react';
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
  Database
} from 'lucide-react';
import { 
  assessmentQuestions, 
  complianceFrameworks, 
  statusOptions,
  criticalityTierOptions,
  defaultTagOptions 
} from '../constants';

function Reports({ sources, assessments, validationTests }) {
  const [activeReport, setActiveReport] = useState('executive');
  const [expandedSections, setExpandedSections] = useState({});

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

    // Validation test results
    const tests = validationTests || [];
    const passedTests = tests.filter(t => t.result === 'pass').length;
    const failedTests = tests.filter(t => t.result === 'fail').length;
    const pendingTests = tests.filter(t => t.result === 'pending' || !t.result).length;
    const detectionRate = tests.length > 0 ? Math.round((passedTests / tests.length) * 100) : 0;

    // MITRE coverage
    const mitreCategories = {};
    tests.forEach(t => {
      if (t.mitreCategory) {
        if (!mitreCategories[t.mitreCategory]) {
          mitreCategories[t.mitreCategory] = { total: 0, passed: 0 };
        }
        mitreCategories[t.mitreCategory].total++;
        if (t.result === 'pass') mitreCategories[t.mitreCategory].passed++;
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
      passedTests,
      failedTests,
      pendingTests,
      detectionRate,
      mitreCategories
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

    const validationGaps = (validationTests || []).filter(t => 
      t.result === 'fail' || t.result === 'pending' || !t.result
    );

    return { sourceGaps, assessmentGaps, validationGaps };
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
    window.print();
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

  const reportTypes = [
    { id: 'executive', label: 'Executive Summary', icon: Building2 },
    { id: 'gap', label: 'Gap Analysis', icon: AlertTriangle },
    { id: 'compliance', label: 'Compliance Mapping', icon: Shield },
    { id: 'coverage', label: 'Inventory Report', icon: Database }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reports</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Generate comprehensive security coverage reports</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors print:hidden"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 print:hidden">
        {reportTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveReport(type.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeReport === type.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <type.icon className="h-4 w-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:shadow-none print:border-none">
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
        
        {activeReport === 'gap' && (
          <GapAnalysis 
            gaps={gaps}
            metrics={metrics}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        
        {activeReport === 'compliance' && (
          <ComplianceMapping 
            complianceStatus={complianceStatus}
            sources={sources}
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
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Source Status Distribution</h4>
          <div className="space-y-2">
            <StatusBar label="Collected" value={metrics.collectedSources} total={metrics.totalSources} color="green" />
            <StatusBar label="Partial" value={metrics.partialSources} total={metrics.totalSources} color="yellow" />
            <StatusBar label="Planned" value={metrics.plannedSources} total={metrics.totalSources} color="blue" />
            <StatusBar label="Not Collected" value={metrics.notCollectedSources} total={metrics.totalSources} color="gray" />
            <StatusBar label="Blocked" value={metrics.blockedSources} total={metrics.totalSources} color="red" />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Assessment by Category</h4>
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

      {/* Key Findings */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Key Findings
        </h4>
        <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
          {gaps.sourceGaps.length > 0 && (
            <li>• {gaps.sourceGaps.length} log sources not yet collecting data</li>
          )}
          {gaps.assessmentGaps.length > 0 && (
            <li>• {gaps.assessmentGaps.length} assessment questions need attention</li>
          )}
          {gaps.validationGaps.length > 0 && (
            <li>• {gaps.validationGaps.length} validation tests failed or pending</li>
          )}
          {Object.entries(metrics.criticalityBreakdown).map(([tier, data]) => {
            if (data.total > 0 && data.coverage < 80) {
              return <li key={tier}>• {data.label} coverage at {data.coverage}% (below 80% target)</li>;
            }
            return null;
          })}
        </ul>
      </div>
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">{test.mitreId} - {test.mitreCategory}</div>
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

function ComplianceMapping({ complianceStatus, sources, expandedSections, toggleSection }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Shield className="h-5 w-5 text-purple-500" />
        Compliance Mapping
      </h3>

      <div className="space-y-4">
        {complianceStatus.map(framework => (
          <CollapsibleSection
            key={framework.id}
            title={
              <div className="flex items-center justify-between w-full">
                <span>{framework.name} - {framework.description}</span>
                {framework.coverage !== null && (
                  <span className={`px-2 py-0.5 text-xs rounded ml-2 ${
                    framework.coverage >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    framework.coverage >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {framework.coverage}% coverage
                  </span>
                )}
              </div>
            }
            icon={Lock}
            isExpanded={expandedSections[framework.id]}
            onToggle={() => toggleSection(framework.id)}
          >
            <div className="space-y-3">
              {/* Framework Stats */}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tagged Sources:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{framework.sourcesTagged}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Collecting:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{framework.sourcesCollected}</span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements:</div>
                <div className="space-y-1">
                  {framework.requirements.map(req => (
                    <div key={req.id} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{req.name}:</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">{req.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagged Sources List */}
              {framework.sourcesTagged > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Tagged Sources:</div>
                  <div className="flex flex-wrap gap-1">
                    {sources
                      .filter(s => (s.tags || []).includes(framework.id))
                      .map(s => (
                        <span 
                          key={s.id} 
                          className={`px-2 py-0.5 text-xs rounded ${
                            s.status === 'collected' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            s.status === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {s.name}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        ))}
      </div>
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

      {/* MITRE ATT&CK Coverage */}
      {Object.keys(metrics.mitreCategories).length > 0 && (
        <CollapsibleSection
          title="MITRE ATT&CK Coverage"
          icon={Shield}
          isExpanded={expandedSections['mitre']}
          onToggle={() => toggleSection('mitre')}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(metrics.mitreCategories).map(([cat, data]) => {
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

export default Reports;
