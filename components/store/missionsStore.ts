import { create } from "zustand";

type State = {
  missions: any[];
};

type Action = {
  updateMissions: (missions: State["missions"]) => void;
};

export const useMissionsStore = create<State & Action>((set) => ({
  missions: [],
  updateMissions: (missions) => set({ missions }),
}));
