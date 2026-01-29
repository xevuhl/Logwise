import { useState, useMemo } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Target,
  Shield,
  Calendar,
  RefreshCw,
  FileText,
  X,
  FolderOpen,
  Trash2,
  Edit3,
  History,
  Link,
  Paperclip,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Terminal,
  Bell,
  BookOpen,
  Code,
  Copy,
  CheckCheck,
  Database
} from 'lucide-react';
import { validationTestLibrary, mitreTactics, techniqueToDataSources, mitreDataSources, categoryToDataSources } from '../constants';
import { validationAPI } from '../api';

function Validation({ validationTests, onSaveResult, sources, campaigns, onCreateCampaign, onUpdateCampaign, onDeleteCampaign }) {
  const [search, setSearch] = useState('');
  const [tacticFilter, setTacticFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTest, setExpandedTest] = useState(null);
  const [showRunModal, setShowRunModal] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Get unique tactics
  const tactics = [...new Set(validationTestLibrary.map(t => t.tactic))];

  // Calculate which data sources are provided by collected log sources
  const providedDataSources = useMemo(() => {
    const provided = new Set();
    (sources || [])
      .filter(s => s.status === 'collected' || s.status === 'partial')
      .forEach(source => {
        const categoryDS = categoryToDataSources[source.category] || [];
        categoryDS.forEach(ds => provided.add(ds));
      });
    return provided;
  }, [sources]);

  // Helper to get technique data source coverage
  const getTechniqueCoverage = (technique) => {
    const requiredDS = techniqueToDataSources[technique] || [];
    if (requiredDS.length === 0) return { covered: [], missing: [], percentage: 0 };
    
    const covered = requiredDS.filter(ds => providedDataSources.has(ds));
    const missing = requiredDS.filter(ds => !providedDataSources.has(ds));
    const percentage = Math.round((covered.length / requiredDS.length) * 100);
    
    return { covered, missing, percentage };
  };

  // Filter tests by campaign
  const campaignTests = useMemo(() => {
    if (selectedCampaign === 'all') {
      return validationTests;
    }
    return validationTests.filter(t => t.campaignId === selectedCampaign);
  }, [validationTests, selectedCampaign]);

  // Merge library with test results
  const testsWithResults = useMemo(() => {
    return validationTestLibrary.map(test => {
      const result = campaignTests.find(r => r.testId === test.id);
      const coverage = getTechniqueCoverage(test.technique);
      return {
        ...test,
        result: result || null,
        dataSourceCoverage: coverage,
      };
    });
  }, [campaignTests, providedDataSources]);

  // Filter tests
  const filteredTests = useMemo(() => {
    return testsWithResults.filter(test => {
      const matchesSearch = !search ||
        test.name.toLowerCase().includes(search.toLowerCase()) ||
        test.technique.toLowerCase().includes(search.toLowerCase()) ||
        test.techniqueName.toLowerCase().includes(search.toLowerCase());
      
      const matchesTactic = tacticFilter === 'all' || test.tactic === tacticFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'passed') matchesStatus = test.result?.logCaptured && test.result?.detectionFired;
      if (statusFilter === 'partial') matchesStatus = test.result?.logCaptured && !test.result?.detectionFired;
      if (statusFilter === 'failed') matchesStatus = test.result && !test.result?.logCaptured;
      if (statusFilter === 'not-tested') matchesStatus = !test.result;
      
      return matchesSearch && matchesTactic && matchesStatus;
    });
  }, [testsWithResults, search, tacticFilter, statusFilter]);

  // Group by tactic
  const groupedTests = useMemo(() => {
    const groups = {};
    filteredTests.forEach(test => {
      if (!groups[test.tactic]) groups[test.tactic] = [];
      groups[test.tactic].push(test);
    });
    return groups;
  }, [filteredTests]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = validationTestLibrary.length;
    const tested = campaignTests.length;
    const passed = campaignTests.filter(t => t.logCaptured && t.detectionFired).length;
    const partial = campaignTests.filter(t => t.logCaptured && !t.detectionFired).length;
    const failed = campaignTests.filter(t => !t.logCaptured).length;
    
    return {
      total,
      tested,
      notTested: total - tested,
      passed,
      partial,
      failed,
      coverageScore: tested > 0 ? Math.round((passed / tested) * 100) : 0,
      visibilityScore: total > 0 ? Math.round((tested / total) * 100) : 0,
    };
  }, [campaignTests]);

  // Get active campaign details
  const activeCampaign = useMemo(() => {
    if (selectedCampaign === 'all') return null;
    return campaigns.find(c => c.id === selectedCampaign);
  }, [campaigns, selectedCampaign]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detection Validation</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Purple team testing to validate log capture and detection efficacy</p>
        </div>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm btn-gradient text-white rounded"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Campaign selector */}
      <div className="bg-white dark:bg-gray-800 rounded p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Tests (No Campaign Filter)</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name} - {campaign.status === 'active' ? '🟢' : campaign.status === 'completed' ? '✅' : '📋'} 
                ({campaign.stats?.passed || 0}/{campaign.stats?.total || 0} passed)
              </option>
            ))}
          </select>
          {activeCampaign && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingCampaign(activeCampaign)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit campaign"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this campaign? Test results will be preserved.')) {
                    onDeleteCampaign(activeCampaign.id);
                    setSelectedCampaign('all');
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Delete campaign"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {activeCampaign && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <div className="text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{activeCampaign.name}</span>
                {activeCampaign.description && <span className="ml-2">— {activeCampaign.description}</span>}
              </div>
              <div className="flex items-center gap-3">
                {activeCampaign.startDate && (
                  <span className="text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(activeCampaign.startDate).toLocaleDateString()}
                    {activeCampaign.endDate && ` - ${new Date(activeCampaign.endDate).toLocaleDateString()}`}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  activeCampaign.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : activeCampaign.status === 'completed'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {activeCampaign.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard 
          title="Total Tests" 
          value={stats.total} 
          icon={Target}
          color="gray"
        />
        <StatCard 
          title="Tested" 
          value={stats.tested}
          subtitle={`${stats.visibilityScore}% coverage`}
          icon={Play}
          color="blue"
        />
        <StatCard 
          title="Passed" 
          value={stats.passed}
          icon={CheckCircle}
          color="green"
        />
        <StatCard 
          title="Partial" 
          value={stats.partial}
          subtitle="Log only"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard 
          title="Failed" 
          value={stats.failed}
          icon={XCircle}
          color="red"
        />
        <StatCard 
          title="Detection Score" 
          value={`${stats.coverageScore}%`}
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by name or technique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={tacticFilter}
          onChange={(e) => setTacticFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Tactics</option>
          {tactics.map(tactic => (
            <option key={tactic} value={tactic}>{tactic}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          <option value="passed">Passed</option>
          <option value="partial">Partial (Log Only)</option>
          <option value="failed">Failed</option>
          <option value="not-tested">Not Tested</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        Showing {filteredTests.length} of {validationTestLibrary.length} tests
      </div>

      {/* Tests grouped by tactic */}
      <div className="space-y-4">
        {Object.entries(groupedTests).map(([tactic, tests]) => (
          <TacticGroup
            key={tactic}
            tactic={tactic}
            tests={tests}
            expandedTest={expandedTest}
            setExpandedTest={setExpandedTest}
            onRunTest={(test) => setShowRunModal(test)}
            onShowHistory={(test) => setShowHistoryModal(test)}
            sources={sources}
          />
        ))}
        
        {Object.keys(groupedTests).length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 dark:text-gray-400">No tests match your filters</div>
          </div>
        )}
      </div>

      {/* Run Test Modal */}
      {showRunModal && (
        <RunTestModal
          test={showRunModal}
          onClose={() => setShowRunModal(null)}
          onSave={onSaveResult}
          sources={sources}
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
        />
      )}

      {/* Campaign Modal */}
      {(showCampaignModal || editingCampaign) && (
        <CampaignModal
          campaign={editingCampaign}
          onClose={() => {
            setShowCampaignModal(false);
            setEditingCampaign(null);
          }}
          onSave={async (campaignData) => {
            if (editingCampaign) {
              await onUpdateCampaign(editingCampaign.id, campaignData);
            } else {
              const newCampaign = await onCreateCampaign(campaignData);
              setSelectedCampaign(newCampaign.id);
            }
            setShowCampaignModal(false);
            setEditingCampaign(null);
          }}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          test={showHistoryModal}
          onClose={() => setShowHistoryModal(null)}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colorClasses = {
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TacticGroup({ tactic, tests, expandedTest, setExpandedTest, onRunTest, onShowHistory, sources }) {
  const [collapsed, setCollapsed] = useState(false);
  
  const tacticStats = {
    total: tests.length,
    passed: tests.filter(t => t.result?.logCaptured && t.result?.detectionFired).length,
    partial: tests.filter(t => t.result?.logCaptured && !t.result?.detectionFired).length,
    failed: tests.filter(t => t.result && !t.result?.logCaptured).length,
    notTested: tests.filter(t => !t.result).length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tactic header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{tactic}</h3>
          <div className="flex gap-1.5">
            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
              {tacticStats.total} tests
            </span>
            {tacticStats.passed > 0 && (
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-[10px] text-green-600 dark:text-green-400">
                {tacticStats.passed} passed
              </span>
            )}
            {tacticStats.partial > 0 && (
              <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-[10px] text-yellow-600 dark:text-yellow-400">
                {tacticStats.partial} partial
              </span>
            )}
            {tacticStats.failed > 0 && (
              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-[10px] text-red-600 dark:text-red-400">
                {tacticStats.failed} failed
              </span>
            )}
          </div>
        </div>
        <TacticProgressBar stats={tacticStats} />
      </button>

      {/* Tests */}
      {!collapsed && (
        <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {tests.map(test => (
            <TestRow
              key={test.id}
              test={test}
              isExpanded={expandedTest === test.id}
              onToggle={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
              onRunTest={onRunTest}
              onShowHistory={onShowHistory}
              sources={sources}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TacticProgressBar({ stats }) {
  const total = stats.total;
  if (total === 0) return null;
  
  const passedPct = (stats.passed / total) * 100;
  const partialPct = (stats.partial / total) * 100;
  const failedPct = (stats.failed / total) * 100;

  return (
    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden flex">
      <div className="bg-green-500 h-full" style={{ width: `${passedPct}%` }} />
      <div className="bg-yellow-500 h-full" style={{ width: `${partialPct}%` }} />
      <div className="bg-red-500 h-full" style={{ width: `${failedPct}%` }} />
    </div>
  );
}

function TestRow({ test, isExpanded, onToggle, onRunTest, onShowHistory, sources }) {
  const getStatusIcon = () => {
    if (!test.result) {
      return <Clock className="h-4 w-4 text-gray-400" />;
    }
    if (test.result.logCaptured && test.result.detectionFired) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (test.result.logCaptured) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (!test.result) {
      return <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">Not Tested</span>;
    }
    if (test.result.logCaptured && test.result.detectionFired) {
      return <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-[10px] text-green-600 dark:text-green-400">Passed</span>;
    }
    if (test.result.logCaptured) {
      return <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-[10px] text-yellow-600 dark:text-yellow-400">Log Only</span>;
    }
    return <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-[10px] text-red-600 dark:text-red-400">Failed</span>;
  };

  // Check if test has evidence/artifacts
  const hasEvidence = test.result?.evidence?.length > 0 || 
    test.result?.alertId || 
    test.result?.siemQuery || 
    test.result?.sigmaRule;

  // Check which expected sources are in inventory
  const sourceMatches = test.expectedLogSources.map(expected => {
    const match = sources.find(s => 
      s.name.toLowerCase().includes(expected.toLowerCase()) ||
      expected.toLowerCase().includes(s.name.toLowerCase())
    );
    return { expected, match, collected: match?.status === 'collected' };
  });

  return (
    <div className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      {/* Main row */}
      <div className="px-4 py-2.5 flex items-center gap-3">
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        {getStatusIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</span>
            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-[10px] font-mono text-purple-700 dark:text-purple-400">
              {test.technique}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{test.techniqueName}</div>
        </div>
        
        {getStatusBadge()}
        
        {/* Data Source Coverage Indicator */}
        {test.dataSourceCoverage && test.dataSourceCoverage.percentage > 0 && (
          <span 
            className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 ${
              test.dataSourceCoverage.percentage === 100
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : test.dataSourceCoverage.percentage >= 50
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}
            title={`${test.dataSourceCoverage.covered.length}/${test.dataSourceCoverage.covered.length + test.dataSourceCoverage.missing.length} data sources available`}
          >
            <Database className="h-3 w-3" />
            {test.dataSourceCoverage.percentage}%
          </span>
        )}
        
        {hasEvidence && (
          <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-[10px] text-purple-600 dark:text-purple-400" title="Has evidence attached">
            <Paperclip className="h-3 w-3 inline" />
          </span>
        )}
        
        <button
          onClick={() => onShowHistory(test)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="View test history"
        >
          <History className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onRunTest(test)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs btn-gradient text-white rounded"
        >
          <Play className="h-3.5 w-3.5" />
          {test.result ? 'Re-test' : 'Run Test'}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-3 pl-12 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Description</div>
              <div className="text-xs text-gray-900 dark:text-white">{test.description}</div>
            </div>
            
            <div>
              <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Test Procedure</div>
              <div className="text-xs text-gray-900 dark:text-white">{test.testProcedure}</div>
            </div>
            
            <div>
              <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Expected Log Sources</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {sourceMatches.map(({ expected, match, collected }) => (
                  <span 
                    key={expected}
                    className={`px-2 py-1 rounded text-xs ${
                      collected 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : match 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    title={collected ? 'Collected' : match ? 'In inventory but not collected' : 'Not in inventory'}
                  >
                    {expected}
                    {collected && <CheckCircle className="inline h-3 w-3 ml-1" />}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Expected Fields</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {test.expectedFields.map(field => (
                  <span 
                    key={field}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-400"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* MITRE Data Source Coverage */}
            {test.dataSourceCoverage && (
              <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5" />
                    MITRE Data Source Coverage
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                    test.dataSourceCoverage.percentage === 100 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : test.dataSourceCoverage.percentage >= 50
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {test.dataSourceCoverage.percentage}% Coverage
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {test.dataSourceCoverage.covered.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">✓ Available Data Sources</div>
                      <div className="flex flex-wrap gap-1">
                        {test.dataSourceCoverage.covered.map(dsId => {
                          const ds = mitreDataSources.find(d => d.id === dsId);
                          return (
                            <span 
                              key={dsId}
                              className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-400"
                              title={ds?.name || dsId}
                            >
                              {ds?.name || dsId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {test.dataSourceCoverage.missing.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">✗ Missing Data Sources</div>
                      <div className="flex flex-wrap gap-1">
                        {test.dataSourceCoverage.missing.map(dsId => {
                          const ds = mitreDataSources.find(d => d.id === dsId);
                          return (
                            <span 
                              key={dsId}
                              className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-700 dark:text-red-400"
                              title={ds?.name || dsId}
                            >
                              {ds?.name || dsId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {test.dataSourceCoverage.covered.length === 0 && test.dataSourceCoverage.missing.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                      No specific data sources mapped for this technique
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Validation Guidance Section */}
            {test.guidance && (
              <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <ValidationGuidance guidance={test.guidance} technique={test.technique} />
              </div>
            )}

            {test.result && (
              <>
                <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Last Test Result</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Tested On</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(test.result.testedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Log Captured</div>
                      <div className={`text-sm font-medium ${test.result.logCaptured ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {test.result.logCaptured ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Detection Fired</div>
                      <div className={`text-sm font-medium ${test.result.detectionFired ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {test.result.detectionFired ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Time to Detect</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {test.result.timeToDetect || 'N/A'}
                      </div>
                    </div>
                  </div>
                  {test.result.logSources && test.result.logSources.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Log Sources Used</div>
                      <div className="flex flex-wrap gap-1">
                        {test.result.logSources.map(source => (
                          <span key={source} className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 rounded text-xs text-primary-700 dark:text-primary-400">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {test.result.notes && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Notes</div>
                      <div className="text-sm text-gray-900 dark:text-white">{test.result.notes}</div>
                    </div>
                  )}
                  
                  {/* Evidence & Artifacts Section */}
                  {(test.result.alertId || test.result.siemQuery || test.result.sigmaRule || test.result.evidence?.length > 0) && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        Evidence & Artifacts
                      </div>
                      <div className="space-y-2">
                        {test.result.alertId && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 text-xs w-20">Alert ID:</span>
                            <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200">
                              {test.result.alertId}
                            </code>
                            {test.result.alertUrl && (
                              <a 
                                href={test.result.alertUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-600"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                        {test.result.siemQuery && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">SIEM Query:</span>
                            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                              {test.result.siemQuery}
                            </pre>
                          </div>
                        )}
                        {test.result.sigmaRule && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">Sigma Rule:</span>
                            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto max-h-32 overflow-y-auto">
                              {test.result.sigmaRule}
                            </pre>
                          </div>
                        )}
                        {test.result.evidence?.length > 0 && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">Attachments:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {test.result.evidence.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                                >
                                  <FileText className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                  {item.url && (
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary-500 hover:text-primary-600"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationGuidance({ guidance, technique }) {
  const [expandedSection, setExpandedSection] = useState('whatToLookFor');
  const [copiedQuery, setCopiedQuery] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuery(true);
      setTimeout(() => setCopiedQuery(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sections = [
    { id: 'whatToLookFor', label: 'What to Look For', icon: Eye, data: guidance.whatToLookFor },
    { id: 'howToTest', label: 'How to Test', icon: Terminal, data: guidance.howToTest },
    { id: 'expectedAlerts', label: 'Expected Alerts', icon: Bell, data: guidance.expectedAlerts },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Validation Guidance</span>
        {guidance.atomicTestRef && (
          <a 
            href={guidance.atomicTestRef} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Atomic Red Team
          </a>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setExpandedSection(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              expandedSection === id
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 -mb-px'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        {sections.map(({ id, data }) => (
          expandedSection === id && (
            <ul key={id} className="space-y-1.5">
              {data?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span className={id === 'howToTest' ? 'font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded' : ''}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )
        ))}
      </div>

      {/* SIEM Query Example */}
      {guidance.siemQueryExample && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Code className="h-3 w-3" />
              Example SIEM Query
            </span>
            <button
              onClick={() => copyToClipboard(guidance.siemQueryExample)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-500 transition-colors"
            >
              {copiedQuery ? (
                <>
                  <CheckCheck className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="p-2.5 bg-gray-900 dark:bg-gray-950 rounded text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
            {guidance.siemQueryExample}
          </pre>
        </div>
      )}
    </div>
  );
}

function RunTestModal({ test, onClose, onSave, sources, campaigns, selectedCampaign }) {
  const [formData, setFormData] = useState({
    logCaptured: test.result?.logCaptured ?? null,
    detectionFired: test.result?.detectionFired ?? null,
    timeToDetect: test.result?.timeToDetect || '',
    logSources: test.result?.logSources || [],
    detectionRule: test.result?.detectionRule || '',
    notes: test.result?.notes || '',
    // Evidence fields
    alertId: test.result?.alertId || '',
    alertUrl: test.result?.alertUrl || '',
    siemQuery: test.result?.siemQuery || '',
    sigmaRule: test.result?.sigmaRule || '',
    evidence: test.result?.evidence || [],
    // Campaign
    campaignId: test.result?.campaignId || (selectedCampaign !== 'all' ? selectedCampaign : ''),
  });
  const [saving, setSaving] = useState(false);
  const [showEvidenceSection, setShowEvidenceSection] = useState(
    !!(test.result?.alertId || test.result?.siemQuery || test.result?.sigmaRule || test.result?.evidence?.length)
  );
  const [newEvidence, setNewEvidence] = useState({ name: '', url: '' });

  // Combine inventory sources with expected sources from test library
  const availableLogSources = useMemo(() => {
    const inventorySources = sources.map(s => s.name);
    const expectedSources = test.expectedLogSources || [];
    const combined = [...new Set([...inventorySources, ...expectedSources])];
    return combined.sort();
  }, [sources, test.expectedLogSources]);

  const handleToggleSource = (sourceName) => {
    setFormData(prev => ({
      ...prev,
      logSources: prev.logSources.includes(sourceName)
        ? prev.logSources.filter(s => s !== sourceName)
        : [...prev.logSources, sourceName]
    }));
  };

  const handleSave = async () => {
    if (formData.logCaptured === null) return;
    
    setSaving(true);
    try {
      await onSave(test.id, {
        ...formData,
        testedAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Record Test Result</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{test.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Test info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-mono text-purple-700 dark:text-purple-400">
                {test.technique}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{test.techniqueName}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{test.testProcedure}</p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Was the log captured in the SIEM? *
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormData({ ...formData, logCaptured: true })}
                  className={`flex-1 py-3 px-4 rounded border-2 transition-colors ${
                    formData.logCaptured === true
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <CheckCircle className={`h-6 w-6 mx-auto mb-1 ${formData.logCaptured === true ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium">Yes</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, logCaptured: false, detectionFired: false })}
                  className={`flex-1 py-3 px-4 rounded border-2 transition-colors ${
                    formData.logCaptured === false
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <XCircle className={`h-6 w-6 mx-auto mb-1 ${formData.logCaptured === false ? 'text-red-500' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium">No</div>
                </button>
              </div>
            </div>

            {formData.logCaptured && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Did a detection rule fire? *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, detectionFired: true })}
                      className={`flex-1 py-3 px-4 rounded border-2 transition-colors ${
                        formData.detectionFired === true
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <CheckCircle className={`h-6 w-6 mx-auto mb-1 ${formData.detectionFired === true ? 'text-green-500' : 'text-gray-400'}`} />
                      <div className="text-sm font-medium">Yes</div>
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, detectionFired: false })}
                      className={`flex-1 py-3 px-4 rounded border-2 transition-colors ${
                        formData.detectionFired === false
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <AlertTriangle className={`h-6 w-6 mx-auto mb-1 ${formData.detectionFired === false ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <div className="text-sm font-medium">No</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Log Source(s) Used
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700">
                      {availableLogSources.map(sourceName => {
                        const isSelected = formData.logSources.includes(sourceName);
                        const isExpected = test.expectedLogSources?.includes(sourceName);
                        const inventorySource = sources.find(s => s.name === sourceName);
                        
                        return (
                          <label
                            key={sourceName}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                              isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSource(sourceName)}
                              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className={`text-sm flex-1 ${isSelected ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                              {sourceName}
                            </span>
                            {isExpected && (
                              <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-600 dark:text-purple-400">
                                expected
                              </span>
                            )}
                            {inventorySource && (
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                inventorySource.status === 'collected' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                              }`}>
                                {inventorySource.status === 'collected' ? 'collected' : inventorySource.status}
                              </span>
                            )}
                          </label>
                        );
                      })}
                      {availableLogSources.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          No log sources available. Add sources to your inventory.
                        </div>
                      )}
                    </div>
                    {formData.logSources.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {formData.logSources.length} source(s) selected
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time to Detect
                    </label>
                    <input
                      type="text"
                      value={formData.timeToDetect}
                      onChange={(e) => setFormData({ ...formData, timeToDetect: e.target.value })}
                      placeholder="e.g., < 1 min, 5 mins"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {formData.detectionFired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Detection Rule Name
                    </label>
                    <input
                      type="text"
                      value={formData.detectionRule}
                      onChange={(e) => setFormData({ ...formData, detectionRule: e.target.value })}
                      placeholder="e.g., Mimikatz Credential Dump Detected"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional observations, issues encountered, remediation needed..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Campaign Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Campaign (Optional)
              </label>
              <select
                value={formData.campaignId}
                onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No Campaign</option>
                {campaigns.filter(c => c.status !== 'completed').map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Associate this test result with a validation campaign
              </p>
            </div>

            {/* Evidence & Artifacts Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={() => setShowEvidenceSection(!showEvidenceSection)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500"
              >
                {showEvidenceSection ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Paperclip className="h-4 w-4" />
                Evidence & Artifacts
              </button>
              
              {showEvidenceSection && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alert ID
                      </label>
                      <input
                        type="text"
                        value={formData.alertId}
                        onChange={(e) => setFormData({ ...formData, alertId: e.target.value })}
                        placeholder="e.g., ALERT-12345"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alert URL
                      </label>
                      <input
                        type="url"
                        value={formData.alertUrl}
                        onChange={(e) => setFormData({ ...formData, alertUrl: e.target.value })}
                        placeholder="https://siem.example.com/alerts/..."
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SIEM Query
                    </label>
                    <textarea
                      value={formData.siemQuery}
                      onChange={(e) => setFormData({ ...formData, siemQuery: e.target.value })}
                      rows={2}
                      placeholder="Paste the search query used to find this event..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sigma Rule (YAML)
                    </label>
                    <textarea
                      value={formData.sigmaRule}
                      onChange={(e) => setFormData({ ...formData, sigmaRule: e.target.value })}
                      rows={4}
                      placeholder="Paste Sigma rule YAML here..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Evidence Links
                    </label>
                    <div className="space-y-2">
                      {formData.evidence.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            readOnly
                            className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
                          />
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 text-primary-500 hover:text-primary-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              evidence: formData.evidence.filter((_, i) => i !== idx)
                            })}
                            className="p-1.5 text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newEvidence.name}
                          onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
                          placeholder="Evidence name"
                          className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="url"
                          value={newEvidence.url}
                          onChange={(e) => setNewEvidence({ ...newEvidence, url: e.target.value })}
                          placeholder="URL"
                          className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newEvidence.name && newEvidence.url) {
                              setFormData({
                                ...formData,
                                evidence: [...formData.evidence, { ...newEvidence }]
                              });
                              setNewEvidence({ name: '', url: '' });
                            }
                          }}
                          disabled={!newEvidence.name || !newEvidence.url}
                          className="p-1.5 btn-gradient text-white rounded disabled:opacity-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Add links to screenshots, ticket IDs, or external documentation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || formData.logCaptured === null}
            className="px-4 py-2 btn-gradient text-white rounded disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignModal({ campaign, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    status: campaign?.status || 'planned',
    startDate: campaign?.startDate || '',
    endDate: campaign?.endDate || '',
    objectives: campaign?.objectives || '',
    scope: campaign?.scope || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {campaign ? 'Edit Campaign' : 'New Validation Campaign'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q1 2026 Purple Team Exercise"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description of the campaign goals..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objectives
            </label>
            <textarea
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              rows={2}
              placeholder="What are we trying to validate? e.g., Ransomware detection capabilities..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scope
            </label>
            <textarea
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              rows={2}
              placeholder="In-scope systems, tactics, techniques..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.name.trim()}
            className="px-4 py-2 btn-gradient text-white rounded disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ test, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history on mount
  useState(() => {
    async function fetchHistory() {
      try {
        const data = await validationAPI.getHistory(test.id);
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [test.id]);

  const getStatusColor = (result) => {
    if (result.logCaptured && result.detectionFired) return 'green';
    if (result.logCaptured) return 'yellow';
    return 'red';
  };

  const getStatusLabel = (result) => {
    if (result.logCaptured && result.detectionFired) return 'Passed';
    if (result.logCaptured) return 'Partial';
    return 'Failed';
  };

  const getTrendIcon = () => {
    if (history.length < 2) return null;
    const recent = history[0];
    const previous = history[1];
    
    const recentScore = (recent.logCaptured ? 1 : 0) + (recent.detectionFired ? 1 : 0);
    const previousScore = (previous.logCaptured ? 1 : 0) + (previous.detectionFired ? 1 : 0);
    
    if (recentScore > previousScore) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (recentScore < previousScore) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Test History
              {getTrendIcon()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{test.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No test history available</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Run the test to create the first entry</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((result, idx) => {
                const statusColor = getStatusColor(result);
                const statusLabel = getStatusLabel(result);
                
                return (
                  <div 
                    key={result.id || idx}
                    className={`p-4 rounded border-l-4 ${
                      statusColor === 'green' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                        : statusColor === 'yellow'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          statusColor === 'green' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : statusColor === 'yellow'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {statusLabel}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 rounded text-xs text-primary-700 dark:text-primary-400">
                            Latest
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(result.testedAt || result.savedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Log Captured:</span>
                        <span className={`ml-2 font-medium ${result.logCaptured ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.logCaptured ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Detection:</span>
                        <span className={`ml-2 font-medium ${result.detectionFired ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.detectionFired ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {result.timeToDetect && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">TTD:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{result.timeToDetect}</span>
                        </div>
                      )}
                    </div>
                    
                    {result.notes && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                        {result.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Validation;
