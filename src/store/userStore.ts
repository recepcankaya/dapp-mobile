import { create } from "zustand";

export type User = {
  id: string;
  username: string;
  numberOfNFTs: number;
  orderNumber: number;
};

type State = {
  user: User;
};

type Action = {
  setUser: (user: State["user"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  user: {
    id: "",
    username: "",
    numberOfNFTs: 0,
    orderNumber: 0,
  },
  setUser: (user) => set(() => ({ user: user })),
}));

export default useUserStore;
