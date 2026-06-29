const fs = require('fs');
const path = 'c:/Users/asus/Desktop/Projet Syn/frontend/src/components/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const importTarget = `  Image as ImageIcon,
  Plane
} from 'lucide-react'`;
content = content.replace(importTarget, `  Image as ImageIcon,
  Plane,
  Menu,
  X
} from 'lucide-react'`);

content = content.replace('const [editingStayId, setEditingStayId] = useState(null)', 'const [editingStayId, setEditingStayId] = useState(null)\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)');

const layoutTarget = `  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-full z-20">
        <button 
          onClick={() => setActiveTab('selector')}
          className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">V</div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">VoyageSmart</span>
        </button>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'selector', label: 'Console Home', icon: LayoutDashboard },
            { id: 'properties', label: 'Stays', icon: Home },
            { id: 'hotels', label: 'Hotels', icon: LayoutDashboard },
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'plans', label: 'Travel Plans', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all \${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}\`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">`;

const layoutReplacement = `  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">V</div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">VoyageSmart</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-slate-50 rounded-xl">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={\`w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-full z-50 transition-transform duration-300 \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0\`}>
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => { setActiveTab('selector'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">V</div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">VoyageSmart</span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 bg-slate-50 rounded-full hover:text-indigo-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'selector', label: 'Console Home', icon: LayoutDashboard },
            { id: 'properties', label: 'Stays', icon: Home },
            { id: 'hotels', label: 'Hotels', icon: LayoutDashboard },
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'plans', label: 'Travel Plans', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={\`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all \${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}\`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 pt-28 pb-12 px-6 lg:pt-12 lg:px-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">`;

content = content.replace(layoutTarget, layoutReplacement);

// Fix hardcoded grids but ONLY inside forms or areas where it matters.
content = content.replace(/className="grid grid-cols-2 gap-6"/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-6"');
content = content.replace(/className="grid grid-cols-3 gap-6"/g, 'className="grid grid-cols-1 md:grid-cols-3 gap-6"');
content = content.replace(/className="grid grid-cols-2 gap-8"/g, 'className="grid grid-cols-1 lg:grid-cols-2 gap-8"');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated Dashboard.jsx successfully');
