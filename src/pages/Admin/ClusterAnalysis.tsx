import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Droplets, Activity } from 'lucide-react';
import networksData from '../../mockData/networks.json';

export default function ClusterAnalysis() {
  const clusterDemandData = networksData.clusters.map(cluster => ({
    name: cluster.name,
    demand: cluster.demand,
    nodes: cluster.nodes.length
  }));

  const demandFlowComparison = [
    { cluster: 'C1', demand: 350, flow: 365, efficiency: 95.9 },
    { cluster: 'C2', demand: 460, flow: 475, efficiency: 96.8 }
  ];

  const timeSeriesData = [
    { time: '00:00', C1: 320, C2: 420 },
    { time: '04:00', C1: 310, C2: 400 },
    { time: '08:00', C1: 380, C2: 480 },
    { time: '12:00', C1: 370, C2: 470 },
    { time: '16:00', C1: 360, C2: 450 },
    { time: '20:00', C1: 340, C2: 440 }
  ];

  const distributionData = [
    { name: 'Cluster 1', value: 350 },
    { name: 'Cluster 2', value: 460 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Cluster Analysis</h1>
        <p className="text-gray-600 mt-1">Demand vs flow analysis and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Total Clusters</p>
              <p className="text-3xl font-bold text-gray-800">{networksData.clusters.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Total Demand</p>
              <p className="text-3xl font-bold text-gray-800">
                {networksData.clusters.reduce((sum, c) => sum + c.demand, 0)} L/s
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Avg Efficiency</p>
              <p className="text-3xl font-bold text-gray-800">96.4%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Demand vs Flow Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandFlowComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cluster" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#3b82f6" name="Demand (L/s)" />
              <Bar dataKey="flow" fill="#10b981" name="Flow (L/s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Demand Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value} L/s`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">24-Hour Demand Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="C1" stroke="#3b82f6" strokeWidth={2} name="Cluster 1 (L/s)" />
            <Line type="monotone" dataKey="C2" stroke="#10b981" strokeWidth={2} name="Cluster 2 (L/s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cluster Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cluster</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Demand (L/s)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Flow (L/s)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {demandFlowComparison.map((cluster) => (
                <tr key={cluster.cluster} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{cluster.cluster}</td>
                  <td className="py-3 px-4 text-gray-600">{cluster.demand}</td>
                  <td className="py-3 px-4 text-gray-600">{cluster.flow}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${cluster.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{cluster.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
