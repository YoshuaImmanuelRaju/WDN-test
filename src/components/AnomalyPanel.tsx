import { Anomaly } from "../services/anomalyService";

export default function AnomalyPanel({
  anomalies,
}: {
  anomalies: Anomaly[];
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg mb-4 text-slate-400">
        Anomalies
      </h2>

      {anomalies.length === 0 ? (
        <div className="text-slate-500 text-sm">
          No anomalies detected
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {anomalies.map((a, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm ${
                a.type === "LEAK"
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-orange-900/30 text-orange-400"
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