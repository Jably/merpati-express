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
      
    }

    return <Component {...props} />;
  };
}
