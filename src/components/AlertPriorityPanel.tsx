// import { Alert } from "../services/analyticsService";

// /* ================= TYPES ================= */
// type Severity = "CRITICAL" | "WARNING" | "INFO";

// interface Insight {
//   node: string;
//   severity: Severity;
//   message: string;
// }

// interface Props {
//   alerts: Alert[];
//   anomalies?: any[];
// }

// export default function AlertPriorityPanel({ alerts, anomalies = [] }: Props) {

//   /* ================= BUILD INSIGHTS (STRICT) ================= */
//   const insights: Insight[] = [];

//   // anomalies
//   anomalies.forEach((a) => {
//     if (a.type === "LEAK") {
//       insights.push({
//         node: a.node,
//         severity: "CRITICAL",
//         message: "Leak suspected",
//       });
//     } else {
//       insights.push({
//         node: a.node,
//         severity: "WARNING",
//         message: "Pressure anomaly detected",
//       });
//     }
//   });

//   // alerts
//   alerts.forEach((a) => {
//     let severity: Severity;

//     if (a.type === "CRITICAL") severity = "CRITICAL";
//     else if (a.type === "WARNING") severity = "WARNING";
//     else severity = "INFO";

//     insights.push({
//       node: a.node,
//       severity,
//       message: a.message,
//     });
//   });

//   /* ================= SORT ================= */
//   const priority: Record<Severity, number> = {
//     CRITICAL: 0,
//     WARNING: 1,
//     INFO: 2,
//   };

//   insights.sort(
//     (a, b) => priority[a.severity] - priority[b.severity]
//   );

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//       <h2 className="text-lg mb-4 text-slate-300">
//         Priority Alerts
//       </h2>

//       {insights.length === 0 ? (
//         <div className="text-slate-500 text-sm">
//           No issues detected
//         </div>
//       ) : (
//         <div className="max-h-60 overflow-y-auto space-y-3">

//           {insights.map((i, idx) => {
//             let color = "";
//             let icon = "";

//             if (i.severity === "CRITICAL") {
//               color = "bg-red-900/30 border-red-800 text-red-300";
//               icon = "🔴";
//             } else if (i.severity === "WARNING") {
//               color = "bg-yellow-900/30 border-yellow-800 text-yellow-300";
//               icon = "🟠";
//             } else {
//               color = "bg-blue-900/30 border-blue-800 text-blue-300";
//               icon = "🟡";
//             }

//             return (
//               <div
//                 key={idx}
//                 className={`p-3 border rounded-lg ${color}`}
//               >
//                 <div className="flex justify-between text-sm">
//                   <span className="font-medium">
//                     {icon} {i.severity}
//                   </span>
//                   <span className="text-xs opacity-70">
//                     Node {i.node}
//                   </span>
//                 </div>

//                 <div className="text-xs mt-1">
//                   {i.message}
//                 </div>
//               </div>
//             );
//           })}

//         </div>
//       )}
//     </div>
//   );
// }

/* ================= TYPES ================= */
type Severity = "CRITICAL" | "WARNING" | "INFO";

interface Insight {
  node: string;
  severity: Severity;
  message: string;
}

interface Props {
  insights: Insight[];
}

/* ================= COMPONENT ================= */
export default function AlertPriorityPanel({ insights }: Props) {

  /* ================= SORT ================= */
  const priority: Record<Severity, number> = {
    CRITICAL: 0,
    WARNING: 1,
    INFO: 2,
  };

  const sortedInsights = [...insights].sort(
    (a, b) => priority[a.severity] - priority[b.severity]
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg mb-4 text-slate-300">
        Priority Alerts
      </h2>

      {sortedInsights.length === 0 ? (
        <div className="text-slate-500 text-sm">
          No issues detected
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-3">

          {sortedInsights.map((i, idx) => {
            let color = "";
            let icon = "";

            if (i.severity === "CRITICAL") {
              color = "bg-red-900/30 border-red-800 text-red-300";
              icon = "🔴";
            } else if (i.severity === "WARNING") {
              color = "bg-yellow-900/30 border-yellow-800 text-yellow-300";
              icon = "🟠";
            } else {
              color = "bg-blue-900/30 border-blue-800 text-blue-300";
              icon = "🟡";
            }

            return (
              <div
                key={idx}
                className={`p-3 border rounded-lg ${color}`}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {icon} {i.severity}
                  </span>
                  <span className="text-xs opacity-70">
                    Node {i.node}
                  </span>
                </div>

                <div className="text-xs mt-1">
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