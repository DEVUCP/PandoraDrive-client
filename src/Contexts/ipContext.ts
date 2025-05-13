import { createContext } from "react";

export const ipContext = createContext<{
  ip: string;
  setIp: (ip: string) => void;
}>({
  ip: "",
  setIp: (ip: string) => {},
});
