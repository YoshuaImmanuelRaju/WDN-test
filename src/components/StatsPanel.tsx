import { RoundState } from "../types/simulation"

interface Props {
  round: RoundState
}

export default function StatsPanel({ round }: Props) {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="font-bold">Round: {round.round}</h2>
      <p>Cluster Heads: {round.clusterHeads.length}</p>
      <p>Total Communications: {round.communications.length}</p>
    </div>
  )
}