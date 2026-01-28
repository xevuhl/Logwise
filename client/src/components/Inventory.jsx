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
  AlertTriangle
} from 'lucide-react';
import { statusOptions, categoryOptions, assessmentQuestions } from '../constants';

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
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          <div className="text-sm text-gray-500 dark:text-gray-400">{source.category}</div>
        </div>
        
        <StatusBadge status={source.status} />
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Integration" value={source.integration || 'Not specified'} />
              <DetailItem label="Criticality" value={source.criticality || 'Not specified'} />
              <DetailItem label="Owner" value={source.owner || 'Not specified'} />
              <DetailItem label="Last Updated" value={source.updatedAt ? new Date(source.updatedAt).toLocaleString() : 'N/A'} />
              
              {source.notes && (
                <div className="md:col-span-2">
                  <DetailItem label="Notes" value={source.notes} />
                </div>
              )}

              {/* Assessment Coverage */}
              <div className="md:col-span-2 mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Integration</label>
          <input
            type="text"
            value={formData.integration || ''}
            onChange={(e) => setFormData({ ...formData, integration: e.target.value })}
            placeholder="e.g., Splunk, Sentinel"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Criticality</label>
          <select
            value={formData.criticality || ''}
            onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
          <input
            type="text"
            value={formData.owner || ''}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Team or person responsible"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

function AddSourceModal({ onClose, onCreate, allCategories }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Network',
    status: 'not-collected',
    integration: '',
    criticality: '',
    owner: '',
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
    <Modal onClose={onClose} title="Add Log Source">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
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
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !jsonText.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
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
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-in">
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
