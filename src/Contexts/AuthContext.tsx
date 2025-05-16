import { createContext, useState, type ReactNode } from "react";
import type { User } from "../types";

interface IAuthContext {
  user?: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}
export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
