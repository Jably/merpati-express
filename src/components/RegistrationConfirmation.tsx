"use client"; // ✅ penting untuk pakai next/navigation

import { useDispatch } from "react-redux";
import { updateForm } from "@/store/formSlice";
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useRouter } from "next/navigation"; // ✅ Ganti dengan next/navigation
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
  const router = useRouter(); // ✅ Sekarang ini valid
  const [formData, setFormData] = useState<any>({});

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

      setFormData(parsed);
    }
  }, []);

  const generateAirwayBill = () => {
    return "AWB-" + Date.now().toString();
  };

  const onFinish = async () => {
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
      airwayBill,
    };

    localStorage.setItem("registrationStep4Data", JSON.stringify(confirmationData));
    dispatch(updateForm({ confirmation: confirmationData }));

    try {
      const response = await axios.post("/api/createOrder", confirmationData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200) {
        throw new Error("Failed to save order");
      }

      message.success("Data konfirmasi berhasil disimpan dan Airway Bill telah dibuat!");

      // ✅ Pindahkan user ke halaman /resi
      router.push("/resi");

    } catch (error) {
      message.error("Gagal mengirim data ke server");
    }
  };

  return (
    <div className="confirmation">
      <h2 className="font-montserrat mb-8 text-2xl font-bold text-center p-2 font-bold text-[#ffff] border-2 rounded-lg bg-[#1d4ebc]">
        Konfirmasi dan Pengecekan Data Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card title="Order Number" value={formData.step2?.detailbarang?.orderNumber || "N/A"} />
        <Card title="Colly / Jumlah Barang" value={formData.step2?.detailbarang?.colly || "N/A"} />
        <Card title="Weight / Berat (kg)" value={formData.step2?.detailbarang?.weight || "N/A"} />
        <Card title="Description" value={formData.step2?.detailbarang?.description || "N/A"} />
        <Card title="Origin / Kota Asal" value={formData.step2?.detailbarang?.origin || "N/A"} />
        <Card title="Destination" value={formData.step2?.detailbarang?.destination || "N/A"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card title="Sender / Pengirim" value={formData.step1?.sender?.name || "(Nama Pengirim)"} />
        <Card title="Consignee / Penerima" value={formData.step1?.consignee?.name || "(Nama Penerima)"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card title="Address / Alamat Pengirim" value={formData.step1?.sender?.address || "(Alamat Pengirim)"} />
        <Card title="Address / Alamat Penerima" value={formData.step1?.consignee?.address || "(Alamat Penerima)"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card title="Transportation / Moda Transportasi" value={formData.step3?.paket?.transport || "(Moda Transportasi)"} />
        <Card title="Service / Jenis Layanan" value={formData.step3?.paket?.service || "(Layanan)"} />
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={onBack}>Kembali</Button>
        <Button onClick={onFinish} type="primary">
          Lanjut
        </Button>
      </div>
    </div>
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
