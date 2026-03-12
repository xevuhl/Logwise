import { FileText, Moon, Sun, Download, LogOut } from 'lucide-react';
import logo from '../assets/Logwise-logo.png';

function Header({ darkMode, setDarkMode, onExport, onLogout }) {
  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logwise" className="h-10 w-10 rounded" />
          <div>
            <h1 className="text-lg font-semibold text-gradient-brand">Logwise</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Security Log Source Tracker</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Export Data"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
