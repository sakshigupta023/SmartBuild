import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function DevicesPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    deviceName: '',
    deviceType: '',
    status: 'OFF',
    powerConsumptionWatts: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [unitResponse, devicesResponse] = await Promise.all([
        api.get(`/units/${unitId}`),
        api.get(`/devices/unit/${unitId}`),
      ]);

      setUnit(unitResponse.data.data);
      setDevices(devicesResponse.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load devices'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [unitId]);

  const resetForm = () => {
    setForm({
      deviceName: '',
      deviceType: '',
      status: 'OFF',
      powerConsumptionWatts: '',
    });

    setEditingDevice(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        unitId,
        deviceName: form.deviceName,
        deviceType: form.deviceType,
        status: form.status,
        powerConsumptionWatts: Number(form.powerConsumptionWatts),
      };

      if (editingDevice) {
        await api.put(`/devices/${editingDevice.id}`, payload);
        toast.success('Device updated successfully');
      } else {
        await api.post('/devices', payload);
        toast.success('Device added successfully');
      }

      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save device'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);

    setForm({
      deviceName: device.deviceName || '',
      deviceType: device.deviceType || '',
      status: device.status || 'OFF',
      powerConsumptionWatts: device.powerConsumptionWatts || '',
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this device?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/devices/${id}`);

      toast.success('Device deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete device'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Icons.ArrowPathIcon className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const activeDevices = devices.filter(
    (device) => device.status === 'ON'
  ).length;

  const totalPower = devices.reduce(
    (sum, device) =>
      sum + Number(device.powerConsumptionWatts || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <Icons.ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-white">
            Unit {unit?.unitNumber} Devices
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage smart devices installed in this unit.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Icons.PlusIcon className="h-5 w-5" />
          Add Device
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Total Devices</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {devices.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Active Devices</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {activeDevices}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Connected Load</p>
          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {totalPower} W
          </p>
        </div>

      </div>

      {/* Devices Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        {devices.length === 0 ? (
          <div className="py-16 text-center">
            <Icons.CpuChipIcon className="mx-auto h-12 w-12 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No devices configured
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add the first smart device to this unit.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Device
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Power
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {devices.map((device) => (
                  <tr
                    key={device.id}
                    className="transition hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Icons.CpuChipIcon className="h-5 w-5 text-indigo-400" />
                        </div>

                        <span className="font-semibold text-white">
                          {device.deviceName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.deviceType}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          device.status === 'ON'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {device.powerConsumptionWatts} W
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleEdit(device)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
                          title="Edit"
                        >
                          <Icons.PencilIcon className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(device.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400"
                          title="Delete"
                        >
                          <Icons.TrashIcon className="h-5 w-5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingDevice ? 'Edit Device' : 'Add Device'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Configure a smart device for this unit.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white"
              >
                <Icons.XMarkIcon className="h-6 w-6" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Device Name
                </label>

                <input
                  name="deviceName"
                  required
                  value={form.deviceName}
                  onChange={handleChange}
                  placeholder="e.g. Living Room AC"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Device Type
                </label>

                <input
                  name="deviceType"
                  required
                  value={form.deviceType}
                  onChange={handleChange}
                  placeholder="e.g. AIR_CONDITIONER"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Power Consumption (Watts)
                </label>

                <input
                  type="number"
                  name="powerConsumptionWatts"
                  min="0"
                  step="0.1"
                  required
                  value={form.powerConsumptionWatts}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingDevice
                      ? 'Update Device'
                      : 'Add Device'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}