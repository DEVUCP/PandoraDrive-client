import { createContext } from "react";

export const portContext = createContext<{
  port: string;
  setPort: (port: string) => void;
}>({
  port: "",
  setPort: (port: string) => {},
});
