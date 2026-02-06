import { useMemo } from 'react';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  TrendingUp,
  FlaskConical,
  Shield,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  BarChart3,
  Target,
  Minus
} from 'lucide-react';
import { assessmentQuestions, validationTestLibrary } from '../constants';

function Dashboard({ stats, sources, assessments, validationTests }) {
  // Calculate assessment progress by category
  const assessmentByCategory = useMemo(() => assessmentQuestions.reduce((acc, q) => {
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
  }, {}), [assessments]);
  
  // Calculate validation progress
  const validationProgress = useMemo(() => ({
    total: validationTestLibrary.length,
    tested: (validationTests || []).length,
    passed: (validationTests || []).filter(t => t.logCaptured && t.detectionFired).length,
    partial: (validationTests || []).filter(t => t.logCaptured && !t.detectionFired).length,
    failed: (validationTests || []).filter(t => !t.logCaptured).length,
  }), [validationTests]);

  // Coverage percentage
  const coveragePct = stats.totalSources > 0 
    ? Math.round(((stats.collected + stats.partial) / stats.totalSources) * 100) 
    : 0;
  
  // Gap percentage
  const gapCount = stats.notCollected + stats.blocked;
  const gapPct = stats.totalSources > 0 
    ? Math.round((gapCount / stats.totalSources) * 100) 
    : 0;

  // Validation rate
  const validationRate = validationProgress.total > 0 
    ? Math.round((validationProgress.tested / validationProgress.total) * 100) 
    : 0;

  // Sorted categories for the breakdown
  const sortedCategories = useMemo(() => {
    return Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  }, [stats.byCategory]);

  // Category colors for visual variety
  const categoryColors = [
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500', 
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-indigo-500',
    'from-fuchsia-500 to-pink-500',
    'from-lime-500 to-green-500',
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Security logging program overview</p>
        </div>
        <div className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
          {sources.length > 0 && `Last updated ${new Date(Math.max(...sources.map(s => new Date(s.updatedAt)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </div>
      </div>

      {/* Hero metric cards — 4 primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sources */}
        <MetricCard
          label="Total Sources"
          value={stats.totalSources}
          icon={Database}
          accentClass="from-cyan-500 to-blue-600"
          iconBg="bg-cyan-500/10 dark:bg-cyan-400/10"
          iconColor="text-cyan-600 dark:text-cyan-400"
          footer={
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Layers className="h-3 w-3" />
              {Object.keys(stats.byCategory).length} categories
            </span>
          }
        />

        {/* Coverage */}
        <MetricCard
          label="Coverage"
          value={`${coveragePct}%`}
          icon={Shield}
          accentClass="from-emerald-500 to-green-600"
          iconBg="bg-emerald-500/10 dark:bg-emerald-400/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          footer={
            <span className="flex items-center gap-1">
              {coveragePct >= 75 ? (
                <><ArrowUpRight className="h-3 w-3 text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">{stats.collected} collected</span></>
              ) : (
                <><ArrowDownRight className="h-3 w-3 text-amber-500" /><span className="text-amber-600 dark:text-amber-400">{stats.collected} collected</span></>
              )}
            </span>
          }
        />

        {/* Gaps */}
        <MetricCard
          label="Coverage Gaps"
          value={gapCount}
          icon={ShieldAlert}
          accentClass="from-rose-500 to-red-600"
          iconBg="bg-rose-500/10 dark:bg-rose-400/10"
          iconColor="text-rose-600 dark:text-rose-400"
          footer={
            gapCount > 0 ? (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-3 w-3" />
                {gapPct}% unmonitored
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Full coverage
              </span>
            )
          }
        />

        {/* Assessment Score */}
        <MetricCard
          label="Maturity Score"
          value={`${stats.assessmentScore}%`}
          icon={TrendingUp}
          accentClass="from-violet-500 to-purple-600"
          iconBg="bg-violet-500/10 dark:bg-violet-400/10"
          iconColor="text-violet-600 dark:text-violet-400"
          footer={
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-3 w-3" />
              {Object.values(assessmentByCategory).reduce((s, c) => s + c.answered, 0)}/{assessmentQuestions.length} assessed
            </span>
          }
        />
      </div>

      {/* Middle row — Collection donut + Validation ring + Category sparklines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Collection Status — donut chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Collection Status</h3>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{stats.totalSources} sources</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* SVG Donut */}
            <DonutChart 
              segments={[
                { value: stats.collected, color: '#10b981', label: 'Collected' },
                { value: stats.partial, color: '#f59e0b', label: 'Partial' },
                { value: stats.planned, color: '#3b82f6', label: 'Planned' },
                { value: stats.notCollected, color: '#9ca3af', label: 'Not Collected' },
                { value: stats.blocked, color: '#ef4444', label: 'Blocked' },
              ]}
              total={stats.totalSources}
              centerLabel={`${coveragePct}%`}
              centerSublabel="covered"
            />

            {/* Legend */}
            <div className="flex-1 space-y-2">
              <LegendItem color="#10b981" label="Collected" count={stats.collected} total={stats.totalSources} />
              <LegendItem color="#f59e0b" label="Partial" count={stats.partial} total={stats.totalSources} />
              <LegendItem color="#3b82f6" label="Planned" count={stats.planned} total={stats.totalSources} />
              <LegendItem color="#9ca3af" label="Not Collected" count={stats.notCollected} total={stats.totalSources} />
              <LegendItem color="#ef4444" label="Blocked" count={stats.blocked} total={stats.totalSources} />
            </div>
          </div>
        </div>

        {/* Validation Progress — ring + stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Validation Testing</h3>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{validationProgress.tested}/{validationProgress.total} tested</span>
          </div>

          <div className="flex items-center gap-6">
            <DonutChart 
              segments={[
                { value: validationProgress.passed, color: '#10b981', label: 'Passed' },
                { value: validationProgress.partial, color: '#f59e0b', label: 'Partial' },
                { value: validationProgress.failed, color: '#ef4444', label: 'Failed' },
                { value: validationProgress.total - validationProgress.tested, color: '#e5e7eb', label: 'Not Tested' },
              ]}
              total={validationProgress.total}
              centerLabel={`${validationRate}%`}
              centerSublabel="tested"
            />

            <div className="flex-1 space-y-2">
              <LegendItem color="#10b981" label="Passed" count={validationProgress.passed} total={validationProgress.total} />
              <LegendItem color="#f59e0b" label="Partial" count={validationProgress.partial} total={validationProgress.total} />
              <LegendItem color="#ef4444" label="Failed" count={validationProgress.failed} total={validationProgress.total} />
              <LegendItem color="#e5e7eb" label="Not Tested" count={validationProgress.total - validationProgress.tested} total={validationProgress.total} dark />
            </div>
          </div>
        </div>

        {/* Assessment Maturity by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Assessment Maturity</h3>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{stats.assessmentScore}% overall</span>
          </div>
          <div className="space-y-3">
            {Object.entries(assessmentByCategory).map(([category, data]) => {
              const maxScore = data.total * 2;
              const percentage = maxScore > 0 ? Math.round((data.score / maxScore) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    <span className={`text-xs font-bold tabular-nums ${
                      percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 
                      percentage >= 40 ? 'text-amber-600 dark:text-amber-400' : 
                      'text-rose-600 dark:text-rose-400'
                    }`}>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        background: percentage >= 75 
                          ? 'linear-gradient(90deg, #10b981, #34d399)' 
                          : percentage >= 40 
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                            : 'linear-gradient(90deg, #ef4444, #f87171)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row — Category tiles + Recent sources */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Source Categories — visual tiles */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Sources by Category</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {sortedCategories.map(([category, count], i) => (
              <div 
                key={category}
                className="group relative overflow-hidden rounded-lg p-3 bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-all duration-200 cursor-default"
              >
                {/* Accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${categoryColors[i % categoryColors.length]}`} />
                <div className="pl-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{category}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{count}</span>
                </div>
                {stats.totalSources > 0 && (
                  <div className="pl-2 mt-1.5">
                    <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${categoryColors[i % categoryColors.length]} transition-all duration-500`}
                        style={{ width: `${Math.round((count / stats.totalSources) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {sortedCategories.length === 0 && (
              <div className="col-span-2 text-center py-6 text-xs text-gray-400 dark:text-gray-500">
                No sources added yet
              </div>
            )}
          </div>
        </div>

        {/* Recently Updated Sources */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Last 5 updated</span>
          </div>
          {sources.length > 0 ? (
            <div className="space-y-1">
              {sources
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((source, i) => (
                  <div 
                    key={source.id} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                  >
                    {/* Position indicator */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{i + 1}</span>
                    </div>

                    {/* Source info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{source.name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{source.category}</div>
                    </div>

                    {/* Status */}
                    <StatusBadge status={source.status} />

                    {/* Date */}
                    <div className="flex-shrink-0 text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                      {new Date(source.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
              <Database className="h-8 w-8 mb-2 opacity-40" />
              <span className="text-xs">No sources added yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Sub-components ============

function MetricCard({ label, value, icon: Icon, accentClass, iconBg, iconColor, footer }) {
  return (
    <div className="relative group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200/80 dark:border-gray-700/60 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Top accent gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentClass} opacity-80`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      
      {footer && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 text-[11px] font-medium">
          {footer}
        </div>
      )}
    </div>
  );
}

function DonutChart({ segments, total, centerLabel, centerSublabel }) {
  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativeOffset = 0;
  const arcs = segments.filter(s => s.value > 0).map(segment => {
    const pct = total > 0 ? segment.value / total : 0;
    const length = pct * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += length;
    return { ...segment, length, offset };
  });

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-700"
        />
        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-gray-900 dark:text-white tabular-nums leading-none">{centerLabel}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{centerSublabel}</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label, count, total, dark }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        <span className={`text-xs truncate ${dark ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs font-semibold text-gray-900 dark:text-white tabular-nums">{count}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums w-7 text-right">{pct}%</span>
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
