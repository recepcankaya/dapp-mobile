import { create } from "zustand";

type State = {
  passwordToken: string;
};

type Action = {
  updatePasswordToken: (passwordToken: State["passwordToken"]) => void;
};

export const usePasswordTokenStore = create<State & Action>((set) => ({
  passwordToken: "",
  updatePasswordToken: (passwordToken) =>
    set(() => ({ passwordToken: passwordToken })),
}));
