import { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowRightLeft,
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle,
  Link2,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { sourcesAPI } from '../api';

// Map activity types to display config
const activityConfig = {
  created: {
    icon: Plus,
    color: 'green',
    label: 'Created',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-600 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  updated: {
    icon: Edit2,
    color: 'blue',
    label: 'Updated',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  status_changed: {
    icon: ArrowRightLeft,
    color: 'orange',
    label: 'Status Changed',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-600 dark:text-orange-400',
    dotClass: 'bg-orange-500',
  },
  deleted: {
    icon: Trash2,
    color: 'red',
    label: 'Deleted',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-600 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
  relationship_added: {
    icon: Link2,
    color: 'purple',
    label: 'Relationship',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    dotClass: 'bg-purple-500',
  },
  imported: {
    icon: Upload,
    color: 'cyan',
    label: 'Imported',
    bgClass: 'bg-cyan-100 dark:bg-cyan-900/30',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    dotClass: 'bg-cyan-500',
  },
};

const defaultConfig = {
  icon: AlertCircle,
  color: 'gray',
  label: 'Event',
  bgClass: 'bg-gray-100 dark:bg-gray-700',
  textClass: 'text-gray-600 dark:text-gray-400',
  dotClass: 'bg-gray-500',
};

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Group activities by date
function groupByDate(activities) {
  const groups = {};
  for (const activity of activities) {
    const date = new Date(activity.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
  }
  return groups;
}

function StatusBadge({ status }) {
  const statusColors = {
    collected: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    partial: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    planned: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'not-collected': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
    blocked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[status] || statusColors['not-collected']}`}>
      {status}
    </span>
  );
}

function ActivityTimeline({ sourceId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    if (!sourceId) return;
    
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    sourcesAPI.getActivity(sourceId)
      .then(data => {
        if (!cancelled) {
          setActivities(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    
    return () => { cancelled = true; };
  }, [sourceId]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Loading activity...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-6 justify-center">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-xs text-red-600 dark:text-red-400">Failed to load activity: {error}</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400">No activity recorded yet</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          Activity will appear here as changes are made to this source
        </p>
      </div>
    );
  }

  const grouped = groupByDate(activities);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Activity Timeline
          </span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {activities.length} event{activities.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, dateActivities]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {date}
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Activities for this date */}
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-1">
                {dateActivities.map((activity) => {
                  const config = activityConfig[activity.type] || defaultConfig;
                  const Icon = config.icon;
                  const isExpanded = expandedIds.has(activity.id);
                  const hasDetails = activity.details && activity.details !== 'null';
                  let parsedDetails = null;
                  if (hasDetails) {
                    try {
                      parsedDetails = typeof activity.details === 'string' ? JSON.parse(activity.details) : activity.details;
                    } catch {
                      parsedDetails = activity.details;
                    }
                  }

                  return (
                    <div key={activity.id} className="relative flex gap-3 group">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${config.bgClass}`}>
                        <Icon className={`h-3 w-3 ${config.textClass}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-2">
                        <div
                          className={`rounded px-2.5 py-1.5 ${hasDetails ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''} transition-colors`}
                          onClick={() => hasDetails && toggleExpand(activity.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.textClass}`}>
                                  {config.label}
                                </span>
                                {hasDetails && (
                                  <span className="text-gray-300 dark:text-gray-600">
                                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                                {activity.description}
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0" title={formatDate(activity.timestamp)}>
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>

                          {/* Expanded details */}
                          {isExpanded && parsedDetails && (
                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                              {/* Status change details */}
                              {activity.type === 'status_changed' && parsedDetails.oldValue && (
                                <div className="flex items-center gap-2 text-xs">
                                  <StatusBadge status={parsedDetails.oldValue} />
                                  <span className="text-gray-400">→</span>
                                  <StatusBadge status={parsedDetails.newValue} />
                                </div>
                              )}

                              {/* Field changes */}
                              {parsedDetails.changes && Array.isArray(parsedDetails.changes) && (
                                <div className="space-y-1">
                                  {parsedDetails.changes.map((change, idx) => (
                                    <div key={idx} className="text-[11px]">
                                      <span className="font-medium text-gray-600 dark:text-gray-400">{change.field}:</span>{' '}
                                      <span className="text-red-500 dark:text-red-400 line-through">
                                        {formatChangeValue(change.oldValue)}
                                      </span>{' '}
                                      <span className="text-gray-400">→</span>{' '}
                                      <span className="text-green-600 dark:text-green-400">
                                        {formatChangeValue(change.newValue)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Relationship details */}
                              {parsedDetails.relatedEntity && (
                                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Related to:</span> {parsedDetails.relatedEntity}
                                  {parsedDetails.relationshipType && (
                                    <span className="ml-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">
                                      {parsedDetails.relationshipType}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Generic details fallback */}
                              {typeof parsedDetails === 'string' && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">{parsedDetails}</p>
                              )}

                              {/* Import method */}
                              {parsedDetails.importMethod && (
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                  <Upload className="h-3 w-3" />
                                  <span>Import method: {parsedDetails.importMethod}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatChangeValue(value) {
  if (value === undefined || value === null || value === '') return '(empty)';
  if (Array.isArray(value)) return value.join(', ') || '(none)';
  return String(value);
}

export default ActivityTimeline;
