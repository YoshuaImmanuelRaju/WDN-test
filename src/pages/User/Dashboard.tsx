// import {
//   AlertTriangle,
//   Network,
//   Gauge,
//   Layers,
// } from 'lucide-react';

// import { useNetworkStore } from '../../store/networkStore';
// import { useMemo, useState, useEffect } from 'react';

// import {
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// /* ================= SERVICES ================= */
// import { generateAlerts } from '../../services/analyticsService';
// import { generateAnomalies } from '../../services/anomalyService';
// import { generateInsights } from '../../services/insightService';
// import AlertPriorityPanel from '../../components/AlertPriorityPanel';
// /* ================= COMPONENTS ================= */
// import AlertsPanel from '../../components/AlertsPanel';
// import AnomalyPanel from '../../components/AnomalyPanel';

// export default function Dashboard() {
//   const { networks, activeNetworkId, setActiveNetwork } =
//     useNetworkStore();

//   const activeNetwork = networks.find(
//     (n) => n.id === activeNetworkId
//   );

//   /* ================= NODE ================= */
//   const [selectedNode, setSelectedNode] = useState<string | null>(null);

//   useEffect(() => {
//     if (activeNetwork?.nodes.length) {
//       setSelectedNode(activeNetwork.nodes[0].id);
//     }
//   }, [activeNetwork]);

//   /* ================= TIME ================= */
//   const [time, setTime] = useState(new Date());
//   useEffect(() => {
//     const interval = setInterval(
//       () => setTime(new Date()),
//       1000
//     );
//     return () => clearInterval(interval);
//   }, []);

//   /* ================= HELPERS ================= */
//   const getPressure = (nodeId: string, hour = '0') =>
//     activeNetwork?.pressures?.[hour]?.[nodeId] ?? 0;

//   const getMeasured = (nodeId: string, hour = '0') =>
//     activeNetwork?.measured_pressures?.[hour]?.[nodeId] ?? 0;

//   /* ================= GRAPH DATA ================= */
//   const chartData = useMemo(() => {
//     if (!activeNetwork || !selectedNode) return [];

//     return Array.from({ length: 24 }, (_, h) => ({
//       hour: h,
//       simulated: getPressure(selectedNode, String(h)),
//       measured: getMeasured(selectedNode, String(h)),
//     }));
//   }, [activeNetwork, selectedNode]);

//   /* ================= AVG PRESSURE ================= */
//   const avgPressure = useMemo(() => {
//     if (!activeNetwork) return 0;

//     let total = 0;
//     activeNetwork.nodes.forEach((n) => {
//       total += getPressure(n.id);
//     });

//     return total / (activeNetwork.nodes.length || 1);
//   }, [activeNetwork]);

//   /* ================= ALERTS ================= */
//   const alerts = useMemo(() => {
//     return generateAlerts(
//       activeNetwork,
//       (id) => getPressure(id),
//       (id) => getMeasured(id),
//       avgPressure
//     );
//   }, [activeNetwork, avgPressure]);

//   /* ================= ANOMALIES ================= */
//   const anomalies = useMemo(() => {
//     return activeNetwork
//       ? generateAnomalies(activeNetwork)
//       : [];
//   }, [activeNetwork]);
//   /* ================= INSIGHTS ================= */
// const insights = useMemo(() => {
//   return generateInsights(alerts, anomalies);
// }, [alerts, anomalies]);

//   /* ================= SYSTEM HEALTH ================= */
//   const healthData = useMemo(() => {
//     if (!activeNetwork) {
//       return {
//         healthy: 0,
//         warning: 0,
//         critical: 0,
//         total: 0,
//         healthyPct: '0',
//         warningPct: '0',
//         criticalPct: '0',
//       };
//     }

//     let healthy = 0,
//       warning = 0,
//       critical = 0;

//     activeNetwork.nodes.forEach((n) => {
//       const p = getPressure(n.id);

//       if (p < 20) critical++;
//       else if (p < 30) warning++;
//       else healthy++;
//     });

//     const total = healthy + warning + critical || 1;

