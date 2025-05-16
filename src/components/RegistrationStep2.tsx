import { Button, Card, Form, Input, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import React, { useEffect } from "react";
import "../app/globals.css";

interface RegistrationStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationStep2 = ({ onNext, onBack }: RegistrationStep2Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [form] = Form.useForm();

  // // Function generate W + 8 digit random
  // const generateOrderNumber = () => {
  //   const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  //   return `W${randomNumber}`;
  // };
  

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

    } else {
      // Auto set orderNumber kalau belum ada
      // form.setFieldsValue({ ordernumber: generateOrderNumber() });
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
      }
    }

    localStorage.setItem("registrationStep2Data", JSON.stringify(updatedValues));
    dispatch(updateForm(updatedValues));
    onNext();
  } catch (error){
      console.error("gagal", error)
  }
};

  return (
    <Card title="" classNames={{
      body: 'ant-card-body',
    }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={formData.detailbarang}
        className="registration-form"
      >
        <Form.Item
          name="orderNumber"
          label="Order Number"
          rules={[{ required: true, message: "Order number wajib diisi" }]}
        >
          <Input placeholder="ex: WS12023" />
        </Form.Item>

        <Form.Item
          name="colly"
          label="Colly/Jumlah"
          rules={[{ required: true, message: "Colly wajib diisi" }]}
        >
          <Input placeholder="Jumlah barang" />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Berat (Kg)"
          rules={[{ required: true, message: "Berat barang wajib diisi" }]}
        >
          <Input min={0} style={{ width: "100%" }} placeholder="Contoh: 1.5" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi Barang/Nama Barang"
          rules={[{ required: true, message: "Deskripsi barang wajib diisi" }]}
        >
          <Input.TextArea rows={4} placeholder="Deskripsi barang Contoh: Kabel" />
        </Form.Item>

        <Form.Item
          name="origin"
          label="Asal"
          rules={[{ required: true, message: "Asal wajib diisi" }]}
        >
          <Input placeholder="Asal barang" />
        </Form.Item>

        <Form.Item
          name="destination"
          label="Tujuan"
          rules={[{ required: true, message: "Tujuan wajib diisi" }]}
        >
          <Input placeholder="Tujuan pengiriman" />
        </Form.Item>

        <Form.Item
          name="keterangan"
          label="Keterangan Tambahan (PxLxT)"
          rules={[{ required: true, message: "Wajib Diisi!!" }]}
        >
          <Input.TextArea rows={4} placeholder="PxLxT" />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between", gap:"20px" }}>
          <Button onClick={onBack}>Kembali</Button>
          <Button onClick={onFinish} type="primary" htmlType="submit">
            Lanjut
          </Button>
        </div>
      </Form>
    </Card>
  );
};