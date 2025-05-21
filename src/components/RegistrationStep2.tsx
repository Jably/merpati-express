import { Button, Card, Form, Input, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import React, { useEffect } from "react";
import "../app/globals.css"; // Pastikan Tailwind CSS diimpor di sini atau di layout utama

interface RegistrationStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationStep2 = ({ onNext, onBack }: RegistrationStep2Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep2Data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.detailbarang) {
        form.setFieldsValue({
          orderNumber: parsed.detailbarang.orderNumber,
          colly: parsed.detailbarang.colly,
          weight: parsed.detailbarang.weight,
          description: parsed.detailbarang.description,
          origin: parsed.detailbarang.origin,
          destination: parsed.detailbarang.destination,
          keterangan: parsed.detailbarang.keterangan,
        });
      }
    }
  }, [form]);

  const onFinish = async () => {
    try {
      const detailbarang = await form.validateFields();
      const updatedValues = {
        detailbarang: {
          orderNumber: detailbarang.orderNumber,
          colly: detailbarang.colly,
          weight: detailbarang.weight,
          description: detailbarang.description,
          origin: detailbarang.origin,
          destination: detailbarang.destination,
          keterangan: detailbarang.keterangan,
        },
      };

      localStorage.setItem("registrationStep2Data", JSON.stringify(updatedValues));
      dispatch(updateForm(updatedValues));
      onNext();
    } catch (error) {
      console.error("gagal", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      {/* Menggunakan div wrapper untuk responsivitas card */}
      <Card
        title=""
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg rounded-lg" // Lebar responsif
        styles={{
          body: {
            display: 'flex',
            flexDirection: 'column', // Pastikan konten Card tetap kolom
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData.detailbarang}
          className="font-bold w-full p-4 sm:p-6 md:p-8" // Padding responsif untuk form
        >
          {/* Form Items: Gunakan w-full untuk setiap input agar responsif */}
          <Form.Item
            name="orderNumber"
            label="Order Number"
            rules={[{ required: true, message: "Order number wajib diisi" }]}
            className="w-full"
          >
            <Input placeholder="ex: WS12023" />
          </Form.Item>

          <Form.Item
            name="colly"
            label="Colly/Jumlah"
            rules={[{ required: true, message: "Colly wajib diisi" }]}
            className="w-full"
          >
            <Input placeholder="Jumlah barang" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Berat (Kg)"
            rules={[{ required: true, message: "Berat barang wajib diisi" }]}
            className="w-full"
          >
            <Input min={0} placeholder="Contoh: 1.5" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Deskripsi Barang/Nama Barang"
            rules={[{ required: true, message: "Deskripsi barang wajib diisi" }]}
            className="w-full"
          >
            <Input.TextArea rows={4} placeholder="Deskripsi barang Contoh: Kabel" />
          </Form.Item>

          <Form.Item
            name="origin"
            label="Asal"
            rules={[{ required: true, message: "Asal wajib diisi" }]}
            className="w-full"
          >
            <Input placeholder="Asal barang" />
          </Form.Item>

          <Form.Item
            name="destination"
            label="Tujuan"
            rules={[{ required: true, message: "Tujuan wajib diisi" }]}
            className="w-full"
          >
            <Input placeholder="Tujuan pengiriman" />
          </Form.Item>

          <Form.Item
            name="keterangan"
            label="Keterangan Tambahan (PxLxT)"
            rules={[{ required: true, message: "Wajib Diisi!!" }]}
            className="w-full"
          >
            <Input.TextArea rows={4} placeholder="PxLxT" />
          </Form.Item>

          {/* Tombol Navigasi */}
          <div className="flex flex-col md:flex-row justify-between w-full p-4 md:p-[25px] gap-y-4 md:gap-x-5 mt-4">
            <Button className="font-semibold font-montserrat w-full md:w-1/2 bg-[ghostwhite]" onClick={onBack}>
              Kembali
            </Button>
            <Button className="font-semibold font-montserrat w-full md:w-1/2" onClick={onFinish} type="primary" htmlType="submit">
              Lanjut
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};