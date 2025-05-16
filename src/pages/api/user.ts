import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  }

  if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(password && { password: await bcrypt.hash(password, 10) }),
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ message: "Failed to update user" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
