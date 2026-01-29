import { useState, useMemo, useCallback } from 'react';
import {
  GitMerge,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Zap,
  Link,
  Layers,
  FileCode,
  Copy,
  X,
  Edit2,
  Trash2,
  Save,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ArrowRightCircle,
  Network,
  Database,
  Target
} from 'lucide-react';
import { relationshipTypes, statusOptions, targetTypes, targetStatusOptions } from '../constants';

function Relationships({ sources, targets, relationships, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'
  const [expandedSource, setExpandedSource] = useState(null);

  // Create a map of sources for quick lookup
  const sourcesMap = useMemo(() => {
    const map = {};
    sources.forEach(s => { map[s.id] = { ...s, entityType: 'source' }; });
    return map;
  }, [sources]);

  // Create a map of targets for quick lookup
  const targetsMap = useMemo(() => {
    const map = {};
    (targets || []).forEach(t => { map[t.id] = { ...t, entityType: 'target' }; });
    return map;
  }, [targets]);

  // Combined map for looking up any entity (source or target)
  const entitiesMap = useMemo(() => {
    return { ...sourcesMap, ...targetsMap };
  }, [sourcesMap, targetsMap]);

  // Helper to get entity by ID and type
  const getEntity = (id, entityType) => {
    if (entityType === 'target') {
      return targetsMap[id];
    }
    return sourcesMap[id];
  };

  // Filter relationships
  const filteredRelationships = useMemo(() => {
    return relationships.filter(rel => {
      const source = sourcesMap[rel.sourceId];
      const target = rel.targetType === 'target' ? targetsMap[rel.targetId] : sourcesMap[rel.targetId];
      
      const matchesSearch = !search || 
        source?.name?.toLowerCase().includes(search.toLowerCase()) ||
        target?.name?.toLowerCase().includes(search.toLowerCase()) ||
        rel.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || rel.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [relationships, sourcesMap, targetsMap, search, typeFilter]);

  // Group relationships by source
  const relationshipsBySource = useMemo(() => {
    const grouped = {};
    sources.forEach(source => {
      const outgoing = relationships.filter(r => r.sourceId === source.id);
      const incoming = relationships.filter(r => r.targetId === source.id && r.targetType !== 'target');
      if (outgoing.length > 0 || incoming.length > 0) {
        grouped[source.id] = {
          source,
          outgoing,
          incoming
        };
      }
    });
    return grouped;
  }, [sources, relationships]);

  // Count relationships to targets
  const targetRelationshipsCount = useMemo(() => {
    return relationships.filter(r => r.targetType === 'target').length;
  }, [relationships]);

  // Get icon component for relationship type
  const getTypeIcon = (type) => {
    const icons = {
      'feeds': ArrowRight,
      'enriches': Sparkles,
      'triggers': Zap,
      'depends-on': Link,
      'aggregates': Layers,
      'normalizes': FileCode,
      'correlates': GitMerge,
      'mirrors': Copy,
    };
    return icons[type] || ArrowRight;
  };

  const getTypeColor = (type) => {
    const relType = relationshipTypes.find(t => t.value === type);
    return relType?.color || 'gray';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600',
    };
    return colors[color] || colors.gray;
  };

  const getStatusColor = (status) => {
    const opt = statusOptions.find(s => s.value === status);
    return opt?.color || 'gray';
  };

  const getTargetStatusColor = (status) => {
    const opt = targetStatusOptions.find(s => s.value === status);
    return opt?.color || 'gray';
  };

  // Helper to get status color for any entity
  const getEntityStatusColor = (entity, entityType) => {
    if (entityType === 'target') {
      return getTargetStatusColor(entity?.status);
    }
    return getStatusColor(entity?.status);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-indigo-500" />
            Relationship Mapping
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Map data flows and dependencies between log sources
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                viewMode === 'graph' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Graph
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Relationship
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search relationships..."
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
          {relationshipTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{relationships.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Relationships</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(relationshipsBySource).length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Connected Sources</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {sources.length - Object.keys(relationshipsBySource).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Isolated Sources</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(relationshipTypes.filter(t => relationships.some(r => r.type === t.value)).map(t => t.value)).size}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Relationship Types Used</div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredRelationships.length === 0 ? (
            <div className="p-8 text-center">
              <Network className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <div className="text-gray-400 dark:text-gray-500 mb-2 text-sm">No relationships defined</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {relationships.length === 0 
                  ? 'Start mapping how your log sources connect to each other'
                  : 'Try adjusting your filters'}
              </p>
              {relationships.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 text-sm btn-gradient text-white rounded"
                >
                  Create First Relationship
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRelationships.map(rel => {
                const source = sourcesMap[rel.sourceId];
                const isTargetDestination = rel.targetType === 'target';
                const destination = isTargetDestination ? targetsMap[rel.targetId] : sourcesMap[rel.targetId];
                const TypeIcon = getTypeIcon(rel.type);
                const typeColor = getTypeColor(rel.type);
                const relType = relationshipTypes.find(t => t.value === rel.type);
                const destStatusColor = isTargetDestination ? getTargetStatusColor(destination?.status) : getStatusColor(destination?.status);
                const targetTypeInfo = isTargetDestination ? targetTypes.find(t => t.value === destination?.type) : null;
                
                return (
                  <div 
                    key={rel.id} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Source */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Database className="h-3.5 w-3.5 text-gray-400" />
                          <div className={`w-2 h-2 rounded-full bg-${getStatusColor(source?.status)}-500`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {source?.name || 'Unknown Source'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-5">{source?.category}</div>
                      </div>

                      {/* Relationship Type */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorClasses(typeColor)}`}>
                        <TypeIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{relType?.label}</span>
                      </div>

                      {/* Destination (Target or Source) */}
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {destination?.name || 'Unknown'}
                          </span>
                          <div className={`w-2 h-2 rounded-full bg-${destStatusColor}-500`} />
                          {isTargetDestination ? (
                            <Target className="h-3.5 w-3.5 text-purple-500" />
                          ) : (
                            <Database className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {isTargetDestination ? (
                            <span className="flex items-center justify-end gap-1">
                              <span className="text-purple-500">{targetTypeInfo?.label || destination?.type}</span>
                              {destination?.vendor && <span>• {destination.vendor}</span>}
                            </span>
                          ) : (
                            destination?.category
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => setEditingRelationship(rel)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(rel)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    {rel.description && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 pl-4">
                        {rel.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Graph View */
        <GraphView
          sources={sources}
          targets={targets}
          relationships={relationships}
          sourcesMap={sourcesMap}
          targetsMap={targetsMap}
          relationshipsBySource={relationshipsBySource}
          getTypeIcon={getTypeIcon}
          getTypeColor={getTypeColor}
          getColorClasses={getColorClasses}
          getStatusColor={getStatusColor}
          getTargetStatusColor={getTargetStatusColor}
          expandedSource={expandedSource}
          setExpandedSource={setExpandedSource}
          onEdit={setEditingRelationship}
          onDelete={setDeleteConfirm}
        />
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingRelationship) && (
        <RelationshipModal
          relationship={editingRelationship}
          sources={sources}
          targets={targets}
          onClose={() => {
            setShowAddModal(false);
            setEditingRelationship(null);
          }}
          onSave={async (data) => {
            if (editingRelationship) {
              await onUpdate(editingRelationship.id, data);
            } else {
              await onCreate(data);
            }
            setShowAddModal(false);
            setEditingRelationship(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          relationship={deleteConfirm}
          sourcesMap={sourcesMap}
          targetsMap={targetsMap}
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

function GraphView({ 
  sources,
  targets, 
  relationships, 
  sourcesMap,
  targetsMap, 
  relationshipsBySource, 
  getTypeIcon, 
  getTypeColor, 
  getColorClasses, 
  getStatusColor,
  getTargetStatusColor,
  expandedSource,
  setExpandedSource,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-2">
      {Object.entries(relationshipsBySource).map(([sourceId, data]) => {
        const isExpanded = expandedSource === sourceId;
        
        return (
          <div 
            key={sourceId}
            className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedSource(isExpanded ? null : sourceId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                <Database className="h-4 w-4 text-gray-400" />
                <div className={`w-3 h-3 rounded-full bg-${getStatusColor(data.source.status)}-500`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{data.source.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({data.source.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {data.outgoing.length} outgoing • {data.incoming.length} incoming
                </span>
              </div>
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                {data.outgoing.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Outgoing ({data.outgoing.length})
                    </div>
                    <div className="space-y-2">
                      {data.outgoing.map(rel => {
                        const isTargetDest = rel.targetType === 'target';
                        const destination = isTargetDest ? targetsMap[rel.targetId] : sourcesMap[rel.targetId];
                        const TypeIcon = getTypeIcon(rel.type);
                        const typeColor = getTypeColor(rel.type);
                        const relType = relationshipTypes.find(t => t.value === rel.type);
                        const destStatusColor = isTargetDest ? getTargetStatusColor(destination?.status) : getStatusColor(destination?.status);
                        const targetTypeInfo = isTargetDest ? targetTypes.find(t => t.value === destination?.type) : null;
                        
                        return (
                          <div key={rel.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <ArrowRightCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${getColorClasses(typeColor)}`}>
                              <TypeIcon className="h-3 w-3" />
                              {relType?.label}
                            </div>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              {isTargetDest ? (
                                <Target className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                              ) : (
                                <Database className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              )}
                              <div className={`w-2 h-2 rounded-full bg-${destStatusColor}-500 flex-shrink-0`} />
                              <div className="min-w-0">
                                <span className="text-sm text-gray-900 dark:text-white">{destination?.name || 'Unknown'}</span>
                                {isTargetDest && targetTypeInfo && (
                                  <span className="text-xs text-purple-500 ml-1">({targetTypeInfo.label})</span>
                                )}
                                {rel.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rel.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => onEdit(rel)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button onClick={() => onDelete(rel)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {data.incoming.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Incoming ({data.incoming.length})
                    </div>
                    <div className="space-y-2">
                      {data.incoming.map(rel => {
                        const source = sourcesMap[rel.sourceId];
                        const TypeIcon = getTypeIcon(rel.type);
                        const typeColor = getTypeColor(rel.type);
                        const relType = relationshipTypes.find(t => t.value === rel.type);
                        
                        return (
                          <div key={rel.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <ArrowRightCircle className="h-4 w-4 text-gray-400 flex-shrink-0 rotate-180" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-900 dark:text-white">{source?.name || 'Unknown'}</span>
                              {rel.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rel.description}</p>
                              )}
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${getColorClasses(typeColor)}`}>
                              <TypeIcon className="h-3 w-3" />
                              {relType?.label}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => onEdit(rel)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button onClick={() => onDelete(rel)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {Object.keys(relationshipsBySource).length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Network className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <div className="text-gray-400 dark:text-gray-500 text-sm">No relationships to display</div>
        </div>
      )}
    </div>
  );
}

function RelationshipModal({ relationship, sources, onClose, onSave }) {
  const [formData, setFormData] = useState(relationship || {
    sourceId: '',
    targetId: '',
    type: 'feeds',
    description: '',
    dataFlow: '',
    protocol: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceId || !formData.targetId) {
      setError('Please select both source and target');
      return;
    }
    
    if (formData.sourceId === formData.targetId) {
      setError('Source and target cannot be the same');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {relationship ? 'Edit Relationship' : 'Add Relationship'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source *
              </label>
              <select
                value={formData.sourceId}
                onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select source...</option>
                {sources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name} ({source.category})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target *
              </label>
              <select
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select target...</option>
                {sources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name} ({source.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relationship Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {relationshipTypes.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <div className={`w-1.5 h-1.5 rounded-full bg-${type.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">{type.label}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe this relationship..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Flow / Port
              </label>
              <input
                type="text"
                value={formData.dataFlow || ''}
                onChange={(e) => setFormData({ ...formData, dataFlow: e.target.value })}
                placeholder="e.g., TCP/514, HTTPS/443"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protocol / Format
              </label>
              <input
                type="text"
                value={formData.protocol || ''}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                placeholder="e.g., Syslog, CEF, JSON"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
              {saving ? 'Saving...' : relationship ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ relationship, sourcesMap, onClose, onConfirm }) {
  const source = sourcesMap[relationship.sourceId];
  const target = sourcesMap[relationship.targetId];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Relationship?
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete the relationship between:
          </p>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm mb-4">
            <span className="font-medium text-gray-900 dark:text-white">{source?.name || 'Unknown'}</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-medium text-gray-900 dark:text-white">{target?.name || 'Unknown'}</span>
          </div>
          
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

export default Relationships;
