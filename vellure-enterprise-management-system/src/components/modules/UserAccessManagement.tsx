import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Key,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  Search,
  Lock,
  Unlock,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { UserPermission, ModuleId } from '../../types';
import { MODULE_DEFINITIONS } from '../../data/initialData';

interface UserAccessManagementProps {
  users: UserPermission[];
  onAddUser: (user: UserPermission) => void;
  onUpdateUser: (user: UserPermission) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: UserPermission;
}

export const UserAccessManagement: React.FC<UserAccessManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPermission | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({
    'USR-001': true, // Show admin password by default for convenience
  });
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCopyPassword = (userId: string, pass: string) => {
    if (!pass) return;
    navigator.clipboard.writeText(pass);
    setCopiedUserId(userId);
    setTimeout(() => setCopiedUserId(null), 2000);
  };

  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserPermission['role']>('Sales Associate');
  const [newDepartment, setNewDepartment] = useState<UserPermission['department']>('Sales & Marketing');
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([2, 6, 8]);

  const handleToggleModule = (modId: ModuleId) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newFullName || !newPassword) return;

    const newUser: UserPermission = {
      userId: `USR-${Date.now().toString().slice(-4)}`,
      username: newUsername.toLowerCase().trim(),
      password: newPassword.trim(),
      fullName: newFullName.trim(),
      email: newEmail.trim() || `${newUsername.toLowerCase().trim()}@vellurefragrances.com`,
      role: newRole,
      department: newDepartment,
      status: 'Active',
      allowedModules: selectedModules,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };

    onAddUser(newUser);
    setShowAddModal(false);
    // Reset form
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setSelectedModules([2, 6, 8]);
  };

  const handleToggleStatus = (user: UserPermission) => {
    const updated: UserPermission = {
      ...user,
      status: user.status === 'Active' ? 'Suspended' : 'Active'
    };
    onUpdateUser(updated);
  };

  const handleToggleModuleForEdit = (modId: ModuleId) => {
    if (!editingUser) return;
    const exists = editingUser.allowedModules.includes(modId);
    const updatedModules = exists
      ? editingUser.allowedModules.filter(id => id !== modId)
      : [...editingUser.allowedModules, modId];
    setEditingUser({ ...editingUser, allowedModules: updatedModules });
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 1
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100">
                User & Access Privilege Management
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Enterprise security control panel. Create unique employee credentials, define page-level privileges (Pages 1-8), and immediately revoke or grant system access.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-amber-950/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Employee Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Super Admin Security Credentials Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
              <span>Super Admin Security Credentials</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                Active & Verified
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Account: <strong className="text-neutral-200">Md. Abdul Hannan (@abdul.hannan)</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                Password: <strong className="text-amber-400 bg-neutral-900 px-2 py-0.5 rounded border border-amber-900/50">Kr100300500</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopyPassword('USR-001', 'Kr100300500')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-all"
          >
            {copiedUserId === 'USR-001' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Password</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              const adminUser = users.find(u => u.userId === 'USR-001' || u.username === 'abdul.hannan') || currentUser;
              setEditingUser(adminUser);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all"
          >
            Edit Credentials
          </button>
        </div>
      </div>

      {/* Staff List & Privileges Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-neutral-200">
              Active Staff Directory & Page Privileges ({users.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-medium uppercase tracking-wider text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role & Dept</th>
                <th className="py-3 px-4">Credentials</th>
                <th className="py-3 px-4">Page-Level Access Privileges (1-8)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredUsers.map((user) => {
                const isCurrent = user.userId === currentUser.userId;
                return (
                  <tr
                    key={user.userId}
                    className={`hover:bg-neutral-800/40 transition-colors ${
                      user.status === 'Suspended' ? 'opacity-60 bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          user.role === 'Super Admin'
                            ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/30'
                            : 'bg-neutral-800 text-amber-300 border border-amber-900/30'
                        }`}>
                          {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-200">{user.role}</div>
                      <div className="text-[11px] text-neutral-500">{user.department}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-neutral-300 font-medium">@{user.username}</div>
                      <div className="text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <Key className="w-3 h-3 text-amber-500/70 shrink-0" />
                        <span className={revealedPasswords[user.userId] ? 'text-amber-300 font-semibold' : 'text-neutral-500'}>
                          {revealedPasswords[user.userId]
                            ? (user.password || (user.userId === 'USR-001' ? 'Kr100300500' : '••••••••'))
                            : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRevealPassword(user.userId)}
                          className="text-neutral-500 hover:text-amber-400 p-0.5 rounded transition-colors"
                          title={revealedPasswords[user.userId] ? 'Hide Password' : 'Show Password'}
                        >
                          {revealedPasswords[user.userId] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                        {revealedPasswords[user.userId] && (
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(user.userId, user.password || 'Kr100300500')}
                            className="text-neutral-500 hover:text-amber-400 p-0.5 rounded transition-colors"
                            title="Copy Password"
                          >
                            {copiedUserId === user.userId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {MODULE_DEFINITIONS.map((m) => {
                          const hasPrivilege = user.allowedModules.includes(m.id);
                          return (
                            <span
                              key={m.id}
                              title={`${m.id}. ${m.name}: ${hasPrivilege ? 'Granted' : 'Revoked'}`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                                hasPrivilege
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-neutral-950 text-neutral-600 border-neutral-800 line-through'
                              }`}
                            >
                              P{m.id}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          user.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {user.status === 'Active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Suspended
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setEditingUser(user)}
                          title="Edit Privileges & Role"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={user.userId === 'USR-001'}
                          title={user.status === 'Active' ? 'Revoke System Access' : 'Restore Access'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'Active'
                              ? 'bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400'
                              : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {user.status === 'Active' ? (
                            <Unlock className="w-3.5 h-3.5" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {user.userId !== 'USR-001' && (
                          <button
                            onClick={() => {
                              if (confirm(`Revoke and permanently delete ${user.fullName}'s account?`)) {
                                onDeleteUser(user.userId);
                              }
                            }}
                            title="Delete Account"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Employee Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  Create Staff Credentials & Privileges
                </h3>
                <p className="text-xs text-neutral-400">
                  Assign secure login username, password, and granular page access.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakib Al Hasan"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Username (Login ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shakib.perfumery"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="staff@vellurefragrances.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Dispatch Specialist">Dispatch Specialist</option>
                    <option value="Lab Formulator">Lab Formulator</option>
                    <option value="Sales Associate">Sales Associate</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Master Perfumer">Master Perfumer</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Logistics">Logistics & Courier</option>
                    <option value="Laboratory">Laboratory & Distillation</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Finance">Finance & Inventory</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              {/* Granular Page-Level Access Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-200">
                    Page-Level Access Privilege Assignment:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedModules.length === 8) {
                        setSelectedModules([]);
                      } else {
                        setSelectedModules([1, 2, 3, 4, 5, 6, 7, 8]);
                      }
                    }}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    {selectedModules.length === 8 ? 'Deselect All' : 'Select All 8 Pages'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {MODULE_DEFINITIONS.map((m) => {
                    const isChecked = selectedModules.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center space-x-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModule(m.id)}
                          className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900"
                        />
                        <span className="font-mono font-bold text-amber-400 text-[10px]">
                          P{m.id}
                        </span>
                        <span className="truncate text-[11px]">{m.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 text-xs font-bold tracking-wider transition-all"
                >
                  Create & Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Privileges Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-400" />
                  Edit Privileges: {editingUser.fullName}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">@{editingUser.username}</span>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 text-xs"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Master Perfumer">Master Perfumer</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Dispatch Specialist">Dispatch Specialist</option>
                    <option value="Lab Formulator">Lab Formulator</option>
                    <option value="Sales Associate">Sales Associate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Account Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended (Access Revoked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 text-xs">
                  Login Password (পাসওয়ার্ড পরিবর্তন / দেখুন)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="e.g. Kr100300500"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Current password for @{editingUser.username}. Changes take effect immediately.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-2">
                  Toggle Page-Level Privileges (Pages 1 - 8):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {MODULE_DEFINITIONS.map((m) => {
                    const isAllowed = editingUser.allowedModules.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleToggleModuleForEdit(m.id)}
                        className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                          isAllowed
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                          isAllowed ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {m.id}
                        </span>
                        <span className="truncate text-[11px]">{m.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateUser(editingUser);
                  setEditingUser(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 text-xs font-bold tracking-wider"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
