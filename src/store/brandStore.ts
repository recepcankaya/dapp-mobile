import { create } from "zustand";

export type Brand = {
  id: number;
  name: string;
  image: string;
};

type State = {
  brand: Brand;
  brands: Brand[];
};

type Action = {
  setBrand: (brand: Brand) => void;
  setBrands: (brands: Brand[]) => void;
};

const useBrandStore = create<State & Action>((set) => ({
  brand: {
    id: 0,
    name: "",
    image: "",
  },
  brands: [],
  setBrand: (brand) => set({ brand }),
  setBrands: (brands) => set({ brands }),
}));

export default useBrandStore;
