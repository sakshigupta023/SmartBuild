import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../utils/constants';
import * as Icons from '@heroicons/react/24/outline';

export default function Sidebar({ onClose }) {
  const { user } = useAuth();

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN') return false;
    return true;
  });

  return (
    <div className="flex h-full flex-col bg-slate-900 text-gray-300">
      <div className="flex h-16 items-center px-6 font-bold text-white text-xl tracking-wide border-b border-slate-800">
        <span className="text-indigo-500 mr-2">⚡</span> SmartBuild
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const Icon = Icons[item.icon];
            // Since only dashboard works in phase 1, map all paths to / except active state will check original path
            // For simplicity and matching requirements, we'll use NavLink to item.path but keep them present.
            // If we actually want them to lead to dashboard, we can just use path="/" but this breaks active state.
            // So we'll let them point to their actual paths (which redirect to dashboard via route fallback if we didn't define them, but currently they go to fallback or Dashboard can handle it).
            // Actually, requirements: "For Phase 1: Dashboard is the only working link. Other items should be present but lead to the dashboard"
            const targetPath = item.path === '/' ? '/' : '/'; // For phase 1, all point to '/'
            
            return (
              <NavLink
                key={item.name}
                to={targetPath}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group
                  ${isActive && item.path === '/' ? 'bg-slate-800 text-white border-l-4 border-indigo-500 pl-2' : 'hover:bg-slate-800 hover:text-white'}
                `}
              >
                {Icon && (
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                )}
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
