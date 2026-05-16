"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export function ResultCard() {
  const { steamId } = useAuth();
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRoast() {
      if (!steamId) return;
      setLoading(true);
      setError("");
      try {
        // Fetch Steam games
        const steamRes = await fetch(`/api/steam?steamid=${steamId}`);
        if (!steamRes.ok) throw new Error(`Steam API error: ${steamRes.status}`);
        const steamData = await steamRes.json();
        if (steamData.error) {
          setError(steamData.error);
          return;
        }
        // Fetch AI roast
        const roastRes = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ games: steamData.games.map((g: any) => g.name), totalHours: steamData.totalHours }),
        });
        if (!roastRes.ok) throw new Error(`Roast API error: ${roastRes.status}`);
        const roastData = await roastRes.json();
        if (!roastData.roast) throw new Error("No roast returned");
        setRoast(roastData.roast);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchRoast();
  }, [steamId]);

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

  if (!steamId) return null;
  return (
    <div className="mt-12 bg-[#171a21] border-2 border-[#bfc7ce] rounded-xl p-8 max-w-xl w-full shadow-xl text-lg font-mono min-h-[120px]">
      {loading && <span className="text-[#bfc7ce] animate-pulse">Analyzing your gaming shame...</span>}
      {error && <span className="text-red-400">{error}</span>}
      {!loading && !error && displayed}
    </div>
  );
}
