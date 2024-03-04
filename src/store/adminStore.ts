import { create } from "zustand";

export type Admin = {
  id: string;
  createdAt: Date;
  brandName: string;
  brandBranch: string;
  brandLogo: string;
  numberOfOrders: number;
  usedNFTs: number;
  notUsedNFTs: number;
  numberForReward: number;
  NFTSrc: string;
  lastQRScanTime: Date;
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
    createdAt: new Date(),
    brandName: "",
    brandBranch: "",
    brandLogo: "",
    numberOfOrders: 0,
    usedNFTs: 0,
    notUsedNFTs: 0,
    numberForReward: 0,
    NFTSrc: "",
    lastQRScanTime: new Date(),
  },
  admins: [],
  updateAdmin: (admin) => set(() => ({ admin })),
  updateAdmins: (admins) =>
    set(() => ({
      admins,
    })),
}));

export default useAdminStore;
