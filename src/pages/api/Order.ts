import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = req.cookies.userId;

    // ❗️Cek session dulu
    if (!session) {
      return res.status(401).json({ message: "Unauthorized: No session found" });
    }

    // 🔒 Ambil user dan cek role-nya
    const user = await prisma.user.findUnique({
      where: { id: Number(session) },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    switch (req.method) {
      case 'GET':
        if (req.query.orderNumber) {
          const order = await prisma.order.findFirst({
            where: { orderNumber: String(req.query.orderNumber) },
          });

          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }

          return res.status(200).json(order);
        }

        const orders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(orders);

      case 'POST':
        const newOrder = await prisma.order.create({
          data: req.body,
        });
        return res.status(201).json(newOrder);

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ message: 'ID is required' });
        }

        const updatedOrder = await prisma.order.update({
          where: { id: Number(id) },
          data: updateData,
        });
        return res.status(200).json(updatedOrder);

      case 'DELETE':
        const orderId = req.body.id;
        if (!orderId) {
          return res.status(400).json({ message: 'ID is required' });
        }

        await prisma.order.delete({
          where: { id: Number(orderId) },
        });
        return res.status(200).json({ message: 'Order deleted' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

export default handler;
