// ResiTemplateForPDF.tsx (Biarkan sama dengan versi sebelumnya yang sudah dioptimalkan)
import React, { forwardRef } from "react";

interface ResiTemplateProps {
  resiData: any;
  generateBarcode: (text: string) => string;
}

const ResiTemplateForPDF = forwardRef<HTMLDivElement, ResiTemplateProps>(
  ({ resiData, generateBarcode }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          border: "0.5px solid #D1D5DB",
          padding: "8px",
          borderRadius: "3px",
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
          width: "auto",
          boxSizing: "border-box",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
        }}
      >
        {/* Header with miring + logo + barcode */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    borderBottom: "0.5px solid #D1D5DB",
    paddingBottom: "5px",
  }}
>
  {/* Kiri: miring.png + logo.svg */}
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <img
      src="miring.png"
      alt="miring"
      style={{ width: "90px", height: "auto", display: "block" }}
    />
    <img
      src="logo.svg"
      alt="logo"
      style={{ width: "35px", height: "auto", display: "block", marginBottom:"8px" }}
    />
  </div>

  {/* Kanan: Barcode */}
  {resiData?.airwayBill && (
    <img
      src={generateBarcode(resiData.airwayBill)}
      alt="Barcode"
      style={{ width: "130px", height: "auto", display: "block" }}
    />
  )}
</div>


        {/* AWB */}
        <div
          style={{
            marginBottom: "6px",
            borderBottom: "0.5px solid #D1D5DB",
            paddingBottom: "6px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              marginBottom: "1px",
            }}
          >
            Airway Bill (AWB): {resiData?.airwayBill}
          </p>
          <p style={{ fontSize: "11px" }}>Order Number: {resiData?.orderNumber}</p>
        </div>

        {/* Pengirim dan Penerima */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: "bold", marginBottom: "2px", fontSize: "11px" }}>Pengirim:</h4>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>{resiData?.sender}</p>
            <p style={{ fontSize: "11px" }}>{resiData?.senderAddress}</p>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: "bold", marginBottom: "2px", fontSize: "11px" }}>Penerima:</h4>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>{resiData?.consignee}</p>
            <p style={{ fontSize: "11px" }}>{resiData?.consigneeAddress}</p>
          </div>
        </div>

        {/* Detail Barang */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Deskripsi:</b> {resiData?.description}
            </p>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Jumlah (Colly):</b> {resiData?.colly}
            </p>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Berat (kg):</b> {resiData?.weight}
            </p>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Keterangan :</b> {resiData?.keterangan}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Origin:</b> {resiData?.origin}
            </p>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Destination:</b> {resiData?.destination}
            </p>
          </div>
        </div>

        {/* Transportasi */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Moda Transportasi:</b> {resiData?.transport}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: "2px", fontSize: "11px" }}>
              <b style={{ fontWeight: "bold" }}>Service:</b> {resiData?.service}
            </p>
          </div>
        </div>

        {/* TTD */}
<div
  style={{
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  }}
>
  <div style={{ flex: 1 }}>
    <p
      style={{
        fontWeight: "600",
        textAlign: "center",
        marginBottom: "2px",
        fontSize: "11px",
      }}
    >
      Tanda Tangan Pengirim
    </p>
    <div
      style={{
        border: "0.5px solid #D1D5DB",
        height: "65px",
        marginTop: "2px",
        marginBottom: "2px",
      }}
    ></div>
  </div>
  <div style={{ flex: 1 }}>
    <p
      style={{
        fontWeight: "600",
        textAlign: "center",
        marginBottom: "2px",
        fontSize: "11px",
      }}
    >
      Tanda Tangan Kurir
    </p>
    <div
      style={{
        border: "0.5px solid #D1D5DB",
        height: "65px",
        marginTop: "2px",
        marginBottom: "2px",
      }}
    ></div>
  </div>
  <div style={{ flex: 1 }}>
    <p
      style={{
        fontWeight: "600",
        textAlign: "center",
        marginBottom: "2px",
        fontSize: "11px",
      }}
    >
      Tanda Tangan Penerima
    </p>
    <div
      style={{
        border: "0.5px solid #D1D5DB",
        height: "65px",
        marginTop: "2px",
        marginBottom: "2px",
      }}
    ></div>
  </div>
</div>


        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <p style={{ fontSize: "10px", color: "#4B5563" }}>
            Terima kasih telah menggunakan layanan kami.
          </p>
          <p style={{ fontSize: "10px", color: "#4B5563" }}>
            Resi ini sebagai bukti pengiriman yang sah.
          </p>
        </div>
      </div>
    );
  }
);

ResiTemplateForPDF.displayName = "ResiTemplateForPDF";
export default ResiTemplateForPDF;