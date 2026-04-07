import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

type Props = {
  nodes: { id: string }[];
  pressures: Record<string, Record<string, number>>;
};

export default function PressureAnalytics({
  nodes,
  pressures,
}: Props) {
  const [selectedNodes, setSelectedNodes] =
    useState<string[]>([]);

  const chartData = Array.from({ length: 24 }, (_, hr) => {
    const row: any = { hour: hr };

    selectedNodes.forEach((nodeId) => {
      row[nodeId] =
        pressures[String(hr)]?.[nodeId.toLowerCase()];
    });

    return row;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 text-slate-300">
      <h2 className="text-xl font-semibold text-slate-400">
        Pressure Analytics (24-Hour)
      </h2>

      <select
        multiple
        value={selectedNodes}
        onChange={(e) =>
          setSelectedNodes(
            Array.from(
              e.target.selectedOptions,
              (o) => o.value
            )
          )
        }
        className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded w-full h-40"
      >
        {nodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.id}
          </option>
        ))}
      </select>

      {selectedNodes.length > 0 ? (
        <div className="w-full h-[400px]">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis stroke="#94a3b8" dataKey="hour" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                }}
              />
              <Legend />

              {selectedNodes.map((nodeId) => (
                <Line
                  key={nodeId}
                  type="monotone"
                  dataKey={nodeId}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-slate-500">
          Select at least one node to view analytics
        </p>
      )}
    </div>
  );
}
