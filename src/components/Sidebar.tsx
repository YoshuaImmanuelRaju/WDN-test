import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Network,
  Database,
  Download,
  Settings,
  Key,
  Play,
  BarChart3,
  Upload,
  RadioTower
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const userLinks = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/visualizer', icon: Network, label: 'Network Visualizer' },
    { to: '/user/wsn', icon: RadioTower, label: 'WSN Simulator'},
    { to: '/user/demand', icon: Database, label: 'Demand Manager' },
    { to: '/user/export', icon: Download, label: 'Export Data' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/algorithm', icon: Upload, label: 'Algorithm Manager' },
    { to: '/admin/simulator', icon: Play, label: 'EPANET Simulator' },
    { to: '/admin/keys', icon: Key, label: 'Key Management' },
    { to: '/admin/analysis', icon: BarChart3, label: 'Cluster Analysis' }
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
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
