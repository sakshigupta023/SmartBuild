import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function BuildingsPage() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    address: '',
    totalFloors: '',
    totalUnits: '',
  });

  const fetchBuildings = async () => {
    try {
      setLoading(true);

      const response = await api.get('/buildings');

      setBuildings(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load buildings'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      totalFloors: '',
      totalUnits: '',
    });

    setEditingBuilding(null);
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
        name: form.name,
        address: form.address,
        totalFloors: Number(form.totalFloors),
        totalUnits: Number(form.totalUnits),
      };

      if (editingBuilding) {
        await api.put(`/buildings/${editingBuilding.id}`, payload);
        toast.success('Building updated successfully');
      } else {
        await api.post('/buildings', payload);
        toast.success('Building added successfully');
      }

      setShowForm(false);
      resetForm();
      fetchBuildings();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save building'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);

    setForm({
      name: building.name || '',
      address: building.address || '',
      totalFloors: building.totalFloors || '',
      totalUnits: building.totalUnits || '',
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this building?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/buildings/${id}`);

      toast.success('Building deleted successfully');
      fetchBuildings();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete building'
      );
    }
  };

  const filteredBuildings = buildings.filter((building) => {
    const query = search.toLowerCase();

    return (
      building.name?.toLowerCase().includes(query) ||
      building.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Buildings
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your smart buildings and their information.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <Icons.PlusIcon className="h-5 w-5" />
          Add Building
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="relative max-w-md">
          <Icons.MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Icons.ArrowPathIcon className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="py-16 text-center">
            <Icons.BuildingOffice2Icon className="mx-auto h-12 w-12 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No buildings found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add your first building to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Building
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Floors
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
                {filteredBuildings.map((building) => (
                  <tr
                    key={building.id}
                    className="transition hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Icons.BuildingOffice2Icon className="h-5 w-5 text-indigo-400" />
                        </div>

                        <span className="font-medium text-white">
                          {building.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {building.address}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {building.totalFloors}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {building.totalUnits}
                    </td>

                    <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

  <button
    onClick={() => navigate(`/buildings/${building.id}/floors`)}
    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-indigo-400"
    title="View Floors"
  >
    <Icons.BuildingOfficeIcon className="h-5 w-5" />
  </button>

  <button
    onClick={() => handleEdit(building)}
    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-indigo-400"
    title="Edit"
  >
    <Icons.PencilIcon className="h-5 w-5" />
  </button>

  <button
    onClick={() => handleDelete(building.id)}
    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-red-400"
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
                  {editingBuilding ? 'Edit Building' : 'Add Building'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingBuilding
                    ? 'Update building information.'
                    : 'Add a new building to SmartBuild.'}
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

            <form onSubmit={handleSubmit} className="space-y-5 p-6">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Building Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SmartBuild Tower"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Address
                </label>

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Total Floors
                  </label>

                  <input
                    type="number"
                    name="totalFloors"
                    min="1"
                    value={form.totalFloors}
                    onChange={handleChange}
                    required
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
                    value={form.totalUnits}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>

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
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingBuilding
                      ? 'Update Building'
                      : 'Add Building'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}