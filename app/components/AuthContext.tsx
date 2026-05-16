"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  steamId: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  steamId: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [steamId, setSteamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setSteamId(data.steamId ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    window.location.href = "/api/auth/logout";
  }

  return (
    <AuthContext.Provider value={{ steamId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
