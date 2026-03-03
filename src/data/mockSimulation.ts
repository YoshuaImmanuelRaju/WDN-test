import { SimulationData } from "../types/simulation"

const nodes = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  x: Math.random() * 600,
  y: Math.random() * 400,
}))

export const mockSimulation: SimulationData = {
  nodes,
  sink: { x: 300, y: 470 },
  rounds: Array.from({ length: 30 }).map((_, r) => {
    const clusterHeads = [r % 10, (r + 4) % 15]

    const communications = nodes.flatMap((node) => {
      if (clusterHeads.includes(node.id)) {
        return [{ from: node.id, to: "sink" }]
      }

      const randomCH =
        clusterHeads[Math.floor(Math.random() * clusterHeads.length)]

      return [{ from: node.id, to: randomCH }]
    })

    return {
      round: r,
      clusterHeads,
      clusters: {},
      energy: {},
      communications,
    }
  }),
}