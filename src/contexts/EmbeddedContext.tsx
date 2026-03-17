import type React from 'react';
import { createContext, useContext } from 'react';

const EmbeddedContext = createContext<boolean>(false);

export const useEmbedded = () => useContext(EmbeddedContext);

export const EmbeddedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <EmbeddedContext.Provider value={true}>{children}</EmbeddedContext.Provider>;
};
