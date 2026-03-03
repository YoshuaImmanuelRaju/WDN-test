import { useState } from 'react';
import { toast } from 'react-toastify';
import { Play, Square, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import networksData from '../../mockData/networks.json';

export default function EPANETSimulator() {
  const [selectedNetwork, setSelectedNetwork] = useState(networksData.networks[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const startSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setSimulationResults(null);
    toast.info('Starting EPANET simulation...');

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setSimulationResults({
            duration: '45 seconds',
            status: 'Success',
            avgPressure: '87.5 PSI',
            avgFlow: '385 L/s',
            leaksDetected: 2,
            efficiency: '94.2%'
          });
          toast.success('Simulation completed successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    toast.warning('Simulation stopped');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">EPANET Simulator</h1>
        <p className="text-gray-600 mt-1">Run hydraulic network simulations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Simulation Configuration</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Network
            </label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
            >
              {networksData.networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                defaultValue={24}
                disabled={isRunning}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Step (minutes)
              </label>
              <input
                type="number"
                defaultValue={15}
                disabled={isRunning}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                <span>Start Simulation</span>
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
              >
                <Square className="w-5 h-5" />
                <span>Stop Simulation</span>
              </button>
            )}
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Running simulation...</p>
            </div>
          )}
        </div>
      </div>

      {simulationResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Simulation Results</h2>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">{simulationResults.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Duration</p>
                  <p className="text-2xl font-bold text-blue-900">{simulationResults.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Efficiency</p>
                  <p className="text-2xl font-bold text-green-900">{simulationResults.efficiency}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-700 font-medium">Leaks Detected</p>
                  <p className="text-2xl font-bold text-orange-900">{simulationResults.leaksDetected}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Average Pressure</p>
              <p className="text-3xl font-bold text-gray-800">{simulationResults.avgPressure}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Average Flow Rate</p>
              <p className="text-3xl font-bold text-gray-800">{simulationResults.avgFlow}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Simulations</h2>
        <div className="space-y-3">
          {[
            { id: 1, network: 'Downtown Network', date: '2025-10-05 14:30', status: 'Success', duration: '45s' },
            { id: 2, network: 'Industrial Zone', date: '2025-10-04 09:15', status: 'Success', duration: '38s' },
            { id: 3, network: 'Downtown Network', date: '2025-10-03 16:45', status: 'Success', duration: '42s' }
          ].map((sim) => (
            <div key={sim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{sim.network}</p>
                <p className="text-sm text-gray-500">{sim.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{sim.duration}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                  {sim.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
