import { create } from "zustand";

export type Admin = {
  id: string;
  brandName: string;
  brandLogo: string;
  ticketImage: string;
  numberForReward: number;
  campaigns: {
    campaign_id: string;
    campaign_name: string;
    campaign_image: string;
  }[];
  NFTSrc: string;
  contractAddress: string;
  coords: {
    lat: number;
    long: number;
  };
  freeRightImageUrl: string;
  brandVideoUrl: string;
};

type State = {
  admin: Admin;
  admins: Admin[];
};

type Action = {
  updateAdmin: (admin: State["admin"]) => void;
};

const useAdminStore = create<State & Action>((set) => ({
  admin: {
    id: "",
    brandName: "",
    brandLogo: "",
    ticketImage: "",
    numberForReward: 0,
    campaigns: [],
    NFTSrc: "",
    contractAddress: "",
    coords: {
      lat: 0,
      long: 0,
    },
    freeRightImageUrl: "",
    brandVideoUrl: "",
  },
  admins: [],
  updateAdmin: (admin) => set(() => ({ admin })),
}));

export default useAdminStore;
