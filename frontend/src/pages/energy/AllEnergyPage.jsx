import { useEffect, useState } from 'react';

import api from '../../api/axios';

export default function AllEnergyPage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnergy = async () => {
    try {
      setLoading(true);
      setError('');

      const buildingsResponse = await api.get('/buildings');
      const buildings = buildingsResponse.data.data || [];

      const allRecords = [];

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
            const energyResponse = await api.get(
              `/energy-consumption/unit/${unit.id}`
            );

            const unitRecords = energyResponse.data.data || [];

            unitRecords.forEach((record) => {
              allRecords.push({
                ...record,
                unitNumber: unit.unitNumber,
                buildingName: building.name,
                floorName: floor.name,
              });
            });
          }
        }
      }

      setRecords(allRecords);
    } catch (err) {
      console.error(err);
      setError('Failed to load energy consumption data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergy();
  }, []);

  const filteredRecords = records.filter((record) => {
    const query = search.toLowerCase();

    return (
      String(record.unitNumber)
        .toLowerCase()
        .includes(query) ||
      record.buildingName?.toLowerCase().includes(query) ||
      record.floorName?.toLowerCase().includes(query)
    );
  });

  const totalConsumption = records.reduce(
    (sum, record) =>
      sum + (Number(record.consumptionKwh) || 0),
    0
  );

  const averageConsumption =
    records.length > 0
      ? totalConsumption / records.length
      : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Energy Consumption
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Monitor energy usage across all units.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Records
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {records.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Consumption
          </p>

          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {totalConsumption.toFixed(2)} kWh
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Average per Record
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {averageConsumption.toFixed(2)} kWh
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <input
          type="text"
          placeholder="Search by unit, building or floor..."
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
                  Building
                </th>

                <th className="px-6 py-4">
                  Floor
                </th>

                <th className="px-6 py-4">
                  Unit
                </th>

                <th className="px-6 py-4">
                  Consumption
                </th>

                <th className="px-6 py-4">
                  Recorded At
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Loading energy data...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No energy records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {record.buildingName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {record.floorName}
                    </td>

                    <td className="px-6 py-4 font-semibold text-white">
                      {record.unitNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-indigo-400">
                      {Number(record.consumptionKwh).toFixed(2)} kWh
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {record.recordedAt
                        ? new Date(record.recordedAt).toLocaleString()
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