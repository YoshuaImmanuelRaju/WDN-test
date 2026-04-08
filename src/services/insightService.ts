export interface Insight {
  node: string;
  type: "LEAK" | "PRESSURE_ANOMALY" | "ALERT";
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
}

/* ================= MERGE FUNCTION ================= */
export function generateInsights(
  alerts: any[],
  anomalies: any[]
): Insight[] {
  const map = new Map<string, Insight>();

  /* ===== ANOMALIES (HIGH PRIORITY) ===== */
  anomalies.forEach((a) => {
    if (a.type === "LEAK") {
      map.set(a.node, {
        node: a.node,
        type: "LEAK",
        severity: "CRITICAL",
        message: "Leak suspected (persistent deviation)",
      });
    } else {
      if (!map.has(a.node)) {
        map.set(a.node, {
          node: a.node,
          type: "PRESSURE_ANOMALY",
          severity: "WARNING",
          message: "Pressure anomaly detected",
        });
      }
    }
  });

  /* ===== ALERTS (LOWER PRIORITY) ===== */
  alerts.forEach((a) => {
    if (!map.has(a.node)) {
      map.set(a.node, {
        node: a.node,
        type: "ALERT",
        severity: a.severity || "INFO",
        message: a.message,
      });
    }
  });

  /* ===== SORT ===== */
  const priority = {
    CRITICAL: 0,
    WARNING: 1,
    INFO: 2,
  };

  return Array.from(map.values()).sort(
    (a, b) => priority[a.severity] - priority[b.severity]
  );
}