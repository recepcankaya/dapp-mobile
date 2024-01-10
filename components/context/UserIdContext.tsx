import React, { createContext, useState } from 'react';

interface UserIdContextProps {
  user_id: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const UserIdContext = createContext<UserIdContextProps>({
  user_id: null,
  setUserId: () => {},
});

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user_id, setUserId] = useState<number | null>(null);

  return (
    <UserIdContext.Provider value={{ user_id, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};