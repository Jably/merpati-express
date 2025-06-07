// pages/api/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma"; // Pastikan path ke prisma Anda benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ambil user ID dari cookie
  const userId = req.cookies.userId; // Sesuaikan dengan nama cookie sesi Anda

  if (!userId) {
    // Jika tidak ada user ID di cookie, berarti tidak ada sesi aktif
    return res.status(401).json({ message: "No active session. Please log in." });
  }

  try {
    // Cari pengguna di database
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, name: true, email: true, role: true }, // Ambil data yang relevan
    });

    if (!user) {
      // Jika user ID ada tapi user tidak ditemukan di DB (mungkin sudah dihapus)
      // Hapus cookie sesi agar tidak ada invalid session
      res.setHeader('Set-Cookie', `userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax;`);
      return res.status(404).json({ message: "User not found or session invalid. Please log in again." });
    }

    // Jika pengguna ditemukan, kembalikan data pengguna
    return res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching session user:", error);
    // Hapus cookie sesi jika terjadi error saat fetch (sesi mungkin korup)
    res.setHeader('Set-Cookie', `userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax;`);
    return res.status(500).json({ message: "Internal server error fetching session." });
  }
}