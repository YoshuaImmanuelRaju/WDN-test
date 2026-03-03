export interface Node {
  id: number
  x: number
  y: number
}

export interface Communication {
  from: number
  to: number | "sink"
}

export interface RoundState {
  round: number
  clusterHeads: number[]
  clusters: Record<number, number[]>
  energy: Record<number, number>
  communications: Communication[]
}

export interface SimulationData {
  nodes: Node[]
  sink: { x: number; y: number }
  rounds: RoundState[]
}