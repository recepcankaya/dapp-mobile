import { create } from "zustand";

export type Admin = {
  id: string;
  brandName: string;
  brandLogo: string;
  numberForReward: number;
  NFTSrc: string;
  contractAddress: string;
  notUsedNFTSrc: string;
  notUsedContractAddress: string;
  coords: {
    lat: number;
    long: number;
  };
};

type State = {
  admin: Admin;
  admins: Admin[];
};

type Action = {
  updateAdmin: (admin: State["admin"]) => void;
  updateAdmins: (admins: State["admins"]) => void;
};

const useAdminStore = create<State & Action>((set) => ({
  admin: {
    id: "",
    brandName: "",
    brandLogo: "",
    numberForReward: 0,
    NFTSrc: "",
    contractAddress: "",
    notUsedNFTSrc: "",
    notUsedContractAddress: "",
    coords: {
      lat: 0,
      long: 0,
    },
  },
  admins: [],
  updateAdmin: (admin) => set(() => ({ admin })),
  updateAdmins: (admins) =>
    set(() => ({
      admins,
    })),
}));

export default useAdminStore;
