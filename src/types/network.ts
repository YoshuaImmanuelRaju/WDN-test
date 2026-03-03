export type NetworkNode = {
  id: string;
  x: number;
  y: number;
  type: 'junction' | 'reservoir' | 'tank';
  demand?: number;
};

export type NetworkEdge = {
  id: string;
  source: string;
  target: string;
  diameter: number;
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
};
