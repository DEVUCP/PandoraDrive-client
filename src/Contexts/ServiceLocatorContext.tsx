import { createContext, useMemo, useState, type ReactNode } from "react";

interface IServiceLocatorContext {
  ip: string;
  setIp: (ip: string) => void;
  port: string;
  setPort: (port: string) => void;
  url: string;
}
export const ServiceLocatorContext =
  createContext<IServiceLocatorContext | null>(null);

export const ServiceLocatorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [port, setPort] = useState<string>("55551");
  const [ip, setIp] = useState<string>("");
  // const url = useMemo(() => `${ip}:${port}`, [ip, port]);
  const url = useMemo(() => (ip ? `http://localhost:${port}` : ""), [ip, port]); // WARN: avoid ip for now, fix later
  return (
    <ServiceLocatorContext.Provider value={{ port, setPort, ip, setIp, url }}>
      {children}
    </ServiceLocatorContext.Provider>
  );
};
