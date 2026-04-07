import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNetworkStore } from '../../store/networkStore';

export default function DemandManager() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
    updateNodeDemand,
  } = useNetworkStore();

  const activeNetwork = networks.find(
    (n) => n.id === activeNetworkId
  );

  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [demand, setDemand] = useState('');

  const handleSaveDemand = () => {
    if (!activeNetwork || !selectedNodeId) return;

    updateNodeDemand(
      activeNetwork.id,
      selectedNodeId,
      Number(demand)
    );

    toast.success('Demand updated');
  };

  const junctions =
    activeNetwork?.nodes.filter(
      (n) => n.type === 'junction'
    ) ?? [];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-200">
      <h1 className="text-3xl font-bold">
        Demand Manager
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="font-semibold mb-4 text-slate-300">
          Select Network
        </h2>

        <select
          value={activeNetworkId ?? ''}
          onChange={(e) =>
            setActiveNetwork(e.target.value)
          }
          className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded w-full"
        >
          <option value="" disabled>
            Select network
          </option>
          {networks.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      {activeNetwork && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-slate-300">
            Edit Junction Demand
          </h2>

          <select
            value={selectedNodeId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedNodeId(id);
              const node =
                activeNetwork.nodes.find(
                  (n) => n.id === id
                );
              setDemand(
                node?.demand?.toString() ?? '0'
              );
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded w-full"
          >
            <option value="" disabled>
              Select junction
            </option>
            {junctions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={demand}
            onChange={(e) =>
              setDemand(e.target.value)
            }
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleSaveDemand}
            className="bg-blue-600 text-slate-100 px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Demand
          </button>
        </div>
      )}
    </div>
  );
}
