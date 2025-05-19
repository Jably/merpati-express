"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSession = async () => {
        try {
          const res = await fetch("/api/session");
          if (res.status === 200) {
            setLoading(false);
          } else {
            router.push("/login");
          }
        } catch (error) {
          router.push("/login");
        }
      };

      checkSession();
    }, [router]);

    if (loading) {
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
        </div>
      )}
    }

    return <Component {...props} />;
  };
}
