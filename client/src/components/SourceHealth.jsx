import { useState, useMemo, useEffect } from 'react';
import { 
  Activity,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MinusCircle,
  Clock,
  Calendar,
  Database,
  FileCode,
  CheckSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  Play,
  RefreshCw,
  Settings,
  History,
  X,
  Save,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  HelpCircle,
  Copy,
  ExternalLink,
  Layers
} from 'lucide-react';
import { 
  healthCheckTypes, 
  storageTierOptions, 
  fieldTypeOptions,
  defaultValidationConfig,
  healthCheckStatusOptions,
  commonFieldsByCategory,
  getSuggestedFields,
  parseRetentionToDays,
  retentionOptions
} from '../constants';
import { sourceHealthAPI, sourceValidationConfigsAPI } from '../api';

function SourceHealth({ sources, healthRecords, validationConfigs, onSaveHealthCheck, onSaveConfig, onRefreshHealth }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSource, setSelectedSource] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(null);
  const [showRunModal, setShowRunModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [expandedSource, setExpandedSource] = useState(null);

  // Build lookup maps
  const healthBySource = useMemo(() => {
    const map = {};
    (healthRecords || []).forEach(record => {
      map[record.sourceId] = record;
    });
    return map;
  }, [healthRecords]);

  const configBySource = useMemo(() => {
    const map = {};
    (validationConfigs || []).forEach(config => {
      map[config.sourceId] = config;
    });
    return map;
  }, [validationConfigs]);

  // Filter sources
  const filteredSources = useMemo(() => {
    return (sources || []).filter(source => {
      // Only show collected/partial sources
      if (source.status !== 'collected' && source.status !== 'partial') return false;
      
      const matchesSearch = !search || 
        source.name.toLowerCase().includes(search.toLowerCase()) ||
        source.category?.toLowerCase().includes(search.toLowerCase());
      
      const health = healthBySource[source.id];
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pass' && health?.overallStatus === 'pass') ||
        (statusFilter === 'warn' && health?.overallStatus === 'warn') ||
        (statusFilter === 'fail' && health?.overallStatus === 'fail') ||
        (statusFilter === 'not-checked' && !health);
      
      const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [sources, search, statusFilter, categoryFilter, healthBySource]);

  // Calculate stats
  const stats = useMemo(() => {
    const collectedSources = (sources || []).filter(s => s.status === 'collected' || s.status === 'partial');
    const total = collectedSources.length;
    const checked = collectedSources.filter(s => healthBySource[s.id]).length;
    const passed = collectedSources.filter(s => healthBySource[s.id]?.overallStatus === 'pass').length;
    const warned = collectedSources.filter(s => healthBySource[s.id]?.overallStatus === 'warn').length;
    const failed = collectedSources.filter(s => healthBySource[s.id]?.overallStatus === 'fail').length;
    const configured = collectedSources.filter(s => configBySource[s.id]).length;
    
    return {
      total,
      checked,
      notChecked: total - checked,
      passed,
      warned,
      failed,
      configured,
      healthScore: checked > 0 ? Math.round((passed / checked) * 100) : 0,
    };
  }, [sources, healthBySource, configBySource]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    (sources || [])
      .filter(s => s.status === 'collected' || s.status === 'partial')
      .forEach(s => s.category && cats.add(s.category));
    return [...cats].sort();
  }, [sources]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Source Health Validation
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Validate log source quality, retention, and detection alignment
          </p>
        </div>
        <button
          onClick={onRefreshHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard 
          title="Total Sources" 
          value={stats.total} 
          icon={Database}
          color="gray"
        />
        <StatCard 
          title="Validated" 
          value={stats.checked}
          subtitle={`${stats.notChecked} pending`}
          icon={CheckSquare}
          color="blue"
        />
        <StatCard 
          title="Healthy" 
          value={stats.passed}
          icon={CheckCircle}
          color="green"
        />
        <StatCard 
          title="Warnings" 
          value={stats.warned}
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
          title="Health Score" 
          value={`${stats.healthScore}%`}
          icon={Activity}
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
              placeholder="Search sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Health Status</option>
          <option value="pass">Healthy</option>
          <option value="warn">Warnings</option>
          <option value="fail">Failed</option>
          <option value="not-checked">Not Checked</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        Showing {filteredSources.length} of {stats.total} collected sources
      </div>

      {/* Source list */}
      <div className="space-y-2">
        {filteredSources.map(source => (
          <SourceHealthCard
            key={source.id}
            source={source}
            health={healthBySource[source.id]}
            config={configBySource[source.id]}
            isExpanded={expandedSource === source.id}
            onToggle={() => setExpandedSource(expandedSource === source.id ? null : source.id)}
            onConfigure={() => setShowConfigModal(source)}
            onRunCheck={() => setShowRunModal(source)}
            onShowHistory={() => setShowHistoryModal(source)}
          />
        ))}
        
        {filteredSources.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 dark:text-gray-400">
              {stats.total === 0 
                ? 'No collected log sources to validate'
                : 'No sources match your filters'
              }
            </div>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <ConfigModal
          source={showConfigModal}
          config={configBySource[showConfigModal.id]}
          onClose={() => setShowConfigModal(null)}
          onSave={onSaveConfig}
        />
      )}

      {/* Run Check Modal */}
      {showRunModal && (
        <RunCheckModal
          source={showRunModal}
          config={configBySource[showRunModal.id]}
          onClose={() => setShowRunModal(null)}
          onSave={onSaveHealthCheck}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          source={showHistoryModal}
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

function SourceHealthCard({ source, health, config, isExpanded, onToggle, onConfigure, onRunCheck, onShowHistory }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <MinusCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      warn: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      fail: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    const labels = { pass: 'Healthy', warn: 'Warning', fail: 'Failed' };
    
    if (!status) {
      return <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">Not Checked</span>;
    }
    
    return <span className={`px-1.5 py-0.5 rounded text-[10px] ${classes[status]}`}>{labels[status]}</span>;
  };

  const checkIcons = {
    'delay-threshold': Clock,
    'schema-compliance': FileCode,
    'field-population': CheckSquare,
    'retention-lookback': Calendar,
    'detection-alignment': Bell,
    'storage-tier': Database,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {getStatusIcon(health?.overallStatus)}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {source.category} • {source.logType || 'Unknown format'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mini check status icons */}
          {health && (
            <div className="hidden md:flex items-center gap-1">
              {health.checks?.map(check => {
                const Icon = checkIcons[check.checkId] || Activity;
                return (
                  <div 
                    key={check.checkId}
                    className={`p-1 rounded ${
                      check.status === 'pass' ? 'text-green-500' :
                      check.status === 'warn' ? 'text-yellow-500' :
                      check.status === 'fail' ? 'text-red-500' : 'text-gray-400'
                    }`}
                    title={`${healthCheckTypes.find(t => t.id === check.checkId)?.name}: ${check.status}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                );
              })}
            </div>
          )}
          
          {getStatusBadge(health?.overallStatus)}
          
          {health?.runAt && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">
              {new Date(health.runAt).toLocaleDateString()}
            </span>
          )}
          
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={onConfigure}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Configure validation"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onRunCheck}
              className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Run health check"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              onClick={onShowHistory}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="View history"
            >
              <History className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          {!health ? (
            <div className="text-center py-6">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No health check has been run for this source</p>
              <button
                onClick={onRunCheck}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm btn-gradient text-white rounded"
              >
                <Play className="h-4 w-4" />
                Run Health Check
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Check results */}
              <div className="grid gap-2">
                {health.checks.map(check => {
                  const checkType = healthCheckTypes.find(t => t.id === check.checkId);
                  const Icon = checkIcons[check.checkId] || Activity;
                  
                  return (
                    <div 
                      key={check.checkId}
                      className={`p-3 rounded border ${
                        check.status === 'pass' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                        check.status === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' :
                        check.status === 'fail' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                        'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded ${
                          check.status === 'pass' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          check.status === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                          check.status === 'fail' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {checkType?.name || check.checkId}
                            </h4>
                            {getStatusBadge(check.status)}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {check.message}
                          </p>
                          
                          {/* Show details */}
                          {check.expected && check.actual && (
                            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                              <div className="p-1.5 bg-white/50 dark:bg-gray-800/50 rounded">
                                <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                                <span className="ml-1 text-gray-700 dark:text-gray-300">
                                  {typeof check.expected === 'object' 
                                    ? JSON.stringify(check.expected)
                                    : check.expected
                                  }
                                </span>
                              </div>
                              <div className="p-1.5 bg-white/50 dark:bg-gray-800/50 rounded">
                                <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                                <span className="ml-1 text-gray-700 dark:text-gray-300">
                                  {typeof check.actual === 'object' 
                                    ? JSON.stringify(check.actual)
                                    : check.actual
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Last run info */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Last checked: {new Date(health.runAt).toLocaleString()}</span>
                <button
                  onClick={onRunCheck}
                  className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Run again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConfigModal({ source, config, onClose, onSave }) {
  const [formData, setFormData] = useState({
    maxDelayMinutes: config?.maxDelayMinutes ?? defaultValidationConfig.maxDelayMinutes,
    requiredFields: config?.requiredFields ?? [],
    fieldTypes: config?.fieldTypes ?? {},
    nullThreshold: config?.nullThreshold ?? defaultValidationConfig.nullThreshold,
    retentionDays: config?.retentionDays ?? (parseRetentionToDays(source.retention) || defaultValidationConfig.retentionDays),
    lookbackQuery: config?.lookbackQuery ?? '',
    linkedDetections: config?.linkedDetections ?? [],
    expectedTier: config?.expectedTier ?? defaultValidationConfig.expectedTier,
    tierTransitions: config?.tierTransitions ?? defaultValidationConfig.tierTransitions,
  });
  
  const [newField, setNewField] = useState('');
  const [newDetection, setNewDetection] = useState('');
  const [saving, setSaving] = useState(false);

  const suggestedFields = getSuggestedFields(source.category);

  const handleAddField = () => {
    if (newField && !formData.requiredFields.includes(newField)) {
      setFormData(prev => ({
        ...prev,
        requiredFields: [...prev.requiredFields, newField],
        fieldTypes: { ...prev.fieldTypes, [newField]: 'string' }
      }));
      setNewField('');
    }
  };

  const handleRemoveField = (field) => {
    setFormData(prev => {
      const { [field]: removed, ...restTypes } = prev.fieldTypes;
      return {
        ...prev,
        requiredFields: prev.requiredFields.filter(f => f !== field),
        fieldTypes: restTypes
      };
    });
  };

  const handleAddDetection = () => {
    if (newDetection && !formData.linkedDetections.includes(newDetection)) {
      setFormData(prev => ({
        ...prev,
        linkedDetections: [...prev.linkedDetections, newDetection]
      }));
      setNewDetection('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(source.id, formData);
      onClose();
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Validation Configuration</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{source.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-130px)] space-y-6">
          {/* Ingestion Delay */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="h-4 w-4 text-blue-500" />
              Ingestion Delay Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={formData.maxDelayMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, maxDelayMinutes: parseInt(e.target.value) || 5 }))}
                className="w-24 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">minutes (max acceptable delay)</span>
            </div>
          </div>

          {/* Required Fields */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileCode className="h-4 w-4 text-purple-500" />
              Required Schema Fields
            </label>
            
            {/* Suggested fields */}
            {suggestedFields.length > 0 && formData.requiredFields.length === 0 && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <span className="text-blue-700 dark:text-blue-300">Suggested fields for {source.category}:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {suggestedFields.slice(0, 6).map(field => (
                    <button
                      key={field}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          requiredFields: [...prev.requiredFields, field],
                          fieldTypes: { ...prev.fieldTypes, [field]: 'string' }
                        }));
                      }}
                      className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
                    >
                      + {field}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Field list */}
            <div className="space-y-1">
              {formData.requiredFields.map(field => (
                <div key={field} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="flex-1 text-sm text-gray-900 dark:text-white">{field}</span>
                  <select
                    value={formData.fieldTypes[field] || 'string'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fieldTypes: { ...prev.fieldTypes, [field]: e.target.value }
                    }))}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
                  >
                    {fieldTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveField(field)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add field name..."
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              />
              <button
                onClick={handleAddField}
                disabled={!newField}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Null Threshold */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckSquare className="h-4 w-4 text-orange-500" />
              Field Population Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.nullThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, nullThreshold: parseInt(e.target.value) || 10 }))}
                className="w-24 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">% max null/empty allowed</span>
            </div>
          </div>

          {/* Retention */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-green-500" />
              Expected Retention (Lookback)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={formData.retentionDays}
                onChange={(e) => setFormData(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 90 }))}
                className="w-24 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
            </div>
            <textarea
              placeholder="Optional: SIEM query to validate retention (e.g., index=firewall earliest=-365d | stats count)"
              value={formData.lookbackQuery}
              onChange={(e) => setFormData(prev => ({ ...prev, lookbackQuery: e.target.value }))}
              rows={2}
              className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs"
            />
          </div>

          {/* Storage Tier */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Database className="h-4 w-4 text-cyan-500" />
              Expected Storage Tier
            </label>
            <select
              value={formData.expectedTier}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedTier: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
            >
              {storageTierOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label} - {opt.description}</option>
              ))}
            </select>
          </div>

          {/* Linked Detections */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Bell className="h-4 w-4 text-red-500" />
              Linked Detection Rules
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add detection rule IDs that should fire from this log source
            </p>
            
            <div className="flex flex-wrap gap-1">
              {formData.linkedDetections.map(det => (
                <span 
                  key={det}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs"
                >
                  {det}
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      linkedDetections: prev.linkedDetections.filter(d => d !== det)
                    }))}
                    className="hover:text-red-900 dark:hover:text-red-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add detection ID (e.g., DET-001)"
                value={newDetection}
                onChange={(e) => setNewDetection(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDetection()}
                className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              />
              <button
                onClick={handleAddDetection}
                disabled={!newDetection}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm btn-gradient text-white rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RunCheckModal({ source, config, onClose, onSave }) {
  const [checks, setChecks] = useState(
    healthCheckTypes.map(checkType => ({
      checkId: checkType.id,
      status: 'skip',
      message: '',
      expected: null,
      actual: null,
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateCheck = (checkId, updates) => {
    setChecks(prev => prev.map(c => 
      c.checkId === checkId ? { ...c, ...updates } : c
    ));
  };

  const handleSave = async () => {
    // Filter out skipped checks
    const activeChecks = checks.filter(c => c.status !== 'skip');
    
    if (activeChecks.length === 0) {
      alert('Please record at least one check result');
      return;
    }

    setSaving(true);
    try {
      await onSave(source.id, activeChecks);
      onClose();
    } catch (err) {
      console.error('Failed to save health check:', err);
    } finally {
      setSaving(false);
    }
  };

  const checkIcons = {
    'delay-threshold': Clock,
    'schema-compliance': FileCode,
    'field-population': CheckSquare,
    'retention-lookback': Calendar,
    'detection-alignment': Bell,
    'storage-tier': Database,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Run Health Check</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{source.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-130px)] space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record the results of each validation check. Query your SIEM to gather the actual values, 
            then mark each check as Pass, Warning, or Fail.
          </p>

          {healthCheckTypes.map(checkType => {
            const Icon = checkIcons[checkType.id] || Activity;
            const check = checks.find(c => c.checkId === checkType.id);
            const configValue = config?.[checkType.configFields?.[0]];

            return (
              <div 
                key={checkType.id}
                className={`p-4 rounded border ${
                  check?.status === 'pass' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                  check?.status === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' :
                  check?.status === 'fail' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                  'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{checkType.name}</h4>
                      <select
                        value={check?.status || 'skip'}
                        onChange={(e) => updateCheck(checkType.id, { status: e.target.value })}
                        className={`px-2 py-1 text-xs rounded border ${
                          check?.status === 'pass' ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' :
                          check?.status === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300' :
                          check?.status === 'fail' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300' :
                          'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500'
                        }`}
                      >
                        <option value="skip">Skip</option>
                        <option value="pass">Pass</option>
                        <option value="warn">Warning</option>
                        <option value="fail">Fail</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{checkType.description}</p>
                    
                    {configValue !== undefined && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                        Expected: {typeof configValue === 'object' ? JSON.stringify(configValue) : configValue}
                      </p>
                    )}

                    {check?.status !== 'skip' && (
                      <div className="space-y-2 mt-3">
                        <input
                          type="text"
                          placeholder="Actual value observed..."
                          value={check?.actual || ''}
                          onChange={(e) => updateCheck(checkType.id, { actual: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Notes/message..."
                          value={check?.message || ''}
                          onChange={(e) => updateCheck(checkType.id, { message: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm btn-gradient text-white rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ source, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await sourceHealthAPI.getHistory(source.id);
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [source.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'warn': return 'bg-yellow-500';
      case 'fail': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Check History</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{source.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No health check history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <div 
                  key={record.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(record.overallStatus)}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.overallStatus === 'pass' ? 'Healthy' : 
                         record.overallStatus === 'warn' ? 'Warning' : 'Failed'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(record.runAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {record.checks?.map(check => (
                      <span 
                        key={check.checkId}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          check.status === 'pass' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          check.status === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                          check.status === 'fail' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {healthCheckTypes.find(t => t.id === check.checkId)?.name || check.checkId}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SourceHealth;
