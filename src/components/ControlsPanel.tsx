interface Props {
  playing: boolean
  setPlaying: (val: boolean) => void
}

export default function ControlsPanel({ playing, setPlaying }: Props) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => setPlaying(!playing)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {playing ? "Pause" : "Start"}
      </button>
    </div>
  )
}