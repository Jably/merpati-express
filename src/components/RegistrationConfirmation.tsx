"use client";

import { useDispatch } from "react-redux";
import { updateForm } from "@/store/formSlice";
import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

interface RegistrationConfirmationProps {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationConfirmation = ({
  onNext,
  onBack,
}: RegistrationConfirmationProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});

  // State untuk modal konfirmasi sebelum submit
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  // State untuk modal sukses
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  // State untuk modal gagal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false); // Untuk tombol OK di modal

  useEffect(() => {
    const savedStep1Data = localStorage.getItem("registrationStep1Data");
    const savedStep2Data = localStorage.getItem("registrationStep2Data");
    const savedStep3Data = localStorage.getItem("registrationStep3Data");
  
    if (savedStep1Data && savedStep2Data && savedStep3Data) {
      const parsed = {
        step1: JSON.parse(savedStep1Data),
        step2: JSON.parse(savedStep2Data),
        step3: JSON.parse(savedStep3Data),
      };
      console.log("Parsed Data:", parsed); // Tambahkan ini
      setFormData(parsed);
    }
  }, []);
  

  // Fungsi untuk menampilkan modal konfirmasi
  const showConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  // Fungsi untuk menampilkan modal sukses
  const showSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  // Fungsi untuk menampilkan modal gagal
  const showErrorModal = () => {
    setIsErrorModalOpen(true);
  };

  // Handler untuk tombol "YA, BENAR" di modal konfirmasi
  const handleConfirmSubmit = async () => {
    setConfirmLoading(true); // Aktifkan loading di tombol OK
    try {
      const airwayBill = generateAirwayBill();
      const confirmationData = {
        orderNumber: formData.step2?.detailbarang?.orderNumber || "",
        sender: formData.step1?.sender?.name || "",
        senderAddress: formData.step1?.sender?.address || "",
        consigneeAddress: formData.step1?.consignee?.address || "",
        consignee: formData.step1?.consignee?.name || "",
        transport: formData.step3?.paket?.transport || "",
        service: formData.step3?.paket?.service || "",
        colly: formData.step2?.detailbarang?.colly || "",
        weight: formData.step2?.detailbarang?.weight || "",
        description: formData.step2?.detailbarang?.description || "",
        origin: formData.step2?.detailbarang?.origin || "",
        destination: formData.step2?.detailbarang?.destination || "",
        keterangan: formData.step2?.detailbarang?.keterangan || "",
        airwayBill,
      };

      localStorage.setItem("registrationStep4Data", JSON.stringify(confirmationData));
      dispatch(updateForm({ confirmation: confirmationData }));

      const response = await axios.post("/api/createOrder", confirmationData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        showSuccessModal(); // Tampilkan modal sukses
      } else {
        throw new Error("Failed to save order with status: " + response.status);
      }
    } catch (error) {
      console.error("Gagal mengirim data ke server:", error);
      message.error("Gagal mengirim data ke server. Silakan coba lagi.");
      showErrorModal(); // Tampilkan modal gagal
    } finally {
      setIsConfirmationModalOpen(false); // Tutup modal konfirmasi
      setConfirmLoading(false); // Nonaktifkan loading
    }
  };

  // Handler untuk tombol "TIDAK" di modal konfirmasi
  const handleConfirmCancel = () => {
    setIsConfirmationModalOpen(false);
  };

  // Handler untuk tombol "OK" di modal sukses
  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false); // Tutup modal sukses
    router.push("/resi"); // Navigasi ke halaman resi
  };

  // Handler untuk tombol "Tutup" di modal gagal
  const handleErrorCancel = () => {
    setIsErrorModalOpen(false);
  };

  const generateAirwayBill = () => {
    const year = new Date().getFullYear(); // Ambil tahun saat ini, contoh: 2025
    const uniquePart = Date.now().toString().slice(-6); // Ambil 6 digit terakhir dari timestamp
    return `${year}${uniquePart}`; // Hasil contoh: 2025123456
  };
  

  // Ketika tombol "Lanjut" (Final Submit) diklik
  const onProceed = () => {
    showConfirmationModal(); // Tampilkan modal konfirmasi
  };

  return (
    <>
      {/* Modal Konfirmasi Sebelum Kirim */}
      <Modal
        centered
        title="Konfirmasi Data"
        open={isConfirmationModalOpen}
        onOk={handleConfirmSubmit} // Panggil fungsi submit jika OK
        onCancel={handleConfirmCancel} // Batalkan jika Cancel
        confirmLoading={confirmLoading}
        okText="Ya, Benar"
        cancelText="Belum/Batal"
      >
        <p>Apakah semua data yang Anda masukkan sudah benar?</p>
        <p>Setelah ini, order akan dibuat dan tidak bisa diubah.</p>
      </Modal>

      {/* Modal Sukses */}
      <Modal
        centered
        title="Berhasil"
        open={isSuccessModalOpen}
        onOk={handleSuccessOk}
        confirmLoading={false} // Tidak ada loading lagi di sini
        closable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessOk}>
            Lanjut ke Resi
          </Button>,
        ]}
      >
        <p>Order telah berhasil dibuat!</p>
      </Modal>

      {/* Modal Gagal */}
      <Modal
       centered
        title="Gagal"
        open={isErrorModalOpen}
        onOk={handleErrorCancel}
        onCancel={handleErrorCancel}
        confirmLoading={false}
        closable
        footer={[
          <Button key="back" onClick={handleErrorCancel}>
            Tutup
          </Button>,
        ]}
      >
        <p>Order gagal dibuat. Harap coba lagi.</p>
      </Modal>

      <div className="confirmation">
        <h2 className="font-montserrat mb-8 text-2xl font-bold text-center p-2 text-[#ffff] border-2 rounded-lg bg-[#1d4ebc]">
          Konfirmasi dan Pengecekan Data Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card title="Order Number" value={formData.step2?.detailbarang?.orderNumber || "N/A"} />
          <Card title="Colly / Jumlah" value={formData.step2?.detailbarang?.colly || "N/A"} />
          <Card title="Weight / Berat (kg)" value={formData.step2?.detailbarang?.weight || "N/A"} />
          <Card title="Description" value={formData.step2?.detailbarang?.description || "N/A"} />
          <Card title="Origin / Kota Asal" value={formData.step2?.detailbarang?.origin || "N/A"} />
          <Card title="Destination" value={formData.step2?.detailbarang?.destination || "N/A"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card title="Sender / Pengirim" value={formData.step1?.sender?.name || "(Nama Pengirim)"} />
          <Card title="Consignee / Penerima" value={formData.step1?.consignee?.name || "(Nama Penerima)"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
          <Card title="Keterangan" value={formData.step2?.detailbarang?.keterangan || "N/A"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card title="Address / Alamat Pengirim" value={formData.step1?.sender?.address ??  "(Alamat Pengirim)"} />
          <Card title="Address / Alamat Penerima" value={formData.step1?.consignee?.address || "(Alamat Penerima)"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card title="Transportation / Moda Transportasi" value={formData.step3?.paket?.transport || "(Moda Transportasi)"} />
          <Card title="Service / Jenis Layanan" value={formData.step3?.paket?.service || "(Layanan)"} />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={onBack}>Kembali</Button>
          <Button onClick={onProceed} type="primary"> {/* Mengubah onFinish menjadi onProceed */}
            Konfirmasi & Lanjut
          </Button>
        </div>
      </div>
    </>
  );
};

const Card = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="border rounded shadow-sm">
      <p className="font-bold text-[#ffff] p-2 border-b-2 bg-[#1d4ebc] font-montserrat">{title}</p>
      <p className="font-semibold mt-2 p-4 font-montserrat">{value}</p>
    </div>
  );
};