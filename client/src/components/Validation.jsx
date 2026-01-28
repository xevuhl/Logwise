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
  X
} from 'lucide-react';
import { validationTestLibrary } from '../constants';

function Validation({ validationTests, onRunTest, onSaveResult, sources }) {
  const [search, setSearch] = useState('');
  const [tacticFilter, setTacticFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTest, setExpandedTest] = useState(null);
  const [showRunModal, setShowRunModal] = useState(null);

  // Get unique tactics
  const tactics = [...new Set(validationTestLibrary.map(t => t.tactic))];

  // Merge library with test results
  const testsWithResults = useMemo(() => {
    return validationTestLibrary.map(test => {
      const result = validationTests.find(r => r.testId === test.id);
      return {
        ...test,
        result: result || null,
      };
    });
  }, [validationTests]);

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
    const tested = validationTests.length;
    const passed = validationTests.filter(t => t.logCaptured && t.detectionFired).length;
    const partial = validationTests.filter(t => t.logCaptured && !t.detectionFired).length;
    const failed = validationTests.filter(t => !t.logCaptured).length;
    
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
  }, [validationTests]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detection Validation</h2>
          <p className="text-gray-600 dark:text-gray-400">Purple team testing to validate log capture and detection efficacy</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by name or technique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={tacticFilter}
          onChange={(e) => setTacticFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Tactics</option>
          {tactics.map(tactic => (
            <option key={tactic} value={tactic}>{tactic}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          <option value="passed">Passed</option>
          <option value="partial">Partial (Log Only)</option>
          <option value="failed">Failed</option>
          <option value="not-tested">Not Tested</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredTests.length} of {validationTestLibrary.length} tests
      </div>

      {/* Tests grouped by tactic */}
      <div className="space-y-6">
        {Object.entries(groupedTests).map(([tactic, tests]) => (
          <TacticGroup
            key={tactic}
            tactic={tactic}
            tests={tests}
            expandedTest={expandedTest}
            setExpandedTest={setExpandedTest}
            onRunTest={(test) => setShowRunModal(test)}
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
    <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TacticGroup({ tactic, tests, expandedTest, setExpandedTest, onRunTest, sources }) {
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
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tactic}</h3>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
              {tacticStats.total} tests
            </span>
            {tacticStats.passed > 0 && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-600 dark:text-green-400">
                {tacticStats.passed} passed
              </span>
            )}
            {tacticStats.partial > 0 && (
              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-600 dark:text-yellow-400">
                {tacticStats.partial} partial
              </span>
            )}
            {tacticStats.failed > 0 && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-600 dark:text-red-400">
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
    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden flex">
      <div className="bg-green-500 h-full" style={{ width: `${passedPct}%` }} />
      <div className="bg-yellow-500 h-full" style={{ width: `${partialPct}%` }} />
      <div className="bg-red-500 h-full" style={{ width: `${failedPct}%` }} />
    </div>
  );
}

function TestRow({ test, isExpanded, onToggle, onRunTest, sources }) {
  const getStatusIcon = () => {
    if (!test.result) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }
    if (test.result.logCaptured && test.result.detectionFired) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (test.result.logCaptured) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (!test.result) {
      return <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Not Tested</span>;
    }
    if (test.result.logCaptured && test.result.detectionFired) {
      return <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-600 dark:text-green-400">Passed</span>;
    }
    if (test.result.logCaptured) {
      return <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-600 dark:text-yellow-400">Log Only</span>;
    }
    return <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-600 dark:text-red-400">Failed</span>;
  };

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
      <div className="px-6 py-4 flex items-center gap-4">
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
        
        {getStatusIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{test.name}</span>
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-mono text-purple-700 dark:text-purple-400">
              {test.technique}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{test.techniqueName}</div>
        </div>
        
        {getStatusBadge()}
        
        <button
          onClick={() => onRunTest(test)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          <Play className="h-4 w-4" />
          {test.result ? 'Re-test' : 'Run Test'}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-6 pb-4 pl-16 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</div>
              <div className="text-sm text-gray-900 dark:text-white">{test.description}</div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Test Procedure</div>
              <div className="text-sm text-gray-900 dark:text-white">{test.testProcedure}</div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Expected Log Sources</div>
              <div className="flex flex-wrap gap-2 mt-1">
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
                  {test.result.notes && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Notes</div>
                      <div className="text-sm text-gray-900 dark:text-white">{test.result.notes}</div>
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

function RunTestModal({ test, onClose, onSave, sources }) {
  const [formData, setFormData] = useState({
    logCaptured: test.result?.logCaptured ?? null,
    detectionFired: test.result?.detectionFired ?? null,
    timeToDetect: test.result?.timeToDetect || '',
    logSource: test.result?.logSource || '',
    detectionRule: test.result?.detectionRule || '',
    notes: test.result?.notes || '',
  });
  const [saving, setSaving] = useState(false);

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
                      Log Source Used
                    </label>
                    <input
                      type="text"
                      value={formData.logSource}
                      onChange={(e) => setFormData({ ...formData, logSource: e.target.value })}
                      placeholder="e.g., Sysmon, Windows Security"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Validation;
