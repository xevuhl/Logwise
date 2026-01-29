import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { assessmentQuestions } from '../constants';

function Dashboard({ stats, sources, assessments }) {
  // Calculate assessment progress by category
  const assessmentByCategory = assessmentQuestions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = { total: 0, answered: 0, score: 0 };
    }
    acc[q.category].total++;
    
    const response = assessments[q.id];
    if (response && response.response) {
      acc[q.category].answered++;
      if (response.response === 'yes') acc[q.category].score += 2;
      else if (response.response === 'partial') acc[q.category].score += 1;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">Overview of your logging program status</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Sources"
          value={stats.totalSources}
          icon={Database}
          color="blue"
        />
        <StatCard
          title="Collected"
          value={stats.collected}
          subtitle={stats.totalSources > 0 ? `${Math.round((stats.collected / stats.totalSources) * 100)}% of total` : '0%'}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Gaps"
          value={stats.notCollected + stats.blocked}
          subtitle={`${stats.notCollected} not collected, ${stats.blocked} blocked`}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Assessment Score"
          value={`${stats.assessmentScore}%`}
          subtitle="Logging maturity"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Two-column layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Collection Status</h3>
          <div className="space-y-3">
            <StatusBar label="Collected" count={stats.collected} total={stats.totalSources} color="green" />
            <StatusBar label="Partial" count={stats.partial} total={stats.totalSources} color="yellow" />
            <StatusBar label="Planned" count={stats.planned} total={stats.totalSources} color="blue" />
            <StatusBar label="Not Collected" count={stats.notCollected} total={stats.totalSources} color="gray" />
            <StatusBar label="Blocked" count={stats.blocked} total={stats.totalSources} color="red" />
          </div>
        </div>

        {/* Assessment by category */}
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Assessment by Category</h3>
          <div className="space-y-3">
            {Object.entries(assessmentByCategory).map(([category, data]) => {
              const maxScore = data.total * 2;
              const percentage = maxScore > 0 ? Math.round((data.score / maxScore) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{category}</span>
                    <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
                    <div 
                      className="h-full bg-gradient-brand rounded-sm transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sources by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
            <div 
              key={category}
              className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-center"
            >
              <div className="text-xl font-bold text-gray-900 dark:text-white">{count}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sources (quick preview) */}
      {sources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recently Updated Sources</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sources
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .slice(0, 5)
                  .map(source => (
                    <tr key={source.id} className="table-row-hover">
                      <td className="py-2 text-gray-900 dark:text-white font-medium">{source.name}</td>
                      <td className="py-2 text-gray-600 dark:text-gray-400">{source.category}</td>
                      <td className="py-2">
                        <StatusBadge status={source.status} />
                      </td>
                      <td className="py-2 text-gray-600 dark:text-gray-400 text-xs">
                        {new Date(source.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    orange: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="rounded p-4 shadow-sm border bg-gradient-brand-subtle border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-0.5 text-gradient-brand">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-400',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{count}</span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-sm transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    collected: { label: 'Collected', class: 'status-collected' },
    partial: { label: 'Partial', class: 'status-partial' },
    planned: { label: 'Planned', class: 'status-planned' },
    'not-collected': { label: 'Not Collected', class: 'status-not-collected' },
    blocked: { label: 'Blocked', class: 'status-blocked' },
  };

  const config = statusConfig[status] || statusConfig['not-collected'];

  return (
    <span className={`status-badge ${config.class}`}>
      {config.label}
    </span>
  );
}

export default Dashboard;