//     return {
//       healthy,
//       warning,
//       critical,
//       total,
//       healthyPct: ((healthy / total) * 100).toFixed(1),
//       warningPct: ((warning / total) * 100).toFixed(1),
//       criticalPct: ((critical / total) * 100).toFixed(1),
//     };
//   }, [activeNetwork]);

//   /* ================= NO NETWORK ================= */
//   if (!activeNetwork) {
//     return (
//       <div className="text-center text-slate-500 mt-20">
//         No network selected
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-300">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         {/* ================= SELECTORS ================= */}
//       <div className="bg-slate-900 p-4 rounded-xl flex gap-4 flex-wrap border border-slate-800">

//         {/* NETWORK SELECT */}
//         <select
//           value={activeNetworkId ?? ''}
//           onChange={(e) => setActiveNetwork(e.target.value)}
//           className="bg-slate-800 text-slate-300 p-2 rounded"
//         >
//           <option value="">Select Network</option>
//           {networks.map((n) => (
//             <option key={n.id} value={n.id}>
//               {n.name}
//             </option>
//           ))}
//         </select>

//         {/* NODE SELECT */}
//         <select
//           value={selectedNode ?? ''}
//           onChange={(e) => setSelectedNode(e.target.value)}
//           className="bg-slate-800 text-slate-300 p-2 rounded"
//         >
//           {activeNetwork.nodes.map((node) => (
//             <option key={node.id} value={node.id}>
//               {node.id}
//             </option>
//           ))}
//         </select>

//       </div>
//         <div>
//           <h1 className="text-3xl font-bold text-slate-200">
//             Dashboard
//           </h1>
//           <p className="text-slate-500">
//             Digital Twin Water Monitoring
//           </p>
//         </div>

//         <div className="text-sm text-slate-400">
//           {time.toLocaleTimeString()}
//         </div>
//       </div>

//       {/* ================= PRESSURE (TOP) ================= */}
//       {selectedNode && (
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//           <h2 className="text-lg mb-4 text-slate-400">
//             Pressure — Node {selectedNode}
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData}>
//               <XAxis dataKey="hour" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 dataKey="simulated"
//                 stroke="#22c55e"
//               />
//               <Line
//                 dataKey="measured"
//                 stroke="#38bdf8"
//                 strokeDasharray="5 5"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       {/* ================= SYSTEM OVERVIEW ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

//         <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
//           <div className="text-sm text-slate-500">Networks</div>
//           <div className="text-2xl font-bold">
//             {networks.length}
//           </div>
//         </div>

//         <div className="bg-red-900/20 p-4 rounded-xl border border-red-800">
//           <div className="text-sm text-red-400">
//             Active Alerts
//           </div>
//           <div className="text-2xl font-bold text-red-300">
//             {alerts.length}
//           </div>
//         </div>

//         <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-800">
//           <div className="text-sm text-yellow-400">
//             Critical Nodes
//           </div>
//           <div className="text-2xl font-bold text-yellow-300">
//             {healthData.critical}
//           </div>
//         </div>

//         <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-800">
//           <div className="text-sm text-blue-400">
//             Leak Suspects
//           </div>
//           <div className="text-2xl font-bold text-blue-300">
//             {anomalies.filter(a => a.type === 'LEAK').length}
//           </div>
//         </div>

//         <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
//           <div className="text-sm text-slate-500">
//             Avg Pressure
//           </div>
//           <div className="text-2xl font-bold text-emerald-400">
//             {avgPressure.toFixed(1)} m
//           </div>
//         </div>

//       </div>

//       {/* ================= ALERTS + SYSTEM HEALTH ================= */}
//       <div className="grid md:grid-cols-2 gap-6">

//         {/* ALERTS */}
//         <AlertPriorityPanel insights={insights} />

//         {/* SYSTEM HEALTH */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//           <h2 className="text-lg mb-4 text-slate-400">
//             System Health Overview
//           </h2>

//           <div className="space-y-3">
//             <div className="grid grid-cols-2 gap-4">

//   {/* LEFT: TEXT STATS */}
//   <div className="space-y-3">

