import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const statusStyles = {
  OCCUPIED: 'bg-emerald-500/10 text-emerald-400',
  AVAILABLE: 'bg-indigo-500/10 text-indigo-400',
  MAINTENANCE: 'bg-amber-500/10 text-amber-400',
};

export default function AllUnitsPage() {
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError('');

      // Get all buildings first
      const buildingsResponse = await api.get('/buildings');
      const buildings = buildingsResponse.data.data || [];

      const allUnits = [];

      // Get floors for every building, then units for every floor
      for (const building of buildings) {
        const floorsResponse = await api.get(
          `/floors/building/${building.id}`
        );

        const floors = floorsResponse.data.data || [];

        for (const floor of floors) {
          const unitsResponse = await api.get(
            `/units/floor/${floor.id}`
          );

          const floorUnits = unitsResponse.data.data || [];

          floorUnits.forEach((unit) => {
            allUnits.push({
              ...unit,
              buildingName: building.name,
              floorName: floor.name,
            });
          });
        }
      }

      setUnits(allUnits);
    } catch (err) {
      console.error(err);
      setError('Failed to load units.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) => {
    const query = search.toLowerCase();

    return (
      String(unit.unitNumber).toLowerCase().includes(query) ||
      unit.unitType?.toLowerCase().includes(query) ||
      unit.buildingName?.toLowerCase().includes(query) ||
      unit.floorName?.toLowerCase().includes(query) ||
      unit.status?.toLowerCase().includes(query)
    );
  });

  const occupied = units.filter(
    (unit) => unit.status === 'OCCUPIED'
  ).length;

  const available = units.filter(
    (unit) => unit.status === 'AVAILABLE'
  ).length;

  const maintenance = units.filter(
    (unit) => unit.status === 'MAINTENANCE'
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Units
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage all units across your buildings.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Units
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {units.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Occupied
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {occupied}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Available
          </p>
          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {available}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Maintenance
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {maintenance}
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <input
          type="text"
          placeholder="Search by unit, building, floor, type or status..."
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
                  Unit
                </th>

                <th className="px-6 py-4">
                  Building
                </th>

                <th className="px-6 py-4">
                  Floor
                </th>

                <th className="px-6 py-4">
                  Type
                </th>

                <th className="px-6 py-4">
                  Area
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Actions
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
                    Loading units...
                  </td>
                </tr>
              ) : filteredUnits.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No units found.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        {unit.unitNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.buildingName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.floorName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.unitType}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.areaSqFt} sq ft
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[unit.status] ||
                          'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/units/${unit.id}/devices`)
                        }
                        className="rounded-lg px-3 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10"
                      >
                        View Devices
                      </button>
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