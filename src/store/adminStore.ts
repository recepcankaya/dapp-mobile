import { create } from "zustand";

export type Admin = {
  brandName: string;
  brandLogo: string;
  numberForReward: number;
  NFTSrc: string;
  contractAddress: string;
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
    brandName: "",
    brandLogo: "",
    numberForReward: 0,
    NFTSrc: "",
    contractAddress: "",
  },
  admins: [],
  updateAdmin: (admin) => set(() => ({ admin })),
  updateAdmins: (admins) =>
    set(() => ({
      admins,
    })),
}));

export default useAdminStore;
