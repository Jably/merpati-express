'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <Table className="table-auto w-full font-montserrat overflow-x-auto">
            <TableHeader>
              <TableRow className="bg-[#1d4ebc] hover:bg-[#1d4ebc] font-bold">
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
                <TableRow className="font-medium " key={order.id}>
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
  <div className="grid w-full gap-1.5">
    <Label htmlFor="orderNumber">No Order</Label>
    <Input id="orderNumber" name="orderNumber" onChange={handleChange} value={form.orderNumber || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="senderName">Nama Pengirim</Label>
    <Input id="senderName" name="senderName" onChange={handleChange} value={form.senderName || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="senderAddress">Alamat Pengirim</Label>
    <Textarea id="senderAddress" name="senderAddress" onChange={handleChange} value={form.senderAddress || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="consigneeName">Nama Penerima</Label>
    <Input id="consigneeName" name="consigneeName" onChange={handleChange} value={form.consigneeName || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="consigneeAddress">Alamat Penerima</Label>
    <Textarea id="consigneeAddress" name="consigneeAddress" onChange={handleChange} value={form.consigneeAddress || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="transport">Transportasi</Label>
    <Input id="transport" name="transport" onChange={handleChange} value={form.transport || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="service">Layanan</Label>
    <Input id="service" name="service" onChange={handleChange} value={form.service || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="colly">Colly</Label>
    <Input id="colly" name="colly" onChange={handleChange} value={form.colly || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="weight">Berat</Label>
    <Input id="weight" name="weight" onChange={handleChange} value={form.weight || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="description">Deskripsi</Label>
    <Input id="description" name="description" onChange={handleChange} value={form.description || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="origin">Asal</Label>
    <Input id="origin" name="origin" onChange={handleChange} value={form.origin || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="destination">Tujuan</Label>
    <Input id="destination" name="destination" onChange={handleChange} value={form.destination || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="airwayBill">Airway Bill</Label>
    <Input id="airwayBill" name="airwayBill" onChange={handleChange} value={form.airwayBill || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="keterangan">Keterangan</Label>
    <Input id="keterangan" name="keterangan" onChange={handleChange} value={form.keterangan || ''} />
  </div>

  <div className="grid w-full gap-1.5">
    <Label htmlFor="status">Status</Label>
    <Select value={form.status || 'pending'} onValueChange={handleSelectChange}>
      <SelectTrigger id="status">
        <SelectValue placeholder="Pilih Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  </div>

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
