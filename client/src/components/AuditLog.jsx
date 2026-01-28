import { useState, useMemo } from 'react';
import { Search, Filter, Clock, Edit2, Trash2, RefreshCw } from 'lucide-react';

function AuditLog({ entries }) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  // Get unique actions
  const actions = [...new Set(entries.map(e => e.action))];

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !search ||
        entry.sourceName?.toLowerCase().includes(search.toLowerCase()) ||
        entry.action?.toLowerCase().includes(search.toLowerCase());
      
      const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
      
      return matchesSearch && matchesAction;
    });
  }, [entries, search, actionFilter]);

  // Group by date
  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h2>
        <p className="text-gray-600 dark:text-gray-400">Track all changes to your log source inventory</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit log..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Actions</option>
          {actions.map(action => (
            <option key={action} value={action}>{formatAction(action)}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>

      {/* Audit entries */}
      <div className="space-y-6">
        {Object.entries(groupedEntries).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 dark:text-gray-400">No audit entries found</div>
          </div>
        ) : (
          Object.entries(groupedEntries)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, dateEntries]) => (
              <div key={date}>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  {formatDate(date)}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                  {dateEntries
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map(entry => (
                      <AuditEntry key={entry.id} entry={entry} />
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function AuditEntry({ entry }) {
  const details = entry.details ? JSON.parse(entry.details) : null;

  return (
    <div className="px-6 py-4 flex items-start gap-4">
      <ActionIcon action={entry.action} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">{entry.sourceName}</span>
          <span className="text-gray-500 dark:text-gray-400">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatAction(entry.action)}</span>
        </div>
        
        {details && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {details.field && (
              <span>
                {details.field}: <span className="line-through">{details.oldValue}</span> → <span className="text-primary-600 dark:text-primary-400">{details.newValue}</span>
              </span>
            )}
            {details.count && (
              <span>{details.count} items</span>
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatTime(entry.timestamp)}
      </div>
    </div>
  );
}

function ActionIcon({ action }) {
  const iconClass = "h-5 w-5";
  
  switch (action) {
    case 'created':
      return (
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
          <Edit2 className={`${iconClass} text-green-600 dark:text-green-400`} />
        </div>
      );
    case 'updated':
    case 'status_changed':
      return (
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
          <RefreshCw className={`${iconClass} text-blue-600 dark:text-blue-400`} />
        </div>
      );
    case 'deleted':
      return (
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
          <Trash2 className={`${iconClass} text-red-600 dark:text-red-400`} />
        </div>
      );
    case 'imported':
      return (
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
          <Clock className={`${iconClass} text-purple-600 dark:text-purple-400`} />
        </div>
      );
    default:
      return (
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <Clock className={`${iconClass} text-gray-600 dark:text-gray-400`} />
        </div>
      );
  }
}

function formatAction(action) {
  const labels = {
    created: 'Created',
    updated: 'Updated',
    deleted: 'Deleted',
    status_changed: 'Status Changed',
    imported: 'Imported',
  };
  return labels[action] || action;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default AuditLog;
