import { useState } from 'react';
import { useNetworkStore } from '../../store/networkStore';
import EpanetVisualizer from '../../components/epanet/EpanetVisualizer';
import PressureAnalytics from '../../components/epanet/PressureAnalytics';
import { toast } from 'react-toastify';

function Visualizer() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
    addNetwork,
    deleteNetwork,
  } = useNetworkStore();

  const activeNetwork = networks.find(
    (n) => n.id === activeNetworkId
  );

  const [hour, setHour] = useState(0);
  const [showAnalytics, setShowAnalytics] =
    useState(false);

  /* ================= UPLOAD ================= */

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

      addNetwork({
        ...network,
        name: file.name,
      });

      toast.success('Network uploaded successfully');
    } catch {
      toast.error('Upload failed');
    }
  };

  /* ================= PRESSURE MAPPING ================= */

  const hourKey = String(hour);

  const nodesWithPressure =
    activeNetwork?.nodes.map((n) => ({
      ...n,
      // 🔥 FIXED — do NOT lowercase (backend keeps original case)
      pressure:
        activeNetwork.pressures?.[hourKey]?.[n.id],
    })) ?? [];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-300">
      
      {/* ================= TITLE ================= */}
      <h1 className="text-3xl font-bold text-slate-200">
        Network Visualizer
      </h1>

      {/* ================= UPLOAD SECTION ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <input
          type="file"
          accept=".inp"
          onChange={handleUpload}
          className="text-slate-400"
        />
      </div>

      {/* ================= NETWORK SELECTOR ================= */}
      {networks.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
          <select
            value={activeNetworkId ?? ''}
            onChange={(e) =>
              setActiveNetwork(e.target.value)
            }
            className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

          {activeNetwork && (
            <button
              onClick={() =>
                deleteNetwork(activeNetwork.id)
              }
              className="px-4 py-2 bg-red-600/80 text-slate-200 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* ================= VISUALIZATION SECTION ================= */}
      {activeNetwork && (
        <>
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-6">
            <input
              type="range"
              min={0}
              max={23}
              value={hour}
              onChange={(e) =>
                setHour(Number(e.target.value))
              }
              className="w-64 accent-blue-500"
            />
            <span className="text-slate-400">
              Hour: {hour}:00
            </span>

            <button
              onClick={() =>
                setShowAnalytics(!showAnalytics)
              }
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition text-slate-300"
            >
              {showAnalytics
                ? 'Hide Analytics'
                : 'Show Analytics'}
            </button>
          </div>

          {/* Network SVG */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <EpanetVisualizer
              nodes={nodesWithPressure}
              edges={activeNetwork.edges}
            />
          </div>

          {/* Analytics */}
          {showAnalytics && (
            <PressureAnalytics
              nodes={activeNetwork.nodes}
              pressures={activeNetwork.pressures!}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Visualizer;
