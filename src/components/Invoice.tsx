import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

// If you prefer using axios, first install it: npm install axios or yarn add axios
// Then uncomment the line below:
// import axios from 'axios';

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
  id: string; // Tambahkan ID unik untuk setiap baris
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
  ket: string; // This will now be 'Good Part' or 'Bad Part'
  service: string;
  biayaPerKg: number;
};

type FormData = {
  date: string;
  pengirim: string;
  kotaOrigin: string;
  kotaTujuan: string;
  penerima: string;
  noTiket: string;
  partDesc: string;
  colly: string;
  kg: string;
  ket: string; // This will now be 'Good Part' or 'Bad Part'
  service: string;
  biayaPerKg: string;
};

export default function InvoiceForm() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');
  const [namaPT, setNamaPT] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today's date

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
    ket: 'Good Part', // Default value for the selector
    service: '',
    biayaPerKg: '',
  };

  const [formData, setFormData] = useState<FormData>({ ...emptyFormData });
  const [mode, setMode] = useState<'kirim' | 'retur'>('kirim');
  const [kirimRows, setKirimRows] = useState<RowData[]>([]);
  const [returRows, setReturRows] = useState<RowData[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null); // State untuk melacak baris yang sedang diedit

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
          ket: 'Good Part', // Ensure 'ket' also defaults or takes from order
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
      id: Math.random().toString(36).substring(2, 9), // ID unik
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

  const handleEditRow = (rowId: string, rowMode: 'kirim' | 'retur') => {
    setEditingRowId(rowId);
    const rowsToEdit = rowMode === 'kirim' ? kirimRows : returRows;
    const rowToEdit = rowsToEdit.find(row => row.id === rowId);

    if (rowToEdit) {
      setFormData({
        date: rowToEdit.date,
        pengirim: rowToEdit.pengirim,
        kotaOrigin: rowToEdit.kotaOrigin,
        penerima: rowToEdit.penerima,
        kotaTujuan: rowToEdit.kotaTujuan,
        noTiket: rowToEdit.noTiket,
        partDesc: rowToEdit.partDesc,
        colly: String(rowToEdit.colly),
        kg: String(rowToEdit.kg),
        ket: rowToEdit.ket,
        service: rowToEdit.service,
        biayaPerKg: String(rowToEdit.biayaPerKg),
      });
      setMode(rowMode);
    }
  };

  const handleUpdateRow = () => {
    if (!editingRowId) return;

    const updatedRow: RowData = {
      id: editingRowId,
      no: 0, // Nomor akan diatur ulang di bawah
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

    if (mode === 'kirim') {
      const updatedKirimRows = kirimRows.map(row => row.id === editingRowId ? updatedRow : row)
                                         .map((row, index) => ({ ...row, no: index + 1 }));
      setKirimRows(updatedKirimRows);
    } else {
      const updatedReturRows = returRows.map(row => row.id === editingRowId ? updatedRow : row)
                                         .map((row, index) => ({ ...row, no: index + 1 }));
      setReturRows(updatedReturRows);
    }

    setFormData({ ...emptyFormData });
    setSelectedOrderNumber('');
    setEditingRowId(null);
  };

  const handleDeleteRow = (rowId: string, rowMode: 'kirim' | 'retur') => {
    if (rowMode === 'kirim') {
      setKirimRows(kirimRows.filter(row => row.id !== rowId).map((row, index) => ({ ...row, no: index + 1 })));
    } else {
      setReturRows(returRows.filter(row => row.id !== rowId).map((row, index) => ({ ...row, no: index + 1 })));
    }
  };

  const calculateTotal = (rows: RowData[]) =>
    rows.reduce((sum, row) => sum + row.kg * row.biayaPerKg, 0);

  const totalAll = calculateTotal(kirimRows) + calculateTotal(returRows);

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice Data');
    
    // --- HEADER INFO ---
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'BILL TO :';
    worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
    
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = namaPT || 'Nama PT Contoh'; // Use namaPT state
    worksheet.getCell('A2').font = { name: 'Calibri', size: 14, bold: true };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'left' };
    
    worksheet.mergeCells('I1:K1');
    worksheet.getCell('I1').value = 'Invoice Number';
    worksheet.getCell('I1').font = { name: 'Calibri', size: 12, bold: true };
    worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'right' };
    worksheet.getCell('L1').value = ':';
    worksheet.getCell('L1').font = { name: 'Calibri', size: 12, bold: true };
    worksheet.getCell('L1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('M1:N1');
    worksheet.getCell('M1').value = invoiceNumber || 'INV-XXXXXX'; // Use invoiceNumber state
    worksheet.getCell('M1').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('M1').font = { name: 'Calibri', size: 12, bold: true };
    
    worksheet.mergeCells('I2:K2');
    worksheet.getCell('I2').value = 'Date';
    worksheet.getCell('I2').font = { name: 'Calibri', size: 12, bold: true };
    worksheet.getCell('I2').alignment = { vertical: 'middle', horizontal: 'right' };
    worksheet.getCell('L2').value = ':';
    worksheet.getCell('L2').font = { name: 'Calibri', size: 12, bold: true };
    worksheet.getCell('L2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('M2:N2');
    worksheet.getCell('M2').value = invoiceDate ? new Date(invoiceDate).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID'); // Use invoiceDate state
    worksheet.getCell('M2').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('M2').font = { name: 'Calibri', size: 12, bold: true };
    
    // --- KOLOM DATA ---
    worksheet.columns = [
      { key: 'no', width: 2 },
      { key: 'date', width: 20 },
      { key: 'pengirim', width: 15 },
      { key: 'kotaOrigin', width: 10 },
      { key: 'penerima', width: 15 },
      { key: 'kotaTujuan', width: 10 },
      { key: 'noTiket', width: 10 },
      { key: 'partDesc', width: 25 },
      { key: 'colly', width: 5 },
      { key: 'kg', width: 5 },
      { key: 'ket', width: 10 },
      { key: 'service', width: 10 },
      { key: 'biayaPerKg', width: 10 },
      { key: 'totalBiaya', width: 20 }
    ];
    
    // Baris 3: Header kolom data
    const headers = [
      'NO', 'DATE', 'PENGIRIM', 'KOTA ORIGIN', 'PENERIMA',
      'KOTA TUJUAN', 'NO TIKET', 'DESCRIPTION PART', 'COLLY',
      'Kg', 'KET', 'SERVICE', 'BIAYA PER Kg', 'TOTAL BIAYA'
    ];
    const headerRow = worksheet.getRow(3);
    headerRow.height = 50;
    headers.forEach((header, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = header;
      cell.font = { name: 'Calibri', size: 11, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BDD7EE' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    // Label "KIRIM" di baris 4
    worksheet.mergeCells('A4:C4');
    const kirimLabelCell = worksheet.getCell('A4');
    kirimLabelCell.value = 'KIRIM';
    kirimLabelCell.font = { name: 'Calibri', size: 10, bold: true };
    kirimLabelCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };
    kirimLabelCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Border seluruh kolom A sampai N di baris 4
    for (let col = 1; col <= 14; col++) {
      const cell = worksheet.getRow(4).getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Data kirim mulai dari baris 5
    kirimRows.forEach((row, index) => {
      const excelRow = worksheet.getRow(5 + index);
      excelRow.values = [
        row.no, row.date, row.pengirim, row.kotaOrigin, row.penerima,
        row.kotaTujuan, row.noTiket, row.partDesc, row.colly, row.kg,
        row.ket, row.service, row.biayaPerKg, row.kg * row.biayaPerKg
      ];
      excelRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 13 || colNumber === 14) {
          cell.numFmt = '"Rp"#,##0';
        }
      });
    });
    
    // Label "RETUR" di bawah data kirim
    const returLabelRowNumber = 5 + kirimRows.length;
    worksheet.mergeCells(`A${returLabelRowNumber}:C${returLabelRowNumber}`);
    const returLabelCell = worksheet.getCell(`A${returLabelRowNumber}`);
    returLabelCell.value = 'RETUR';
    returLabelCell.font = { name: 'Calibri', size: 10, bold: true };
    returLabelCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };
    returLabelCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Border seluruh kolom A sampai N di baris label RETUR
    for (let col = 1; col <= 14; col++) {
      const cell = worksheet.getRow(returLabelRowNumber).getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Data retur mulai baris berikutnya
    returRows.forEach((row, index) => {
      const excelRow = worksheet.getRow(returLabelRowNumber + 1 + index);
      excelRow.values = [
        row.no, row.date, row.pengirim, row.kotaOrigin, row.penerima,
        row.kotaTujuan, row.noTiket, row.partDesc, row.colly, row.kg,
        row.ket, row.service, row.biayaPerKg, row.kg * row.biayaPerKg
      ];
      excelRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 13 || colNumber === 14) {
          cell.numFmt = '"Rp"#,##0';
        }
      });
    });
    
    const totalRowNumber = returLabelRowNumber + 1 + returRows.length;
    // totalAll is already calculated
    const totalRow = worksheet.getRow(totalRowNumber);
    totalRow.height = 50;
    totalRow.values = ['', '', '', '', '', '', '', '', '', '', '', '', 'TOTAL BIAYA', totalAll];
    totalRow.font = { name: 'Calibri', size: 11, bold: true };
    totalRow.getCell(13).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    totalRow.getCell(14).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    totalRow.getCell(14).numFmt = '"Rp"#,##0';

    totalRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BDD7EE' } // latar belakang sama untuk semua cell
      };
    });

    const startInfoRow = totalRowNumber + 2;

    // Row 1: Payment To
    worksheet.getCell(`B${startInfoRow}`).value = 'Payment To :';
    worksheet.getCell(`B${startInfoRow}`).font = { name: 'Tenorite Display', size: 11, bold: true, italic: true };
    worksheet.getCell(`B${startInfoRow}`).alignment = { horizontal: 'left', vertical: 'middle' };

    // Row 2: Bank BCA
    worksheet.getCell(`B${startInfoRow + 1}`).value = 'Bank BCA :';
    worksheet.getCell(`B${startInfoRow + 1}`).font = { name: 'Calibri', size: 11 };
    worksheet.getCell(`B${startInfoRow + 1}`).alignment = { horizontal: 'left', vertical: 'middle' };

    // Row 3: Atas Nama
    worksheet.getCell(`B${startInfoRow + 2}`).value = 'Atas Nama : Sandy Ayudia Putra';
    worksheet.getCell(`B${startInfoRow + 2}`).font = { name: 'Calibri', size: 11 };
    worksheet.getCell(`B${startInfoRow + 2}`).alignment = { horizontal: 'left', vertical: 'middle' };

    // Row 4: No Rek
    worksheet.getCell(`B${startInfoRow + 3}`).value = 'No Rek : 547-103-4178';
    worksheet.getCell(`B${startInfoRow + 3}`).font = { name: 'Calibri', size: 11 };
    worksheet.getCell(`B${startInfoRow + 3}`).alignment = { horizontal: 'left', vertical: 'middle' };

    // Row tanda tangan: "Accounting" di H–L
    worksheet.mergeCells(`H${startInfoRow}:L${startInfoRow}`);
    worksheet.getCell(`H${startInfoRow}`).value = 'Accounting';
    worksheet.getCell(`H${startInfoRow}`).font = { name: 'Calibri', size: 11 };
    worksheet.getCell(`H${startInfoRow}`).alignment = { horizontal: 'center', vertical: 'middle' };

    // Row tanda tangan: "Dennis Deanova Setiawan" di H–L (7 baris di bawah Payment To)
    const signatureNameRow = startInfoRow + 7;
    worksheet.mergeCells(`H${signatureNameRow}:L${signatureNameRow}`);
    worksheet.getCell(`H${signatureNameRow}`).value = 'Dennis Deanova Setiawan';
    worksheet.getCell(`H${signatureNameRow}`).font = { name: 'Calibri', size: 11 };
    worksheet.getCell(`H${signatureNameRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'invoice_data.xlsx');
  };

  const handleSaveInvoice = async () => {
    // Basic client-side validation
    if (!namaPT || !invoiceNumber || !invoiceDate) {
      alert('Nama PT, Invoice Number, dan Date harus diisi sebelum menyimpan!');
      return;
    }

    if (kirimRows.length === 0 && returRows.length === 0) {
      alert('Tidak ada data item invoice untuk disimpan.');
      return;
    }

    // Prepare the data to be sent to the API
    const invoiceData = {
      namaPT,
      invoiceNumber,
      invoiceDate,
      // Combine all rows and add a 'type' property
      items: [
        ...kirimRows.map(row => ({ ...row, type: 'KIRIM', totalBiaya: row.kg * row.biayaPerKg })),
        ...returRows.map(row => ({ ...row, type: 'RETUR', totalBiaya: row.kg * row.biayaPerKg }))
      ]
    };

    try {
      // Make the POST request to your API endpoint
      const response = await fetch('/api/saveInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData), // Send data as JSON string
      });

      // Handle the API response
      if (response.ok) {
        alert('Invoice berhasil disimpan!');
        // Optionally, reset the form after successful save
        setNamaPT('');
        setInvoiceNumber('');
        setInvoiceDate(new Date().toISOString().split('T')[0]);
        setKirimRows([]);
        setReturRows([]);
        setFormData({...emptyFormData});
        setSelectedOrderNumber('');
      } else {
        const errorData = await response.json();
        alert(`Gagal menyimpan invoice: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Terjadi kesalahan saat menyimpan invoice. Cek konsol untuk detail.');
    }
  };
  
  return (
    <div className="p-4 text-sm">
      <div className="mb-4">
        <label htmlFor="namaPT" className="block font-semibold mb-1">
          Nama PT:
        </label>
        <input
          type="text"
          id="namaPT"
          value={namaPT}
          onChange={(e) => setNamaPT(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
          required // HTML5 required attribute for basic validation
        />
      </div>

      <div className="mb-4">
        <label htmlFor="invoiceNumber" className="block font-semibold mb-1">
          Invoice Number:
        </label>
        <input
          type="text"
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
          required // HTML5 required attribute for basic validation
        />
      </div>

      <div className="mb-6">
        <label htmlFor="invoiceDate" className="block font-semibold mb-1">
          Date:
        </label>
        <input
          type="date"
          id="invoiceDate"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
          required // HTML5 required attribute for basic validation
        />
      </div>
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
            <select
              value={formData.ket}
              onChange={(e) => handleChange('ket', e.target.value)}
              className="border p-1"
            >
              <option value="Good Part">Good Part</option>
              <option value="Bad Part">Bad Part</option>
            </select>
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

        {editingRowId ? (
          <button onClick={handleUpdateRow} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Update</button>
        ) : (
          <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Tambah</button>
        )}
      </div>

      <table className="min-w-full border border-gray-400 text-xs">
        <thead className="bg-gray-200 text-center">
          <tr>
            <th className="border px-2 py-1">Aksi</th>
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
            <td colSpan={15} className="border py-1">KIRIM</td>
          </tr>
          {kirimRows.map((row) => (
            <tr key={`kirim-${row.id}`} className="text-center">
              <td className="border px-2 py-1 flex items-center justify-center space-x-1">
                <button
                  onClick={() => handleEditRow(row.id, 'kirim')}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRow(row.id, 'kirim')}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-xs"
                >
                  Hapus
                </button>
              </td>
              {renderRow(row)}
            </tr>
          ))}
          <tr className="bg-red-100 font-bold text-center">
            <td colSpan={15} className="border py-1">RETUR</td>
          </tr>
          {returRows.map((row) => (
            <tr key={`retur-${row.id}`} className="text-center">
              <td className="border px-2 py-1 flex items-center justify-center space-x-1">
                <button
                  onClick={() => handleEditRow(row.id, 'retur')}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRow(row.id, 'retur')}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-xs"
                >
                  Hapus
                </button>
              </td>
              {renderRow(row)}
            </tr>
          ))}
          <tr className="bg-green-200 font-bold text-right">
            <td colSpan={14} className="border px-2 text-right">TOTAL BIAYA</td>
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
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleSaveInvoice}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"
        >
          Save Invoice
        </button>
        <button
          onClick={handleExportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
        >
          Export ke Excel
        </button>
      </div>
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
        <td className="border px-2">
          {(row.biayaPerKg).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          })}</td>
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