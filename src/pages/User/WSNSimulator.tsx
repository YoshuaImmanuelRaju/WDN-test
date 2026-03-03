import { useEffect, useState } from "react"
import NetworkCanvas from "../../components/NetworkCanvas"
import ControlsPanel from "../../components/ControlsPanel"
import StatsPanel from "../../components/StatsPanel"
import { useSimulation } from "../../hooks/useSimulation"
import { SimulationData } from "../../types/simulation"

export default function WSNSimulator() {
  const [data, setData] = useState<SimulationData | null>(null)

  useEffect(() => {
    fetch("http://localhost:5173", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numNodes: 60,
        areaX: 600,
        areaY: 400,
        initialEnergy: 2,
        clusterHeadProbability: 0.1,
        packetSize: 4000,
        maxRounds: 30,
        sinkX: 300,
        sinkY: 470,
      }),
    })
      .then((res) => res.json())
      .then((json) => setData(json))
  }, [])

  if (!data) return <div>Loading simulation...</div>

  const { currentRound, playing, setPlaying } =
    useSimulation(data)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Real LEACH WSN Simulator
      </h1>

      <ControlsPanel playing={playing} setPlaying={setPlaying} />

      <NetworkCanvas data={data} round={currentRound} />

      <StatsPanel round={currentRound} />
    </div>
  )
}