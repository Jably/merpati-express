// components/RegistrationForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationStep1 } from "./RegistrationStep1";
import { RegistrationStep2 } from "./RegistrationStep2";
import { RegistrationStep3 } from "./RegistrationStep3";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { Card } from "antd"; // Pastikan antd terinstal dan diimpor dengan benar
import Navbar from "./Navbar";
import withAuth from "@/withAuth"; // Pastikan path ini benar

export const RegistrationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // --- STATE UNTUK AUTENTIKASI ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // State baru untuk loading autentikasi
  // ---------------------------------------------

  useEffect(() => {
    // Simulasi loading data utama (ini terpisah dari loading autentikasi)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedStep = localStorage.getItem("currentStep");
      if (savedStep && !isNaN(Number(savedStep))) {
        setCurrentStep(Number(savedStep));
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && currentStep >= 1 && currentStep <= 4) {
      localStorage.setItem("currentStep", currentStep.toString());
    }
  }, [currentStep, isClient]);

  // --- KODE FETCH("/API/SESSION") UNTUK CEK STATUS LOGIN DI KOMPONEN INI ---
  useEffect(() => {
    setLoadingAuth(true); // Mulai loading autentikasi

    fetch("/api/session")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data?.name) {
          setIsLoggedIn(true);
          setUserRole(data.role || null);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching session in RegistrationForm:", error);
        setIsLoggedIn(false);
        setUserRole(null);
      })
      .finally(() => {
        setLoadingAuth(false); // Selesai loading autentikasi
      });
  }, []);
  // ---------------------------------------------------------------------

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (currentStep === 4) {
      router.push("/");
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  // --- KONDISI RENDER BARU UNTUK MENCEGAH RENDERING JIKA BELUM LOGIN ---
  // Jika masih memuat status autentikasi, tampilkan loading spinner
  if (loadingAuth) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
      </div>
    );
  }

  // Jika loading autentikasi sudah selesai DAN pengguna TIDAK login
  // kita bisa langsung mengalihkan atau mengembalikan null.
  // PENTING: `withAuth` seharusnya sudah menangani pengalihan ini,
  // tapi ini adalah lapisan keamanan tambahan di level komponen.
  if (!isLoggedIn) {
    // Opsional: Anda bisa menambahkan router.replace('/login') di sini
    // untuk memastikan redirect, meskipun withAuth seharusnya sudah melakukannya.
    router.replace('/login');
    return (
      <div className="p-4 text-center text-xl text-red-500">
        Anda harus login untuk mengakses halaman ini.
      </div>
    );
  }
  // ---------------------------------------------------------------------

  return (
    <>
      <Navbar />
      <div className="registration-container overflow-x-hidden">
        <div className="title">
          <p>Pengisian Data Pengiriman Barang Merpati Express</p>
        </div>
        <div className="steps-container">
          <div className="steps-wrapper">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`step ${currentStep === step ? "active" : ""}`}
              >
                <div className="step-title">{`Step ${step}: ${
                  step === 1
                    ? "Informasi Pengirim dan Penerima"
                    : step === 2
                    ? "Isi Detail Barang"
                    : step === 3
                    ? "Pilih Layanan Pengiriman"
                    : "Konfirmasi Semua Data"
                }`}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: currentStep >= step ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {isLoggedIn ? (
              <p>Selamat datang, {userRole}!</p>
            ) : (
              <p>Anda belum login.</p> // Seharusnya tidak terlihat karena di-redirect
            )}
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>

        <Card loading={loading}>
          {currentStep === 1 && <RegistrationStep1 onNext={nextStep} />}
          {currentStep === 2 && (
            <RegistrationStep2 onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 3 && (
            <RegistrationStep3 onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 4 && (
            <RegistrationConfirmation onNext={nextStep} onBack={prevStep} />
          )}
        </Card>
      </div>
    </>
  );
};

export default withAuth(RegistrationForm, ["USER", "ADMIN"]);