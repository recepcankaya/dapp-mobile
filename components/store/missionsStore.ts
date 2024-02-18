import { create } from "zustand";

export type MissionFields = {
  id: number;
  title: string;
  startDate: string;
  isCompleted: boolean;
  numberOfDays: number;
};

type State = {
  missions: MissionFields[];
};

type Action = {
  updateMissions: (missions: State["missions"]) => void;
};

export const useMissionsStore = create<State & Action>((set) => ({
  missions: [],
  updateMissions: (missions) => set(() => ({ missions: missions })),
}));
