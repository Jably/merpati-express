import React from "react";
import NavbarAdmin from "@/components/NavbarAdmin";
import SidebarAdmin from "@/components/SidebarAdmin";
import withAuth from "../../lib/withAuth";
import "@/app/globals.css";

const AdminLayout = () => {
  return (
    <>
      <NavbarAdmin />
      {/* Tambahkan konten lainnya di sini */}
    </>
  );
};

// ⛔ Hanya user dengan role 'admin' yang bisa mengakses halaman ini
export default withAuth(AdminLayout, ["ADMIN"]);
