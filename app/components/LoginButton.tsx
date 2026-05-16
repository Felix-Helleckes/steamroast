"use client";
import { useAuth } from "./AuthContext";
import Image from "next/image";

export function LoginButton() {
  const { steamId, loading, logout } = useAuth();

  if (loading) return null;

  if (steamId) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 bg-[#171a21] hover:bg-red-950 text-red-400 rounded-lg font-bold text-sm shadow-lg border border-red-700 transition-colors"
        onClick={logout}
      >
        Sign Out
      </button>
    );
  }

  return (
    <a
      href="/api/auth/steam/login"
      className="flex items-center gap-2 px-6 py-3 bg-[#171a21] hover:bg-[#1b2838] text-[#1bff4a] rounded-lg font-bold text-lg shadow-lg border border-[#1bff4a] transition-colors"
    >
      <Image src="/steam-logo.svg" alt="Steam" width={32} height={32} />
      Sign in with <span className="ml-1 font-mono">STEAM</span>
    </a>
  );
}
