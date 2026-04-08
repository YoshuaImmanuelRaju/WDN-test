import { AlertTriangle } from "lucide-react";
import { Insight } from "../services/insightService";

export default function InsightsPanel({
  insights,
}: {
  insights: Insight[];
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg mb-4 text-slate-300 flex items-center gap-2">
        <AlertTriangle size={18} />
        System Insights
      </h2>

      {insights.length === 0 ? (
        <div className="text-slate-500 text-sm">
          No issues detected
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">

          {insights.map((i, idx) => {
            let color = "";
            let badge = "";

            if (i.severity === "CRITICAL") {
              color = "bg-red-900/30 border-red-800 text-red-300";
              badge = "🔴";
            } else if (i.severity === "WARNING") {
              color = "bg-yellow-900/30 border-yellow-800 text-yellow-300";
              badge = "🟠";
            } else {
              color = "bg-blue-900/30 border-blue-800 text-blue-300";
              badge = "🟡";
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${color}`}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {badge} {i.type}
                  </span>
                  <span className="text-xs opacity-70">
                    Node {i.node}
                  </span>
                </div>

                <div className="text-xs mt-1 opacity-80">
                  {i.message}
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}