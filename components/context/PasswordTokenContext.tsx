import React, { createContext, useState } from 'react';

interface PasswordTokenContextProps {
  passwordToken: string | null;
  setPasswordToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PasswordTokenContext = createContext<PasswordTokenContextProps>({
  passwordToken: null,
  setPasswordToken: () => {},
});

export const PasswordTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwordToken, setPasswordToken] = useState<string | null>(null);

  return (
    <PasswordTokenContext.Provider value={{ passwordToken, setPasswordToken }}>
      {children}
    </PasswordTokenContext.Provider>
  );
};