export interface Anomaly {
  node: string;
  type: "PRESSURE_ANOMALY" | "LEAK";
  message: string;
}

/* ================= PRESSURE ANOMALY ================= */
function detectPressureAnomaly(
  series: number[],
  base: number
) {
  const tolerance = base * 0.1;

  return series.some(
    (p) => p < base - tolerance || p > base + tolerance
  );
}

/* ================= LEAK DETECTION ================= */
function detectLeak(sim: number[], meas: number[]) {
  let count = 0;

  for (let i = 0; i < sim.length; i++) {
    if (Math.abs(sim[i] - meas[i]) > 5) {
      count++;
    }
  }

  return count > sim.length * 0.3;
}

/* ================= MAIN ================= */
export function generateAnomalies(network: any): Anomaly[] {
  if (!network) return [];

  const anomalies: Anomaly[] = [];

  network.nodes.forEach((node: any) => {
    const sim: number[] = [];
    const meas: number[] = [];

    for (let h = 0; h < 24; h++) {
      sim.push(network.pressures?.[h]?.[node.id] ?? 0);
      meas.push(network.measured_pressures?.[h]?.[node.id] ?? 0);
    }

    const base = sim[0];

    if (detectPressureAnomaly(sim, base)) {
      anomalies.push({
        node: node.id,
        type: "PRESSURE_ANOMALY",
        message: "Pressure deviation detected",
      });
    }

    if (detectLeak(sim, meas)) {
      anomalies.push({
        node: node.id,
        type: "LEAK",
        message: "Possible leak detected",
      });
    }
  });

  return anomalies;
}