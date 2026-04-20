"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export function LoginButton() {
  const { data: session } = useSession();
  if (session?.user?.steamId) return null;
  return (
    <button
      className="flex items-center gap-2 px-6 py-3 bg-[#171a21] hover:bg-[#1b2838] text-[#1bff4a] rounded-lg font-bold text-lg shadow-lg border border-[#1bff4a]"
      onClick={() => signIn("steam")}
    >
      <Image src="/steam-logo.svg" alt="Steam" width={32} height={32} />
      Sign in with <span className="ml-1 font-mono">STEAM</span>
    </button>
  );
}
