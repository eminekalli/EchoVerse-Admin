import React from 'react';
import { LayoutDashboard, Database, Music, Disc, Mic2, FileJson, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'artists', label: 'Artists', icon: Mic2 },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'tracks', label: 'Tracks', icon: Music },
    { id: 'data', label: 'Raw Data & Export', icon: Database },
    { id: 'generator', label: 'AI Data Generator', icon: Sparkles, highlight: true },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            EchoVerse
          </h1>
          <p className="text-xs text-slate-500 mt-1">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600/10 text-green-400 border border-green-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                } ${item.highlight ? 'mt-6 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}
              >
                <Icon size={20} className={item.highlight && !isActive ? 'text-emerald-400' : ''} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        <div className="max-w-7xl mx-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;