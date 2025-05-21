import React, { forwardRef } from "react";
import ResiTemplateForPDF from "./ResiTemplateForPDF";

interface TripleResiProps {
  resiData: any;
  generateBarcode: (text: string) => string;
}

// Ubah array labels hanya menjadi "Shipper" dan "Received"
const labels = ["Shipper", "Received"];

const TripleResi = forwardRef<HTMLDivElement, TripleResiProps>(
  ({ resiData, generateBarcode }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "794px", // Lebar A4 (untuk 96dpi)
          padding: "3px 10px", // Mengurangi padding vertikal menjadi sangat minimal
          backgroundColor: "white",
          boxSizing: "border-box",
          height: "1123px", // Tinggi A4 (untuk 96dpi)
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {labels.map((label, idx) => (
          <div
            key={label}
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              // Karena hanya ada 2 resi, kita bisa berikan lebih banyak padding antar mereka
              // atau biarkan flexGrow yang mengatur ruang kosong.
              // Jika Anda ingin lebih banyak ruang di tengah, bisa tingkatkan paddingBottom ini.
              paddingBottom: idx < labels.length - 1 ? "15px" : "0", // Tambahkan padding bawah lebih banyak untuk 2 resi
            }}
          >
            <ResiTemplateForPDF
              resiData={resiData}
              generateBarcode={generateBarcode}
            />
            <div
              style={{
                textAlign: "right",
                fontWeight: "600",
                marginTop: "2px",
                fontSize: "13px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TripleResi.displayName = "TripleResi";

export default TripleResi;