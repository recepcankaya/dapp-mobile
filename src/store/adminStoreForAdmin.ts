import { create } from "zustand";

type Admin = {
  adminId: string;
  brandName: "";
  brandBranch: "";
  numberOfOrdersSoFar: 0;
  usedNFTs: 0;
  notUsedNFTs: 0;
  numberForReward: 0;
  lastQRScanTime: "";
  contractAddress: "";
  NFTSrc: "";
};

type State = {
  admin: Admin;
};

type Action = {
  updateAdmin: (admin: State["admin"]) => void;
};

const useAdminForAdminStore = create<State & Action>((set) => ({
  admin: {
    adminId: "",
    brandName: "",
    brandBranch: "",
    numberOfOrdersSoFar: 0,
    usedNFTs: 0,
    notUsedNFTs: 0,
    numberForReward: 0,
    lastQRScanTime: "",
    contractAddress: "",
    NFTSrc: "",
  },
  updateAdmin: (admin) => set(() => ({ admin: admin })),
}));

export default useAdminForAdminStore;
