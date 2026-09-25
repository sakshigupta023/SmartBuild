import { useAuth } from '../../hooks/useAuth';
import * as Icons from '@heroicons/react/24/outline';

const placeholderStats = [
  { name: 'Total Buildings', value: '—', icon: 'BuildingOffice2Icon', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Total Units', value: '—', icon: 'Square3Stack3DIcon', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { name: 'Active Devices', value: '0', icon: 'CpuChipIcon', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'Energy Usage', value: '—', icon: 'BoltIcon', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { name: 'Pending Maintenance', value: '0', icon: 'WrenchScrewdriverIcon', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { name: 'Occupancy Rate', value: '—', icon: 'UsersIcon', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.firstName || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {placeholderStats.map((stat) => {
          const Icon = Icons[stat.icon];
          return (
            <div 
              key={stat.name}
              className="overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-gray-700 opacity-80"
            >
              <div className="flex items-center">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                  {Icon && <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />}
                </div>
                <div className="ml-4 w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 italic">
                Coming in Phase 2
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 p-12 text-center opacity-80">
          <Icons.ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Analytics Placeholder</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Charts and analytics will appear here in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}
