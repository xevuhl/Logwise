import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  ChevronDown, 
  ChevronRight,
  Edit2,
  Trash2,
  X,
  Save,
  AlertTriangle,
  User,
  Mail,
  Clock,
  Database,
  Tag,
  CheckCircle,
  XCircle,
  Target,
  Link2,
  TrendingUp,
  Layers,
  Activity,
  Settings
} from 'lucide-react';
import { statusOptions, categoryOptions, logTypeOptions, criticalityTierOptions, retentionOptions, defaultTagOptions, validationTestLibrary } from '../constants';
import Pagination from './Pagination';
import ActivityTimeline from './ActivityTimeline';

function Inventory({ sources, onCreate, onUpdate, onDelete, onBulkImport, savedViews, onOpenOnboarding, targets, relationships, validationTests, userRole }) {
  const readOnly = userRole === 'viewer';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Calculate stats for summary cards
  const stats = useMemo(() => {
    const total = sources.length;
    const collected = sources.filter(s => s.status === 'collected').length;
    const partial = sources.filter(s => s.status === 'partial').length;
    const planned = sources.filter(s => s.status === 'planned').length;
    const notCollected = sources.filter(s => s.status === 'not-collected').length;
    const blocked = sources.filter(s => s.status === 'blocked').length;
    const collectionRate = total > 0 ? Math.round(((collected + partial * 0.5) / total) * 100) : 0;
    
    // Target assignments
    const sourcesWithTargets = sources.filter(s => s.targetId).length;
    const targetAssignmentRate = total > 0 ? Math.round((sourcesWithTargets / total) * 100) : 0;
    
    // Relationship count
    const relationshipCount = (relationships || []).length;
    
    // Validation tests count
    const testsAvailable = validationTestLibrary.length;
    
    return {
      total,
      collected,
      partial,
      planned,
      notCollected,
      blocked,
      collectionRate,
      testsAvailable,
      sourcesWithTargets,
      targetAssignmentRate,
      relationshipCount,
      gaps: notCollected + blocked,
    };
  }, [sources, relationships]);

  // Get all used tags from sources
  const allUsedTags = useMemo(() => {
    const tags = new Set();
    sources.forEach(source => {
      (source.tags || []).forEach(tag => tags.add(tag));
    });
    return [...tags];
  }, [sources]);

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = !search || 
        source.name.toLowerCase().includes(search.toLowerCase()) ||
        source.category?.toLowerCase().includes(search.toLowerCase()) ||
        source.description?.toLowerCase().includes(search.toLowerCase()) ||
        source.ownerTeam?.toLowerCase().includes(search.toLowerCase()) ||
        source.notes?.toLowerCase().includes(search.toLowerCase()) ||
        (source.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || source.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
      const matchesTag = tagFilter === 'all' || (source.tags || []).includes(tagFilter);
      const matchesTier = tierFilter === 'all' || source.criticalityTier === tierFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesTag && matchesTier;
    });
  }, [sources, search, statusFilter, categoryFilter, tagFilter, tierFilter]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, tagFilter, tierFilter]);

  // Paginate filtered sources
  const paginatedSources = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSources.slice(start, start + pageSize);
  }, [filteredSources, currentPage, pageSize]);

  // Get unique categories from sources
  const usedCategories = [...new Set(sources.map(s => s.category).filter(Boolean))];
  const allCategories = [...new Set([...categoryOptions, ...usedCategories])].sort();

  // Selection helpers (operate on current page)
  const allFilteredSelected = paginatedSources.length > 0 && paginatedSources.every(s => selectedIds.has(s.id));
  const someFilteredSelected = paginatedSources.some(s => selectedIds.has(s.id));
  
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all on current page
      const newSelected = new Set(selectedIds);
      paginatedSources.forEach(s => newSelected.delete(s.id));
      setSelectedIds(newSelected);
    } else {
      // Select all on current page
      const newSelected = new Set(selectedIds);
      paginatedSources.forEach(s => newSelected.add(s.id));
      setSelectedIds(newSelected);
    }
  };
  
  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };
  
  const handleBulkDelete = async () => {
    const idsToDelete = [...selectedIds];
    for (const id of idsToDelete) {
      await onDelete(id);
    }
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-500" />
            Log Source Inventory
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage and track your organization's log sources</p>
        </div>
        
        <div className="flex gap-2">
          {!readOnly && (
            <>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </button>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Wizard
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded"
          >
            <Plus className="h-3.5 w-3.5" />
            Quick Add
          </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          title="Total Sources"
          value={stats.total}
          subtitle={`${stats.collected} collected, ${stats.partial} partial`}
          icon={Database}
          color="blue"
        />
        <StatCard
          title="Collection Rate"
          value={`${stats.collectionRate}%`}
          subtitle={stats.gaps > 0 ? `${stats.gaps} gaps to address` : 'All sources covered'}
          icon={CheckCircle}
          color={stats.collectionRate >= 80 ? 'green' : stats.collectionRate >= 50 ? 'yellow' : 'red'}
        />
        <StatCard
          title="Validation Tests"
          value={stats.testsAvailable}
          subtitle="available in library"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Integrations"
          value={stats.sourcesWithTargets}
          subtitle={`${stats.relationshipCount} relationships defined`}
          icon={Link2}
          color="cyan"
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Tags</option>
          {allUsedTags.map(tag => {
            const tagOption = defaultTagOptions.find(t => t.value === tag);
            return (
              <option key={tag} value={tag}>{tagOption?.label || tag}</option>
            );
          })}
        </select>
        
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className={`px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            tierFilter === 'tier-1' 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
              : tierFilter === 'tier-2'
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400'
                : tierFilter === 'tier-3'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400'
                  : tierFilter === 'tier-4'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          <option value="all">All Tiers</option>
          {criticalityTierOptions.map(tier => (
            <option key={tier.value} value={tier.value}>{tier.label}</option>
          ))}
        </select>
      </div>

      {/* Results count with quick insights */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Showing {filteredSources.length} of {sources.length} sources
          {selectedIds.size > 0 && (
            <span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">
              ({selectedIds.size} selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-[10px] font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete {selectedIds.size} selected
            </button>
          )}
          {stats.blocked > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-[10px] font-medium">
              <XCircle className="h-3 w-3" />
              {stats.blocked} blocked
            </span>
          )}
          {stats.planned > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[10px] font-medium">
              <Clock className="h-3 w-3" />
              {stats.planned} planned
            </span>
          )}
          {stats.notCollected > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[10px] font-medium">
              <AlertTriangle className="h-3 w-3" />
              {stats.notCollected} not collected
            </span>
          )}
        </div>
      </div>

      {/* Sources list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 overflow-hidden">
        {/* Select All Header */}
        {filteredSources.length > 0 && (
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              ref={el => {
                if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
              }}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {allFilteredSelected 
                ? `All ${paginatedSources.length} on this page selected` 
                : someFilteredSelected 
                  ? `${selectedIds.size} selected`
                  : 'Select all on page'}
            </span>
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear selection
              </button>
            )}
          </div>
        )}
        
        {filteredSources.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2 text-sm">No sources found</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {sources.length === 0 
                ? 'Add your first log source to get started'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedSources.map(source => {
              // Find target and relationships for this source
              const sourceTarget = targets?.find(t => t.id === source.targetId);
              const sourceRelationships = relationships?.filter(r => r.sourceId === source.id) || [];
              
              return (
                <SourceRow
                  key={source.id}
                  source={source}
                  isExpanded={expandedId === source.id}
                  isEditing={editingId === source.id}
                  isSelected={selectedIds.has(source.id)}
                  onToggleSelect={() => toggleSelect(source.id)}
                  onToggle={() => setExpandedId(expandedId === source.id ? null : source.id)}
                  onEdit={() => setEditingId(source.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onUpdate={onUpdate}
                  onDelete={() => setDeleteConfirm(source)}
                  allCategories={allCategories}
                  target={sourceTarget}
                  relationshipCount={sourceRelationships.length}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredSources.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredSources.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddSourceModal
          onClose={() => setShowAddModal(false)}
          onCreate={onCreate}
          allCategories={allCategories}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={onBulkImport}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {showBulkDeleteConfirm && (
        <BulkDeleteConfirmModal
          count={selectedIds.size}
          onClose={() => setShowBulkDeleteConfirm(false)}
          onConfirm={handleBulkDelete}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          source={deleteConfirm}
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

function SourceRow({ source, isExpanded, isEditing, isSelected, onToggleSelect, onToggle, onEdit, onCancelEdit, onUpdate, onDelete, allCategories, target, relationshipCount }) {
  const [formData, setFormData] = useState(source);
  const [saving, setSaving] = useState(false);
  const [detailTab, setDetailTab] = useState('details');

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, sortOrder, ...cleanData } = formData;
      await onUpdate(source.id, cleanData);
      onCancelEdit();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`transition-colors ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
      {/* Main row */}
      <div className="px-4 py-2.5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
        
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{source.name}</div>
            {/* Integration badges */}
            {target && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-[10px]">
                <Target className="h-2.5 w-2.5" />
                {target.name}
              </span>
            )}
            {relationshipCount > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded text-[10px]">
                <Link2 className="h-2.5 w-2.5" />
                {relationshipCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>{source.category}</span>
            {source.logType && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{logTypeOptions.find(o => o.value === source.logType)?.label || source.logType}</span>
              </>
            )}
          </div>
          {/* Tags display */}
          {source.tags && source.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {source.tags.slice(0, 3).map(tag => {
                const tagOption = defaultTagOptions.find(t => t.value === tag);
                return (
                  <span 
                    key={tag} 
                    className={`px-1.5 py-0.5 rounded text-[10px] ${getTagColorClass(tagOption?.color || 'gray')}`}
                  >
                    {tagOption?.label || tag}
                  </span>
                );
              })}
              {source.tags.length > 3 && (
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-500 dark:text-gray-400">
                  +{source.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {source.criticalityTier && (
          <CriticalityBadge tier={source.criticalityTier} />
        )}
        
        <StatusBadge status={source.status} />
        
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-3 pl-14 border-t border-gray-100 dark:border-gray-700 pt-3">
          {isEditing ? (
            <EditForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={onCancelEdit}
              saving={saving}
              allCategories={allCategories}
            />
          ) : (
            <div className="space-y-3">
              {/* Detail / Activity Tabs */}
              <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setDetailTab('details')}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
                    detailTab === 'details'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setDetailTab('activity')}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                    detailTab === 'activity'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  Activity
                </button>
              </div>

              {/* Details Tab Content */}
              {detailTab === 'details' && (
                <div className="space-y-3 animate-fade-in">
                  {/* Description */}
                  {source.description && (
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      {source.description}
                    </div>
                  )}

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <DetailItem label="Log Type" value={logTypeOptions.find(o => o.value === source.logType)?.label || source.logType || 'Not specified'} />
                    <DetailItem label="Criticality Tier" value={criticalityTierOptions.find(o => o.value === source.criticalityTier)?.label || source.criticalityTier || 'Not specified'} />
                    <DetailItem label="Retention" value={retentionOptions.find(o => o.value === source.retention)?.label || source.retention || 'Not specified'} />
                    <DetailItem label="Last Updated" value={source.updatedAt ? new Date(source.updatedAt).toLocaleString() : 'N/A'} />
                  </div>

                  {/* Owner Information */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Ownership</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">Team</div>
                          <div className="text-xs text-gray-900 dark:text-white">{source.ownerTeam || 'Not assigned'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">Contact</div>
                          <div className="text-xs text-gray-900 dark:text-white">{source.ownerContact || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {source.notes && (
                    <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="text-[10px] font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-0.5">Notes</div>
                      <div className="text-xs text-yellow-800 dark:text-yellow-300">{source.notes}</div>
                    </div>
                  )}

                  {/* Technical Details */}
                  {(source.collectionMethod || source.networkRequirements || source.credentials) && (
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Technical Details</div>
                      <div className="space-y-2">
                        {source.collectionMethod && (
                          <div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">Collection Method</div>
                            <div className="text-xs text-gray-900 dark:text-white">{source.collectionMethod}</div>
                          </div>
                        )}
                        {source.networkRequirements && (
                          <div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">Network Requirements</div>
                            <div className="text-xs text-gray-900 dark:text-white">{source.networkRequirements}</div>
                          </div>
                        )}
                        {source.credentials && (
                          <div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">Credentials Reference</div>
                            <div className="text-xs text-gray-900 dark:text-white">{source.credentials}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Validation Details */}
                  {(source.validationPlan || source.expectedFields || source.sampleQuery) && (
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="text-[10px] font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1.5">Validation</div>
                      <div className="space-y-2">
                        {source.validationPlan && (
                          <div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400">Validation Plan</div>
                            <div className="text-xs text-gray-900 dark:text-white">{source.validationPlan}</div>
                          </div>
                        )}
                        {source.expectedFields && (
                          <div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400">Expected Fields</div>
                            <div className="text-xs text-gray-900 dark:text-white">{source.expectedFields}</div>
                          </div>
                        )}
                        {source.sampleQuery && (
                          <div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400">Sample Query</div>
                            <pre className="text-xs text-gray-900 dark:text-white font-mono bg-blue-100 dark:bg-blue-900/30 p-2 rounded mt-1 overflow-x-auto">{source.sampleQuery}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Activity Tab Content */}
              {detailTab === 'activity' && (
                <div className="animate-fade-in">
                  <ActivityTimeline sourceId={source.id} />
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditForm({ formData, setFormData, onSave, onCancel, saving, allCategories }) {
  const [activeSection, setActiveSection] = useState('basic');
  
  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'technical', label: 'Technical' },
    { id: 'validation', label: 'Validation' },
  ];

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Basic Information Section */}
      {activeSection === 'basic' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description of this log source and its purpose"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Log Type</label>
              <select
                value={formData.logType || ''}
                onChange={(e) => setFormData({ ...formData, logType: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select log type...</option>
                {logTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Criticality Tier</label>
              <select
                value={formData.criticalityTier || ''}
                onChange={(e) => setFormData({ ...formData, criticalityTier: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select criticality...</option>
                {criticalityTierOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retention Period</label>
              <select
                value={formData.retention || ''}
                onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select retention...</option>
                {retentionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Tag className="h-3.5 w-3.5 inline mr-1" />
              Tags
            </label>
            <TagSelector
              selectedTags={formData.tags || []}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes, configuration details, known issues..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {/* Ownership Section */}
      {activeSection === 'ownership' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded space-y-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Ownership Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Team</label>
                <input
                  type="text"
                  value={formData.ownerTeam || ''}
                  onChange={(e) => setFormData({ ...formData, ownerTeam: e.target.value })}
                  placeholder="e.g., Security Operations, Network Team"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Contact</label>
                <input
                  type="text"
                  value={formData.ownerContact || ''}
                  onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                  placeholder="e.g., email or Slack channel"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details Section */}
      {activeSection === 'technical' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded space-y-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              Technical Configuration
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collection Method</label>
              <input
                type="text"
                value={formData.collectionMethod || ''}
                onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })}
                placeholder="e.g., Syslog, API, Agent, File-based"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Network Requirements</label>
              <textarea
                value={formData.networkRequirements || ''}
                onChange={(e) => setFormData({ ...formData, networkRequirements: e.target.value })}
                rows={2}
                placeholder="e.g., Ports, protocols, firewall rules needed"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credentials Reference</label>
              <input
                type="text"
                value={formData.credentials || ''}
                onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                placeholder="e.g., Vault path, credential manager reference"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation Section */}
      {activeSection === 'validation' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 space-y-4">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Validation Configuration
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validation Plan</label>
              <textarea
                value={formData.validationPlan || ''}
                onChange={(e) => setFormData({ ...formData, validationPlan: e.target.value })}
                rows={2}
                placeholder="Describe how to validate this log source is working correctly"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Fields</label>
              <textarea
                value={formData.expectedFields || ''}
                onChange={(e) => setFormData({ ...formData, expectedFields: e.target.value })}
                rows={2}
                placeholder="e.g., timestamp, source_ip, dest_ip, action, user"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sample Query</label>
              <textarea
                value={formData.sampleQuery || ''}
                onChange={(e) => setFormData({ ...formData, sampleQuery: e.target.value })}
                rows={3}
                placeholder="e.g., index=firewall sourcetype=pan:traffic | head 10"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Helper function for tag colors
function getTagColorClass(color) {
  const colorMap = {
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
  };
  return colorMap[color] || colorMap.gray;
}

// Tag Selector Component
function TagSelector({ selectedTags, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tagValue) => {
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter(t => t !== tagValue));
    } else {
      onChange([...selectedTags, tagValue]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-left text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map(tag => {
              const tagOption = defaultTagOptions.find(t => t.value === tag);
              return (
                <span 
                  key={tag} 
                  className={`px-1.5 py-0.5 rounded text-xs ${getTagColorClass(tagOption?.color || 'gray')}`}
                >
                  {tagOption?.label || tag}
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-500">Select tags...</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                placeholder="Add custom tag..."
                className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="px-2 py-1 text-xs btn-gradient text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
          <div className="p-1">
            {defaultTagOptions.map(tag => (
              <label
                key={tag.value}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.value)}
                  onChange={() => toggleTag(tag.value)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className={`px-1.5 py-0.5 rounded text-xs ${getTagColorClass(tag.color)}`}>
                  {tag.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-xs text-gray-900 dark:text-white mt-0.5">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    collected: { label: 'Collected', class: 'status-collected' },
    partial: { label: 'Partial', class: 'status-partial' },
    planned: { label: 'Planned', class: 'status-planned' },
    'not-collected': { label: 'Not Collected', class: 'status-not-collected' },
    blocked: { label: 'Blocked', class: 'status-blocked' },
  };

  const c = config[status] || config['not-collected'];
  return <span className={`status-badge ${c.class}`}>{c.label}</span>;
}

function CriticalityBadge({ tier }) {
  const config = {
    'tier-1': { label: 'Tier 1', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    'tier-2': { label: 'Tier 2', class: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    'tier-3': { label: 'Tier 3', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
    'tier-4': { label: 'Tier 4', class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600' },
  };

  const c = config[tier] || config['tier-4'];
  return <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${c.class}`}>{c.label}</span>;
}

function AddSourceModal({ onClose, onCreate, allCategories }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'not-collected',
    description: '',
    ownerTeam: '',
    ownerContact: '',
    category: 'Network',
    logType: '',
    criticalityTier: '',
    retention: '',
    notes: '',
    tags: []
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setSaving(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Log Source" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Palo Alto Firewall"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              autoFocus
            />
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            placeholder="Brief description of this log source and its purpose"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Ownership */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded space-y-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Ownership</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Team</label>
              <input
                type="text"
                value={formData.ownerTeam}
                onChange={(e) => setFormData({ ...formData, ownerTeam: e.target.value })}
                placeholder="e.g., Security Operations"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Contact</label>
              <input
                type="text"
                value={formData.ownerContact}
                onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                placeholder="e.g., soc@company.com"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Log Type</label>
            <select
              value={formData.logType}
              onChange={(e) => setFormData({ ...formData, logType: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select log type...</option>
              {logTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Criticality Tier</label>
            <select
              value={formData.criticalityTier}
              onChange={(e) => setFormData({ ...formData, criticalityTier: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select criticality...</option>
              {criticalityTierOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retention Period</label>
            <select
              value={formData.retention}
              onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select retention...</option>
              {retentionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Tag className="h-3.5 w-3.5 inline mr-1" />
            Tags
          </label>
          <TagSelector
            selectedTags={formData.tags || []}
            onChange={(tags) => setFormData({ ...formData, tags })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            placeholder="Additional notes, configuration details, known issues..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-4 py-2 btn-gradient text-white rounded disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Source'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ImportModal({ onClose, onImport }) {
  const [jsonText, setJsonText] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setError(null);
    
    try {
      const data = JSON.parse(jsonText);
      let sources = [];
      
      // Handle different formats
      if (Array.isArray(data)) {
        sources = data;
      } else if (data.data?.logSources) {
        sources = data.data.logSources;
      } else if (data.logSources) {
        sources = data.logSources;
      } else {
        throw new Error('Invalid format. Expected array of sources or export object.');
      }
      
      if (sources.length === 0) {
        throw new Error('No sources found in import data.');
      }
      
      setImporting(true);
      await onImport(sources, replaceAll);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Import Log Sources">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paste JSON data
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[{"name": "Firewall Logs", "category": "Network", "status": "collected"}, ...]'
            rows={8}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={replaceAll}
            onChange={(e) => setReplaceAll(e.target.checked)}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          Replace all existing sources
        </label>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !jsonText.trim()}
            className="px-4 py-2 btn-gradient text-white rounded disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteConfirmModal({ source, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
  };

  return (
    <Modal onClose={onClose} title="Delete Source">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-gray-900 dark:text-white">
              Are you sure you want to delete <strong>{source.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function BulkDeleteConfirmModal({ count, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
  };

  return (
    <Modal onClose={onClose} title="Delete Multiple Sources">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-gray-900 dark:text-white">
              Are you sure you want to delete <strong>{count} sources</strong>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This action cannot be undone. All selected sources will be permanently removed.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {deleting ? `Deleting ${count}...` : `Delete ${count} Sources`}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, title, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-white dark:bg-gray-800 rounded shadow-xl ${sizeClass} w-full max-h-[90vh] overflow-y-auto animate-slide-in`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const accentClasses = {
    blue: 'from-cyan-500 to-blue-600',
    green: 'from-emerald-500 to-green-600',
    red: 'from-rose-500 to-red-600',
    purple: 'from-violet-500 to-purple-600',
    orange: 'from-amber-500 to-orange-600',
    yellow: 'from-yellow-500 to-amber-600',
    cyan: 'from-cyan-500 to-teal-600',
  };
  const iconBgClasses = {
    blue: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    green: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    red: 'bg-rose-500/10 dark:bg-rose-400/10',
    purple: 'bg-violet-500/10 dark:bg-violet-400/10',
    orange: 'bg-amber-500/10 dark:bg-amber-400/10',
    yellow: 'bg-yellow-500/10 dark:bg-yellow-400/10',
    cyan: 'bg-cyan-500/10 dark:bg-cyan-400/10',
  };
  const iconColorClasses = {
    blue: 'text-cyan-600 dark:text-cyan-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-rose-600 dark:text-rose-400',
    purple: 'text-violet-600 dark:text-violet-400',
    orange: 'text-amber-600 dark:text-amber-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200/80 dark:border-gray-700/60 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentClasses[color] || accentClasses.blue} opacity-80`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgClasses[color] || iconBgClasses.blue}`}>
          <Icon className={`h-5 w-5 ${iconColorClasses[color] || iconColorClasses.blue}`} />
        </div>
      </div>
      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default Inventory;
