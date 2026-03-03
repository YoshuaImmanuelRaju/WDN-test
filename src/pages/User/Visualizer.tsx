import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AlertTriangle, Network } from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';
import StatCard from '../../components/StatCard';
import { useEffect, useMemo, useState } from 'react';

/* ---------------- HELPERS ---------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const pipeColor = (d?: number) => {
  if (!d) return '#6b7280';
  if (d <= 8) return '#dc2626';    // small
  if (d <= 14) return '#f97316';   // medium
  return '#2563eb';                // large
};

function normalizeNodes(nodes: any[]) {
  const PAD = 120;

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const scale = Math.min(
    1200 / (maxX - minX || 1),
    800 / (maxY - minY || 1)
  );

  return nodes.map((n) => ({
    ...n,
    x: (n.x - minX) * scale + PAD,
    y: (n.y - minY) * scale + PAD,
  }));
}

/* ---------------- COMPONENT ---------------- */

export default function Visualizer() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
    getActiveNetwork,
  } = useNetworkStore();

  const activeNetwork = getActiveNetwork();

  const [zoom, setZoom] = useState(1);
  const [rf, setRf] =
    useState<ReactFlowInstance | null>(null);
  const [hovered, setHovered] = useState<any | null>(null);

  if (!activeNetwork) {
    return <div className="p-6">No network selected</div>;
  }

  const nodeCount = activeNetwork.nodes.length;
  const alerts = activeNetwork.alerts ?? [];

  /* 🔥 VERY SMALL BASE SIZE */
  const baseNodeSize = clamp(
    420 / nodeCount,
    4,
    10
  );

  const normalized = useMemo(
    () => normalizeNodes(activeNetwork.nodes),
    [activeNetwork.nodes]
  );

  /* ---------------- NODES ---------------- */

  const nodes: Node[] = normalized.map((n) => {
    const hasAlert = alerts.some((a) =>
      a.location.includes(n.id)
    );

    const typeBoost =
      n.type === 'tank' ? 1.6 :
      n.type === 'reservoir' ? 1.9 :
      1;

    const size =
      baseNodeSize *
      typeBoost *
      clamp(zoom, 0.7, 1.8);

    return {
      id: n.id,
      position: { x: n.x, y: n.y },
      data: {
        ...n,
        label:
          zoom > 1.3 ? (
            <div className="text-[8px] font-semibold text-center">
              <div>{n.id}</div>
              {n.type === 'junction' && (
                <div className="text-[7px] text-gray-500">
                  {n.demand}
                </div>
              )}
            </div>
          ) : null,
      },
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        background:
          n.type === 'reservoir'
            ? '#dbeafe'
            : n.type === 'tank'
            ? '#dcfce7'
            : '#ffffff',
        border: hasAlert
          ? '1.5px solid #dc2626'
          : '1px solid #3b82f6',
        boxShadow: hasAlert
          ? '0 0 0 4px rgba(220,38,38,0.35)'
          : undefined,
        animation: hasAlert
          ? 'pulse 1.5s infinite'
          : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  });

  /* ---------------- EDGES ---------------- */

  const edges: Edge[] = activeNetwork.edges.map(
    (e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: e.type === 'pump',
      style: {
        stroke: pipeColor(e.diameter),
        strokeWidth: clamp(
          1.6 * zoom,
          0.6,
          3
        ),
        strokeDasharray:
          e.type === 'valve' ? '6 4' : undefined,
      },
    })
  );

  useEffect(() => {
    rf?.fitView({ padding: 0.4 });
  }, [rf, activeNetworkId]);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-3xl font-bold">
        Network Visualizer
      </h1>

      {/* Network selector */}
      <select
        value={activeNetworkId ?? ''}
        onChange={(e) =>
          setActiveNetwork(e.target.value)
        }
        className="border px-3 py-2 rounded"
      >
        {networks.map((n) => (
          <option key={n.id} value={n.id}>
            {n.name}
          </option>
        ))}
      </select>

      {/* Graph */}
      <div className="h-[600px] border rounded-lg relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onInit={setRf}
          onMove={(_, v) => setZoom(v.zoom)}
          onNodeMouseEnter={(_, n) =>
            setHovered(n.data)
          }
          onNodeMouseLeave={() =>
            setHovered(null)
          }
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute bottom-4 left-4 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg">
            <div className="font-semibold">
              Node {hovered.id}
            </div>
            <div>Type: {hovered.type}</div>
            {hovered.demand !== undefined && (
              <div>Demand: {hovered.demand}</div>
            )}
          </div>
        )}
      </div>

      {/* 🔍 LEGEND */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">
          Network Legend
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* Nodes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-blue-500 bg-white" />
              <span>Junction (Demand Node)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-200 border border-green-500" />
              <span>Tank (Storage)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-200 border border-blue-500" />
              <span>Reservoir (Source)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-red-600" />
              <span>Alert / Issue at Node</span>
            </div>
          </div>

          {/* Pipes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] bg-red-600" />
              <span>Small Pipe (≤ 8)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] bg-orange-500" />
              <span>Medium Pipe (≤ 14)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] bg-blue-600" />
              <span>Large Pipe (&gt; 14)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] border-b-2 border-dashed border-purple-600" />
              <span>Valve</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] bg-green-600 animate-pulse" />
              <span>Pump</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Network />}
          label="Nodes"
          value={nodeCount}
        />
        <StatCard
          icon={<Network />}
          label="Edges"
          value={activeNetwork.edges.length}
        />
        <StatCard
          icon={<AlertTriangle />}
          label="Alerts"
          value={alerts.length}
        />
      </div>

      {/* Alert pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
            70% { box-shadow: 0 0 0 6px rgba(220,38,38,0); }
            100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
          }
        `}
      </style>
    </div>
  );
}
