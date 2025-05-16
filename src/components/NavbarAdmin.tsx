'use client';

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import DataAkun from "./DataAkun";
import DataOrder from "./DataOrder";
import Invoice from "./Invoice";

export default function NavbarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [currentPage, setCurrentPage] = useState("order");
  const router = useRouter();

  const toggleMenu = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setAdminName(data.name);
        }
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "akun":
        return <DataAkun />;
      case "order":
        return <DataOrder />;
      case "invoice":
        return <Invoice />;
      default:
        return <DataOrder />;
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">

      {/* Sidebar */}
      <div className={`
        bg-white shadow-md z-40
        transition-all duration-300
        ${isMobileOpen ? 'translate-x-0 fixed top-0 left-0 h-full' : '-translate-x-full'} 
        md:translate-x-0 md:static
        ${isCollapsed ? 'w-10' : 'w-60'}
        flex flex-col
      `}>

        {/* Logo */}
        <div className="flex items-center justify-center px-4 py-4">
          <img className="w-10 h-10 transition-all" src="/logo.svg" alt="logo" />
        </div>

        {/* Menu Items */}
        <div className="mt-4 space-y-2 flex-1">
          <div
            onClick={() => { setCurrentPage('order'); setIsMobileOpen(false); }}
            className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer 
            ${currentPage === 'order' ? 'bg-gray-200 font-semibold' : ''}`}
          >
            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-700" />
            {!isCollapsed && <span className="ml-6 text-[18px] text-black">Data Order</span>}
          </div>

          <div
            onClick={() => { setCurrentPage('invoice'); setIsMobileOpen(false); }}
            className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer 
            ${currentPage === 'invoice' ? 'bg-gray-200 font-semibold' : ''}`}
          >
            <DocumentTextIcon className="w-8 h-8 text-gray-700" />
            {!isCollapsed && <span className="ml-6 text-[18px] text-black">Invoice</span>}
          </div>
          <div
            onClick={() => { setCurrentPage('akun'); setIsMobileOpen(false); }}
            className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer 
            ${currentPage === 'akun' ? 'bg-gray-200 font-semibold' : ''}`}
          >
            <UserCircleIcon className="w-8 h-8 text-gray-700" />
            {!isCollapsed && <span className="ml-6 text-[18px] text-black">Data Akun</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Navbar */}
        <nav className="bg-[#d8d8d8] shadow-md w-full fixed top-0 left-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">

              {/* Left Side */}
              <div className="flex items-center space-x-4">

                {/* Hamburger (Mobile) */}
                <div className="md:hidden">
                  <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={isMobileOpen ? faTimes : faBars} size="lg" />
                  </button>
                </div>

                {/* Hamburger (Desktop) */}
                <button onClick={toggleCollapse} className="hidden md:block text-gray-700">
                  <FontAwesomeIcon icon={faBars} />
                </button>

                {/* Logo */}
                <img className="w-12 h-12" src="/logo.svg" alt="logo" />
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <UserCircleIcon className="w-8 h-8 text-gray-700" />
                <div className="text-lg text-gray-700 text-center font-semibold">{adminName || "Loading..."}</div>
                <ArrowRightOnRectangleIcon onClick={handleLogout} className="w-8 h-8 text-gray-700 cursor-pointer" />
              </div>

            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="mt-16 p-4 flex-1">
          {renderPage()}
        </div>

      </div>

    </div>
  );
}
