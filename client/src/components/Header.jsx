import { FileText, Moon, Sun, Download, Sparkles } from 'lucide-react';

function Header({ darkMode, setDarkMode, onExport }) {
  return (
    <header className="bg-gradient-brand sticky top-0 z-50 shadow-lg">
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Logwise</h1>
            <p className="text-[10px] text-white/70 -mt-0.5">Security Log Source Tracker</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/20 rounded transition-colors"
            title="Export Data"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 text-white/90 hover:bg-white/20 rounded transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
