import { useEffect, useRef } from "react"
import { SimulationData, RoundState } from "../types/simulation"

interface Props {
  data: SimulationData
  round: RoundState
}

interface Packet {
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number
}

export default function NetworkCanvas({ data, round }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const packetsRef = useRef<Packet[]>([])

  // Create packets when round changes
  useEffect(() => {
    const packets: Packet[] = []

    round.communications.forEach((comm) => {
      const fromNode = data.nodes.find((n) => n.id === comm.from)
      if (!fromNode) return

      let endX = 0
      let endY = 0

      if (comm.to === "sink") {
        endX = data.sink.x
        endY = data.sink.y
      } else {
        const toNode = data.nodes.find((n) => n.id === comm.to)
        if (!toNode) return
        endX = toNode.x
        endY = toNode.y
      }

      packets.push({
        startX: fromNode.x,
        startY: fromNode.y,
        endX,
        endY,
        progress: 0,
      })
    })

    packetsRef.current = packets
  }, [round, data])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw nodes
      data.nodes.forEach((node) => {
        const isCH = round.clusterHeads.includes(node.id)

        ctx.beginPath()
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = isCH ? "red" : "blue"
        ctx.fill()
      })

      // Draw sink
      ctx.beginPath()
      ctx.arc(data.sink.x, data.sink.y, 10, 0, Math.PI * 2)
      ctx.fillStyle = "green"
      ctx.fill()

      // Animate packets
      packetsRef.current.forEach((packet) => {
        packet.progress += 0.02
        if (packet.progress > 1) packet.progress = 0

        const x =
          packet.startX +
          (packet.endX - packet.startX) * packet.progress
        const y =
          packet.startY +
          (packet.endY - packet.startY) * packet.progress

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "orange"
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationFrameId)
  }, [data, round])

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={500}
      className="border rounded-lg bg-white"
    />
  )
}