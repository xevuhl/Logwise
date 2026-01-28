import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Database, 
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'assessment', label: 'Assessment', icon: ClipboardCheck, shortcut: '1' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '2' },
  { id: 'inventory', label: 'Inventory', icon: Database, shortcut: '3' },
  { id: 'audit', label: 'Audit Log', icon: History, shortcut: '4' },
];

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, stats }) {
  return (
    <aside 
      className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={collapsed ? `${item.label} (${item.shortcut})` : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{item.shortcut}</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats summary (when expanded) */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Stats</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Sources</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalSources}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Collected</span>
              <span className="font-medium text-green-600 dark:text-green-400">{stats.collected}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Assessment Score</span>
              <span className="font-medium text-primary-600 dark:text-primary-400">{stats.assessmentScore}%</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
