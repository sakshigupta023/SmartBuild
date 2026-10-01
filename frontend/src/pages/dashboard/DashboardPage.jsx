import { useEffect, useState } from 'react';
import * as Icons from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const statsConfig = [
  {
    key: 'totalBuildings',
    name: 'Total Buildings',
    icon: 'BuildingOffice2Icon',
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    key: 'totalUnits',
    name: 'Total Units',
    icon: 'Square3Stack3DIcon',
    color: 'text-indigo-500',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    key: 'activeDevices',
    name: 'Active Devices',
    icon: 'CpuChipIcon',
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    key: 'totalEnergyConsumptionKwh',
    name: 'Energy Usage',
    icon: 'BoltIcon',
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    key: 'openMaintenanceRequests',
    name: 'Open Maintenance',
    icon: 'WrenchScrewdriverIcon',
    color: 'text-rose-500',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/dashboard');

        setDashboard(response.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError(
          err.response?.data?.message ||
            'Unable to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const occupancyRate =
    dashboard?.totalUnits > 0
      ? ((dashboard.occupiedUnits / dashboard.totalUnits) * 100).toFixed(1)
      : '0.0';

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Icons.ArrowPathIcon className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/50 dark:bg-rose-900/10">
        <div className="flex items-start gap-3">
          <Icons.ExclamationTriangleIcon className="h-6 w-6 text-rose-500" />

          <div>
            <h3 className="font-semibold text-rose-700 dark:text-rose-400">
              Unable to load dashboard
            </h3>

            <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.firstName || 'User'}!
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {statsConfig.map((stat) => {
          const Icon = Icons[stat.icon];

          let value = dashboard?.[stat.key] ?? 0;

          if (stat.key === 'totalEnergyConsumptionKwh') {
            value = `${Number(value).toFixed(1)} kWh`;
          }

          return (
            <div
              key={stat.key}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
            >
              <div className="flex items-center">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon
                    className={`h-6 w-6 ${stat.color}`}
                    aria-hidden="true"
                  />
                </div>

                <div className="ml-4 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {value}
                  </p>
                </div>

              </div>
            </div>
          );
        })}

        {/* Occupancy */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-slate-800">

          <div className="flex items-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Icons.UsersIcon className="h-6 w-6 text-purple-500" />
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Occupancy Rate
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {occupancyRate}%
              </p>
            </div>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-purple-500 transition-all"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>

        </div>

      </div>

      {/* Secondary information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Units */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unit Overview
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Occupied
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {dashboard?.occupiedUnits ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Available
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {dashboard?.availableUnits ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Under Maintenance
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {dashboard?.maintenanceUnits ?? 0}
              </span>
            </div>

          </div>
        </div>

        {/* Maintenance */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Maintenance Overview
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Open
              </span>

              <span className="font-semibold text-rose-500">
                {dashboard?.openMaintenanceRequests ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                In Progress
              </span>

              <span className="font-semibold text-amber-500">
                {dashboard?.inProgressMaintenanceRequests ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Completed
              </span>

              <span className="font-semibold text-emerald-500">
                {dashboard?.completedMaintenanceRequests ?? 0}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}