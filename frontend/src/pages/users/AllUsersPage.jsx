import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../api/axios';

const roleStyles = {
  ADMIN: 'bg-purple-500/10 text-purple-400',
  MANAGER: 'bg-indigo-500/10 text-indigo-400',
  RESIDENT: 'bg-emerald-500/10 text-emerald-400',
};

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${userId}`);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId)
      );

      toast.success('User deleted successfully.');
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          'Failed to delete user.'
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    const fullName =
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();

    return (
      fullName.includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    );
  });

  const activeUsers = users.filter(
    (user) => user.active !== false
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === 'ADMIN'
  ).length;

  const managerUsers = users.filter(
    (user) => user.role === 'MANAGER'
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage SmartBuild users and their access roles.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Users
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {users.length}
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
                  Name
                </th>

                <th className="px-6 py-4">
                  Email
                </th>

                <th className="px-6 py-4">
                  Phone
                </th>

                <th className="px-6 py-4">
                  Role
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
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/30"
                  >

                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        {user.firstName} {user.lastName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {user.phone || '-'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          roleStyles[user.role] ||
                          'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.active !== false
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {user.active !== false
                          ? 'ACTIVE'
                          : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Delete
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