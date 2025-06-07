// withAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Pastikan ini dari next/navigation

export default function withAuth(
  Component: any,
  allowedRoles: string[] = [],
  redirectIfUnauthorized: Record<string, string> = {
    USER: "/",
    ADMIN: "/admin",
    DEFAULT: "/unauthorized", // Fallback default
  }
) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [redirecting, setRedirecting] = useState(false); // State baru untuk menandai proses redirect

    useEffect(() => {
      const checkSession = async () => {
        setLoading(true); // Pastikan loading diatur true di awal efek

        try {
          const res = await fetch("/api/session");

          if (res.status === 200) {
            const user = await res.json();
            const userRole = user.role?.toUpperCase() ?? "";

            if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
              setAuthorized(true);
              setLoading(false); // Hentikan loading setelah otorisasi berhasil
            } else {
              // Pengguna terautentikasi, tetapi perannya tidak diizinkan
              setRedirecting(true); // Mulai proses redirect
              const redirectPath = redirectIfUnauthorized[userRole] || redirectIfUnauthorized.DEFAULT || "/unauthorized";
              router.replace(redirectPath);
            }
          } else {
            // Sesi tidak valid (401, 404, 500)
            setRedirecting(true); // Mulai proses redirect
            router.replace("/login");
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
          setRedirecting(true); // Mulai proses redirect karena error
          router.replace("/login");
        }
        // Pastikan setLoading(false) hanya dipanggil jika tidak ada redirect yang terjadi di sini
        // atau jika otorisasi berhasil. Jika ada redirect, loading bisa tetap true
        // sampai navigasi selesai, atau langsung return null.
      };

      checkSession();
    }, [router, allowedRoles, redirectIfUnauthorized]); // Tambahkan dependensi lengkap

    // Selama loading atau sedang dalam proses redirect, tampilkan spinner atau null
    // Jangan pernah merender komponen anak jika belum authorized atau sedang redirect.
    if (loading || redirecting) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
            </div>
        );
    }

    // Jika authorized adalah false (setelah loading selesai dan tidak ada redirect),
    // ini adalah fallback, meskipun seharusnya tidak tercapai jika redirecting bekerja.
    if (!authorized) {
      return null;
    }

    // Jika sudah authorized, render komponen anak
    return <Component {...props} />;
  };
}