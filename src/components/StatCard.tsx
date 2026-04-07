// import React from 'react';

export default function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-200">{value}</p>
        </div>
      </div>
    </div>
  );
}
