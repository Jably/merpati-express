'use client';

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const login = () => {
    router.push("/login");
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
        />
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <button onClick={() => document.getElementById('about')?.scrollIntoView()} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => document.getElementById('footer')?.scrollIntoView()} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
            <button onClick={login} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
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
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Order</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}
