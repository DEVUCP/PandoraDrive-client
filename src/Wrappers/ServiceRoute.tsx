import { useContext, type ReactNode } from "react";
import { ServiceLocatorContext } from "../Contexts/ServiceLocatorContext";
import { Navigate } from "react-router-dom";

export default function ({ children }: { children: ReactNode }) {
  const { url } = useContext(ServiceLocatorContext);
  return url ? children : <Navigate to="/connect" />;
}
