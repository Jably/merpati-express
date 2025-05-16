import React, { useState } from 'react';
import {
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  UserIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import '../app/globals.css';
import NavbarAdmin from '@/components/NavbarAdmin';
import SidebarAdmin from '@/components/SidebarAdmin';
import withAuth from "../../lib/withAuth";
import "@/app/globals.css";


const AdminLayout = () => {
  return (
    <>
    <NavbarAdmin />
    </>
  );
};

export default withAuth(AdminLayout);
