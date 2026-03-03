import { useState, useEffect } from "react"
import { SimulationData } from "../types/simulation"

export const useSimulation = (data: SimulationData) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setCurrentRoundIndex((prev) =>
        prev < data.rounds.length - 1 ? prev + 1 : 0
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [playing, data])

  return {
    currentRound: data.rounds[currentRoundIndex],
    currentRoundIndex,
    playing,
    setPlaying,
  }
}