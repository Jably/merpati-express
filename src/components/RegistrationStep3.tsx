import React, { useEffect } from "react";
import { Card, Form, Button, Radio, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";

interface RegistrationStep3Props {
  onNext: () => void;
  onBack: () => void;
}

const transportOptions = [
  { label: "Udara", value: "Udara / Air" },
  { label: "Laut", value: "Laut / Sea" },
  { label: "Darat", value: "Darat / Land" },
  { label: "Lainnya", value: "Lainnya" },
];

const serviceOptions = [
  { label: "Same Day", value: "Same Day Service" },
  { label: "Over Night", value: "Over Night Service" },
  { label: "Hand Carry", value: "Hand Carry" },
  { label: "Reguler", value: "Reguler" },
  { label: "Inner City", value: "Inner City ( Dalam Kota)" },
  { label: "Lainnya", value: "Lainnya" },
];

export const RegistrationStep3 = ({ onNext, onBack }: RegistrationStep3Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep3Data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.paket) {
        form.setFieldsValue({
          transport: parsed.paket.transport,
          service: parsed.paket.service,
        });
      }
    }
  }, []);

  const onFinish = async () => {
    try {
      const paket = await form.validateFields();
      const updatedValues = {
        paket: {
          transport: paket.transport,
          service: paket.service,
        },
      };
      localStorage.setItem("registrationStep3Data", JSON.stringify(updatedValues));
      dispatch(updateForm(updatedValues));
      onNext();
    } catch (error) {
      console.error("Validation error", error);
    }
  };

  return (
    <div className="text-center max-w-[145vh] mx-auto mt-10 px-4 font-montserrat">
      <Card className="rounded-xl shadow-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData.paket}
        >
          {/* Transport Title */}
          <Row justify="center">
            <Col xs={24} sm={20} md={18} lg={16} className="text-center mb-6">
              <h3 className="text-xl font-bold">
                Pilih Layanan Moda Yang Ingin Digunakan
              </h3>
            </Col>
          </Row>

          {/* Transport Options */}
          <Form.Item
            name="transport"
            rules={[{ required: true, message: "Wajib Pilih!!" }]}
          >
            <Radio.Group
              block
              options={transportOptions}
              optionType="button"
              buttonStyle="solid"
              className="flex flex-wrap justify-center gap-2  "
              size="middle"
            />
          </Form.Item>

          {/* Service Title */}
          <Row justify="center" className="mt-8">
            <Col xs={24} sm={20} md={18} lg={16} className="text-center mb-6">
              <h3 className="text-xl font-bold">
                Pilih Layanan Pengiriman Yang Ingin Digunakan
              </h3>
            </Col>
          </Row>

          {/* Service Options */}
          <Form.Item
            name="service"
            rules={[{ required: true, message: "Wajib Pilih!!!" }]}
          >
            <Radio.Group
              block
              options={serviceOptions}
              optionType="button"
              buttonStyle="solid"
              className="flex flex-wrap justify-center gap-2"
            />
          </Form.Item>
        </Form>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 gap-4">
        <Button
          onClick={onBack}
          type="default"
          className="w-1/2 font-semibold bg-gray-100 border-gray-300 text-gray-800"
        >
          Kembali
        </Button>
        <Button
          onClick={() => form.submit()}
          type="primary"
          htmlType="submit"
          className="w-1/2 font-semibold"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
};
