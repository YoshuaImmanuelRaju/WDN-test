import { Users, Network, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/StatCard';
import alertsData from '../../mockData/alerts.json';
import networksData from '../../mockData/networks.json';

export default function AdminDashboard() {
  const activeAlerts = alertsData.alerts.filter(a => !a.acknowledged);

  const demandData = [
    { month: 'Jan', demand: 320, flow: 340 },
    { month: 'Feb', demand: 350, flow: 365 },
    { month: 'Mar', demand: 380, flow: 390 },
    { month: 'Apr', demand: 360, flow: 375 },
    { month: 'May', demand: 405, flow: 420 },
    { month: 'Jun', demand: 390, flow: 400 }
  ];

  const performanceData = [
    { time: '00:00', pressure: 85 },
    { time: '04:00', pressure: 88 },
    { time: '08:00', pressure: 92 },
    { time: '12:00', pressure: 89 },
    { time: '16:00', pressure: 86 },
    { time: '20:00', pressure: 84 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Networks"
          value={networksData.networks.length}
          icon={Network}
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={AlertTriangle}
          color="red"
          change="Requires attention"
        />
        <StatCard
          title="Active Users"
          value={8}
          icon={Users}
          color="green"
        />
        <StatCard
          title="System Health"
          value="98%"
          icon={Activity}
          color="green"
          change="Optimal performance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Demand vs Flow Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#3b82f6" name="Demand (L/s)" />
              <Bar dataKey="flow" fill="#10b981" name="Flow (L/s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Pressure (24h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} name="Pressure (PSI)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alert Management</h2>
        <div className="space-y-3">
          {alertsData.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                alert.severity === 'high'
                  ? 'bg-red-50 border-red-500'
                  : alert.severity === 'medium'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : alert.severity === 'medium'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`} />
                  <span className="font-medium text-gray-800">{alert.location}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded uppercase ${
                    alert.severity === 'high'
                      ? 'bg-red-200 text-red-800'
                      : alert.severity === 'medium'
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
              {!alert.acknowledged && (
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                  Acknowledge
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
