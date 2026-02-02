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
  Target,
  Link2,
  AlertCircle
} from 'lucide-react';
import { relationshipTypes, statusOptions, targetTypes, targetStatusOptions } from '../constants';

function Relationships({ sources, targets, relationships, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' (Sources) or 'targets'
  const [expandedSource, setExpandedSource] = useState(null);
  const [expandedTarget, setExpandedTarget] = useState(null);

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
      // Handle both source types (log source or target as source for chained flows)
      const sourceEntity = rel.sourceType === 'target' ? targetsMap[rel.sourceId] : sourcesMap[rel.sourceId];
      const targetEntity = rel.targetType === 'target' ? targetsMap[rel.targetId] : sourcesMap[rel.targetId];
      
      const matchesSearch = !search || 
        sourceEntity?.name?.toLowerCase().includes(search.toLowerCase()) ||
        targetEntity?.name?.toLowerCase().includes(search.toLowerCase()) ||
        rel.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || rel.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [relationships, sourcesMap, targetsMap, search, typeFilter]);

  // Group relationships by source (only log sources, not target-to-target)
  const relationshipsBySource = useMemo(() => {
    const grouped = {};
    sources.forEach(source => {
      // Outgoing: relationships where this source is the origin (and sourceType is 'source' or undefined)
      const outgoing = relationships.filter(r => r.sourceId === source.id && (!r.sourceType || r.sourceType === 'source'));
      // Incoming: relationships where this source is the destination (targetType must be 'source' or undefined)
      const incoming = relationships.filter(r => r.targetId === source.id && (!r.targetType || r.targetType === 'source'));
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

  // Group relationships by target (ingestion destinations) - includes both incoming and outgoing for chained flows
  const relationshipsByTarget = useMemo(() => {
    const grouped = {};
    
    (targets || []).forEach(target => {
      // Incoming: relationships where this target is the destination
      const incoming = relationships.filter(r => r.targetId === target.id && r.targetType === 'target');
      // Outgoing: relationships where this target is the source (for chained flows like Cribl → ADX)
      const outgoing = relationships.filter(r => r.sourceId === target.id && r.sourceType === 'target');
      
      if (incoming.length > 0 || outgoing.length > 0) {
        grouped[target.id] = {
          target,
          incoming,
          outgoing
        };
      }
    });
    return grouped;
  }, [targets, relationships]);

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
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                viewMode === 'graph' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Database className="h-3 w-3" />
              Sources
            </button>
            <button
              onClick={() => setViewMode('targets')}
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                viewMode === 'targets' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Target className="h-3 w-3" />
              Targets
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Relationships"
          value={relationships.length}
          subtitle={`${targetRelationshipsCount} to targets`}
          icon={GitMerge}
          color="indigo"
        />
        <StatCard
          title="Connected Sources"
          value={Object.keys(relationshipsBySource).length}
          subtitle={`of ${sources.length} sources`}
          icon={Link2}
          color="green"
        />
        <StatCard
          title="Isolated Sources"
          value={sources.length - Object.keys(relationshipsBySource).length}
          subtitle={sources.length - Object.keys(relationshipsBySource).length > 0 ? 'need connections' : 'all connected'}
          icon={AlertCircle}
          color={sources.length - Object.keys(relationshipsBySource).length > 0 ? 'yellow' : 'green'}
        />
        <StatCard
          title="Active Targets"
          value={Object.keys(relationshipsByTarget).length}
          subtitle={`of ${(targets || []).length} targets`}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Content */}
      {viewMode === 'graph' ? (
        /* Sources Graph View */
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
      ) : (
        /* Targets Graph View */
        <TargetsGraphView
          targets={targets}
          sourcesMap={sourcesMap}
          targetsMap={targetsMap}
          relationshipsByTarget={relationshipsByTarget}
          getTypeIcon={getTypeIcon}
          getTypeColor={getTypeColor}
          getColorClasses={getColorClasses}
          getStatusColor={getStatusColor}
          getTargetStatusColor={getTargetStatusColor}
          expandedTarget={expandedTarget}
          setExpandedTarget={setExpandedTarget}
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

function TargetsGraphView({
  targets,
  sourcesMap,
  targetsMap,
  relationshipsByTarget,
  getTypeIcon,
  getTypeColor,
  getColorClasses,
  getStatusColor,
  getTargetStatusColor,
  expandedTarget,
  setExpandedTarget,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-2">
      {Object.entries(relationshipsByTarget).map(([targetId, data]) => {
        const isExpanded = expandedTarget === targetId;
        const target = data.target;
        const targetTypeInfo = targetTypes.find(t => t.value === target.type);
        const incomingCount = data.incoming.length;
        const outgoingCount = data.outgoing?.length || 0;
        
        // Group incoming by relationship type for summary
        const typeGroups = {};
        data.incoming.forEach(rel => {
          if (!typeGroups[rel.type]) {
            typeGroups[rel.type] = [];
          }
          typeGroups[rel.type].push(rel);
        });
        
        return (
          <div 
            key={targetId}
            className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedTarget(isExpanded ? null : targetId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                <Target className="h-4 w-4 text-purple-500" />
                <div className={`w-3 h-3 rounded-full bg-${getTargetStatusColor(target.status)}-500`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{target.name}</span>
                <span className="text-xs text-purple-500">({targetTypeInfo?.label || target.type})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {incomingCount} in{outgoingCount > 0 ? ` • ${outgoingCount} out` : ''}
                </span>
                <div className="flex items-center gap-1">
                  {Object.entries(typeGroups).slice(0, 3).map(([type, rels]) => {
                    const TypeIcon = getTypeIcon(type);
                    const color = getTypeColor(type);
                    return (
                      <div key={type} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${getColorClasses(color)}`}>
                        <TypeIcon className="h-2.5 w-2.5" />
                        <span>{rels.length}</span>
                      </div>
                    );
                  })}
                  {Object.keys(typeGroups).length > 3 && (
                    <span className="text-[10px] text-gray-400">+{Object.keys(typeGroups).length - 3}</span>
                  )}
                </div>
              </div>
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                {/* Incoming sources */}
                {incomingCount > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Incoming Sources ({incomingCount})
                    </div>
                    <div className="space-y-2">
                      {data.incoming.map(rel => {
                        // Handle both source types (log source or target as source for chained flows)
                        const isSourceTarget = rel.sourceType === 'target';
                        const sourceEntity = isSourceTarget ? targetsMap[rel.sourceId] : sourcesMap[rel.sourceId];
                        const sourceTypeInfo = isSourceTarget ? targetTypes.find(t => t.value === sourceEntity?.type) : null;
                        const sourceStatusColor = isSourceTarget ? getTargetStatusColor(sourceEntity?.status) : getStatusColor(sourceEntity?.status);
                        const TypeIcon = getTypeIcon(rel.type);
                        const typeColor = getTypeColor(rel.type);
                        const relType = relationshipTypes.find(t => t.value === rel.type);
                        
                        return (
                          <div key={rel.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            {isSourceTarget ? (
                              <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            ) : (
                              <Database className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            )}
                            <div className={`w-2 h-2 rounded-full bg-${sourceStatusColor}-500 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-900 dark:text-white">{sourceEntity?.name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                ({isSourceTarget ? (sourceTypeInfo?.label || sourceEntity?.type) : sourceEntity?.category})
                              </span>
                              {rel.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rel.description}</p>
                              )}
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${getColorClasses(typeColor)}`}>
                              <TypeIcon className="h-3 w-3" />
                              {relType?.label}
                            </div>
                            {rel.dataFlow && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                {rel.dataFlow}
                              </span>
                            )}
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

                {/* Outgoing to other targets (chained flow) */}
                {outgoingCount > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                      Forwards To ({outgoingCount})
                    </div>
                    <div className="space-y-2">
                      {data.outgoing.map(rel => {
                        const destTarget = targetsMap[rel.targetId];
                        const destTypeInfo = targetTypes.find(t => t.value === destTarget?.type);
                        const TypeIcon = getTypeIcon(rel.type);
                        const typeColor = getTypeColor(rel.type);
                        const relType = relationshipTypes.find(t => t.value === rel.type);
                        
                        return (
                          <div key={rel.id} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                            <ArrowRightCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${getColorClasses(typeColor)}`}>
                              <TypeIcon className="h-3 w-3" />
                              {relType?.label}
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-green-400" />
                            <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <div className={`w-2 h-2 rounded-full bg-${getTargetStatusColor(destTarget?.status)}-500 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-900 dark:text-white">{destTarget?.name || 'Unknown'}</span>
                              <span className="text-xs text-purple-500 ml-1">({destTypeInfo?.label || destTarget?.type})</span>
                              {rel.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rel.description}</p>
                              )}
                            </div>
                            {rel.dataFlow && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                {rel.dataFlow}
                              </span>
                            )}
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
                
                {/* Summary stats for this target */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(typeGroups).map(([type, rels]) => {
                      const TypeIcon = getTypeIcon(type);
                      const color = getTypeColor(type);
                      const relType = relationshipTypes.find(t => t.value === type);
                      return (
                        <div key={type} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${getColorClasses(color)}`}>
                          <TypeIcon className="h-3 w-3" />
                          <span>{relType?.label}: {rels.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {Object.keys(relationshipsByTarget).length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <div className="text-gray-400 dark:text-gray-500 text-sm">No target feeds to display</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create relationships from sources to targets to see them here
          </p>
        </div>
      )}
    </div>
  );
}

function RelationshipModal({ relationship, sources, targets, onClose, onSave }) {
  const [formData, setFormData] = useState(relationship || {
    sourceId: '',
    sourceType: 'source', // 'source' or 'target' (for chained flows)
    targetId: '',
    targetType: 'source', // 'source' or 'target'
    type: 'feeds',
    description: '',
    dataFlow: '',
    protocol: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Handle source selection (Log Source or intermediate Target)
  const handleSourceChange = (value) => {
    if (!value) {
      setFormData({ ...formData, sourceId: '', sourceType: 'source' });
      return;
    }
    const [type, id] = value.split(':');
    setFormData({ ...formData, sourceId: id, sourceType: type });
  };

  const getSourceValue = () => {
    if (!formData.sourceId) return '';
    return `${formData.sourceType || 'source'}:${formData.sourceId}`;
  };

  // Handle destination selection (combined source + target dropdown)
  const handleDestinationChange = (value) => {
    if (!value) {
      setFormData({ ...formData, targetId: '', targetType: 'source' });
      return;
    }
    const [type, id] = value.split(':');
    setFormData({ ...formData, targetId: id, targetType: type });
  };

  const getDestinationValue = () => {
    if (!formData.targetId) return '';
    return `${formData.targetType}:${formData.targetId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceId || !formData.targetId) {
      setError('Please select both source and destination');
      return;
    }
    
    // Check if source and destination are the same entity
    const sameType = (formData.sourceType || 'source') === formData.targetType;
    if (sameType && formData.sourceId === formData.targetId) {
      setError('Source and destination cannot be the same');
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
                <span className="flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" />
                  Source *
                </span>
              </label>
              <select
                value={getSourceValue()}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select source...</option>
                {targets && targets.length > 0 && (
                  <optgroup label="🎯 Targets (for chained flows)">
                    {targets.filter(t => ['log-collector', 'log-aggregator', 'stream-processor'].includes(t.type)).map(target => {
                      const targetTypeInfo = targetTypes.find(tt => tt.value === target.type);
                      return (
                        <option key={`target:${target.id}`} value={`target:${target.id}`}>
                          {target.name} ({targetTypeInfo?.label || target.type})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                <optgroup label="📦 Log Sources">
                  {sources.map(source => (
                    <option key={`source:${source.id}`} value={`source:${source.id}`}>
                      {source.name} ({source.category})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Log Source or intermediate Target (e.g., Cribl)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination *
              </label>
              <select
                value={getDestinationValue()}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select destination...</option>
                {targets && targets.length > 0 && (
                  <optgroup label="🎯 Targets (Ingestion Destinations)">
                    {targets.map(target => {
                      const targetTypeInfo = targetTypes.find(t => t.value === target.type);
                      return (
                        <option key={`target:${target.id}`} value={`target:${target.id}`}>
                          {target.name} ({targetTypeInfo?.label || target.type})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                <optgroup label="📦 Log Sources">
                  {sources.map(source => (
                    <option key={`source:${source.id}`} value={`source:${source.id}`}>
                      {source.name} ({source.category})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select a Target (SIEM, data lake) or another Log Source
              </p>
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

function DeleteConfirmModal({ relationship, sourcesMap, targetsMap, onClose, onConfirm }) {
  // Handle both source types (log source or target as source for chained flows)
  const isTargetSource = relationship.sourceType === 'target';
  const sourceEntity = isTargetSource 
    ? targetsMap[relationship.sourceId]
    : sourcesMap[relationship.sourceId];
  const isTargetDestination = relationship.targetType === 'target';
  const destination = isTargetDestination 
    ? targetsMap[relationship.targetId]
    : sourcesMap[relationship.targetId];
  
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
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm mb-4 flex items-center gap-2">
            {isTargetSource ? (
              <Target className="h-4 w-4 text-purple-500" />
            ) : (
              <Database className="h-4 w-4 text-blue-500" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">{sourceEntity?.name || 'Unknown'}</span>
            <span className="mx-2 text-gray-400">→</span>
            {isTargetDestination ? (
              <Target className="h-4 w-4 text-purple-500" />
            ) : (
              <Database className="h-4 w-4 text-blue-500" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">{destination?.name || 'Unknown'}</span>
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

export default Relationships;