//     <div className="flex justify-between">
//       <span className="text-green-400">Healthy</span>
//       <span>
//         {healthData.healthy} ({healthData.healthyPct}%)
//       </span>
//     </div>

//     <div className="flex justify-between">
//       <span className="text-yellow-400">Warning</span>
//       <span>
//         {healthData.warning} ({healthData.warningPct}%)
//       </span>
//     </div>

//     <div className="flex justify-between">
//       <span className="text-red-400">Critical</span>
//       <span>
//         {healthData.critical} ({healthData.criticalPct}%)
//       </span>
//     </div>

//     <div className="pt-2 text-sm text-slate-500">
//       Total Nodes: {healthData.total}
//     </div>

//   </div>

//   {/* RIGHT: PIE CHART */}
//   <div className="h-40">
//     <ResponsiveContainer width="100%" height="100%">
//       <PieChart>
//         <Pie
//           data={[
//             { name: 'Healthy', value: healthData.healthy, color: '#22c55e' },
//             { name: 'Warning', value: healthData.warning, color: '#facc15' },
//             { name: 'Critical', value: healthData.critical, color: '#ef4444' },
//           ]}
//           dataKey="value"
//         >
//           {[
//             '#22c55e',
//             '#facc15',
//             '#ef4444'
//           ].map((color, i) => (
//             <Cell key={i} fill={color} />
//           ))}
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   </div>

// </div>

//             {/* <div className="flex justify-between">
//               <span className="text-green-400">
//                 Healthy Nodes
//               </span>
//               <span>
//                 {healthData.healthy} ({healthData.healthyPct}%)
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-yellow-400">
//                 Warning Nodes
//               </span>
//               <span>
//                 {healthData.warning} ({healthData.warningPct}%)
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-red-400">
//                 Critical Nodes
//               </span>
//               <span>
//                 {healthData.critical} ({healthData.criticalPct}%)
//               </span>
//             </div>

//             <div className="pt-2 text-sm text-slate-500">
//               Total Nodes: {healthData.total}
//             </div> */}

//           </div>
//         </div>

//       </div>

//       {/* ================= ANOMALIES ================= */}
//       <AnomalyPanel anomalies={anomalies} />

//     </div>
//   );
// }

import {
  AlertTriangle,
  Network,
  Gauge,
  Layers,
} from 'lucide-react';

import { useNetworkStore } from '../../store/networkStore';
import { useMemo, useState, useEffect } from 'react';

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ================= SERVICES ================= */
import { generateAlerts } from '../../services/analyticsService';
import { generateAnomalies } from '../../services/anomalyService';
import { generateInsights } from '../../services/insightService';

/* ================= COMPONENTS ================= */
import AlertPriorityPanel from '../../components/AlertPriorityPanel';
import AnomalyPanel from '../../components/AnomalyPanel';

