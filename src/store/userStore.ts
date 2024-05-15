import { create } from "zustand";

type State = {
  user: User;
};

type Action = {
  setUser: (user: State["user"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  user: {} as User,
  setUser: (user) => set(() => ({ user: user })),
}));

export default useUserStore;
