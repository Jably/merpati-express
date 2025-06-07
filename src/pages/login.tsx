"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Cek session saat halaman login dibuka
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.status === 200) {
          // ✅ Kalau sudah login, langsung redirect ke admin
          router.push("/admin");
        }
      } catch (error) {
        // Ignore, biar form login tetap tampil
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // ✅ Redirect berdasarkan role
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (data.user.role === "USER") {
          router.push("/registrationform");
        }
      } else {
        const res = await response.json();
        setError(res.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    router.push("/");
  };
  

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <div className="flex flex-col items-center mb-6">
          <img className="w-12 h-12" src="/logo.svg" alt="logo" />
          <h1 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">Login</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full p-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full p-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={goHome}
            className={`w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Home" : "Home"}
          </button>
        </form>
      </div>
    </section>
  );
}
