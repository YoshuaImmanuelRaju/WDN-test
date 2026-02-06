import { Layers } from 'lucide-react';

export function ClustersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clusters</h1>
        <p className="text-gray-600">Manage demand clusters across your networks</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cluster Management</h3>
        <p className="text-gray-600 mb-6">
          Create and manage demand clusters for your water distribution networks.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Create Cluster
        </button>
      </div>
    </div>
  );
}
