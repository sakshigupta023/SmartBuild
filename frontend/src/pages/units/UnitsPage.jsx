import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function UnitsPage() {
  const { floorId } = useParams();
  const navigate = useNavigate();

  const [floor, setFloor] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    unitNumber: '',
    unitType: '',
    areaSqFt: '',
    status: 'AVAILABLE',
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [floorResponse, unitsResponse] = await Promise.all([
        api.get(`/floors/${floorId}`),
        api.get(`/units/floor/${floorId}`),
      ]);

      setFloor(floorResponse.data.data);
      setUnits(unitsResponse.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load units'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [floorId]);

  const resetForm = () => {
    setForm({
      unitNumber: '',
      unitType: '',
      areaSqFt: '',
      status: 'AVAILABLE',
    });

    setEditingUnit(null);
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
        floorId,
        unitNumber: Number(form.unitNumber),
        unitType: form.unitType,
        areaSqFt: Number(form.areaSqFt),
        status: form.status,
      };

      if (editingUnit) {
        await api.put(`/units/${editingUnit.id}`, payload);
        toast.success('Unit updated successfully');
      } else {
        await api.post('/units', payload);
        toast.success('Unit added successfully');
      }

      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save unit'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);

    setForm({
      unitNumber: unit.unitNumber || '',
      unitType: unit.unitType || '',
      areaSqFt: unit.areaSqFt || '',
      status: unit.status || 'AVAILABLE',
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this unit?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/units/${id}`);

      toast.success('Unit deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete unit'
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
            Floor {floor?.floorNumber} Units
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {floor?.name}
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
          Add Unit
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Configured Units</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {units.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Occupied</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {units.filter((u) => u.status === 'OCCUPIED').length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Available</p>
          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {units.filter((u) => u.status === 'AVAILABLE').length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Maintenance</p>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {units.filter((u) => u.status === 'MAINTENANCE').length}
          </p>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        {units.length === 0 ? (
          <div className="py-16 text-center">
            <Icons.HomeModernIcon className="mx-auto h-12 w-12 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No units configured
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add the first unit to this floor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Unit
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Area
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="transition hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Icons.HomeModernIcon className="h-5 w-5 text-indigo-400" />
                        </div>

                        <span className="font-semibold text-white">
                          {unit.unitNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.unitType}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {unit.areaSqFt} sq ft
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          unit.status === 'OCCUPIED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : unit.status === 'MAINTENANCE'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-indigo-500/10 text-indigo-400'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            navigate(`/units/${unit.id}/devices`)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
                          title="View Devices"
                        >
                          <Icons.CpuChipIcon className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleEdit(unit)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
                          title="Edit"
                        >
                          <Icons.PencilIcon className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(unit.id)}
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
                  {editingUnit ? 'Edit Unit' : 'Add Unit'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Configure residential unit information.
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
                  Unit Number
                </label>

                <input
                  type="number"
                  name="unitNumber"
                  min="1"
                  required
                  value={form.unitNumber}
                  onChange={handleChange}
                  placeholder="e.g. 101"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Unit Type
                </label>

                <input
                  name="unitType"
                  required
                  value={form.unitType}
                  onChange={handleChange}
                  placeholder="e.g. 3BHK"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Area (sq ft)
                </label>

                <input
                  type="number"
                  name="areaSqFt"
                  min="1"
                  required
                  value={form.areaSqFt}
                  onChange={handleChange}
                  placeholder="e.g. 1400"
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
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
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
                    : editingUnit
                      ? 'Update Unit'
                      : 'Add Unit'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}