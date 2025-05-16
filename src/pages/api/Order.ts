import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma"; // pastikan kamu sudah ada prisma.ts di /lib

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      // 🔎 Ambil semua order
      case 'GET':
        const orders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(orders);
        break;

      // ➕ Tambah order baru
      case 'POST':
        const newOrder = await prisma.order.create({
          data: req.body,
        });
        res.status(201).json(newOrder);
        break;

      // ✏️ Update order by ID
      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ message: 'ID is required' });

        const updatedOrder = await prisma.order.update({
          where: { id: Number(id) },
          data: updateData,
        });
        res.status(200).json(updatedOrder);
        break;

      // ❌ Hapus order by ID (via query: /api/Order?id=123)
      case 'DELETE':
        const orderId = req.query.id;
        if (!orderId) return res.status(400).json({ message: 'ID is required' });

        await prisma.order.delete({
          where: { id: Number(orderId) },
        });
        res.status(200).json({ message: 'Order deleted' });
        break;

      // ❓ Method tidak diizinkan
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
