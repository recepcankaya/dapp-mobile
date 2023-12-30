import React, { createContext, useState} from 'react';

interface TokenContextProps {
  tokens: { access: string; refresh: string } | null;
  setTokens: React.Dispatch<React.SetStateAction<{ access: string; refresh: string } | null>>;
}

export const TokenContext = createContext<TokenContextProps>({
  tokens: null,
  setTokens: () => {},
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);

    return (
        <TokenContext.Provider value={{ tokens, setTokens }}>
            {children}
        </TokenContext.Provider>
    );
};