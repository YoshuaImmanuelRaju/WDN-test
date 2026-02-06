import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Network, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import type { Network as NetworkType, LeakAlert, Simulation } from '@/types';

export function DashboardPage() {
  const { profile } = useAuthStore();
  const [stats, setStats] = useState({
    networks: 0,
    activeAlerts: 0,
    runningSimulations: 0,
    totalNodes: 0,
  });
  const [recentNetworks, setRecentNetworks] = useState<NetworkType[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<LeakAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const [networksRes, alertsRes, simulationsRes] = await Promise.all([
        supabase
          .from('networks')
          .select('*')
          .eq('owner_id', profile.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('leak_alerts')
          .select('*, networks!inner(owner_id)')
          .eq('networks.owner_id', profile.id)
          .in('status', ['new', 'acknowledged'])
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('simulations')
          .select('*')
          .eq('created_by', profile.id)
          .in('status', ['queued', 'running']),
      ]);

      const networks = networksRes.data || [];
      const alerts = alertsRes.data || [];
      const simulations = simulationsRes.data || [];

      const totalNodes = networks.reduce((sum, n) => sum + (n.node_count || 0), 0);

      setStats({
        networks: networks.length,
        activeAlerts: alerts.length,
        runningSimulations: simulations.length,
        totalNodes,
      });

      setRecentNetworks(networks);
      setRecentAlerts(alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {profile?.first_name}! Here's your network overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.networks}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Networks</h3>
          <p className="text-xs text-gray-500">{stats.totalNodes} total nodes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Alerts</h3>
          <p className="text-xs text-gray-500">Requires attention</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.runningSimulations}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Running Simulations</h3>
          <p className="text-xs text-gray-500">In progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">98%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">System Efficiency</h3>
          <p className="text-xs text-gray-500">Network average</p>
        </div>
      </div>

      {/* Recent Networks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Networks</h2>
            <Link
              to="/networks"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        {recentNetworks.length === 0 ? (
          <div className="p-12 text-center">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No networks yet</h3>
            <p className="text-gray-600 mb-6">Get started by uploading your first network file.</p>
            <Link
              to="/networks/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Upload Network
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentNetworks.map((network) => (
              <Link
                key={network.id}
                to={`/networks/${network.id}`}
                className="block p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{network.name}</h3>
                    <p className="text-sm text-gray-600">{network.description || 'No description'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{network.node_count} nodes</span>
                      <span>{network.pipe_count} pipes</span>
                      <span className="capitalize">{network.status}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    network.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {network.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
              <Link
                to="/alerts"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-900">{alert.description || 'Leak detected'}</p>
                    {alert.confidence && (
                      <p className="text-sm text-gray-600 mt-1">
                        Confidence: {(alert.confidence * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
