import { Button, Card, Form, Input, InputNumber, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import React, { useEffect, useState } from "react";
import "../app/globals.css";

interface RegistrationStep3Props {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationStep3 = ({ onNext, onBack }: RegistrationStep3Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [form] = Form.useForm();


  

  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep3Data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.paket){
        form.setFieldsValue({
            transport: parsed.paket.transport,
            service: parsed.paket.service,
        });
      }
    } else {
      // Auto set orderNumber kalau belum ada
    //   form.setFieldsValue({ ordernumber: generateOrderNumber() });
    }
  }, [formData]);

  const onFinish = async () => {
    try {
      const paket = await form.validateFields();
      const updatedValues = {
       paket: {
        transport: paket.transport,
        service: paket.service,
       }
    }

    localStorage.setItem("registrationStep3Data", JSON.stringify(updatedValues));
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
        initialValues={formData.paket}
        className="registration-form"
      >
        <Form.Item
  name="transport"
  label="Pilih Layanan Moda Yang Ingin Digunakan"
  rules={[{ required: true, message: "Wajib Pilih!!" }]}
>
  <Radio.Group className="grid grid-cols-1 sm:grid-cols-2 gap-4 !w-full">
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Udara / Air ">Udara/Air</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Laut / Sea">Laut/Sea</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Darat / Land">Darat/Land</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Lainnya">Lainnya</Radio>
  </Radio.Group>
</Form.Item>

<Form.Item
  name="service"
  label="Pilih Layanan Pengiriman Yang Ingin Digunakan"
  rules={[{ required: true, message: "Wajib Pilih!!!" }]}
>
  <Radio.Group className="grid grid-cols-1 sm:grid-cols-2 gap-4 !w-full">
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Same Day Service">Same Day Service</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Over Night Service">Over Night Service</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Hand Carry">Hand Carry</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Reguler">Reguler</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Inner City ( Dalam Kota)">Inner City (Dalam Kota)</Radio>
    <Radio className="!w-full flex items-center gap-2 text-lg [&_.ant-radio-inner]:w-5 [&_.ant-radio-inner]:h-5" value="Lainnya">Lainnya</Radio>
  </Radio.Group>
</Form.Item>


        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onBack}>Kembali</Button>
          <Button onClick={onFinish} type="primary" htmlType="submit">
            Lanjut
          </Button>
        </div>
      </Form>
    </Card>
  );
};