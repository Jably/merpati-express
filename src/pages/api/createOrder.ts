// pages/api/createOrder.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // pastikan prisma terkonfigurasi dengan benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      // Simpan data order ke dalam database dengan status pending
      const order = await prisma.order.create({
        data: {
          orderNumber: data.orderNumber,
          senderName: data.sender,
          senderAddress: data.senderAddress,
          consigneeName: data.consignee,
          consigneeAddress: data.consigneeAddress,
          transport: data.transport,
          service: data.service,
          colly: data.colly,
          weight: data.weight,
          description: data.description,
          origin: data.origin,
          destination: data.destination,
          airwayBill: data.airwayBill,
          status: "pending", // Menetapkan status sebagai "pending"
        },
      });

      res.status(200).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to save order" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
