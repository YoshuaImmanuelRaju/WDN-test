export type NetworkNode = {
  id: string;
  x: number;
  y: number;
  type: 'junction' | 'reservoir' | 'tank';

  // backend sends base_demand, but keep flexible
  demand?: number;
  base_demand?: number;
};

export type NetworkEdge = {
  id: string;
  source: string;
  target: string;

  // optional because backend varies by type
  diameter?: number;
  length?: number;
  roughness?: number;
};

export type Alert = {
  id: string;
  location: string[];
  acknowledged: boolean;
};

export type Network = {
  id: string;
  name?: string;

  nodes: NetworkNode[];
  edges: NetworkEdge[];

  alerts?: Alert[];

  // 🔥 Simulation data (required)
  pressures: Record<string, Record<string, number>>;

  // 🔥 Measured data (optional, generated later)
  measured_pressures?: Record<string, Record<string, number>>;
};