import { Settings, Users, FileCode, Key, Activity } from 'lucide-react';

export function AdminPage() {
  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Algorithm Management',
      description: 'Upload and manage simulation algorithms',
      icon: FileCode,
      color: 'green',
    },
    {
      title: 'Key Management',
      description: 'Generate and manage cluster access keys',
      icon: Key,
      color: 'yellow',
    },
    {
      title: 'System Monitoring',
      description: 'Monitor system performance and health',
      icon: Activity,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System administration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminCards.map((card) => {
          const Icon = card.icon;
          const bgColor =
            card.color === 'blue'
              ? 'bg-blue-100'
              : card.color === 'green'
              ? 'bg-green-100'
              : card.color === 'yellow'
              ? 'bg-yellow-100'
              : 'bg-red-100';
          const textColor =
            card.color === 'blue'
              ? 'text-blue-600'
              : card.color === 'green'
              ? 'text-green-600'
              : card.color === 'yellow'
              ? 'text-yellow-600'
              : 'text-red-600';

          return (
            <button
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg transition group"
            >
              <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System configuration updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
