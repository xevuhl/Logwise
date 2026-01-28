import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Database, 
  History,
  ChevronLeft,
  ChevronRight,
  FlaskConical
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
  { id: 'assessment', label: 'Assessment', icon: ClipboardCheck, shortcut: '2' },
  { id: 'inventory', label: 'Inventory', icon: Database, shortcut: '3' },
  { id: 'validation', label: 'Validation', icon: FlaskConical, shortcut: '4' },
  { id: 'audit', label: 'Audit Log', icon: History, shortcut: '5' },
];

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, stats }) {
  return (
    <aside 
      className={`fixed left-0 top-[52px] h-[calc(100vh-52px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        collapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-2.5 top-4 p-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={collapsed ? `${item.label} (${item.shortcut})` : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left font-medium text-[13px]">{item.label}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.shortcut}</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats summary (when expanded) */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Quick Stats</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Total Sources</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalSources}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Collected</span>
              <span className="font-medium text-green-600 dark:text-green-400">{stats.collected}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Assessment</span>
              <span className="font-medium text-primary-600 dark:text-primary-400">{stats.assessmentScore}%</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
