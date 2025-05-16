import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";

export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.cookies.userId;

  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }

  return user;
}
