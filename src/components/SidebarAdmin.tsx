'use client';

import { UserCircleIcon, ClipboardDocumentListIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function SidebarAdmin() {
  return (
    <div className="h-screen bg-white shadow-md w-[450px] fixed left-0 top-0">

      {/* Menu Item 1: Data Akun */}
      <div className="w-full h-[83px] flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
        <UserCircleIcon className="w-8 h-8 text-gray-700" />
        <span className="ml-6 text-[18px] font-normal text-black">Data Akun</span>
      </div>

      {/* Menu Item 2: Data Order */}
      <div className="w-full h-[83px] flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
        <ClipboardDocumentListIcon className="w-8 h-8 text-gray-700" />
        <span className="ml-6 text-[18px] font-normal text-black">Data Order</span>
      </div>

      {/* Menu Item 3: Invoice */}
      <div className="w-full h-[83px] flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
        <DocumentTextIcon className="w-8 h-8 text-gray-700" />
        <span className="ml-6 text-[18px] font-normal text-black">Invoice</span>
      </div>
    </div>
  );
}
