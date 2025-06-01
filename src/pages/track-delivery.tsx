import React, { useState } from "react";
import axios from "axios";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

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
  const [message, setMessage] = useState<{ type: 'success' | 'info' | 'warning' | 'error', text: string } | null>(null); // State for custom messages

  // ---
  // We'll manually render the table using HTML <table> elements
  // The 'columns' array is now just a reference for headers, not used directly by a component
  const columns = [
    { title: "Nomor Airway Bill", key: "airwayBill" },
    { title: "Status", key: "status" },
    { title: "Asal", key: "origin" },
    { title: "Tujuan", key: "destination" },
    { title: "Nama Penerima", key: "consigneeName" },
    { title: "Nama Pengirim", key: "senderName" },
    { title: "Terakhir Diperbarui", key: "updatedAt" },
    // { title: "Alamat Pengirim", key: "senderAddress" },
    // { title: "Transportasi", key: "transport" },
    // { title: "Layanan", key: "service" },
    // { title: "Colly", key: "colly" },
    // { title: "Berat", key: "weight" },
    // { title: "Deskripsi", key: "description" },
    // { title: "Dibuat Pada", key: "createdAt" },
  ];
  // ---

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDeliveryStatus([]); // Clear previous results
    setMessage(null); // Clear previous messages

    if (!trackingNumber.trim()) { // Use .trim() to handle empty spaces
      setMessage({ type: 'warning', text: "Mohon masukkan nomor Airway Bill." });
      setLoading(false);
      return;
    }

    try {
      // Mengambil status pengiriman dari API Anda
      const response = await axios.get(`/api/delivery-status?airwayBill=${trackingNumber}`);

      if (response.status === 200 && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];

        if (data.length > 0 && data[0] !== null) {
          setDeliveryStatus(data);
          setMessage({ type: 'success', text: "Status pengiriman ditemukan!" });
        } else {
          setMessage({ type: 'info', text: "Tidak ada status ditemukan untuk nomor Airway Bill ini." });
          setDeliveryStatus([]);
        }
      } else {
        setMessage({ type: 'info', text: "Tidak ada status ditemukan untuk nomor Airway Bill ini." });
        setDeliveryStatus([]);
      }
    } catch (error) {
      console.error("Kesalahan saat mengambil status pengiriman:", error);
      setMessage({ type: 'error', text: "Terjadi kesalahan saat mengambil status pengiriman. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date strings
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString; // Return original if invalid date
    }
  };

  // Helper for message styling
  const getMessageClass = (type: 'success' | 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return 'bg-green-100 border border-green-400 text-green-700 font-montserrat';
      case 'info': return 'bg-blue-100 border border-blue-400 text-blue-700 font-montserrat';
      case 'warning': return 'bg-yellow-100 border border-yellow-400 text-yellow-700 font-montserrat';
      case 'error': return 'bg-red-100 border border-red-400 text-red-700 font-montserrat';
      default: return 'bg-gray-100 border border-gray-400 text-gray-700 font-montserrat';
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center py-8">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-[150vh]">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-800">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="font-montserrat text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Lacak Status Pengiriman Anda
              </h1>

              {/* Custom Message Display */}
              {message && (
                <div className={`p-3 rounded-md ${getMessageClass(message.type)}`} role="alert">
                  <p>{message.text}</p>
                </div>
              )}

              <form className="flex space-x-4 items-center justify-center" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Masukkan Nomor Airway Bill"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-lg" // Increased text size
                  required // HTML5 validation
                />
                <button
                  type="submit"
                  disabled={loading} // Disable button when loading
                  className="w-auto px-6 py-2.5 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mencari...' : 'Cari'}
                </button>
              </form>

              {deliveryStatus.length > 0 && (
                <div className="mt-8 overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Detail Pengiriman
                  </h2>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden font-bold capitalize text-center"> {/* Removed font-bold capitalize here as it affects whole table */}
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-bold font-montserrat uppercase tracking-wider text-gray-700 dark:text-gray-300" // Added font-bold, font-montserrat, text-center
                          >
                            {col.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {deliveryStatus.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.airwayBill}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.origin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.destination}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.consigneeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.senderName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatDate(item.updatedAt)}
                          </td>
                          {/* Tambahkan sel untuk kolom-kolom lain jika Anda menambahkannya ke `columns` */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Show a message if no results are found after search
              {!loading && deliveryStatus.length === 0 && trackingNumber && message?.type !== 'warning' && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4 font-montserrat">
                  Tidak ada status pengiriman ditemukan untuk "{trackingNumber}". Mohon periksa kembali nomor Airway Bill.
                </p>
              )} */}
            </div>
          </div>
        </div>
      </section>
      {/* Loading Spinner
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 border-gray-300" />
        </div>
      )} */}
    </>
  );
}