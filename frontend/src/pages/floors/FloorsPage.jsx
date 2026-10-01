import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function FloorsPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();

  const [building, setBuilding] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    floorNumber: '',
    name: '',
    totalUnits: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [buildingResponse, floorsResponse] = await Promise.all([
        api.get(`/buildings/${buildingId}`),
        api.get(`/floors/building/${buildingId}`),
      ]);

      setBuilding(buildingResponse.data.data);
      setFloors(floorsResponse.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load floors'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [buildingId]);

  const resetForm = () => {
    setForm({
      floorNumber: '',
      name: '',
      totalUnits: '',
    });

    setEditingFloor(null);
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
        buildingId,
        floorNumber: Number(form.floorNumber),
        name: form.name,
        totalUnits: Number(form.totalUnits),
      };

      if (editingFloor) {
        await api.put(`/floors/${editingFloor.id}`, payload);
        toast.success('Floor updated successfully');
      } else {
        await api.post('/floors', payload);
        toast.success('Floor added successfully');
      }

      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save floor'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (floor) => {
    setEditingFloor(floor);

    setForm({
      floorNumber: floor.floorNumber || '',
      name: floor.name || '',
      totalUnits: floor.totalUnits || '',
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this floor?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/floors/${id}`);

      toast.success('Floor deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete floor'
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
            onClick={() => navigate('/buildings')}
            className="mb-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <Icons.ArrowLeftIcon className="h-4 w-4" />
            Back to Buildings
          </button>

          <h1 className="text-2xl font-bold text-white">
            {building?.name || 'Building Floors'}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {building?.address}
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
          Add Floor
        </button>
      </div>

      {/* Building Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Total Floors</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {building?.totalFloors || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Total Units</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {building?.totalUnits || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Configured Floors</p>
          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {floors.length}
          </p>
        </div>

      </div>

      {/* Floors */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        {floors.length === 0 ? (
          <div className="py-16 text-center">

            <Icons.BuildingOfficeIcon className="mx-auto h-12 w-12 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No floors configured
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add the first floor for this building.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Floor
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Units
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">

                {floors.map((floor) => (
                  <tr
                    key={floor.id}
                    className="transition hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                        <span className="font-bold text-indigo-400">
                          {floor.floorNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      {floor.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {floor.totalUnits}
                    </td>

                    <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

  <button
    onClick={() => navigate(`/floors/${floor.id}/units`)}
    className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
    title="View Units"
  >
    <Icons.HomeModernIcon className="h-5 w-5" />
  </button>

  <button
    onClick={() => handleEdit(floor)}
    className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
    title="Edit"
  >
    <Icons.PencilIcon className="h-5 w-5" />
  </button>

  <button
    onClick={() => handleDelete(floor.id)}
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
                  {editingFloor ? 'Edit Floor' : 'Add Floor'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Configure floor information.
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
                  Floor Number
                </label>

                <input
                  type="number"
                  name="floorNumber"
                  min="0"
                  required
                  value={form.floorNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Floor Name
                </label>

                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. First Floor"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Total Units
                </label>

                <input
                  type="number"
                  name="totalUnits"
                  min="1"
                  required
                  value={form.totalUnits}
                  onChange={handleChange}
                  placeholder="e.g. 20"
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
                    : editingFloor
                      ? 'Update Floor'
                      : 'Add Floor'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}