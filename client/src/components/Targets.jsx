import { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Server,
  Shield,
  Database,
  Cloud,
  Eye,
  Monitor,
  Network,
  Archive,
  BarChart,
  Box,
  Zap,
  Ticket,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Activity,
  HardDrive,
  Clock,
  Link2,
  CheckCircle
} from 'lucide-react';
import { targetTypes, targetStatusOptions } from '../constants';

function Targets({ targets, sources, relationships, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedTarget, setExpandedTarget] = useState(null);

  // Get icon component for target type
  const getTypeIcon = (type) => {
    const icons = {
      'siem': Shield,
      'soar': Zap,
      'data-lake': Database,
      'log-collector': Server,
      'cloud-storage': Cloud,
      'xdr': Eye,
      'edr': Monitor,
      'ndr': Network,
      'ticketing': Ticket,
      'archive': Archive,
      'analytics': BarChart,
      'other': Box,
    };
    return icons[type] || Box;
  };

  const getTypeColor = (type) => {
    const targetType = targetTypes.find(t => t.value === type);
    return targetType?.color || 'gray';
  };

  const getStatusColor = (status) => {
    const opt = targetStatusOptions.find(s => s.value === status);
    return opt?.color || 'gray';
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700',
      sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-700',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-700',
      slate: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600',
    };
    return colors[color] || colors.gray;
  };

  const getStatusBadgeClasses = (status) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      maintenance: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      degraded: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      offline: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      planned: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      decommissioned: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    };
    return colors[status] || colors.planned;
  };

  // Filter targets
  const filteredTargets = useMemo(() => {
    return targets.filter(target => {
      const matchesSearch = !search || 
        target.name?.toLowerCase().includes(search.toLowerCase()) ||
        target.description?.toLowerCase().includes(search.toLowerCase()) ||
        target.vendor?.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || target.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || target.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [targets, search, typeFilter, statusFilter]);

  // Calculate sources ingested per target
  const sourcesPerTarget = useMemo(() => {
    const map = {};
    targets.forEach(target => {
      // Count sources that have this target as their ingestion destination
      const ingestedSources = sources.filter(s => s.targetId === target.id);
      map[target.id] = ingestedSources;
    });
    return map;
  }, [targets, sources]);

  // Calculate relationships to each target
  const relationshipsPerTarget = useMemo(() => {
    const map = {};
    targets.forEach(target => {
      const targetRelationships = (relationships || []).filter(r => 
        r.targetType === 'target' && r.targetId === target.id
      );
      map[target.id] = targetRelationships;
    });
    return map;
  }, [targets, relationships]);

  // Stats
  const stats = useMemo(() => {
    const totalRelationshipsToTargets = (relationships || []).filter(r => r.targetType === 'target').length;
    return {
      total: targets.length,
      active: targets.filter(t => t.status === 'active').length,
      totalRelationships: totalRelationshipsToTargets,
      byType: targetTypes.reduce((acc, type) => {
        acc[type.value] = targets.filter(t => t.type === type.value).length;
        return acc;
      }, {}),
    };
  }, [targets, relationships]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Target Inventory
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Manage ingestion destinations for your log sources
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Target
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search targets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          {targetTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          {targetStatusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Targets"
          value={stats.total}
          subtitle={`${stats.byType['siem'] || 0} SIEMs, ${stats.byType['data-lake'] || 0} data lakes`}
          icon={Target}
          color="purple"
        />
        <StatCard
          title="Active"
          value={stats.active}
          subtitle={stats.active === stats.total ? 'all operational' : `${stats.total - stats.active} inactive`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Relationships"
          value={stats.totalRelationships}
          subtitle="source connections"
          icon={Link2}
          color="indigo"
        />
        <StatCard
          title="Log Collectors"
          value={stats.byType['log-collector'] || 0}
          subtitle={`${stats.byType['xdr'] || 0} XDR, ${stats.byType['edr'] || 0} EDR`}
          icon={Server}
          color="cyan"
        />
      </div>

      {/* Target List */}
      <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredTargets.length === 0 ? (
          <div className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <div className="text-gray-400 dark:text-gray-500 mb-2 text-sm">No targets defined</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {targets.length === 0 
                ? 'Add your SIEM, data lake, and other log destinations'
                : 'Try adjusting your filters'}
            </p>
            {targets.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 text-sm btn-gradient text-white rounded"
              >
                Add First Target
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTargets.map(target => {
              const TypeIcon = getTypeIcon(target.type);
              const typeColor = getTypeColor(target.type);
              const targetType = targetTypes.find(t => t.value === target.type);
              const statusOpt = targetStatusOptions.find(s => s.value === target.status);
              const ingestedSources = sourcesPerTarget[target.id] || [];
              const isExpanded = expandedTarget === target.id;
              
              return (
                <div key={target.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={`p-2 rounded-lg border ${getColorClasses(typeColor)}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {target.name}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClasses(target.status)}`}>
                            {statusOpt?.label || target.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Box className="h-3 w-3" />
                            {targetType?.label}
                          </span>
                          {target.vendor && (
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {target.vendor}
                            </span>
                          )}
                          {target.version && (
                            <span>v{target.version}</span>
                          )}
                        </div>

                        {target.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {target.description}
                          </p>
                        )}

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <button
                            onClick={() => setExpandedTarget(isExpanded ? null : target.id)}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <Database className="h-3 w-3" />
                            {ingestedSources.length} sources ingested
                          </button>
                          {target.endpoint && (
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Link2 className="h-3 w-3" />
                              {target.endpoint}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingTarget(target)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(target)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sources */}
                  {isExpanded && ingestedSources.length > 0 && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="ml-11 p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Ingested Sources
                        </div>
                        <div className="space-y-1.5">
                          {ingestedSources.map(source => (
                            <div key={source.id} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full bg-${getStatusColor(source.status)}-500`} />
                              <span className="text-gray-900 dark:text-white">{source.name}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">({source.category})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTarget) && (
        <TargetModal
          target={editingTarget}
          onClose={() => {
            setShowAddModal(false);
            setEditingTarget(null);
          }}
          onSave={async (data) => {
            if (editingTarget) {
              await onUpdate(editingTarget.id, data);
            } else {
              await onCreate(data);
            }
            setShowAddModal(false);
            setEditingTarget(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          target={deleteConfirm}
          sourcesCount={(sourcesPerTarget[deleteConfirm.id] || []).length}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={async () => {
            await onDelete(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
}

function TargetModal({ target, onClose, onSave }) {
  const [formData, setFormData] = useState(target || {
    name: '',
    type: 'siem',
    status: 'active',
    vendor: '',
    version: '',
    description: '',
    endpoint: '',
    port: '',
    protocol: '',
    credentials: '',
    retentionDays: '',
    capacityGB: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      setError('Target name is required');
      return;
    }
    
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {target ? 'Edit Target' : 'Add Target'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Production SIEM, Security Data Lake"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {targetTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label} - {type.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {targetStatusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vendor / Product
              </label>
              <input
                type="text"
                value={formData.vendor || ''}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="e.g., Splunk, Microsoft Sentinel, Elastic"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={formData.version || ''}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g., 9.1.0, 2024.1"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe this target's purpose and scope..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Connection Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Connection Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endpoint / URL
                </label>
                <input
                  type="text"
                  value={formData.endpoint || ''}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="e.g., https://siem.company.com, 10.0.1.50"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={formData.port || ''}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  placeholder="e.g., 514, 9997"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Protocol
                </label>
                <input
                  type="text"
                  value={formData.protocol || ''}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  placeholder="e.g., Syslog TCP, HTTPS, HEC"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credentials Reference
                </label>
                <input
                  type="text"
                  value={formData.credentials || ''}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  placeholder="e.g., Vault path, secret name"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Capacity Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Capacity & Retention</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Retention (days)
                </label>
                <input
                  type="number"
                  value={formData.retentionDays || ''}
                  onChange={(e) => setFormData({ ...formData, retentionDays: e.target.value })}
                  placeholder="e.g., 90, 365"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity (GB)
                </label>
                <input
                  type="number"
                  value={formData.capacityGB || ''}
                  onChange={(e) => setFormData({ ...formData, capacityGB: e.target.value })}
                  placeholder="e.g., 500, 10000"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes or documentation links..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm btn-gradient text-white rounded disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : target ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ target, sourcesCount, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Target?
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete <strong>{target.name}</strong>?
          </p>
          
          {sourcesCount > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-700 dark:text-yellow-400 mb-4">
              <strong>Warning:</strong> {sourcesCount} log source{sourcesCount !== 1 ? 's' : ''} currently target{sourcesCount === 1 ? 's' : ''} this destination. You may need to update their target assignments.
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component for consistent styling
function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500',
    cyan: 'text-cyan-500',
    orange: 'text-orange-500',
  };

  const valueColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${valueColorClasses[color]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default Targets;
