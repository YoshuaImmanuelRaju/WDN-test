// src/services/analyticsService.ts

export interface Alert {
  type: "CRITICAL" | "WARNING" | "LEAK" | "HIGH_DEMAND";
  node: string;
  message: string;
}

export function generateAlerts(
  network: any,
  getPressure: (id: string) => number,
  getMeasured: (id: string) => number,
  avgPressure: number
): Alert[] {
  if (!network) return [];

  const alerts: Alert[] = [];

  network.nodes.forEach((node: any) => {
    const sim = getPressure(node.id);
    const meas = getMeasured(node.id);

    // 🚨 Pressure alerts
    if (sim < 20) {
      alerts.push({
        type: "CRITICAL",
        node: node.id,
        message: "Very low pressure",
      });
    } else if (sim < 30) {
      alerts.push({
        type: "WARNING",
        node: node.id,
        message: "Low pressure",
      });
    }

    // 💧 Leak detection
    if (Math.abs(sim - meas) > 5) {
      alerts.push({
        type: "LEAK",
        node: node.id,
        message: "Possible leak detected",
      });
    }

    // 📈 High demand
    if (sim < avgPressure * 0.7) {
      alerts.push({
        type: "HIGH_DEMAND",
        node: node.id,
        message: "High demand detected",
      });
    }
  });

  return alerts;
}