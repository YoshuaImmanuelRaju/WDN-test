import {
  AlertTriangle,
  Network,
  Gauge,
  Layers,
} from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';
import StatCard from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';

/* ---------------- ALERT INTERPRETATION ---------------- */

function explainAlert(alert: any) {
  switch (alert.type) {
    case 'LOW_PRESSURE':
      return {
        title: 'Low Pressure',
        description:
          'Pressure at this node has dropped below safe operating limits.',
        severity: 'critical',
      };

    case 'HIGH_DEMAND':
      return {
        title: 'High Demand',
        description:
          'Demand exceeds expected values. Risk of supply shortfall.',
        severity: 'warning',
      };

    case 'PIPE_LOSS':
      return {
        title: 'High Headloss',
        description:
          'Pipe is experiencing excessive headloss. Possible bottleneck.',
        severity: 'warning',
      };

    case 'QUALITY':
      return {
        title: 'Water Quality Issue',
        description:
          'Quality parameter out of acceptable range.',
        severity: 'critical',
      };

    default:
      return {
        title: 'Unknown Issue',
        description:
          alert.message ??
          'An unspecified issue was detected.',
        severity: 'warning',
      };
  }
}

function severityColor(severity: string) {
  if (severity === 'critical') return 'text-red-600';
  return 'text-orange-600';
}

/* ---------------- COMPONENT ---------------- */

export default function Dashboard() {
  const { networks, setActiveNetwork } =
    useNetworkStore();
  const navigate = useNavigate();

  /* ---------------- AGGREGATES ---------------- */

  const totalNetworks = networks.length;
  const totalNodes = networks.reduce(
    (sum, n) => sum + n.nodes.length,
    0
  );
  const totalEdges = networks.reduce(
    (sum, n) => sum + n.edges.length,
    0
  );
  const totalAlerts = networks.reduce(
    (sum, n) => sum + (n.alerts?.length ?? 0),
    0
  );

  const totalDemand = networks.reduce(
    (sum, n) =>
      sum +
      n.nodes.reduce(
        (s, node) => s + (node.demand ?? 0),
        0
      ),
    0
  );

  const getNetworkStatus = (alerts: number) =>
    alerts > 0 ? '⚠️ Attention' : '✅ Healthy';

  /* ---------------- RENDER ---------------- */

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        System Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Layers />}
          label="Networks"
          value={totalNetworks}
        />
        <StatCard
          icon={<Network />}
          label="Nodes"
          value={totalNodes}
        />
        <StatCard
          icon={<Network />}
          label="Pipes"
          value={totalEdges}
        />
        <StatCard
          icon={<Gauge />}
          label="Total Demand"
          value={Math.round(totalDemand)}
        />
        <StatCard
          icon={<AlertTriangle />}
          label="Alerts"
          value={totalAlerts}
        />
      </div>

      {/* NETWORK HEALTH TABLE */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Network Health
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Network</th>
                <th>Nodes</th>
                <th>Pipes</th>
                <th>Demand</th>
                <th>Alerts</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {networks.map((n) => {
                const demand = n.nodes.reduce(
                  (s, node) =>
                    s + (node.demand ?? 0),
                  0
                );
                const alerts = n.alerts?.length ?? 0;

                return (
                  <tr
                    key={n.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2 font-medium">
                      {n.name}
                    </td>
                    <td>{n.nodes.length}</td>
                    <td>{n.edges.length}</td>
                    <td>{Math.round(demand)}</td>
                    <td
                      className={
                        alerts > 0
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600'
                      }
                    >
                      {alerts}
                    </td>
                    <td>{getNetworkStatus(alerts)}</td>
                    <td>
                      <button
                        onClick={() => {
                          setActiveNetwork(n.id);
                          navigate('/user/visualizer');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVE ALERTS WITH MEANING */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Active Alerts (Detailed)
        </h2>

        {totalAlerts === 0 ? (
          <p className="text-green-600">
            No active alerts 🎉
          </p>
        ) : (
          <ul className="space-y-4">
            {networks.flatMap((n) =>
              (n.alerts ?? []).map((a, idx) => {
                const info = explainAlert(a);
                return (
                  <li
                    key={`${n.id}-${idx}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-5 h-5 ${severityColor(
                          info.severity
                        )}`}
                      />
                      <span
                        className={`font-semibold ${severityColor(
                          info.severity
                        )}`}
                      >
                        {info.title}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 mt-1">
                      {info.description}
                    </div>

                    <div className="text-sm mt-2">
                      <span className="font-medium">
                        Network:
                      </span>{' '}
                      {n.name}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">
                        Location:
                      </span>{' '}
                      {a.location ?? 'Unknown'}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() =>
              navigate('/user/demand-manager')
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Demands
          </button>

          <button
            onClick={() =>
              navigate('/user/visualizer')
            }
            className="px-4 py-2 border rounded"
          >
            Open Visualizer
          </button>
        </div>
      </div>
    </div>
  );
}
