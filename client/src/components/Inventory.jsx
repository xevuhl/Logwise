import { useState, useMemo } from 'react';
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
  Shield
} from 'lucide-react';
import { statusOptions, categoryOptions, assessmentQuestions, logTypeOptions, criticalityTierOptions, retentionOptions } from '../constants';

function Inventory({ sources, onCreate, onUpdate, onDelete, onBulkImport, savedViews }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = !search || 
        source.name.toLowerCase().includes(search.toLowerCase()) ||
        source.category?.toLowerCase().includes(search.toLowerCase()) ||
        source.description?.toLowerCase().includes(search.toLowerCase()) ||
        source.ownerTeam?.toLowerCase().includes(search.toLowerCase()) ||
        source.notes?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || source.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [sources, search, statusFilter, categoryFilter]);

  // Get unique categories from sources
  const usedCategories = [...new Set(sources.map(s => s.category).filter(Boolean))];
  const allCategories = [...new Set([...categoryOptions, ...usedCategories])].sort();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Log Source Inventory</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your organization's log sources</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Source
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredSources.length} of {sources.length} sources
      </div>

      {/* Sources list */}
      <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredSources.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">No sources found</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sources.length === 0 
                ? 'Add your first log source to get started'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSources.map(source => (
              <SourceRow
                key={source.id}
                source={source}
                isExpanded={expandedId === source.id}
                isEditing={editingId === source.id}
                onToggle={() => setExpandedId(expandedId === source.id ? null : source.id)}
                onEdit={() => setEditingId(source.id)}
                onCancelEdit={() => setEditingId(null)}
                onUpdate={onUpdate}
                onDelete={() => setDeleteConfirm(source)}
                allCategories={allCategories}
              />
            ))}
          </div>
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

function SourceRow({ source, isExpanded, isEditing, onToggle, onEdit, onCancelEdit, onUpdate, onDelete, allCategories }) {
  const [formData, setFormData] = useState(source);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(source.id, formData);
      onCancelEdit();
    } finally {
      setSaving(false);
    }
  };

  // Get assessment coverage for this source
  const getAssessmentCoverage = () => {
    const sourceName = source.name.toLowerCase();
    const sourceCategory = (source.category || '').toLowerCase();
    
    return assessmentQuestions.filter(q => {
      const questionLower = q.question.toLowerCase();
      const descLower = q.description.toLowerCase();
      
      // Simple keyword matching
      const keywords = sourceName.split(/[\s-_]+/).filter(k => k.length > 2);
      return keywords.some(kw => 
        questionLower.includes(kw) || descLower.includes(kw)
      ) || (sourceCategory && (questionLower.includes(sourceCategory) || descLower.includes(sourceCategory)));
    });
  };

  const assessmentCoverage = getAssessmentCoverage();

  return (
    <div className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      {/* Main row */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-white truncate">{source.name}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{source.category}</span>
            {source.logType && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{logTypeOptions.find(o => o.value === source.logType)?.label || source.logType}</span>
              </>
            )}
          </div>
        </div>

        {source.criticalityTier && (
          <CriticalityBadge tier={source.criticalityTier} />
        )}
        
        <StatusBadge status={source.status} />
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-6 pb-4 pl-16 border-t border-gray-100 dark:border-gray-700 pt-4">
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
            <div className="space-y-4">
              {/* Description */}
              {source.description && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {source.description}
                </div>
              )}

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem label="Log Type" value={logTypeOptions.find(o => o.value === source.logType)?.label || source.logType || 'Not specified'} />
                <DetailItem label="Criticality Tier" value={criticalityTierOptions.find(o => o.value === source.criticalityTier)?.label || source.criticalityTier || 'Not specified'} />
                <DetailItem label="Retention" value={retentionOptions.find(o => o.value === source.retention)?.label || source.retention || 'Not specified'} />
                <DetailItem label="Last Updated" value={source.updatedAt ? new Date(source.updatedAt).toLocaleString() : 'N/A'} />
              </div>

              {/* Owner Information */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Ownership</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Team</div>
                      <div className="text-sm text-gray-900 dark:text-white">{source.ownerTeam || 'Not assigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Contact</div>
                      <div className="text-sm text-gray-900 dark:text-white">{source.ownerContact || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {source.notes && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-1">Notes</div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">{source.notes}</div>
                </div>
              )}

              {/* Assessment Coverage */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Coverage ({assessmentCoverage.length} questions)
                </div>
                {assessmentCoverage.length > 0 ? (
                  <div className="space-y-1">
                    {assessmentCoverage.map(q => (
                      <div key={q.id} className="text-sm text-gray-600 dark:text-gray-400">
                        • {q.question}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No direct assessment questions linked to this source
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditForm({ formData, setFormData, onSave, onCancel, saving, allCategories }) {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
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

      {/* Ownership */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded space-y-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Ownership</div>
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

      {/* Technical Details */}
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
      
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
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

function DetailItem({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-gray-900 dark:text-white mt-1">{value}</div>
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
  return <span className={`px-2 py-0.5 text-xs font-medium rounded border ${c.class}`}>{c.label}</span>;
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
    notes: ''
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
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
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
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
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

function Modal({ children, onClose, title, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-white dark:bg-gray-800 rounded shadow-xl ${sizeClass} w-full max-h-[90vh] overflow-y-auto animate-slide-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
