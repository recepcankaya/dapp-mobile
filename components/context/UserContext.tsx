import React, { createContext, useState } from 'react';

// Define the shape of the context
interface UserContextProps {
  username: string;
  setUsername: (username: string) => void;
}

// Create the context with default values
export const UserContext = createContext<UserContextProps>({
  username: '',
  setUsername: () => {},
});

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};