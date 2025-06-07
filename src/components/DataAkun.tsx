// components/DataAkun.tsx
'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export default function DataAkun() {
  // Hanya perlu state untuk pengguna yang sedang login untuk memeriksa perannya
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  // State untuk manajemen pengguna (CRUD)
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [crudForm, setCrudForm] = useState({ name: '', email: '', password: '', role: UserRole.USER });
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);

  // --- Fungsionalitas Mendapatkan Peran Pengguna Saat Ini ---
  const fetchCurrentUserRole = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setCurrentUserRole(data.role);
      } else {
        const errorData = await res.json();
        console.error("Failed to fetch current user role:", errorData);
        setCurrentUserRole(null);
      }
    } catch (error) {
      console.error("Network or parsing error fetching current user role:", error);
      setCurrentUserRole(null);
    }
  }

  useEffect(() => {
    fetchCurrentUserRole();
  }, []);

  // --- Fungsionalitas Manajemen Pengguna (Admin CRUD) ---
  const fetchAllUsers = async () => {
    if (currentUserRole === UserRole.ADMIN) {
      try {
        const res = await fetch('/api/user?allUsers=true');
        if (res.ok) {
          const data = await res.json();
          setAllUsers(data);
        } else {
          const errorData = await res.json();
          console.error("Failed to fetch all users:", errorData);
          setAllUsers([]);
          if (res.status === 403) {
            alert('Anda tidak memiliki izin untuk melihat daftar pengguna.');
          }
        }
      } catch (error) {
        console.error("Network or parsing error fetching all users:", error);
        setAllUsers([]);
      }
    } else if (currentUserRole !== null && currentUserRole !== UserRole.ADMIN) {
        setAllUsers([]);
    }
  }

  useEffect(() => {
    if (currentUserRole !== null) {
      fetchAllUsers();
    }
  }, [currentUserRole]);

  const handleCrudFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCrudForm({ ...crudForm, [e.target.name]: e.target.value });
  }

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setCrudForm({ name: userToEdit.name, email: userToEdit.email, password: '', role: userToEdit.role });
    setIsCrudModalOpen(true);
  }

  const handleDeleteUser = async (userId: number) => {
    if (currentUserRole !== UserRole.ADMIN) {
        alert('Anda tidak memiliki izin untuk menghapus pengguna.');
        return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    const res = await fetch(`/api/user?id=${userId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Pengguna berhasil dihapus!');
      fetchAllUsers();
    } else {
      const errorData = await res.json();
      alert(`Gagal menghapus pengguna: ${errorData.message || 'Terjadi kesalahan'}`);
      console.error("Delete user failed:", errorData);
    }
  }

  const handleSubmitCrudForm = async () => {
    if (currentUserRole !== UserRole.ADMIN) {
        alert('Anda tidak memiliki izin untuk melakukan tindakan ini.');
        return;
    }

    const url = editingUser ? `/api/user?id=${editingUser.id}` : '/api/user';

    if (!crudForm.name || !crudForm.email || (!editingUser && !crudForm.password)) {
      alert('Nama, Email, dan Password (untuk pengguna baru) harus diisi.');
      return;
    }
    if (!Object.values(UserRole).includes(crudForm.role)) {
      alert('Peran tidak valid.');
      return;
    }

    const payload: any = { ...crudForm };
    // BARIS YANG DIPERBAIKI:
    if (editingUser && !payload.password) { // Menggunakan 'payload.password' bukan 'form.password'
      delete payload.password;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(`Pengguna berhasil ${editingUser ? 'diupdate' : 'ditambahkan'}!`);
      setIsCrudModalOpen(false);
      setEditingUser(null);
      setCrudForm({ name: '', email: '', password: '', role: UserRole.USER });
      fetchAllUsers();
    } else {
      const errorData = await res.json();
      alert(`Gagal ${editingUser ? 'mengupdate' : 'menambahkan'} pengguna: ${errorData.message || 'Terjadi kesalahan'}`);
      console.error("CRUD operation failed:", errorData);
    }
  }

  const handleAddUserClick = () => {
    setEditingUser(null);
    setCrudForm({ name: '', email: '', password: '', role: UserRole.USER });
    setIsCrudModalOpen(true);
  }

  if (currentUserRole === null) {
    return <div className="p-4 max-w-md mx-auto"><Card><CardContent>Memuat data pengguna...</CardContent></Card></div>;
  }

  if (currentUserRole !== UserRole.ADMIN) {
    return <div className="p-4 max-w-md mx-auto"><Card><CardContent>Anda tidak memiliki izin untuk mengakses halaman manajemen pengguna.</CardContent></Card></div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Manajemen Akun Pengguna</CardTitle>
          <Button onClick={handleAddUserClick}>Tambah Pengguna Baru</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((userItem) => (
                <TableRow key={userItem.id}>
                  <TableCell>{userItem.name}</TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>{userItem.role}</TableCell>
                  <TableCell className="text-right flex space-x-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(userItem)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(userItem.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
              {allUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Tidak ada pengguna.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Dialog open={isCrudModalOpen} onOpenChange={setIsCrudModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  name="name"
                  placeholder="Nama"
                  value={crudForm.name}
                  onChange={handleCrudFormChange}
                  className="col-span-3"
                />
                <Input
                  name="email"
                  placeholder="Email"
                  value={crudForm.email}
                  onChange={handleCrudFormChange}
                  className="col-span-3"
                />
                <Input
                  name="password"
                  placeholder={editingUser ? "Password Baru (kosongkan jika tidak mengubah)" : "Password"}
                  type="password"
                  value={crudForm.password}
                  onChange={handleCrudFormChange}
                  className="col-span-3"
                />
                <div>
                  <label htmlFor="crud-role" className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                  <select
                    id="crud-role"
                    name="role"
                    value={crudForm.role}
                    onChange={handleCrudFormChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {Object.values(UserRole).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitCrudForm}>
                  {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}