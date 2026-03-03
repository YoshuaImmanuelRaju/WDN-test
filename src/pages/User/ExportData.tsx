import { useMemo, useState } from 'react';
import { Download, Clock, Database } from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';

type ExportType = 'networks' | 'nodes' | 'alerts';
type ExportFormat = 'json' | 'csv';

type ExportHistoryItem = {
  timestamp: string;
  type: ExportType;
  format: ExportFormat;
  networkName: string;
};

export default function ExportData() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
    getActiveNetwork,
  } = useNetworkStore();

  const activeNetwork = getActiveNetwork();

  const [exportType, setExportType] =
    useState<ExportType>('nodes');
  const [format, setFormat] =
    useState<ExportFormat>('json');

  const [history, setHistory] = useState<
    ExportHistoryItem[]
  >(() => {
    const saved = localStorage.getItem(
      'export-history'
    );
    return saved ? JSON.parse(saved) : [];
  });

  /* ---------------- DATA BUILDERS ---------------- */

  const buildData = () => {
    if (!activeNetwork) return null;

    switch (exportType) {
      case 'networks':
        return networks.map((n) => ({
          id: n.id,
          name: n.name,
          nodeCount: n.nodes.length,
          edgeCount: n.edges.length,
        }));

      case 'nodes':
        return activeNetwork.nodes.map((n) => ({
          id: n.id,
          type: n.type,
          x: n.x,
          y: n.y,
          demand: n.demand ?? null,
        }));

      case 'alerts':
        return (
          activeNetwork.alerts ?? []
        ).map((a) => ({
          type: a.type ?? 'UNKNOWN',
          location: a.location ?? 'Unknown',
          message: a.message ?? '',
        }));

      default:
        return null;
    }
  };

  const toCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => row[h]).join(',')
    );

    return [headers.join(','), ...rows].join(
      '\n'
    );
  };

  /* ---------------- EXPORT ---------------- */

  const handleExport = () => {
    const data = buildData();
    if (!data || !activeNetwork) return;

    let content = '';
    let mime = '';
    let ext = '';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mime = 'application/json';
      ext = 'json';
    } else {
      content = toCSV(data);
      mime = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], {
      type: mime,
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNetwork.name}-${exportType}.${ext}`;
    a.click();

    const record: ExportHistoryItem = {
      timestamp: new Date().toLocaleString(),
      type: exportType,
      format,
      networkName: activeNetwork.name,
    };

    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem(
      'export-history',
      JSON.stringify(newHistory)
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        Export Data
      </h1>

      {/* CONFIG */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Database className="w-5 h-5" />
          Export Configuration
        </h2>

        {/* Network */}
        <div>
          <label className="text-sm font-medium">
            Network
          </label>
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

        {/* Data type */}
        <div>
          <label className="text-sm font-medium">
            Data Type
          </label>
          <select
            value={exportType}
            onChange={(e) =>
              setExportType(
                e.target.value as ExportType
              )
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option value="networks">
              Networks
            </option>
            <option value="nodes">
              Nodes
            </option>
            <option value="alerts">
              Alerts
            </option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-sm font-medium">
            Format
          </label>
          <select
            value={format}
            onChange={(e) =>
              setFormat(
                e.target.value as ExportFormat
              )
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={!activeNetwork}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* HISTORY */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" />
          Export History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-500">
            No exports yet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h, i) => (
              <li
                key={i}
                className="border rounded p-3"
              >
                <div className="font-medium">
                  {h.networkName}
                </div>
                <div className="text-gray-600">
                  {h.type} → {h.format.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">
                  {h.timestamp}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
