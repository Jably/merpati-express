'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataAkun() {
  const [user, setUser] = useState<{ id: number, name: string, email: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // Fetch user yang sedang login
  const fetchUser = async () => {
    const res = await fetch('/api/user')
    if (res.ok) {
      const data = await res.json()
      setUser(data)
      setForm({ name: data.name, email: data.email, password: '' }) // password kosong
    }
  }

  useEffect(() => { fetchUser() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!user) return

    await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, ...form }),
    })

    alert('Akun berhasil diupdate')
    fetchUser() // refresh data
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="password" placeholder="Password Baru" type="password" value={form.password} onChange={handleChange} />

          <Button onClick={handleSave} className="w-full">Simpan Perubahan</Button>
        </CardContent>
      </Card>
    </div>
  )
}
