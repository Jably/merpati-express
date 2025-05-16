import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ✅ Clear cookie
  res.setHeader(
    "Set-Cookie",
    serialize("userId", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
  );

  return res.status(200).json({ message: "Logout successful" });
}
