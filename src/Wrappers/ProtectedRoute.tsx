import { useContext, type ReactNode } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}
