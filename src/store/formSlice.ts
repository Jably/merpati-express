import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  province: string;
  regency: string;
  district: string;
  village: string;
}

interface Confirmation {
  orderNumber: string;
  sender: string;
  consignee: string;
  transport: string;
  service: string;
}

interface FormState {
  sender: {
    name: string;
    address: string;
    location: Location;
  };
  consignee: {
    name: string;
    address: string;
    location: Location;
  };
  paket: {
    transport: string;
    service: string;
  };
  detailbarang: {
    orderNumber: string;
    colly: string;
    weight: string;
    description: string;
    origin: string;
    destination: string;
    keterangan: string;
  };
  confirmation?: Confirmation; // Tambahan ini
}

const initialState: FormState = {
  sender: {
    name: '',
    address: '',
    location: {
      province: '',
      regency: '',
      district: '',
      village: '',
    },
  },
  consignee: {
    name: '',
    address: '',
    location: {
      province: '',
      regency: '',
      district: '',
      village: '',
    },
  },
  detailbarang: {
    orderNumber: '',
    colly: '',
    weight: '',
    description: '',
    origin: '',
    destination: '',
    keterangan: '', 
  },
  paket: {
    transport: '',
    service: '',
  },
  confirmation: undefined, // Tambahkan default undefined
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<FormState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = formSlice.actions;
export default formSlice.reducer;
