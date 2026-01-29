import { useState, useMemo } from 'react';
import { 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Database,
  ExternalLink,
  Layers,
  Cpu
} from 'lucide-react';
import { 
  mitreTactics, 
  mitreDataSources, 
  mitreDataComponents,
  categoryToDataSources,
  calculateMitreCoverage,
  calculateComponentCoverage
} from '../constants';

function MitreCoverage({ sources, validationTests }) {
  const [viewMode, setViewMode] = useState('dataSources'); // 'dataSources' or 'dataComponents'

  // Calculate overall MITRE coverage from log sources
  const coverage = useMemo(() => {
    return calculateMitreCoverage(sources);
  }, [sources]);

  // Calculate coverage at data component level
  const componentCoverage = useMemo(() => {
    return calculateComponentCoverage(sources);
  }, [sources]);

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
              onClick={() => setViewMode('dataSources')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'dataSources'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Data Sources
            </button>
            <button
              onClick={() => setViewMode('dataComponents')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'dataComponents'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Data Components
            </button>
          </div>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Data Components</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {componentCoverage.componentsProvided.length}
          </div>
          <div className="text-[10px] text-gray-500">
            of {mitreDataComponents.filter(dc => dc.platform.includes('Enterprise')).length} enterprise components
          </div>
        </div>
      </div>

      {viewMode === 'dataSources' ? (
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
                  {(ds.componentIds || []).map(compId => {
                    const comp = mitreDataComponents.find(c => c.id === compId);
                    return (
                      <span
                        key={compId}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        {comp?.name || compId}
                      </span>
                    );
                  })}
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
      ) : (
        /* Data Components View */
        <DataComponentsView 
          componentCoverage={componentCoverage}
          sources={sources}
        />
      )}
    </div>
  );
}

// New Data Components View Component
function DataComponentsView({ componentCoverage, sources }) {
  const [expandedDataSource, setExpandedDataSource] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('Enterprise');

  // Group data components by data source
  const componentsByDataSource = useMemo(() => {
    const grouped = {};
    
    mitreDataSources.forEach(ds => {
      const components = (ds.componentIds || []).map(id => {
        const comp = mitreDataComponents.find(c => c.id === id);
        if (!comp) return null;
        return {
          ...comp,
          isProvided: componentCoverage.componentsProvided.includes(id)
        };
      }).filter(Boolean);
      
      if (components.length > 0) {
        grouped[ds.id] = {
          dataSource: ds,
          components,
          coveredCount: components.filter(c => c.isProvided).length,
          totalCount: components.length
        };
      }
    });
    
    return grouped;
  }, [componentCoverage]);

  // Standalone components (no data source or Mobile/ICS only)
  const standaloneComponents = useMemo(() => {
    return mitreDataComponents
      .filter(dc => !dc.dataSourceId && dc.platform.includes(filterPlatform))
      .map(dc => ({
        ...dc,
        isProvided: componentCoverage.componentsProvided.includes(dc.id)
      }));
  }, [componentCoverage, filterPlatform]);

  return (
    <div className="space-y-4">
      {/* Platform filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Platform:</span>
        <div className="flex gap-1">
          {['Enterprise', 'ICS', 'Mobile'].map(platform => (
            <button
              key={platform}
              onClick={() => setFilterPlatform(platform)}
              className={`px-2 py-1 text-xs rounded ${
                filterPlatform === platform
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {componentCoverage.componentsProvided.length} of {mitreDataComponents.filter(dc => dc.platform.includes(filterPlatform)).length} components covered
        </div>
      </div>

      {/* Data Sources with their components */}
      <div className="space-y-2">
        {Object.entries(componentsByDataSource).map(([dsId, data]) => {
          const isExpanded = expandedDataSource === dsId;
          const coveragePercentage = Math.round((data.coveredCount / data.totalCount) * 100);
          
          return (
            <div
              key={dsId}
              className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Data Source Header */}
              <button
                onClick={() => setExpandedDataSource(isExpanded ? null : dsId)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <Database className="h-4 w-4 text-blue-500" />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{data.dataSource.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({dsId})</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.dataSource.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    coveragePercentage >= 100
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : coveragePercentage >= 50
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {data.coveredCount}/{data.totalCount} components
                  </span>
                  <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        coveragePercentage >= 100 ? 'bg-green-500' :
                        coveragePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${coveragePercentage}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Components List */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {data.components.map(comp => (
                      <div
                        key={comp.id}
                        className={`p-2 rounded border ${
                          comp.isProvided
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {comp.isProvided ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-gray-900 dark:text-white truncate">{comp.name}</span>
                              <a
                                href={`https://attack.mitre.org/datacomponents/${comp.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-500 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{comp.description}</p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-[9px] px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                                {comp.id}
                              </span>
                              {comp.platform.split(',').map(p => (
                                <span key={p} className="text-[9px] px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                  {p.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Log Source Examples */}
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Example Log Sources:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data.dataSource.logSourceExamples.map(example => (
                        <span
                          key={example}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Standalone components (platform-specific) */}
      {standaloneComponents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {filterPlatform}-Specific Components
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {standaloneComponents.map(comp => (
              <div
                key={comp.id}
                className={`p-2 rounded border ${
                  comp.isProvided
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-2">
                  {comp.isProvided ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-900 dark:text-white truncate">{comp.name}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                        {comp.id}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{comp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MitreCoverage;
