// pages/api/user.ts (atau lokasi API Anda)
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUserId = req.cookies.userId;

  // Untuk semua operasi yang memerlukan otentikasi
  if (!currentUserId) {
    // Namun, jika kita hanya akan menampilkan komponen manajemen pengguna bagi admin
    // dan halaman ini sudah diamankan di level Next.js (misalnya pakai middleware)
    // maka error ini mungkin tidak akan terlalu sering muncul.
    // Tapi tetap penting untuk API ini tidak bisa diakses tanpa login.
    return res.status(401).json({ message: "Not authenticated." });
  }

  let currentUser;
  try {
    currentUser = await prisma.user.findUnique({
      where: { id: Number(currentUserId) },
      select: { id: true, role: true }, // Hanya ambil ID dan role
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Authenticated user not found. Please log in again." });
    }
  } catch (error) {
    console.error("Error fetching current user for role check:", error);
    return res.status(500).json({ message: "Failed to verify user identity." });
  }

  // --- GET Request ---
  if (req.method === "GET") {
    // Mengambil semua pengguna (khusus ADMIN)
    if (req.query.allUsers === 'true') {
      if (currentUser.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Forbidden: Only ADMIN can view all users." });
      }
      try {
        const allUsers = await prisma.user.findMany({
          select: { id: true, name: true, email: true, role: true },
        });
        return res.status(200).json(allUsers);
      } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json([]); // Selalu kembalikan array kosong pada error
      }
    } else {
      // Mengambil data pengguna yang sedang login
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(currentUserId) },
          select: { id: true, name: true, email: true, role: true },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Failed to fetch user." });
      }
    }
  }

  // --- POST Request (Create New User or Update Existing User) ---
  if (req.method === "POST") {
    // Hanya admin yang bisa membuat atau mengupdate pengguna lain
    if (currentUser.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Forbidden: Only ADMIN can create/update users." });
    }

    const { name, email, password, role } = req.body;
    const targetUserId = req.query.id ? Number(req.query.id) : null;

    if (targetUserId) { // Ini adalah permintaan untuk MENGUPDATE pengguna lain
      try {
        const updatedUser = await prisma.user.update({
          where: { id: targetUserId },
          data: {
            ...(name && { name }),
            ...(email && { email }),
            ...(password && { password: await bcrypt.hash(password, 10) }),
            ...(role && Object.values(UserRole).includes(role) && { role: role as UserRole }),
          },
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        return res.status(200).json(userWithoutPassword);
      } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          return res.status(400).json({ message: "Email already taken." });
        }
        if (error.code === 'P2025') { // record not found
          return res.status(404).json({ message: "User to update not found." });
        }
        console.error("Update other user error:", error);
        return res.status(500).json({ message: "Failed to update user." });
      }
    } else { // Ini adalah permintaan untuk MEMBUAT pengguna baru
      if (!password) {
          return res.status(400).json({ message: "Password is required for new user creation." });
      }
      if (!email || !name) { // Email dan nama wajib untuk pengguna baru
          return res.status(400).json({ message: "Name and Email are required for new user creation." });
      }
      try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
              data: {
                  name,
                  email,
                  password: hashedPassword,
                  role: role ? (role as UserRole) : UserRole.USER, // Default ke USER jika role tidak diberikan
              },
          });
          const { password: _, ...newUserWithoutPassword } = newUser;
          return res.status(201).json(newUserWithoutPassword);
      } catch (error: any) {
          if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
              return res.status(400).json({ message: "Email already exists." });
          }
          console.error("Create user error:", error);
          return res.status(500).json({ message: "Failed to create user." });
      }
    }
  }

  // --- DELETE Request ---
  if (req.method === "DELETE") {
    if (currentUser.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Forbidden: Only ADMIN can delete users." });
    }

    const targetUserId = req.query.id;
    if (!targetUserId) {
      return res.status(400).json({ message: "User ID is required for deletion." });
    }

    if (Number(targetUserId) === currentUser.id) {
        return res.status(400).json({ message: "Cannot delete your own account via this endpoint. Please use a proper account deletion flow." });
    }

    try {
      await prisma.user.delete({
        where: { id: Number(targetUserId) },
      });
      return res.status(204).end(); // No Content
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User to delete not found." });
      }
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Failed to delete user." });
    }
  }

  return res.status(405).json({ message: "Method not allowed." });
}