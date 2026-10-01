import { useEffect, useState } from 'react';

import api from '../../api/axios';

const statusStyles = {
  ON: 'bg-emerald-500/10 text-emerald-400',
  OFF: 'bg-slate-500/10 text-slate-400',
};

export default function AllDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');

      const buildingsResponse = await api.get('/buildings');
      const buildings = buildingsResponse.data.data || [];

      const allDevices = [];

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
            const devicesResponse = await api.get(
              `/devices/unit/${unit.id}`
            );

            const unitDevices = devicesResponse.data.data || [];

            unitDevices.forEach((device) => {
              allDevices.push({
                ...device,
                unitNumber: unit.unitNumber,
                buildingName: building.name,
                floorName: floor.name,
              });
            });
          }
        }
      }

      setDevices(allDevices);
    } catch (err) {
      console.error(err);
      setError('Failed to load devices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const filteredDevices = devices.filter((device) => {
    const query = search.toLowerCase();

    return (
      device.deviceName?.toLowerCase().includes(query) ||
      device.deviceType?.toLowerCase().includes(query) ||
      device.status?.toLowerCase().includes(query) ||
      String(device.unitNumber)
        .toLowerCase()
        .includes(query) ||
      device.buildingName?.toLowerCase().includes(query)
    );
  });

  const activeDevices = devices.filter(
    (device) => device.status === 'ON'
  ).length;

  const totalPower = devices.reduce(
    (sum, device) =>
      sum + (Number(device.powerConsumptionWatts) || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Devices
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Monitor smart devices across all units.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Devices
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {devices.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Active Devices
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {activeDevices}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Connected Load
          </p>

          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {totalPower.toLocaleString()} W
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <input
          type="text"
          placeholder="Search by device, type, unit, building or status..."
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
                  Device
                </th>

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
                  Type
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Power
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
                    Loading devices...
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No devices found.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        {device.deviceName}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.buildingName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.floorName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.unitNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.deviceType}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[device.status] ||
                          'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.powerConsumptionWatts} W
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