"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function ResultCard() {
  const { data: session } = useSession();
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRoast() {
      if (!session?.user?.steamId) return;
      setLoading(true);
      // Fetch Steam games
      const steamRes = await fetch(`/api/steam?steamid=${session.user.steamId}`);
      const steamData = await steamRes.json();
      if (steamData.error) {
        setRoast(steamData.error);
        setLoading(false);
        return;
      }
      // Fetch AI roast
      const roastRes = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: steamData.games.map((g: any) => g.name), totalHours: steamData.totalHours }),
      });
      const roastData = await roastRes.json();
      setRoast(roastData.roast);
      setLoading(false);
    }
    fetchRoast();
  }, [session]);

  // Typewriter effect
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!roast) return;
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + roast[i]);
      i++;
      if (i >= roast.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [roast]);

  if (!session?.user?.steamId) return null;
  return (
    <div className="mt-12 bg-[#171a21] border-2 border-beskar-silver rounded-xl p-8 max-w-xl w-full shadow-xl text-lg font-mono min-h-[120px]">
      {loading ? "Loading your roast..." : displayed}
    </div>
  );
}
