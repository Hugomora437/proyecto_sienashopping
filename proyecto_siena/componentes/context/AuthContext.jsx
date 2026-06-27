import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STATIC_USER = {
  username: "ana@example.com",
  password: "admin123",
  name: "Administrador",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    if (
      username === STATIC_USER.username &&
      password === STATIC_USER.password
    ) {
      setUser({
        name: STATIC_USER.name,
        username: STATIC_USER.username,
      });

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx)  throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};