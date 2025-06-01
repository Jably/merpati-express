// pages/api/delivery-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Pastikan Anda sudah memiliki file: lib/prisma.ts atau sejenisnya
// Contoh isi file lib/prisma.ts:
/*
  import { PrismaClient }

  let prisma: PrismaClient

  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient()
    }
    prisma = global.prisma
  }

  export default prisma
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Hanya izinkan metode GET untuk API ini
  if (req.method === 'GET') {
    // Ambil 'airwayBill' dari query parameter URL
    const { airwayBill } = req.query;

    // Validasi apakah airwayBill ada dan bertipe string
    if (!airwayBill || typeof airwayBill !== 'string') {
      // Mengirim respons error jika airwayBill tidak valid
      return res.status(400).json({ message: 'Nomor Airway Bill diperlukan sebagai string.' });
    }

    try {
      // Menggunakan Prisma Client untuk mencari order berdasarkan airwayBill
      // Karena 'airwayBill' adalah field @unique di skema Anda, kita gunakan findUnique
      const order = await prisma.order.findUnique({
        where: {
          airwayBill: airwayBill,
        },
        // Anda bisa memilih kolom-kolom spesifik yang ingin dikembalikan
        // Ini akan membatasi data yang dikirim ke frontend, baik untuk performa maupun keamanan
        select: {
          senderName: true,
          consigneeName: true,
          origin: true,
          destination: true,
          airwayBill: true,
          status: true,
          updatedAt: true,
        },
      });

      if (order) {
        // Jika order ditemukan, kirimkan sebagai array tunggal
        // Ini karena komponen frontend Anda mengharapkan `deliveryStatus` sebagai array
        return res.status(200).json([order]);
      } else {
        // Jika tidak ada order yang ditemukan, kirimkan array kosong
        return res.status(200).json([]);
      }
    } catch (error) {
      // Menangani error database atau error lainnya
      console.error('Kesalahan database saat mencari order:', error);
      // Mengirim respons error server internal
      return res.status(500).json({ message: 'Terjadi kesalahan server internal saat mengambil status pengiriman.' });
    }
  } else {
    // Jika metode HTTP selain GET, kirimkan status 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Metode ${req.method} Tidak Diizinkan`);
  }
}