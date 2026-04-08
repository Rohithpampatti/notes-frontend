import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  StickyNote,
  FileDown,
  Lock,
  History,
  FileText,
  Settings,
  Info,
  FileCheck,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface MenuItem {
  icon: typeof StickyNote;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: StickyNote, label: 'Notes', path: '/dashboard' },
  { icon: FileDown, label: 'Export PDF', path: '/export' },
  { icon: Lock, label: 'Privacy Notes', path: '/privacy-notes' },
  { icon: History, label: 'History', path: '/history' },
  { icon: FileText, label: 'Rich Text Editor', path: '/editor' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Info, label: 'About', path: '/about' },
  { icon: FileCheck, label: 'Terms & Conditions', path: '/terms' },
];

export const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">
              {user?.user_metadata?.name || 'User'}
            </h3>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-300 hover:text-white"
          >
            <span className="text-sm">Account</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isProfileOpen && (
            <div className="mt-2 space-y-1 pl-2">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm"
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </Link>
              <Link
                to="/manage-profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Manage Profile</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e293b] text-white hover:bg-[#334155] transition-all"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#1e293b] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
};
