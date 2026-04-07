// src/components/AlertsPanel.tsx

import { Alert } from "../services/analyticsService";

interface Props {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg mb-4 text-slate-400">Alerts</h2>

      {alerts.length === 0 ? (
        <div className="text-slate-500 text-sm">No alerts</div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm ${
                a.type === "CRITICAL"
                  ? "bg-red-900/30 text-red-400"
                  : a.type === "WARNING"
                  ? "bg-yellow-900/30 text-yellow-400"
                  : a.type === "LEAK"
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-purple-900/30 text-purple-400"
              }`}
            >
              [{a.type}] Node {a.node} → {a.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}