"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { mockDb } from "@/lib/supabase";
import { Users, Plus, ShieldAlert, Edit2, Trash2, CheckCircle, X } from "lucide-react";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ username: "", name: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await mockDb.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenAdd = () => {
    setEditingUsername(null);
    setFormData({ username: "", name: "", password: "", role: "admin" });
    setIsFormOpen(true);
    setError("");
    setSuccess("");
  };

  const handleOpenEdit = (userData) => {
    setEditingUsername(userData.username);
    setFormData({ 
      username: userData.username, 
      name: userData.name, 
      password: "", // biarkan kosong jika tidak ingin ganti
      role: userData.role 
    });
    setIsFormOpen(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editingUsername && formData.password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }
    
    if (editingUsername && formData.password && formData.password.length < 6) {
      setError("Password baru harus minimal 6 karakter.");
      return;
    }

    if (editingUsername) {
      const res = await mockDb.updateUser(editingUsername, formData);
      if (res.success) {
        setSuccess(`Admin ${formData.username} berhasil diperbarui!`);
        setIsFormOpen(false);
        loadUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } else {
      const res = await mockDb.addUser(formData);
      if (res.success) {
        setSuccess(`Admin ${formData.username} berhasil ditambahkan!`);
        setIsFormOpen(false);
        loadUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    }
  };

  const handleDelete = async (username) => {
    if (username === user?.username) {
      alert("Anda tidak bisa menghapus akun Anda sendiri!");
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus admin '${username}'?`)) {
      await mockDb.deleteUser(username);
      loadUsers();
    }
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <ShieldAlert className="w-20 h-20 text-red-500/50 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
        <p className="text-slate-400">Hanya Admin Utama (Super Admin) yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-0 sm:pr-16">
        <div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">Manajemen Admin</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola akses *Sub-Admin* untuk tim JD Music Anda.</p>
        </div>
        <button 
          onClick={isFormOpen ? () => setIsFormOpen(false) : handleOpenAdd}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center space-x-2 border border-white/10"
        >
          {isFormOpen ? <><X className="w-4 h-4" /><span>Batal</span></> : <><Plus className="w-4 h-4" /><span>Tambah Admin</span></>}
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-sm animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">{editingUsername ? "Edit Admin" : "Tambah Admin Baru"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Nama Lengkap</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: Budi CS" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Username (Login)</label>
                <input required name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: budi_admin" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">{editingUsername ? "Password Baru (Kosongkan jika tidak diubah)" : "Password Sementara"}</label>
                <input required={!editingUsername} type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Role (Hak Akses)</label>
                <select name="role" value={formData.role} onChange={handleChange} disabled={editingUsername === user?.username} className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold text-sm bg-navy-darker text-white disabled:opacity-50">
                  <option value="admin">Admin Biasa (Terbatas)</option>
                  <option value="superadmin">Super Admin (Akses Penuh)</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 flex justify-end">
              <button type="submit" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold text-navy-dark px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all">
                {editingUsername ? "Simpan Perubahan" : "Buat Akun Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Admin */}
      <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-gold" />
            <span>Daftar Tim & Admin</span>
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-white/10">Admin</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Username</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Role</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-gold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-400 bg-black/20 px-2 py-1 rounded inline-block">{u.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'superadmin' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(u)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-colors text-xs font-semibold"
                          title="Edit Admin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.username !== user?.username && (
                          <button 
                            onClick={() => handleDelete(u.username)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors text-xs font-semibold"
                            title="Hapus Admin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
