'use client';

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"; // Pastikan ini diimpor untuk Next.js App Router

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const login = () => {
    router.push("/login");
    setIsOpen(false); // Tutup menu mobile setelah navigasi
  }

  const tracking = () => {
    router.push("/track-delivery"); // Pastikan ini sesuai dengan rute halaman tracking Anda
    setIsOpen(false); // Tutup menu mobile setelah navigasi
  }

  // Fungsi baru untuk mengarahkan ke halaman Home (root path '/')
  const goHome = () => {
    router.push("/");
    setIsOpen(false); // Tutup menu mobile setelah navigasi
  }

  // Perhatikan: Jika 'About' dan 'Contact' masih berada di halaman utama dan Anda ingin tetap
  // menggunakan scroll ke elemen, Anda bisa mempertahankan fungsi ini atau menjadikannya rute terpisah.
  // Untuk contoh ini, saya mempertahankan fungsi scroll untuk 'About' dan 'Contact'
  // jika Anda menggunakannya di satu halaman Landing Page dengan bagian-bagian yang di-scroll.
  const scrollToElement = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false); // Tutup menu mobile setelah scroll
  }

  return (
    <nav className="bg-[#d8d8d8] shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <img
              className="logo"
              src="logo.svg"
              alt="logo"
              onClick={goHome}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {/* Tombol Home sekarang mengarah ke rute '/' */}
            <button onClick={goHome} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            {/* Tombol About dan Contact masih menggunakan scrollIntoView() jika masih ada di halaman yang sama */}
            <button onClick={() => scrollToElement('about')} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => scrollToElement('footer')} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
            <button onClick={login} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
            <button onClick={tracking} className="text-gray-700 hover:text-blue-600 font-medium">Track Status</button>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col justify-center items-center">
            {/* Tombol Home untuk mobile juga mengarah ke rute '/' */}
            <button onClick={goHome} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToElement('about')} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => scrollToElement('footer')} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
            <button onClick={login} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
            {/* Tambahkan tombol Track Status untuk mobile menu */}
            <button onClick={tracking} className="text-gray-700 hover:text-blue-600 font-medium">Track Status</button>
          </div>
        </div>
      )}
    </nav>
  );
}