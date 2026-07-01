import { createContext, useContext } from "react";

const EmbeddedContext = createContext<boolean>(false);

export const useEmbedded = () => useContext(EmbeddedContext);
