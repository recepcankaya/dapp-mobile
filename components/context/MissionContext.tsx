import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type Mission = {
  id: number;
  isCompleted: boolean;
  numberOfDays: number;
  prevDate: null | string; // replace string with the actual type if it's not a string
  title: string;
};

type MissionContextType = [Mission[], Dispatch<SetStateAction<Mission[]>>];

export const MissionContext = createContext<MissionContextType>([[], () => {}]);

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missions_list, setMissions_list] = useState<Mission[]>([]);

  return (
    <MissionContext.Provider value={[missions_list, setMissions_list]}>
      {children}
    </MissionContext.Provider>
  );
};