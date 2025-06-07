"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // <- Role disimpan di sini

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data?.name) {
          setIsLoggedIn(true);
          setUserRole(data.role || "");
        } else {
          setIsLoggedIn(false);
          setUserRole("");
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserRole("");
      });
  }, []);

  const login = () => {
    router.push("/login");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const tracking = () => {
    router.push("/track-delivery");
    setIsOpen(false);
  };

  const goHome = () => {
    router.push("/");
    setIsOpen(false);
  };

  const goToAdmin = () => {
    router.push("/admin");
    setIsOpen(false);
  };

  const goToUser = () => {
    router.push("/registrationform");
    setIsOpen(false);
  };

  const scrollToElement = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="bg-[#d8d8d8] shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <img className="logo cursor-pointer" src="logo.svg" alt="logo" onClick={goHome} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <button onClick={goHome} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToElement("about")} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => scrollToElement("footer")} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium">Logout</button>
            ) : (
              <button onClick={login} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
            )}
            <button onClick={tracking} className="text-gray-700 hover:text-blue-600 font-medium">Track Status</button>
            {userRole === "ADMIN" && (
               <><button onClick={goToAdmin} className="text-gray-700 hover:text-blue-600 font-medium">Admin</button><button onClick={goToUser} className="text-gray-700 hover:text-blue-600 font-medium">Buat Order</button></>
            )}
            {userRole === "USER" && (
              <button onClick={goToUser} className="text-gray-700 hover:text-blue-600 font-medium">Buat Order</button>
            )}
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
            <button onClick={goHome} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToElement("about")} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => scrollToElement("footer")} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium">Logout</button>
            ) : (
              <button onClick={login} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
            )}
            <button onClick={tracking} className="text-gray-700 hover:text-blue-600 font-medium">Track Status</button>
            {userRole === "ADMIN" && (
              <><button onClick={goToAdmin} className="text-gray-700 hover:text-blue-600 font-medium">Admin</button><button onClick={goToUser} className="text-gray-700 hover:text-blue-600 font-medium">Buat Order</button></>
            )}
            {userRole === "USER" && (
              <button onClick={goToUser} className="text-gray-700 hover:text-blue-600 font-medium">Buat Order</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
