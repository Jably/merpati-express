import React, { useEffect, useState } from 'react';

type Order = {
  orderNumber: string;
  senderName: string;
  senderAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  transport: string;
  service: string;
  colly: string;
  weight: string;
  description: string;
  origin: string;
  destination: string;
  airwayBill: string;
  keterangan: string;
  status: string;
  createdAt: string;
};

type RowData = {
  no: number;
  date: string;
  pengirim: string;
  kotaOrigin: string;
  penerima: string;
  kotaTujuan: string;
  noTiket: string;
  partDesc: string;
  colly: number;
  kg: number;
  ket: string;
  service: string;
  biayaPerKg: number;
};

type FormData = {
  date: string;
  pengirim: string;
  kotaOrigin: string;
  penerima: string;
  kotaTujuan: string;
  noTiket: string;
  partDesc: string;
  colly: string;
  kg: string;
  ket: string;
  service: string;
  biayaPerKg: string;
};

export default function InvoiceForm() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');

  const emptyFormData: FormData = {
    date: '',
    pengirim: '',
    kotaOrigin: '',
    penerima: '',
    kotaTujuan: '',
    noTiket: '',
    partDesc: '',
    colly: '',
    kg: '',
    ket: '',
    service: '',
    biayaPerKg: '',
  };

  const [formData, setFormData] = useState<FormData>({ ...emptyFormData });
  const [mode, setMode] = useState<'kirim' | 'retur'>('kirim');
  const [kirimRows, setKirimRows] = useState<RowData[]>([]);
  const [returRows, setReturRows] = useState<RowData[]>([]);

  useEffect(() => {
    fetch('/api/Order')
      .then(res => res.json())
      .then((data: Order[]) => setOrders(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedOrderNumber) return setFormData({ ...emptyFormData });

    fetch(`/api/Order?orderNumber=${selectedOrderNumber}`)
      .then(res => res.json())
      .then((order: Order) => {
        setFormData({
          date: new Date(order.createdAt).toISOString().split('T')[0],
          pengirim: order.senderName,
          kotaOrigin: order.origin,
          penerima: order.consigneeName,
          kotaTujuan: order.destination,
          noTiket: order.orderNumber,
          partDesc: order.description,
          colly: order.colly,
          kg: order.weight,
          ket: order.keterangan,
          service: order.service,
          biayaPerKg: '',
        });
      })
      .catch(() => setFormData({ ...emptyFormData }));
  }, [selectedOrderNumber]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddRow = () => {
    const newRow: RowData = {
      no: (mode === 'kirim' ? kirimRows.length : returRows.length) + 1,
      date: formData.date,
      pengirim: formData.pengirim,
      kotaOrigin: formData.kotaOrigin,
      penerima: formData.penerima,
      kotaTujuan: formData.kotaTujuan,
      noTiket: formData.noTiket,
      partDesc: formData.partDesc,
      colly: Number(formData.colly) || 0,
      kg: Number(formData.kg) || 0,
      ket: formData.ket,
      service: formData.service,
      biayaPerKg: Number(formData.biayaPerKg) || 0,
    };

    if (mode === 'kirim') setKirimRows([...kirimRows, newRow]);
    else setReturRows([...returRows, newRow]);

    setFormData({ ...emptyFormData });
    setSelectedOrderNumber('');
  };

  const calculateTotal = (rows: RowData[]) =>
    rows.reduce((sum, row) => sum + row.kg * row.biayaPerKg, 0);

  const totalAll = calculateTotal(kirimRows) + calculateTotal(returRows);

  return (
    <div className="p-4 text-sm">
      <div className="mb-4">
        <label htmlFor="orderSelect" className="block font-semibold mb-1">
          Pilih Order Number:
        </label>
        <select
          id="orderSelect"
          value={selectedOrderNumber}
          onChange={(e) => setSelectedOrderNumber(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
        >
          <option value="">-- Pilih Order --</option>
          {orders.map((order) => (
            <option key={order.orderNumber} value={order.orderNumber}>
              {order.orderNumber} - {order.senderName} ke {order.consigneeName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-bold mb-2">Input Data</h2>
        <div className="flex flex-wrap gap-4 mb-2">
  <div className="flex flex-col">
    <span className="text-xs font-medium">Jenis</span>
    <select value={mode} onChange={(e) => setMode(e.target.value as 'kirim' | 'retur')} className="border p-1">
      <option value="kirim">KIRIM</option>
      <option value="retur">RETUR</option>
    </select>
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Date</span>
    <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Pengirim</span>
    <input value={formData.pengirim} onChange={(e) => handleChange('pengirim', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Kota Origin</span>
    <input value={formData.kotaOrigin} onChange={(e) => handleChange('kotaOrigin', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Penerima</span>
    <input value={formData.penerima} onChange={(e) => handleChange('penerima', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Kota Tujuan</span>
    <input value={formData.kotaTujuan} onChange={(e) => handleChange('kotaTujuan', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">No Tiket</span>
    <input value={formData.noTiket} onChange={(e) => handleChange('noTiket', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Part Desc</span>
    <input value={formData.partDesc} onChange={(e) => handleChange('partDesc', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col w-20">
    <span className="text-xs font-medium">Colly</span>
    <input type="number" value={formData.colly} onChange={(e) => handleChange('colly', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col w-20">
    <span className="text-xs font-medium">Kg</span>
    <input type="number" value={formData.kg} onChange={(e) => handleChange('kg', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Ket</span>
    <input value={formData.ket} onChange={(e) => handleChange('ket', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-medium">Service</span>
    <input value={formData.service} onChange={(e) => handleChange('service', e.target.value)} className="border p-1" />
  </div>
  <div className="flex flex-col w-24">
    <span className="text-xs font-medium">Biaya/Kg</span>
    <input type="number" value={formData.biayaPerKg} onChange={(e) => handleChange('biayaPerKg', e.target.value)} className="border p-1" />
  </div>
</div>

        <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Tambah</button>
      </div>

      <table className="min-w-full border border-gray-400 text-xs">
        <thead className="bg-gray-200 text-center">
          <tr>
            <th className="border px-2 py-1">NO</th>
            <th className="border px-2 py-1">DATE</th>
            <th className="border px-2 py-1">PENGIRIM</th>
            <th className="border px-2 py-1">KOTA ORIGIN</th>
            <th className="border px-2 py-1">PENERIMA</th>
            <th className="border px-2 py-1">KOTA TUJUAN</th>
            <th className="border px-2 py-1">NO TIKET</th>
            <th className="border px-2 py-1">DESCRIPTION PART</th>
            <th className="border px-2 py-1">COLLY</th>
            <th className="border px-2 py-1">Kg</th>
            <th className="border px-2 py-1">KET</th>
            <th className="border px-2 py-1">SERVICE</th>
            <th className="border px-2 py-1">BIAYA PER Kg</th>
            <th className="border px-2 py-1">TOTAL BIAYA</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-yellow-100 font-bold text-center">
            <td colSpan={14} className="border py-1">KIRIM</td>
          </tr>
          {kirimRows.map((row) => (
            <tr key={`kirim-${row.no}`} className="text-center">
              {renderRow(row)}
            </tr>
          ))}
          <tr className="bg-red-100 font-bold text-center">
            <td colSpan={14} className="border py-1">RETUR</td>
          </tr>
          {returRows.map((row) => (
            <tr key={`retur-${row.no}`} className="text-center">
              {renderRow(row)}
            </tr>
          ))}
          <tr className="bg-green-200 font-bold text-right">
            <td colSpan={13} className="border px-2 text-right">TOTAL BIAYA</td>
            <td className="border px-2 text-right">
              {totalAll.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  function renderRow(row: RowData) {
    return (
      <>
        <td className="border px-2">{row.no}</td>
        <td className="border px-2">{row.date}</td>
        <td className="border px-2">{row.pengirim}</td>
        <td className="border px-2">{row.kotaOrigin}</td>
        <td className="border px-2">{row.penerima}</td>
        <td className="border px-2">{row.kotaTujuan}</td>
        <td className="border px-2">{row.noTiket}</td>
        <td className="border px-2">{row.partDesc}</td>
        <td className="border px-2">{row.colly}</td>
        <td className="border px-2">{row.kg}</td>
        <td className="border px-2">{row.ket}</td>
        <td className="border px-2">{row.service}</td>
        <td className="border px-2">{row.biayaPerKg}</td>
        <td className="border px-2 text-right">
          {(row.kg * row.biayaPerKg).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          })}
        </td>
      </>
    );
  }
}
