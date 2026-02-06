import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeProps,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNetworkStore } from '@/stores/networkStore';
import { getPressureColor, getFlowColor } from '@/lib/utils';
import { Droplet, Circle } from 'lucide-react';

function NetworkNode({ data, selected }: NodeProps) {
  const pressureColor = data.pressure !== null ? getPressureColor(data.pressure) : '#94a3b8';

  return (
    <div
      className={`min-w-[60px] px-3 py-2 rounded-lg border-2 transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-gray-300'
      } bg-white shadow-sm hover:shadow-md cursor-pointer`}
      style={{ borderLeftColor: pressureColor, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center gap-2">
        {data.type === 'tank' || data.type === 'reservoir' ? (
          <Droplet className="w-4 h-4 text-blue-600" />
        ) : (
          <Circle className="w-3 h-3 text-gray-600" />
        )}
        <div>
          <p className="text-xs font-semibold text-gray-900">{data.label}</p>
          {data.pressure !== null && (
            <p className="text-xs text-gray-600">{data.pressure.toFixed(1)} m</p>
          )}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: NetworkNode,
};

export function NetworkVisualization() {
  const { currentNetwork, visualizationMode, selectedNode, selectedPipe, selectNode, selectPipe } =
    useNetworkStore();

  const initialNodes: Node[] = useMemo(() => {
    if (!currentNetwork?.nodes) return [];

    return currentNetwork.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: {
        x: (node.x_coord || 0) * 5,
        y: (node.y_coord || 0) * 5,
      },
      data: {
        label: node.node_id,
        type: node.type,
        pressure: node.current_pressure,
        demand: node.current_demand,
        elevation: node.elevation,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [currentNetwork?.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!currentNetwork?.pipes) return [];

    return currentNetwork.pipes.map((pipe) => {
      const flow = pipe.current_flow || 0;
      const color = getFlowColor(flow);
      const width = Math.max(2, Math.min(Math.abs(flow) / 10, 8));

      return {
        id: pipe.id,
        source: pipe.from_node_id,
        target: pipe.to_node_id,
        animated: Math.abs(flow) > 10,
        style: {
          stroke: color,
          strokeWidth: width,
        },
        label: flow !== null ? `${flow.toFixed(1)} L/s` : undefined,
        labelStyle: {
          fontSize: 10,
          fill: '#374151',
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.8,
        },
      };
    });
  }, [currentNetwork?.pipes, visualizationMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const networkNode = currentNetwork?.nodes?.find((n) => n.id === node.id);
      if (networkNode) {
        selectNode(networkNode);
      }
    },
    [currentNetwork, selectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const networkPipe = currentNetwork?.pipes?.find((p) => p.id === edge.id);
      if (networkPipe) {
        selectPipe(networkPipe);
      }
    },
    [currentNetwork, selectPipe]
  );

  if (!currentNetwork || !currentNetwork.nodes || currentNetwork.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No network data to visualize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background color="#e5e7eb" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            if (node.data.type === 'tank' || node.data.type === 'reservoir') return '#3b82f6';
            return '#94a3b8';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          zoomable
          pannable
        />
      </ReactFlow>

      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Node Details</h3>
            <button
              onClick={() => selectNode(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-600">ID</dt>
              <dd className="font-medium text-gray-900">{selectedNode.node_id}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Type</dt>
              <dd className="font-medium text-gray-900 capitalize">{selectedNode.type}</dd>
            </div>
            {selectedNode.current_pressure !== null && (
              <div>
                <dt className="text-gray-600">Pressure</dt>
                <dd className="font-medium text-gray-900">{selectedNode.current_pressure.toFixed(2)} m</dd>
              </div>
            )}
            {selectedNode.elevation !== null && (
              <div>
                <dt className="text-gray-600">Elevation</dt>
                <dd className="font-medium text-gray-900">{selectedNode.elevation.toFixed(2)} m</dd>
              </div>
            )}
            {selectedNode.base_demand !== null && (
              <div>
                <dt className="text-gray-600">Base Demand</dt>
                <dd className="font-medium text-gray-900">{selectedNode.base_demand.toFixed(2)} L/s</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {selectedPipe && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Pipe Details</h3>
            <button
              onClick={() => selectPipe(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-600">ID</dt>
              <dd className="font-medium text-gray-900">{selectedPipe.pipe_id}</dd>
            </div>
            {selectedPipe.length !== null && (
              <div>
                <dt className="text-gray-600">Length</dt>
                <dd className="font-medium text-gray-900">{selectedPipe.length.toFixed(2)} m</dd>
              </div>
            )}
            {selectedPipe.diameter !== null && (
              <div>
                <dt className="text-gray-600">Diameter</dt>
                <dd className="font-medium text-gray-900">{selectedPipe.diameter.toFixed(3)} m</dd>
              </div>
            )}
            {selectedPipe.current_flow !== null && (
              <div>
                <dt className="text-gray-600">Flow</dt>
                <dd className="font-medium text-gray-900">{selectedPipe.current_flow.toFixed(2)} L/s</dd>
              </div>
            )}
            {selectedPipe.current_velocity !== null && (
              <div>
                <dt className="text-gray-600">Velocity</dt>
                <dd className="font-medium text-gray-900">{selectedPipe.current_velocity.toFixed(2)} m/s</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-600">Status</dt>
              <dd className="font-medium text-gray-900 capitalize">{selectedPipe.status}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span className="text-gray-700">High Pressure (&gt;80m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
            <span className="text-gray-700">Good Pressure (60-80m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
            <span className="text-gray-700">Medium Pressure (40-60m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-gray-700">Low Pressure (20-40m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-700">Critical Pressure (&lt;20m)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
