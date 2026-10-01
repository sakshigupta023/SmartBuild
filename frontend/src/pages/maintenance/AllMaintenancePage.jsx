import { useEffect, useState } from 'react';

import api from '../../api/axios';

const statusStyles = {
  OPEN: 'bg-red-500/10 text-red-400',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400',
};

const priorityStyles = {
  LOW: 'bg-slate-500/10 text-slate-400',
  MEDIUM: 'bg-indigo-500/10 text-indigo-400',
  HIGH: 'bg-orange-500/10 text-orange-400',
  URGENT: 'bg-red-500/10 text-red-400',
};

export default function AllMaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError('');

      const buildingsResponse = await api.get('/buildings');
      const buildings = buildingsResponse.data.data || [];

      const allRequests = [];

      for (const building of buildings) {
        const floorsResponse = await api.get(
          `/floors/building/${building.id}`
        );

        const floors = floorsResponse.data.data || [];

        for (const floor of floors) {
          const unitsResponse = await api.get(
            `/units/floor/${floor.id}`
          );

          const units = unitsResponse.data.data || [];

          for (const unit of units) {
           const maintenanceResponse = await api.get(
            `/maintenance-requests/unit/${unit.id}`
        );
            const unitRequests =
              maintenanceResponse.data.data || [];

            unitRequests.forEach((request) => {
              allRequests.push({
                ...request,
                unitNumber: unit.unitNumber,
                buildingName: building.name,
                floorName: floor.name,
              });
            });
          }
        }
      }

      setRequests(allRequests);
    } catch (err) {
      console.error(err);
      setError('Failed to load maintenance requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const query = search.toLowerCase();

    return (
      request.title?.toLowerCase().includes(query) ||
      request.description?.toLowerCase().includes(query) ||
      request.status?.toLowerCase().includes(query) ||
      request.priority?.toLowerCase().includes(query) ||
      request.assignedTo?.toLowerCase().includes(query) ||
      String(request.unitNumber)
        .toLowerCase()
        .includes(query) ||
      request.buildingName?.toLowerCase().includes(query)
    );
  });

  const openRequests = requests.filter(
    (request) => request.status === 'OPEN'
  ).length;

  const inProgressRequests = requests.filter(
    (request) => request.status === 'IN_PROGRESS'
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === 'COMPLETED'
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Maintenance
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Track and manage maintenance requests across all units.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Requests
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {requests.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Open
          </p>

          <p className="mt-2 text-2xl font-bold text-red-400">
            {openRequests}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-400">
            {inProgressRequests}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {completedRequests}
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <input
          type="text"
          placeholder="Search by title, unit, building, priority, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b border-slate-700">
              <tr className="text-xs uppercase tracking-wider text-slate-400">

                <th className="px-6 py-4">
                  Request
                </th>

                <th className="px-6 py-4">
                  Building
                </th>

                <th className="px-6 py-4">
                  Unit
                </th>

                <th className="px-6 py-4">
                  Priority
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Assigned To
                </th>

                <th className="px-6 py-4">
                  Created
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Loading maintenance requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No maintenance requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">
                          {request.title}
                        </p>

                        {request.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {request.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {request.buildingName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {request.unitNumber}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          priorityStyles[request.priority] ||
                          'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {request.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[request.status] ||
                          'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {request.assignedTo || 'Unassigned'}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : '-'}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}