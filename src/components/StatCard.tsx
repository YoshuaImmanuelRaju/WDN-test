import React from 'react';

export type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

export default function StatCard({
  icon,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="text-gray-700">{icon}</div>

        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
