import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
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

  const [selectedNodeId, setSelectedNodeId] =
    useState<string>('');
  const [demand, setDemand] = useState<string>('');

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/networks/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      const network = await res.json();

      useNetworkStore
        .getState()
        .addNetwork({
          ...network,
          name: file.name,
        });

      toast.success('Network uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Demand Manager
      </h1>

      {/* Upload */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Upload EPANET (.inp)
        </h2>
        <input
          type="file"
          accept=".inp"
          onChange={handleUpload}
        />
      </div>

      {/* Network selector */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Select Network
        </h2>
        <select
          value={activeNetworkId ?? ''}
          onChange={(e) =>
            setActiveNetwork(e.target.value)
          }
          className="border px-3 py-2 rounded w-full"
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

      {/* Node demand editor */}
      {activeNetwork && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">
            Edit Node Demand
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
            className="border px-3 py-2 rounded w-full"
          >
            <option value="" disabled>
              Select junction node
            </option>
            {junctions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Demand"
            value={demand}
            onChange={(e) =>
              setDemand(e.target.value)
            }
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleSaveDemand}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Demand
          </button>
        </div>
      )}

      {/* Uploaded networks list */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Uploaded Networks
        </h2>
        <ul className="space-y-2">
          {networks.map((n) => (
            <li
              key={n.id}
              className="flex items-center gap-2 border p-2 rounded"
            >
              <FileText className="w-4 h-4" />
              {n.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
