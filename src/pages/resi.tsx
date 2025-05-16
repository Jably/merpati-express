"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import BWIPJS from "bwip-js";
import "../app/globals.css";

const ResiPage = () => {
  const [resiData, setResiData] = useState<any>(null);
  const resiRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Mengambil data dari localStorage
    const savedData = localStorage.getItem("registrationStep4Data");
    if (savedData) {
      setResiData(JSON.parse(savedData));
    } else {
      alert("Data resi tidak ditemukan!");
    }

    // Menghapus data saat halaman ditutup
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Membersihkan event listener saat komponen dibersihkan
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const generateBarcode = (text: string) => {
    const canvas = document.createElement("canvas");
    BWIPJS.toCanvas(canvas, {
      bcid: "code128",
      text: text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
    return canvas.toDataURL("image/png");
  };

  const downloadPDF = async () => {
    if (resiRef.current) {
      const canvas = await html2canvas(resiRef.current, {
        scale: 2,  
        useCORS: true,
        x: 0, // Optional: Set offset to ensure content is captured properly
        y: 0, // Optional: Set offset to ensure content is captured properly
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width * 0.264583; // px to mm
      const imgHeight = canvas.height * 0.264583;

      const padding = 15; // Increased padding for better spacing
      const pdfWidth = imgWidth + padding * 2;
      const pdfHeight = imgHeight + padding * 2;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "l" : "p",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      // Add padding to image inside the PDF
      pdf.addImage(imgData, "PNG", padding, padding, imgWidth, imgHeight);

      pdf.save("resi.pdf");
    }
  };

  const goBack = () => {
    // Hapus semua item di localStorage saat tombol kembali ditekan
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Resi Pengiriman</h2>

      <div
        ref={resiRef}
        className="border p-8 rounded-lg shadow-lg bg-white w-full max-w-3xl mx-auto"
        style={{ padding: "20px" }} // Added padding here to ensure content is not tight
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
          <div>
            <h3 className="font-semibold text-xl text-gray-800">Merpati Express</h3>
            <p className="text-sm text-gray-500"></p>
          </div>
          {resiData?.airwayBill && (
            <img
              src={generateBarcode(resiData.airwayBill)} // Barcode image
              alt="Barcode"
              className="w-48 h-auto"
            />
          )}
        </div>

        {/* AWB */}
        <div className="mb-4 border-b-2 pb-4">
          <p className="text-sm font-semibold">Airway Bill (AWB): {resiData?.airwayBill}</p>
          <p className="text-sm">Order Number: {resiData?.orderNumber}</p>
        </div>

        {/* Pengirim dan Penerima */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold">Pengirim</h4>
            <p>{resiData?.sender}</p>
            <p>{resiData?.senderAddress}</p>
          </div>
          <div>
            <h4 className="font-semibold">Penerima</h4>
            <p>{resiData?.consignee}</p>
            <p>{resiData?.consigneeAddress}</p>
          </div>
        </div>

        {/* Detail Barang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><b>Deskripsi:</b> {resiData?.description}</p>
            <p><b>Jumlah (Colly):</b> {resiData?.colly}</p>
            <p><b>Berat (kg):</b> {resiData?.weight}</p>
          </div>
          <div>
            <p><b>Origin:</b> {resiData?.origin}</p>
            <p><b>Destination:</b> {resiData?.destination}</p>
          </div>
        </div>

        {/* Transportasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><b>Moda Transportasi:</b> {resiData?.transport}</p>
          </div>
          <div>
            <p><b>Service:</b> {resiData?.service}</p>
          </div>
        </div>

        {/* TTD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="font-semibold text-center">Tanda Tangan Pengirim</p>
            <div className="border h-16 my-2"></div>
          </div>
          <div>
            <p className="font-semibold text-center">Tanda Tangan Penerima</p>
            <div className="border h-16 my-2"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Terima kasih telah menggunakan layanan kami.</p>
          <p className="text-sm text-gray-600">Resi ini sebagai bukti pengiriman yang sah.</p>
        </div>
      </div>

      {/* Tombol Download */}
      <div className="flex justify-center mt-8">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Download Resi (PDF)
        </button>
      </div>

      {/* Tombol Kembali */}
      <div className="flex justify-center mt-4">
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default ResiPage;
