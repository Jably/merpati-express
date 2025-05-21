"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import BWIPJS from "bwip-js";
import ResiTemplateForPDF from "@/components/ResiTemplateForPDF"; // Import the non-responsive template
import "@/app/globals.css";
import TripleResi from "@/components/TripleResi";


const ResiPage = () => {
  const [resiData, setResiData] = useState<any>(null);
  const router = useRouter();
  const pdfContentRef = useRef<HTMLDivElement>(null); // Ref for the hidden PDF content

  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep4Data");
    if (savedData) {
      setResiData(JSON.parse(savedData));
    } else {
      alert("Data resi tidak ditemukan!");
      router.push("/");
    }

    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const generateBarcode = (text: string) => {
    const canvas = document.createElement("canvas");
    try {
      BWIPJS.toCanvas(canvas, {
        bcid: "code128",
        text: text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
      return canvas.toDataURL("image/png");
    } catch (e) {
      console.error("Error generating barcode:", e);
      return "";
    }
  };

  

  const downloadPDF = async () => {
    const original = pdfContentRef.current;
    if (!original) return;
  
    const canvas = await html2canvas(original, {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: original.scrollWidth,
      windowHeight: original.scrollHeight,
    });
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      compress: true,
    });
  
    // Mendapatkan ukuran gambar dalam mm (konversi dari px)
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    // Set scale factor untuk menjaga kualitas
    pdf.internal.scaleFactor = 2;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resi.pdf");
  };
  
  

  const goBack = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!resiData) {
    return <div className="text-center p-8">Memuat data resi...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Resi Pengiriman</h2>

      {/* Konten resi yang responsif untuk tampilan user */}
      <div className="border p-8 rounded-lg shadow-lg bg-white w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b-2 pb-4">
          <img
            src="miring.png"
            alt="miring"
            className="w-24 sm:w-32 md:w-[140px] h-auto mb-4 sm:mb-0"
          />
          <img
            src="logo.svg"
            alt="logo"
            className="w-[50px] h-auto mb-4 sm:mb-0"
          />
          {resiData?.airwayBill && (
            <img
              src={generateBarcode(resiData.airwayBill)}
              alt="Barcode"
              className="w-32 sm:w-40 md:w-48 h-auto"
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
            <h4 className="font-bold">Pengirim:</h4>
            <p>{resiData?.sender}</p>
            <br />
            <p>{resiData?.senderAddress}</p>
          </div>
          <div>
            <h4 className="font-bold">Penerima:</h4>
            <p>{resiData?.consignee}</p>
            <br />
            <p>{resiData?.consigneeAddress}</p>
          </div>
        </div>

        {/* Detail Barang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><b>Deskripsi:</b> {resiData?.description}</p>
            <p><b>Jumlah (Colly):</b> {resiData?.colly}</p>
            <p><b>Berat (kg):</b> {resiData?.weight}</p>
            <p><b>Keterangan :</b> {resiData?.keterangan}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <div>
    <p className="font-semibold text-center">Tanda Tangan Pengirim</p>
    <div className="border h-16 my-2"></div>
  </div>
  <div>
    <p className="font-semibold text-center">Tanda Tangan Kurir</p>
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

      {/* Hidden component for PDF generation */}
<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
  {resiData && (
    <TripleResi ref={pdfContentRef} resiData={resiData} generateBarcode={generateBarcode} />
  )}
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