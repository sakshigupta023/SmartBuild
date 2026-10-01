import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return users;

    return users.filter((user) =>
      `${user.firstName || ''} ${user.lastName || ''} ${
        user.email || ''
      } ${user.phone || ''} ${user.role || ''}`
        .toLowerCase()
        .includes(query)
    );
  }, [users, search]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.active
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === 'ADMIN'
  ).length;

  const managerUsers = users.filter(
    (user) => user.role === 'MANAGER'
  ).length;

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);

      await api.put(`/users/${editingUser.id}`, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phone: editingUser.phone,
        role: editingUser.role,
        active: editingUser.active,
      });

      toast.success('User updated successfully.');

      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update user.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);

      toast.success('User deleted successfully.');

      await fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete user.'
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage SmartBuild users and their access roles.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Users
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Active Users
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {activeUsers}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Admins
          </p>

          <p className="mt-2 text-2xl font-bold text-purple-400">
            {adminUsers}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Managers
          </p>

          <p className="mt-2 text-2xl font-bold text-indigo-400">
            {managerUsers}
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

        <input
          type="text"
          placeholder="Search by name, email, phone or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
        />

      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-700 bg-slate-800">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-400">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-700">

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="hover:bg-slate-750"
                  >

                    {/* User */}
                    <td className="px-6 py-4">

                      <div className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </div>

                      <div className="text-sm text-slate-400">
                        {user.email}
                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {user.phone || '—'}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-500/15 text-purple-400'
                            : user.role === 'MANAGER'
                            ? 'bg-indigo-500/15 text-indigo-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.active
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {user.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
  <div className="flex items-center justify-end gap-3">

    <button
      type="button"
      onClick={() => setEditingUser({ ...user })}
      className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => deleteUser(user.id)}
      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
    >
      Delete
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

      {/* Edit User Modal */}
      {editingUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">

            <h2 className="mb-5 text-xl font-bold text-white">
              Edit User
            </h2>

            <div className="space-y-4">

              {/* First Name */}
              <input
                type="text"
                value={editingUser.firstName || ''}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    firstName: e.target.value,
                  })
                }
                placeholder="First name"
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />

              {/* Last Name */}
              <input
                type="text"
                value={editingUser.lastName || ''}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    lastName: e.target.value,
                  })
                }
                placeholder="Last name"
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />

              {/* Phone */}
              <input
                type="text"
                value={editingUser.phone || ''}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />

              {/* Role */}
              <select
                value={editingUser.role || 'RESIDENT'}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="RESIDENT">RESIDENT</option>
              </select>

              {/* Active */}
              <label className="flex items-center gap-3 text-sm text-slate-300">

                <input
                  type="checkbox"
                  checked={editingUser.active ?? false}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded"
                />

                Active user

              </label>

            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateUser}
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}