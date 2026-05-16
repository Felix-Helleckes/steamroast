"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type Profile = {
  username: string;
  avatar: string | null;
};

export function AuthTopBar() {
  const { steamId, loading, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (!steamId) return;

    fetch("/api/auth/profile", { cache: "no-store", credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.profile) {
          setAvatarFailed(false);
          setProfile(data.profile as Profile);
        }
      })
      .catch(() => {
        setProfile(null);
      });
  }, [steamId]);

  if (loading || !steamId) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 md:pt-6 pointer-events-none">
      <div className="mx-auto max-w-6xl flex items-center justify-end">
        <div className="flex items-center gap-2">
        <div className="pointer-events-auto px-3 py-1.5 bg-[#171a21]/95 border border-[#2d3748] rounded-md text-xs md:text-sm text-[#bfc7ce] shadow-lg flex items-center gap-2">
          {profile?.avatar && !avatarFailed ? (
            <Image
              src={profile.avatar}
              alt={profile.username}
              width={26}
              height={26}
              className="rounded-full border border-[#2d3748] object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="w-[26px] h-[26px] rounded-full border border-[#2d3748] bg-[#0f141b]" />
          )}
          <span className="font-semibold">{profile?.username ?? "Steam User"}</span>
        </div>

        <button
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#171a21]/95 hover:bg-red-950 text-red-400 rounded-md font-medium text-xs shadow-lg border border-red-700 transition-colors"
          onClick={logout}
        >
          Sign Out
        </button>
        </div>
      </div>
    </div>
  );
}
