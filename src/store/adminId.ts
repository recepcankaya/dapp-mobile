import { create } from "zustand";

type State = {
  adminId: string;
};

type Action = {
  setAdminId: (adminId: State["adminId"]) => void;
};

const updateAdminId = create<State & Action>((set) => ({
  adminId: "",
  setAdminId: (adminId) => set(() => ({ adminId: adminId })),
}));

export default updateAdminId;
