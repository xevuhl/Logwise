import { useState, useMemo } from 'react';
import { 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Target,
  Database,
  Info,
  ExternalLink,
  Filter,
  Search,
  Layers,
  Activity
} from 'lucide-react';
import { 
  mitreTactics, 
  mitreDataSources, 
  validationTestLibrary,
  techniqueToDataSources,
  categoryToDataSources,
  calculateMitreCoverage,
  getSourceMitreCoverage,
  getRecommendedSources
} from '../constants';

function MitreCoverage({ sources, validationTests }) {
  const [expandedTactic, setExpandedTactic] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' or 'dataSources'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'covered', 'partial', 'gap'

  // Calculate overall MITRE coverage from log sources
  const coverage = useMemo(() => {
    return calculateMitreCoverage(sources);
  }, [sources]);

  // Get validation test results by technique
  const testResultsByTechnique = useMemo(() => {
    const results = {};
    validationTests.forEach(test => {
      const libraryTest = validationTestLibrary.find(t => t.id === test.testId);
      if (libraryTest) {
        results[libraryTest.technique] = {
          ...test,
          testInfo: libraryTest
        };
      }
    });
    return results;
  }, [validationTests]);

  // Group techniques by tactic
  const techniquesByTactic = useMemo(() => {
    const grouped = {};
    mitreTactics.forEach(tactic => {
      grouped[tactic.name] = validationTestLibrary
        .filter(t => t.tactic === tactic.name)
        .map(test => ({
          ...test,
          coverage: coverage.techniqueCoverage[test.technique],
          testResult: testResultsByTechnique[test.technique]
        }));
    });
    return grouped;
  }, [coverage, testResultsByTechnique]);

  // Filter techniques based on status
  const filteredTechniquesByTactic = useMemo(() => {
    if (filterStatus === 'all') return techniquesByTactic;
    
    const filtered = {};
    Object.entries(techniquesByTactic).forEach(([tactic, techniques]) => {
      const filteredTechniques = techniques.filter(t => {
        if (filterStatus === 'covered') return t.coverage?.status === 'full';
        if (filterStatus === 'partial') return t.coverage?.status === 'partial';
        if (filterStatus === 'gap') return t.coverage?.status === 'none' || !t.coverage;
        return true;
      });
      if (filteredTechniques.length > 0) {
        filtered[tactic] = filteredTechniques;
      }
    });
    return filtered;
  }, [techniquesByTactic, filterStatus]);

  // Get data sources with coverage info
  const dataSourcesCoverage = useMemo(() => {
    const providedDS = new Set(coverage.dataSourcesProvided);
    return mitreDataSources.map(ds => ({
      ...ds,
      isProvided: providedDS.has(ds.id),
      providingSources: sources.filter(s => 
        (categoryToDataSources[s.category] || []).includes(ds.id) &&
        (s.status === 'collected' || s.status === 'partial')
      )
    }));
  }, [coverage, sources]);

  const getTechniqueStatusColor = (technique) => {
    if (!technique.coverage) return 'gray';
    if (technique.coverage.status === 'full') return 'green';
    if (technique.coverage.status === 'partial') return 'yellow';
    return 'red';
  };

  const getTechniqueStatusIcon = (technique) => {
    if (!technique.coverage || technique.coverage.status === 'none') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (technique.coverage.status === 'full') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getTestStatusBadge = (technique) => {
    if (!technique.testResult) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">Not Tested</span>;
    }
    if (technique.testResult.logCaptured && technique.testResult.detectionFired) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Passed</span>;
    }
    if (technique.testResult.logCaptured) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">Partial</span>;
    }
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Failed</span>;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            MITRE ATT&CK Coverage
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Detection coverage mapped to MITRE ATT&CK framework
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-0.5">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Matrix View
            </button>
            <button
              onClick={() => setViewMode('dataSources')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'dataSources'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Data Sources
            </button>
          </div>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Techniques</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {coverage.summary.totalTechniques}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Fully Covered</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {coverage.summary.fullyCovered}
          </div>
          <div className="text-[10px] text-gray-500">
            {Math.round((coverage.summary.fullyCovered / coverage.summary.totalTechniques) * 100)}% of techniques
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Partial Coverage</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {coverage.summary.partiallyCovered}
          </div>
          <div className="text-[10px] text-gray-500">
            {Math.round((coverage.summary.partiallyCovered / coverage.summary.totalTechniques) * 100)}% of techniques
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Coverage Gaps</span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {coverage.summary.notCovered}
          </div>
          <div className="text-[10px] text-gray-500">
            {Math.round((coverage.summary.notCovered / coverage.summary.totalTechniques) * 100)}% need attention
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex gap-1">
          {[
            { value: 'all', label: 'All' },
            { value: 'covered', label: 'Covered' },
            { value: 'partial', label: 'Partial' },
            { value: 'gap', label: 'Gaps' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                filterStatus === opt.value
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'matrix' ? (
        /* Matrix View - Tactics and Techniques */
        <div className="space-y-2">
          {mitreTactics.map(tactic => {
            const techniques = filteredTechniquesByTactic[tactic.name] || [];
            if (techniques.length === 0 && filterStatus !== 'all') return null;
            
            const isExpanded = expandedTactic === tactic.id;
            const coveredCount = techniques.filter(t => t.coverage?.status === 'full').length;
            const partialCount = techniques.filter(t => t.coverage?.status === 'partial').length;
            
            return (
              <div
                key={tactic.id}
                className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTactic(isExpanded ? null : tactic.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                    <div className={`w-3 h-3 rounded-full bg-${tactic.color}-500`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tactic.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({tactic.id})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        {coveredCount} covered
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                        {partialCount} partial
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        {techniques.length - coveredCount - partialCount} gaps
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {techniques.length} techniques
                    </span>
                  </div>
                </button>

                {isExpanded && techniques.length > 0 && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{tactic.description}</p>
                    <div className="space-y-2">
                      {techniques.map(technique => (
                        <div
                          key={technique.id}
                          className={`p-3 rounded border cursor-pointer transition-all ${
                            selectedTechnique === technique.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                          }`}
                          onClick={() => setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getTechniqueStatusIcon(technique)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {technique.technique}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {technique.techniqueName}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {technique.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTestStatusBadge(technique)}
                              {technique.coverage && (
                                <span className={`text-xs font-medium ${
                                  technique.coverage.status === 'full' ? 'text-green-600 dark:text-green-400' :
                                  technique.coverage.status === 'partial' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {technique.coverage.percentage}%
                                </span>
                              )}
                            </div>
                          </div>

                          {selectedTechnique === technique.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-3">
                              {/* Data Sources Required */}
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Required Data Sources:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {(technique.coverage?.required || []).map(dsId => {
                                    const ds = mitreDataSources.find(d => d.id === dsId);
                                    const isCovered = (technique.coverage?.covered || []).includes(dsId);
                                    return (
                                      <span
                                        key={dsId}
                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                          isCovered
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                                        }`}
                                      >
                                        {ds?.name || dsId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Expected Log Sources */}
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Expected Log Sources:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {technique.expectedLogSources.map(ls => (
                                    <span
                                      key={ls}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                      {ls}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Test Result Details */}
                              {technique.testResult && (
                                <div>
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Last Validation:
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <div>Log Captured: {technique.testResult.logCaptured ? 'Yes' : 'No'}</div>
                                    <div>Detection Fired: {technique.testResult.detectionFired ? 'Yes' : 'No'}</div>
                                    {technique.testResult.testedAt && (
                                      <div>Tested: {new Date(technique.testResult.testedAt).toLocaleDateString()}</div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* MITRE Link */}
                              <a
                                href={`https://attack.mitre.org/techniques/${technique.technique.replace('.', '/')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                              >
                                View on MITRE ATT&CK <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Sources View */
        <div className="space-y-2">
          {dataSourcesCoverage.map(ds => (
            <div
              key={ds.id}
              className={`p-4 bg-white dark:bg-gray-800 rounded border ${
                ds.isProvided
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {ds.isProvided ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{ds.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({ds.id})</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ds.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ds.isProvided && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {ds.providingSources.length} {ds.providingSources.length === 1 ? 'source' : 'sources'}
                    </span>
                  )}
                </div>
              </div>

              {/* Components */}
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {ds.components.map(comp => (
                    <span
                      key={comp}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Providing Sources */}
              {ds.isProvided && ds.providingSources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Providing Log Sources:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ds.providingSources.map(source => (
                      <span
                        key={source.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      >
                        <Database className="h-2.5 w-2.5 inline mr-0.5" />
                        {source.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Sources if not covered */}
              {!ds.isProvided && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Recommended Sources:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ds.logSourceExamples.map(example => (
                      <span
                        key={example}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MitreCoverage;