export default function Dashboard() {
  const { networks, activeNetworkId, setActiveNetwork } =
    useNetworkStore();

  const activeNetwork = networks.find(
    (n) => n.id === activeNetworkId
  );

  /* ================= NODE ================= */
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (activeNetwork?.nodes.length) {
      setSelectedNode(activeNetwork.nodes[0].id);
    }
  }, [activeNetwork]);

  /* ================= TIME ================= */
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(
      () => setTime(new Date()),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  /* ================= HELPERS ================= */
  const getPressure = (nodeId: string, hour = '0') =>
    activeNetwork?.pressures?.[hour]?.[nodeId] ?? 0;

  const getMeasured = (nodeId: string, hour = '0') =>
    activeNetwork?.measured_pressures?.[hour]?.[nodeId] ?? 0;

  /* ================= GRAPH DATA ================= */
  const chartData = useMemo(() => {
    if (!activeNetwork || !selectedNode) return [];

    return Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      simulated: getPressure(selectedNode, String(h)),
      measured: getMeasured(selectedNode, String(h)),
    }));
  }, [activeNetwork, selectedNode]);

  /* ================= AVG PRESSURE ================= */
  const avgPressure = useMemo(() => {
    if (!activeNetwork) return 0;

    let total = 0;
    activeNetwork.nodes.forEach((n) => {
      total += getPressure(n.id);
    });

    return total / (activeNetwork.nodes.length || 1);
  }, [activeNetwork]);

  /* ================= ALERTS ================= */
  const alerts = useMemo(() => {
    return generateAlerts(
      activeNetwork,
      (id) => getPressure(id),
      (id) => getMeasured(id),
      avgPressure
    );
  }, [activeNetwork, avgPressure]);

  /* ================= ANOMALIES ================= */
  const anomalies = useMemo(() => {
    return activeNetwork
      ? generateAnomalies(activeNetwork)
      : [];
  }, [activeNetwork]);

  /* ================= INSIGHTS ================= */
  const insights = useMemo(() => {
    return generateInsights(alerts, anomalies);
  }, [alerts, anomalies]);

  /* ================= SYSTEM HEALTH ================= */
  const healthData = useMemo(() => {
    if (!activeNetwork) {
      return {
        healthy: 0,
        warning: 0,
        critical: 0,
        total: 0,
        healthyPct: '0',
        warningPct: '0',
        criticalPct: '0',
      };
    }

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

    return {
      healthy,
      warning,
      critical,
      total,
      healthyPct: ((healthy / total) * 100).toFixed(1),
      warningPct: ((warning / total) * 100).toFixed(1),
      criticalPct: ((critical / total) * 100).toFixed(1),
    };
  }, [activeNetwork]);

  /* ================= NO NETWORK ================= */
  if (!activeNetwork) {
    return (
      <div className="text-center text-slate-500 mt-20">
        No network selected
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-300">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        {/* SELECTORS */}
        <div className="bg-slate-900 p-4 rounded-xl flex gap-4 flex-wrap border border-slate-800">

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

        <div>
          <h1 className="text-3xl font-bold text-slate-200">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Digital Twin Water Monitoring
          </p>
        </div>

        <div className="text-sm text-slate-400">
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* PRESSURE */}
      {selectedNode && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg mb-4 text-slate-400">
            Pressure — Node {selectedNode}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line dataKey="simulated" stroke="#22c55e" />
              <Line dataKey="measured" stroke="#38bdf8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* SYSTEM OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-500">Networks</div>
          <div className="text-2xl font-bold">{networks.length}</div>
        </div>

        <div className="bg-red-900/20 p-4 rounded-xl border border-red-800">
          <div className="text-sm text-red-400">Active Alerts</div>
          <div className="text-2xl font-bold text-red-300">{alerts.length}</div>
        </div>

        <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-800">
          <div className="text-sm text-yellow-400">Critical Nodes</div>
          <div className="text-2xl font-bold text-yellow-300">{healthData.critical}</div>
        </div>

        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-800">
          <div className="text-sm text-blue-400">Leak Suspects</div>
          <div className="text-2xl font-bold text-blue-300">
            {anomalies.filter(a => a.type === 'LEAK').length}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-500">Avg Pressure</div>
          <div className="text-2xl font-bold text-emerald-400">
            {avgPressure.toFixed(1)} m
          </div>
        </div>

      </div>

      {/* PRIORITY ALERTS + HEALTH */}
      <div className="grid md:grid-cols-2 gap-6">

        <AlertPriorityPanel insights={insights} />

        {/* SYSTEM HEALTH (unchanged) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg mb-4 text-slate-400">
            System Health Overview
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-400">Healthy</span>
                <span>{healthData.healthy} ({healthData.healthyPct}%)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-yellow-400">Warning</span>
                <span>{healthData.warning} ({healthData.warningPct}%)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-red-400">Critical</span>
                <span>{healthData.critical} ({healthData.criticalPct}%)</span>
              </div>

              <div className="text-sm text-slate-500">
                Total Nodes: {healthData.total}
              </div>
            </div>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Healthy', value: healthData.healthy },
                      { name: 'Warning', value: healthData.warning },
                      { name: 'Critical', value: healthData.critical },
                    ]}
                    dataKey="value"
                  >
                    {['#22c55e', '#facc15', '#ef4444'].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

      </div>

      {/* ANOMALIES */}
      <AnomalyPanel anomalies={anomalies} />

    </div>
  );
}