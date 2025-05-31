import React, { useState } from "react";
import { Button, message, Input, Table } from "antd"; // Import Input and Table from antd
import axios from "axios";

// ---
// Define the type for a delivery status item based on your Prisma 'order' model
interface DeliveryStatus {
  id: number;
  orderNumber: string;
  senderName: string;
  senderAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  transport: string;
  service: string;
  colly: string;
  weight: string;
  description: string;
  origin: string;
  destination: string;
  airwayBill: string;
  keterangan: string;
  status: string;
  createdAt: string; // Represented as string from database, will be formatted
  updatedAt: string; // Represented as string from database, will be formatted
}
// ---

export default function TrackStatusDelivery() {
  const [trackingNumber, setTrackingNumber] = useState(""); // Will be used for airwayBill
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus[]>([]); // State to store fetched delivery status
  const [loading, setLoading] = useState(false);

  // ---
  // Define table columns based on the DeliveryStatus interface
  const columns = [
    {
      title: "Nomor Order",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Nomor Airway Bill", // This is likely your primary tracking ID
      dataIndex: "airwayBill",
      key: "airwayBill",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Asal",
      dataIndex: "origin",
      key: "origin",
    },
    {
      title: "Tujuan",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Nama Penerima",
      dataIndex: "consigneeName",
      key: "consigneeName",
    },
    {
      title: "Alamat Penerima",
      dataIndex: "consigneeAddress",
      key: "consigneeAddress",
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
    },
    {
      title: "Terakhir Diperbarui",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => new Date(text).toLocaleString(), // Format date for better readability
    },
    // Anda bisa menambahkan kolom lain jika diperlukan:
    // {
    //   title: "Nama Pengirim",
    //   dataIndex: "senderName",
    //   key: "senderName",
    // },
    // {
    //   title: "Alamat Pengirim",
    //   dataIndex: "senderAddress",
    //   key: "senderAddress",
    // },
    // {
    //   title: "Transportasi",
    //   dataIndex: "transport",
    //   key: "transport",
    // },
    // {
    //   title: "Layanan",
    //   dataIndex: "service",
    //   key: "service",
    // },
    // {
    //   title: "Colly",
    //   dataIndex: "colly",
    //   key: "colly",
    // },
    // {
    //   title: "Berat",
    //   dataIndex: "weight",
    //   key: "weight",
    // },
    // {
    //   title: "Deskripsi",
    //   dataIndex: "description",
    //   key: "description",
    // },
    // {
    //   title: "Dibuat Pada",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text: string) => new Date(text).toLocaleString(),
    // },
  ];
  // ---

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDeliveryStatus([]); // Clear previous results

    if (!trackingNumber) {
      message.warning("Mohon masukkan nomor Airway Bill.");
      setLoading(false);
      return;
    }

    try {
      // Mengambil status pengiriman dari API Anda
      // Sesuaikan endpoint API ini dengan endpoint yang benar di backend Anda.
      // Di sini, kita asumsikan Anda mencari berdasarkan 'airwayBill'
      const response = await axios.get(`/api/delivery-status?airwayBill=${trackingNumber}`);

      if (response.status === 200 && response.data) {
        // Asumsikan API Anda mengembalikan objek tunggal atau array kosong
        const data = Array.isArray(response.data) ? response.data : [response.data];

        if (data.length > 0 && data[0] !== null) { // Check if data is not empty and not null
          setDeliveryStatus(data);
          message.success("Status pengiriman ditemukan!");
        } else {
          message.info("Tidak ada status ditemukan untuk nomor Airway Bill ini.");
          setDeliveryStatus([]);
        }
      } else {
        message.info("Tidak ada status ditemukan untuk nomor Airway Bill ini.");
        setDeliveryStatus([]); // Clear data if no results
      }
    } catch (error) {
      console.error("Kesalahan saat mengambil status pengiriman:", error);
      message.error("Terjadi kesalahan saat mengambil status pengiriman. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center py-8">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-2xl">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Lacak Status Pengiriman
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Lacak Pengiriman Anda
              </h1>
              <form className="flex space-x-4 items-center justify-center" onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Masukkan Nomor Airway Bill"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full md:w-3/4 p-2.5"
                  size="large"
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="px-6 py-2"
                  size="large"
                >
                  Cari
                </Button>
              </form>

              {deliveryStatus.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Detail Pengiriman
                  </h2>
                  <Table
                    columns={columns}
                    dataSource={deliveryStatus.map((item) => ({ ...item, key: item.id }))} // Use item.id as unique key
                    pagination={false} // Disable pagination for single result
                    loading={loading} // Show loading state for the table
                    className="dark:bg-gray-700 dark:border-gray-600 rounded-lg overflow-hidden"
                    scroll={{ x: 'max-content' }} // Enable horizontal scroll for many columns
                  />
                </div>
              )}

              {/* Show a message if no results are found after search */}
              {!loading && deliveryStatus.length === 0 && trackingNumber && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                  Tidak ada status pengiriman ditemukan untuk "{trackingNumber}". Mohon periksa kembali nomor Airway Bill.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
        </div>
      )}
    </>
  );
}