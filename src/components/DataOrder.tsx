'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import "@/app/globals.css";
import withAuth from "../../lib/withAuth";

export default function DataOrder() {
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState<any>({})
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchOrders = async () => {
    const res = await fetch('/api/Order');
    if (!res.ok) {
      setOrders([]);
      return;
    }
  
    const data = await res.json();
  
    if (Array.isArray(data)) {
      setOrders(data);
    } else if (data && typeof data === 'object') {
      setOrders([data]);
    } else {
      setOrders([]);
    }
  };
  

  useEffect(() => { fetchOrders() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setForm({ ...form, status: value })
  }

  const handleSave = async () => {
    const method = editingId ? 'PUT' : 'POST'
    await fetch('/api/Order', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    })
    setForm({})
    setEditingId(null)
    fetchOrders()
  }

  const handleEdit = (order: any) => {
    setForm(order)
    setEditingId(order.id)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Yakin hapus order ini?')) {
      await fetch('/api/Order', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchOrders()
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold font-montserrat mb-4">Data Order</h1>
  
      {/* Grid 2 kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Tabel */}
        <div className="w-full text-center">
          <Table className="table-auto w-full font-montserrat font-bold">
            <TableHeader>
              <TableRow className="bg-[#1d4ebc] hover:bg-[#1d4ebc]">
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">AWB</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">No Order</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">Pengirim</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">Penerima</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">Asal - Tujuan</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">Status</TableHead>
                <TableHead className="whitespace-nowrap text-center text-white font-extrabold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">{order.airwayBill}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.orderNumber}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.senderName}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.consigneeName}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.origin} → {order.destination}</TableCell>
                  <TableCell className="whitespace-nowrap">
  <span
    className={`text-black text-sm px-3 py-1 rounded ${
      order.status === 'pending'
        ? 'bg-orange-500'
        : order.status === 'delivered'
        ? 'bg-green-600'
        : order.status === 'cancelled'
        ? 'bg-red-500'
        : 'bg-gray-300'
    }`}
  >
    {order.status}
  </span>
</TableCell>


                  <TableCell className="whitespace-nowrap space-x-2">
                    <Button className="text-black font-bold" size="sm" variant="secondary" onClick={() => handleEdit(order)}>Edit</Button>
                    <Button size="sm" className="font-bold" variant="destructive" onClick={() => handleDelete(order.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">Tidak ada data.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
        </div>
      </div>
      <div>
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Order' : 'Tambah Order Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 font-montserrat font-bold">
              <Input name="orderNumber" onChange={handleChange} value={form.orderNumber || ''} placeholder="No Order" />
              <Input name="senderName" onChange={handleChange} value={form.senderName || ''} placeholder="Nama Pengirim" />
              <Input name="senderAddress" onChange={handleChange} value={form.senderAddress || ''} placeholder="Alamat Pengirim" />
              <Input name="consigneeName" onChange={handleChange} value={form.consigneeName || ''} placeholder="Nama Penerima" />
              <Input name="consigneeAddress" onChange={handleChange} value={form.consigneeAddress || ''} placeholder="Alamat Penerima" />
              <Input name="transport" onChange={handleChange} value={form.transport || ''} placeholder="Transportasi" />
              <Input name="service" onChange={handleChange} value={form.service || ''} placeholder="Layanan" />
              <Input name="colly" onChange={handleChange} value={form.colly || ''} placeholder="Colly" />
              <Input name="weight" onChange={handleChange} value={form.weight || ''} placeholder="Berat" />
              <Input name="description" onChange={handleChange} value={form.description || ''} placeholder="Deskripsi" />
              <Input name="origin" onChange={handleChange} value={form.origin || ''} placeholder="Asal" />
              <Input name="destination" onChange={handleChange} value={form.destination || ''} placeholder="Tujuan" />
              <Input name="airwayBill" onChange={handleChange} value={form.airwayBill || ''} placeholder="Airway Bill" />
              <Input name="keterangan" onChange={handleChange} value={form.keterangan || ''} placeholder="Keterangan"></Input>
  
              <Select value={form.status || 'pending'} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
  
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  
}
