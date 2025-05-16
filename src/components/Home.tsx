'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import Carousel from "./Carousell";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      // setLoading(false);
      router.push("/registrationform");
    }, 900);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Background full screen */}
      <div className="relative w-full h-screen">
        <img
          src="background.svg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gambar miring responsive */}
        <img
          src="miring.png"
          alt="miring"
          className="
            absolute
            top-[50%]
            left-1/2
            transform -translate-x-1/2
            w-8/12
            max-w-[400px]
            sm:w-6/12
            md:w-5/12
            lg:w-4/12
            h-auto
            md:left-[260px] md:transform-none
          "
        />
      </div>

      {/* About Section + Carousel */}
      <div id="about" className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* About Text */}
          <p className="text-sm text-justify sm:text-base md:text-lg lg:text-xl font-montserrat font-normal text-[#1d4ebc]">
            Merpati Express adalah perusahaan jasa pengiriman barang logistik yang
            berdiri pada 23 Juli 2023 dengan komitmen utama untuk memberikan
            layanan pengiriman yang amanah, cepat, aman, dan sesuai dengan kebutuhan
            pelanggan. Terinspirasi dari filosofi burung merpati yang dikenal sebagai
            pengantar pesan yang andal, Merpati Express hadir untuk menjadi mitra
            terpercaya dalam mendistribusikan berbagai jenis barang ke seluruh
            penjuru Indonesia.
            <br />
            <br />
            Dengan sistem operasional yang modern, didukung oleh armada pengangkutan
            yang handal dan tim profesional yang berpengalaman, Merpati Express siap
            memberikan solusi pengiriman yang efisien bagi perorangan, UKM, hingga
            perusahaan besar.
          </p>

          {/* Carousel */}
          <Carousel />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center p-5">
        <button
          onClick={handleClick}
          className="bg-black text-white text-base sm:text-lg md:text-xl font-bold px-6 sm:px-8 py-3 rounded hover:bg-gray-300 hover:text-black transition duration-300"
        >
          Buat Order
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}
