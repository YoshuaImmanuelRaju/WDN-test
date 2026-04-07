import {
  AlertTriangle,
  Network,
  Gauge,
  Layers,
} from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';
import StatCard from '../../components/StatCard';
import { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Dashboard() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
  } = useNetworkStore();

  const activeNetwork = networks.find(
    (n) => n.id === activeNetworkId
  );

  /* ================= NODE SELECTION ================= */
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (activeNetwork?.nodes.length) {
      setSelectedNode(activeNetwork.nodes[0].id);
    }
  }, [activeNetwork]);

  /* ================= RESPONSIVE ================= */
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ================= SAFE ACCESS ================= */
  const getPressure = (nodeId: string, hour = '0') =>
    activeNetwork?.pressures?.[hour]?.[nodeId] ?? 0;

  const getMeasured = (nodeId: string, hour = '0') =>
    activeNetwork?.measured_pressures?.[hour]?.[nodeId] ?? 0;

  /* ================= STATS (NETWORK SPECIFIC) ================= */
  const stats = useMemo(() => {
    if (!activeNetwork) {
      return {
        totalNetworks: networks.length,
        totalNodes: 0,
        totalEdges: 0,
        totalAlerts: 0,
      };
    }

    return {
      totalNetworks: networks.length,
      totalNodes: activeNetwork.nodes.length,
      totalEdges: activeNetwork.edges.length,
      totalAlerts: activeNetwork.alerts?.length ?? 0,
    };
  }, [networks, activeNetwork]);

  /* ================= GRAPH DATA ================= */
  const chartData = useMemo(() => {
    if (!activeNetwork || !selectedNode) return [];

    return Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      simulated: getPressure(selectedNode, String(h)),
      measured: getMeasured(selectedNode, String(h)),
    }));
  }, [activeNetwork, selectedNode]);

  /* ================= AVG PRESSURE (NETWORK BASED) ================= */
  const avgPressure = useMemo(() => {
    if (!activeNetwork) return 0;

    let total = 0;
    let count = 0;

    activeNetwork.nodes.forEach((n) => {
      const p = getPressure(n.id);
      total += p;
      count++;
    });

    return count ? total / count : 0;
  }, [activeNetwork]);

  /* ================= SYSTEM HEALTH ================= */
  const healthData = useMemo(() => {
    if (!activeNetwork) return [];

    let healthy = 0,
      warning = 0,
      critical = 0;

    activeNetwork.nodes.forEach((n) => {
      const p = getPressure(n.id);

      if (p < 20) critical++;
      else if (p < 30) warning++;
      else healthy++;
    });

    const total = healthy + warning + critical || 1;

    return [
      {
        name: 'Healthy',
        value: healthy,
        percent: ((healthy / total) * 100).toFixed(1),
        color: '#22c55e',
      },
      {
        name: 'Warning',
        value: warning,
        percent: ((warning / total) * 100).toFixed(1),
        color: '#facc15',
      },
      {
        name: 'Critical',
        value: critical,
        percent: ((critical / total) * 100).toFixed(1),
        color: '#ef4444',
      },
    ];
  }, [activeNetwork]);

  if (!activeNetwork) {
    return (
      <div className="text-center text-slate-500 mt-20">
        No network selected. Upload or choose a network.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-300">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Digital Twin Water Network Monitoring
          </p>
        </div>

        <div className="text-sm text-slate-400">
          Network: {activeNetwork.name}
        </div>
      </div>

      {/* SELECTORS */}
      <div className="bg-slate-900 p-4 rounded-xl flex gap-4 flex-wrap">
        <select
          value={activeNetworkId ?? ''}
          onChange={(e) => setActiveNetwork(e.target.value)}
          className="bg-slate-800 text-slate-300 p-2 rounded"
        >
          <option value="">Select Network</option>
          {networks.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>

        <select
          value={selectedNode ?? ''}
          onChange={(e) => setSelectedNode(e.target.value)}
          className="bg-slate-800 text-slate-300 p-2 rounded"
        >
          {activeNetwork.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.id}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Layers />} label="Networks" value={stats.totalNetworks} />
        <StatCard icon={<Network />} label="Nodes" value={stats.totalNodes} />
        <StatCard icon={<Network />} label="Pipes" value={stats.totalEdges} />
        <StatCard icon={<Gauge />} label="Avg Pressure" value={`${avgPressure.toFixed(1)} m`} />
        <StatCard icon={<AlertTriangle />} label="Alerts" value={stats.totalAlerts} />
      </div>

      {/* GRAPH + DONUT */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* GRAPH */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg mb-4 text-slate-400">
            Pressure — Node {selectedNode}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="simulated" stroke="#22c55e" />
              <Line type="monotone" dataKey="measured" stroke="#38bdf8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* DONUT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg mb-4 text-slate-400">
            System Health
          </h2>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={healthData} dataKey="value" innerRadius={50} outerRadius={80}>
                {healthData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NODE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl mb-4 text-slate-400">
          Node Status
        </h2>

        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-left">
                <th className="py-2">Node</th>
                <th>Type</th>
                <th>Pressure</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {activeNetwork.nodes.map((n) => {
                const p = getPressure(n.id);

                let status = 'Healthy';
                let color = 'text-emerald-400';

                if (p < 20) {
                  status = 'Critical';
                  color = 'text-red-400';
                } else if (p < 30) {
                  status = 'Warning';
                  color = 'text-yellow-400';
                }

                return (
                  <tr
                    key={n.id}
                    onClick={() => setSelectedNode(n.id)}
                    className={`border-b border-slate-800 hover:bg-slate-800 cursor-pointer ${
                      p < 20 ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="py-2 font-medium">{n.id}</td>
                    <td>{n.type}</td>
                    <td>{p.toFixed(1)} m</td>
                    <td className={color}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}