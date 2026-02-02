import { useState, useMemo, useEffect } from 'react';
import { 
  Layers,
  Search,
  Database,
  Shield,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  X,
  Save,
  Trash2,
  ExternalLink,
  History,
  Play,
  Eye,
  Download,
  ChevronDown,
  ChevronRight,
  Link2,
  Zap,
  Info,
  Check,
  Loader2
} from 'lucide-react';
import { 
  integrationTypes,
  importModeOptions,
  integrationStatusOptions,
  criblTypeToCategory
} from '../constants';
import { integrationsAPI } from '../api';

function Integrations({ integrations, sources, onCreate, onUpdate, onDelete, onRefreshSources }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [expandedIntegration, setExpandedIntegration] = useState(null);
  const [testingConnection, setTestingConnection] = useState(null);
  const [syncingIntegration, setSyncingIntegration] = useState(null);

  // Get integration type info
  const getIntegrationType = (typeId) => {
    return integrationTypes.find(t => t.id === typeId);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = integrations.length;
    const synced = integrations.filter(i => i.status === 'synced').length;
    const errors = integrations.filter(i => i.status === 'error').length;
    const totalSynced = integrations.reduce((sum, i) => sum + (i.syncCount || 0), 0);
    const criblImported = sources.filter(s => s.criblId).length;
    
    return {
      total,
      synced,
      errors,
      totalSynced,
      criblImported
    };
  }, [integrations, sources]);

  // Test connection handler
  const handleTestConnection = async (integration) => {
    setTestingConnection(integration.id);
    try {
      const result = await integrationsAPI.test(integration.id);
      alert(result.success 
        ? `✓ Connection successful!\n${result.version ? `Version: ${result.version}` : ''}` 
        : `✗ Connection failed: ${result.message}`
      );
    } catch (err) {
      alert(`✗ Connection failed: ${err.message}`);
    } finally {
      setTestingConnection(null);
    }
  };

  // Sync handler
  const handleSync = async (integration, options = {}) => {
    setSyncingIntegration(integration.id);
    try {
      const result = await integrationsAPI.sync(integration.id, options);
      
      if (result.success) {
        alert(`✓ Sync completed!\n\nImported: ${result.imported}\nUpdated: ${result.updated}\nSkipped: ${result.skipped}`);
        // Refresh sources list
        if (onRefreshSources) {
          await onRefreshSources();
        }
      } else {
        alert(`✗ Sync failed: ${result.message}`);
      }
    } catch (err) {
      alert(`✗ Sync failed: ${err.message}`);
    } finally {
      setSyncingIntegration(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Link2 className="h-5 w-5 text-purple-500" />
            Integrations
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Connect to external systems to auto-discover and sync log sources
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Integration
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          title="Integrations" 
          value={stats.total} 
          icon={Link2}
          color="purple"
        />
        <StatCard 
          title="Active" 
          value={stats.synced}
          subtitle={stats.errors > 0 ? `${stats.errors} with errors` : undefined}
          icon={CheckCircle}
          color="green"
        />
        <StatCard 
          title="Sources Synced" 
          value={stats.totalSynced}
          icon={RefreshCw}
          color="blue"
        />
        <StatCard 
          title="From Cribl" 
          value={stats.criblImported}
          subtitle="sources in inventory"
          icon={Layers}
          color="cyan"
        />
      </div>

      {/* Available Integration Types */}
      <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Available Connectors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {integrationTypes.map(type => {
            const IconComponent = getIconComponent(type.icon);
            const isConfigured = integrations.some(i => i.type === type.id);
            
            return (
              <button
                key={type.id}
                onClick={() => setShowAddModal(type.id)}
                className={`p-3 rounded border text-left transition-all ${
                  isConfigured
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-300'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded ${getColorClasses(type.color)}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</span>
                  {isConfigured && <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto" />}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configured Integrations */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configured Integrations</h3>
        
        {integrations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 dark:text-gray-400 mb-2">No integrations configured</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Add an integration to auto-discover log sources from external systems
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm btn-gradient text-white rounded"
            >
              <Plus className="h-4 w-4" />
              Add Integration
            </button>
          </div>
        ) : (
          integrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              type={getIntegrationType(integration.type)}
              isExpanded={expandedIntegration === integration.id}
              onToggle={() => setExpandedIntegration(expandedIntegration === integration.id ? null : integration.id)}
              onEdit={() => setEditingIntegration(integration)}
              onDelete={() => {
                if (confirm(`Delete integration "${integration.name}"?`)) {
                  onDelete(integration.id);
                }
              }}
              onTest={() => handleTestConnection(integration)}
              onSync={() => handleSync(integration, { importMode: 'new-only' })}
              onPreview={() => setShowPreviewModal(integration)}
              onShowHistory={() => setShowHistoryModal(integration)}
              isTesting={testingConnection === integration.id}
              isSyncing={syncingIntegration === integration.id}
              sources={sources}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingIntegration) && (
        <IntegrationModal
          integration={editingIntegration}
          preselectedType={typeof showAddModal === 'string' ? showAddModal : null}
          onClose={() => {
            setShowAddModal(false);
            setEditingIntegration(null);
          }}
          onSave={async (data) => {
            if (editingIntegration) {
              await onUpdate(editingIntegration.id, data);
            } else {
              await onCreate(data);
            }
            setShowAddModal(false);
            setEditingIntegration(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal
          integration={showPreviewModal}
          existingSources={sources}
          onClose={() => setShowPreviewModal(null)}
          onSync={async (options) => {
            await handleSync(showPreviewModal, options);
            setShowPreviewModal(null);
          }}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          integration={showHistoryModal}
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
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
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

function IntegrationCard({ integration, type, isExpanded, onToggle, onEdit, onDelete, onTest, onSync, onPreview, onShowHistory, isTesting, isSyncing, sources }) {
  const IconComponent = getIconComponent(type?.icon || 'Link2');
  
  const getStatusBadge = () => {
    const status = integrationStatusOptions.find(s => s.value === integration.status);
    const classes = {
      configured: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      synced: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      syncing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] ${classes[integration.status] || classes.configured}`}>
        {status?.label || 'Unknown'}
      </span>
    );
  };

  // Count sources from this integration
  const importedCount = sources.filter(s => s.integrationId === integration.id).length;

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
          <div className={`p-2 rounded ${getColorClasses(type?.color || 'gray')}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{integration.name}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {type?.name || integration.type} • {integration.baseUrl}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-600 dark:text-gray-400">{importedCount} sources</p>
            {integration.lastSync && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Last sync: {new Date(integration.lastSync).toLocaleDateString()}
              </p>
            )}
          </div>
          {getStatusBadge()}
          
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={onTest}
              disabled={isTesting}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              title="Test connection"
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </button>
            <button
              onClick={onPreview}
              className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Preview sources"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              title="Sync sources"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Type</p>
              <p className="text-sm text-gray-900 dark:text-white">{type?.name || integration.type}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Worker Group</p>
              <p className="text-sm text-gray-900 dark:text-white">{integration.workerGroup || 'Default'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Total Synced</p>
              <p className="text-sm text-gray-900 dark:text-white">{integration.syncCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Created</p>
              <p className="text-sm text-gray-900 dark:text-white">{new Date(integration.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onShowHistory}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <History className="h-3.5 w-3.5" />
              View sync history
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Settings className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationModal({ integration, preselectedType, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState(integration?.type || preselectedType || '');
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    baseUrl: integration?.baseUrl || '',
    apiToken: '',
    workerGroup: integration?.workerGroup || '',
    ...integration
  });
  const [saving, setSaving] = useState(false);

  const typeConfig = integrationTypes.find(t => t.id === selectedType);

  const handleSave = async () => {
    if (!selectedType || !formData.name || !formData.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!integration && !formData.apiToken) {
      alert('API token is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        type: selectedType
      });
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {integration ? 'Edit Integration' : 'Add Integration'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-130px)] space-y-4">
          {/* Type Selection */}
          {!integration && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Integration Type</label>
              <div className="grid grid-cols-2 gap-2">
                {integrationTypes.filter(t => !t.comingSoon).map(type => {
                  const Icon = getIconComponent(type.icon);
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded border text-left transition-all ${
                        selectedType === type.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedType && (
            <>
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Integration Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Production Cribl"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>

              {/* Dynamic fields from type config */}
              {typeConfig?.configFields.map(field => (
                <div key={field.id} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type === 'password' ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                  />
                  {field.id === 'apiToken' && integration && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Leave empty to keep existing token
                    </p>
                  )}
                </div>
              ))}

              {/* Documentation link */}
              {typeConfig?.docUrl && (
                <a
                  href={typeConfig.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View API documentation
                </a>
              )}
            </>
          )}
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
            disabled={saving || !selectedType}
            className="px-4 py-1.5 text-sm btn-gradient text-white rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : (integration ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ integration, existingSources, onClose, onSync }) {
  const [loading, setLoading] = useState(true);
  const [previewSources, setPreviewSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState(new Set());
  const [importMode, setImportMode] = useState('new-only');
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function loadPreview() {
      try {
        const result = await integrationsAPI.preview(integration.id);
        if (result.success) {
          setPreviewSources(result.sources || []);
          // Auto-select new sources
          const newSources = (result.sources || []).filter(s => 
            !existingSources.some(e => e.criblId === s.criblId || e.name.toLowerCase() === s.name.toLowerCase())
          );
          setSelectedSources(new Set(newSources.map(s => s.criblId)));
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, [integration.id, existingSources]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSync({
        importMode,
        selectedSources: [...selectedSources]
      });
    } finally {
      setSyncing(false);
    }
  };

  const toggleSource = (criblId) => {
    setSelectedSources(prev => {
      const next = new Set(prev);
      if (next.has(criblId)) {
        next.delete(criblId);
      } else {
        next.add(criblId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedSources.size === previewSources.length) {
      setSelectedSources(new Set());
    } else {
      setSelectedSources(new Set(previewSources.map(s => s.criblId)));
    }
  };

  // Check which sources already exist
  const getSourceStatus = (source) => {
    const existing = existingSources.find(e => 
      e.criblId === source.criblId || e.name.toLowerCase() === source.name.toLowerCase()
    );
    if (existing) {
      return { exists: true, source: existing };
    }
    return { exists: false };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Sources</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{integration.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Fetching sources from Cribl...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : previewSources.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No sources found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Import mode */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">Import mode:</span>
                <div className="flex gap-2">
                  {importModeOptions.filter(o => o.value !== 'preview').map(option => (
                    <button
                      key={option.value}
                      onClick={() => setImportMode(option.value)}
                      className={`px-2 py-1 text-xs rounded ${
                        importMode === option.value
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select all */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleAll}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {selectedSources.size === previewSources.length ? 'Deselect all' : 'Select all'}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedSources.size} of {previewSources.length} selected
                </span>
              </div>

              {/* Source list */}
              <div className="space-y-2">
                {previewSources.map(source => {
                  const status = getSourceStatus(source);
                  return (
                    <div 
                      key={source.criblId}
                      className={`p-3 rounded border ${
                        selectedSources.has(source.criblId)
                          ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSources.has(source.criblId)}
                          onChange={() => toggleSource(source.criblId)}
                          className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</span>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] text-gray-600 dark:text-gray-400">
                              {source.criblType}
                            </span>
                            {status.exists && (
                              <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-[10px] text-yellow-700 dark:text-yellow-400">
                                Exists
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {source.category} • {source.logType} • {source.status === 'collected' ? 'Active' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {previewSources.filter(s => !getSourceStatus(s).exists).length} new sources,{' '}
            {previewSources.filter(s => getSourceStatus(s).exists).length} existing
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSync}
              disabled={syncing || selectedSources.size === 0}
              className="px-4 py-1.5 text-sm btn-gradient text-white rounded disabled:opacity-50"
            >
              {syncing ? 'Importing...' : `Import ${selectedSources.size} Sources`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ integration, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await integrationsAPI.getHistory(integration.id);
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [integration.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sync History</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{integration.name}</p>
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
              <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No sync history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(record => (
                <div 
                  key={record.id}
                  className={`p-3 rounded border ${
                    record.success 
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {record.success 
                        ? <CheckCircle className="h-4 w-4 text-green-500" />
                        : <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.success ? 'Sync successful' : 'Sync failed'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(record.syncedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Found:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{record.sourcesFound || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Imported:</span>
                      <span className="ml-1 text-green-600 dark:text-green-400">{record.sourcesImported || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                      <span className="ml-1 text-blue-600 dark:text-blue-400">{record.sourcesUpdated || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Skipped:</span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400">{record.sourcesSkipped || 0}</span>
                    </div>
                  </div>
                  {record.message && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{record.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getIconComponent(iconName) {
  const icons = {
    Layers,
    Search,
    Database,
    Shield,
    Link2,
  };
  return icons[iconName] || Link2;
}

function getColorClasses(color) {
  const classes = {
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  };
  return classes[color] || classes.gray;
}

export default Integrations;
