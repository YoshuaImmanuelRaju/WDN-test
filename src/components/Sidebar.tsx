import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Network,
  Database,
  Download,
  Upload,
  Key,
  Play,
  BarChart3,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const userLinks = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/visualizer', icon: Network, label: 'Network Visualizer' },
    { to: '/user/demand', icon: Database, label: 'Demand Manager' },
    { to: '/user/export', icon: Download, label: 'Export Data' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/algorithm', icon: Upload, label: 'Algorithm Manager' },
    { to: '/admin/simulator', icon: Play, label: 'EPANET Simulator' },
    { to: '/admin/keys', icon: Key, label: 'Key Management' },
    { to: '/admin/analysis', icon: BarChart3, label: 'Cluster Analysis' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 min-h-screen">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
