"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Select, Button, Card } from "antd";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import { fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages } from "@/utils/api";

const { Option } = Select;
const { TextArea } = Input;

type Province = {
  id: string;
  name: string;
};

type Regency = {
  id: string;
  name: string;
};

type District = {
  id: string;
  name: string;
};

type Village = {
  id: string;
  name: string;
};

interface RegistrationStep1Props {
  onNext: () => void;
}

export const RegistrationStep1 = ({ onNext }: RegistrationStep1Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);

  const [senderForm] = Form.useForm();
  const [consigneeForm] = Form.useForm();

  
  

  // Sender location states
  const [senderProvinces, setSenderProvinces] = useState<Province[]>([]);
  const [senderRegencies, setSenderRegencies] = useState<Regency[]>([]);
  const [senderDistricts, setSenderDistricts] = useState<District[]>([]);
  const [senderVillages, setSenderVillages] = useState<Village[]>([]);

  // Consignee location states
  const [consigneeProvinces, setConsigneeProvinces] = useState<Province[]>([]);
  const [consigneeRegencies, setConsigneeRegencies] = useState<Regency[]>([]);
  const [consigneeDistricts, setConsigneeDistricts] = useState<District[]>([]);
  const [consigneeVillages, setConsigneeVillages] = useState<Village[]>([]);

  useEffect(() => {
    async function loadSenderProvinces() {
      const data = await fetchProvinces();
      setSenderProvinces(data);
    }
    loadSenderProvinces();

    async function loadConsigneeProvinces() {
      const data = await fetchProvinces();
      setConsigneeProvinces(data);
    }
    loadConsigneeProvinces();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep1Data");
    if (savedData) {
      const parsed = JSON.parse(savedData);

      if (parsed.sender) {
        senderForm.setFieldsValue({
          sender: parsed.sender.name,
          province: parsed.sender.location.province,
          regency: parsed.sender.location.regency,
          district: parsed.sender.location.district,
          village: parsed.sender.location.village,
          senderaddress: parsed.sender?.addressDetail
        });
      }

      if (parsed.consignee) {
        consigneeForm.setFieldsValue({
          consignee: parsed.consignee.name,
          province: parsed.consignee.location.province,
          regency: parsed.consignee.location.regency,
          district: parsed.consignee.location.district,
          village: parsed.consignee.location.village,
          consigneeaddress: parsed.consignee?.addressDetail
        });
      }
    }
  }, [senderForm, consigneeForm]);

  // Sender handlers
  const handleSenderProvinceChange = async (value: string) => {
    const selected = senderProvinces.find((p) => p.id === value);
    senderForm.setFieldsValue({ regency: undefined, district: undefined, village: undefined });
    const data = await fetchRegencies(value);
    setSenderRegencies(data);
    setSenderDistricts([]);
    setSenderVillages([]);
    dispatch(updateForm({ sender: { ...formData.sender, location: { province: selected?.name || "", regency: "", district: "", village: "" } } }));
  };

  const handleSenderRegencyChange = async (value: string) => {
    const selected = senderRegencies.find((r) => r.id === value);
    senderForm.setFieldsValue({ district: undefined, village: undefined });
    const data = await fetchDistricts(value);
    setSenderDistricts(data);
    setSenderVillages([]);
    dispatch(updateForm({ sender: { ...formData.sender, location: { ...formData.sender.location, regency: selected?.name || "", district: "", village: "" } } }));
  };

  const handleSenderDistrictChange = async (value: string) => {
    const selected = senderDistricts.find((d) => d.id === value);
    const data = await fetchVillages(value);
    setSenderVillages(data);
    dispatch(updateForm({ sender: { ...formData.sender, location: { ...formData.sender.location, district: selected?.name || "", village: "" } } }));
  };

  // Consignee handlers
  const handleConsigneeProvinceChange = async (value: string) => {
    const selected = consigneeProvinces.find((p) => p.id === value);
    consigneeForm.setFieldsValue({ regency: undefined, district: undefined, village: undefined });
    const data = await fetchRegencies(value);
    setConsigneeRegencies(data);
    setConsigneeDistricts([]);
    setConsigneeVillages([]);
    dispatch(updateForm({ consignee: { ...formData.consignee, location: { province: selected?.name || "", regency: "", district: "", village: "" } } }));
  };

  const handleConsigneeRegencyChange = async (value: string) => {
    const selected = consigneeRegencies.find((r) => r.id === value);
    consigneeForm.setFieldsValue({ district: undefined, village: undefined });
    const data = await fetchDistricts(value);
    setConsigneeDistricts(data);
    setConsigneeVillages([]);
    dispatch(updateForm({ consignee: { ...formData.consignee, location: { ...formData.consignee.location, regency: selected?.name || "", district: "", village: "" } } }));
  };

  const handleConsigneeDistrictChange = async (value: string) => {
    const selected = consigneeDistricts.find((d) => d.id === value);
    const data = await fetchVillages(value);
    setConsigneeVillages(data);
    dispatch(updateForm({ consignee: { ...formData.consignee, location: { ...formData.consignee.location, district: selected?.name || "", village: "" } } }));
  };

  const onFinish = async () => {
    try {
      const senderValues = await senderForm.validateFields();
      const consigneeValues = await consigneeForm.validateFields();
  
      const senderLocation = {
        province: senderProvinces.find((prov) => prov.id === senderValues.province)?.name || senderValues.province,
        regency: senderRegencies.find((reg) => reg.id === senderValues.regency)?.name || senderValues.regency,
        district: senderDistricts.find((dist) => dist.id === senderValues.district)?.name || senderValues.district,
        village: senderVillages.find((vil) => vil.id === senderValues.village)?.name || senderValues.village,
      };
  
      const consigneeLocation = {
        province: consigneeProvinces.find((prov) => prov.id === consigneeValues.province)?.name || consigneeValues.province,
        regency: consigneeRegencies.find((reg) => reg.id === consigneeValues.regency)?.name || consigneeValues.regency,
        district: consigneeDistricts.find((dist) => dist.id === consigneeValues.district)?.name || consigneeValues.district,
        village: consigneeVillages.find((vil) => vil.id === consigneeValues.village)?.name || consigneeValues.village,
      };
  
      // Alamat komplit ditampilkan, tapi alamat jalan disimpan terpisah
      const senderAddress = `${senderLocation.village}, ${senderLocation.district}, ${senderLocation.regency}, ${senderLocation.province}, ${senderValues.senderaddress}`;
      const consigneeAddress = `${consigneeLocation.village}, ${consigneeLocation.district}, ${consigneeLocation.regency}, ${consigneeLocation.province}, ${consigneeValues.consigneeaddress}`;
  
      const updatedValues = {
        sender: {
          name: senderValues.sender,
          address: senderAddress, // Alamat komplit (lokasi + jalan)
          location: senderLocation,
          addressDetail: senderValues.senderaddress || "", // Alamat jalan
        },
        consignee: {
          name: consigneeValues.consignee,
          address: consigneeAddress,
          location: consigneeLocation,
          addressDetail: consigneeValues.consigneeaddress,
        },
      };
  
      localStorage.setItem("registrationStep1Data", JSON.stringify(updatedValues));
      dispatch(updateForm(updatedValues));
      onNext();
  
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };


  
  

  return (
    <>
     <div>
     <Card title=""
  classNames={{
    body: 'my-classname',
  }}
  styles={{
    body: {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }}
>
      <Form form={senderForm} layout="vertical" className="registration-form "  autoComplete="off">
        <Form.Item label="Sender/Pengirim" name="sender" rules={[{ required: true, message: "Harap Isi Pengirim!!!" }]}>
          <Input placeholder="Informasi Pengirim" />
        </Form.Item>
        <Form.Item label="Provinsi" name="province" rules={[{ required: true, message: "Pilih Provinsi!!!" }]}>
          <Select placeholder="Pilih" onChange={handleSenderProvinceChange} showSearch filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}>
            {senderProvinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kabupaten/Kota" name="regency" rules={[{ required: true, message: "Pilih Kabupaten/Kota!!!" }]}>
          <Select placeholder="Pilih" onChange={handleSenderRegencyChange} disabled={!senderRegencies.length}>
            {senderRegencies.map((regency) => (
              <Option key={regency.id} value={regency.id}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kecamatan" name="district" rules={[{ required: true, message: "Pilih Kecamatan!!!" }]}>
          <Select placeholder="Pilih" onChange={handleSenderDistrictChange} disabled={!senderDistricts.length}>
            {senderDistricts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kelurahan" name="village" rules={[{ required: true, message: "Pilih Kelurahan!!!" }]}>
          <Select placeholder="Pilih" disabled={!senderVillages.length}>
            {senderVillages.map((village) => (
              <Option key={village.id} value={village.id}>
                {village.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Alamat Pengirim (Optional)" name="senderaddress">
          <TextArea
            rows={4}
            styles={{
              textarea: { minHeight: '100px' },
            }}
            placeholder="contoh: Jl.RayaBogor Rt02/09"
          />
        </Form.Item>
      </Form>
      
      <Form form={consigneeForm} layout="vertical" className="registration-form" autoComplete="off">
        <Form.Item label="Consignee/Penerima" name="consignee" rules={[{ required: true, message: "Harap Isi Penerima!!!" }]}>
          <Input placeholder="Informasi Penerima" />
        </Form.Item>
        <Form.Item label="Provinsi" name="province" rules={[{ required: true, message: "Pilih Provinsi!!!" }]}>
          <Select placeholder="Pilih" onChange={handleConsigneeProvinceChange} showSearch filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}>
            {consigneeProvinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kabupaten/Kota" name="regency" rules={[{ required: true, message: "Pilih Kabupaten/Kota!!!" }]}>
          <Select placeholder="Pilih" onChange={handleConsigneeRegencyChange} disabled={!consigneeRegencies.length}>
            {consigneeRegencies.map((regency) => (
              <Option key={regency.id} value={regency.id}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kecamatan" name="district" rules={[{ required: true, message: "Pilih Kecamatan!!!" }]}>
          <Select placeholder="Pilih" onChange={handleConsigneeDistrictChange} disabled={!consigneeDistricts.length}>
            {consigneeDistricts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kelurahan" name="village" rules={[{ required: true, message: "Pilih Kelurahan!!!" }]}>
          <Select placeholder="Pilih" disabled={!consigneeVillages.length}>
            {consigneeVillages.map((village) => (
              <Option key={village.id} value={village.id}>
                {village.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Alamat Penerima (Wajib)" name="consigneeaddress" rules={[{required: true, message: "Isi Alamat Penerima!!"}]}>
          <TextArea
            rows={4}
            styles={{
              textarea: { minHeight: '100px' },
            }}
            placeholder="contoh: Jl.RayaBogor Rt02/09"
          />
        </Form.Item>
      </Form>

      
    </Card> 
     </div>
     <div className="flex flex-row flex-wrap justify-center">
    <Button type="primary" onClick={onFinish} className="submit-button">
        Next
      </Button>
    </div>
    </>
  );
};
