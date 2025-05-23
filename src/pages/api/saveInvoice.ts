// pages/api/saveInvoice.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Destructure data from the request body
  const { namaPT, invoiceNumber, invoiceDate, items } = req.body;

  // Basic validation to ensure required data is present
  if (!namaPT || !invoiceNumber || !invoiceDate || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Data invoice tidak lengkap. Pastikan Nama PT, Invoice Number, Date, dan items terisi.' });
  }

  try {
    // Convert invoiceDate string to a proper Date object
    const parsedInvoiceDate = new Date(invoiceDate);
    if (isNaN(parsedInvoiceDate.getTime())) {
      return res.status(400).json({ error: 'Format tanggal invoice tidak valid.' });
    }

    // Calculate the total amount from all items
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.kg * item.biayaPerKg), 0);

    // Create the invoice and its items in a single Prisma transaction
    const newInvoice = await prisma.invoice.create({
      data: {
        namaPT,
        invoiceNumber,
        invoiceDate: parsedInvoiceDate,
        totalAmount: totalAmount,
        items: {
          create: items.map((item: any) => ({
            type: item.type,
            no: item.no,
            date: new Date(item.date), // Convert item date string to Date object
            pengirim: item.pengirim,
            kotaOrigin: item.kotaOrigin,
            penerima: item.penerima,
            kotaTujuan: item.kotaTujuan,
            noTiket: item.noTiket,
            partDesc: item.partDesc,
            colly: item.colly,
            kg: parseFloat(item.kg),         // Ensure numbers are parsed correctly
            ket: item.ket,
            service: item.service,
            biayaPerKg: parseFloat(item.biayaPerKg), // Ensure numbers are parsed correctly
            totalBiayaItem: parseFloat(item.kg) * parseFloat(item.biayaPerKg), // Calculate item total
          })),
        },
      },
      include: {
        items: true, // Include the created items in the response if needed
      },
    });

    // Send a success response
    res.status(201).json({ message: 'Invoice berhasil disimpan!', invoice: newInvoice });
  } catch (error: any) {
    // Handle unique constraint error for invoiceNumber
    if (error.code === 'P2002' && error.meta?.target?.includes('invoiceNumber')) {
      return res.status(409).json({ error: 'Invoice Number ini sudah ada. Mohon gunakan nomor invoice lain.' });
    }
    // Log the error for debugging purposes
    console.error('Error saving invoice:', error);
    // Send a generic error response
    res.status(500).json({ error: 'Gagal menyimpan invoice.', details: error.message });
  } finally {
    // Disconnect Prisma client to prevent connection leaks
    await prisma.$disconnect();
  }
}