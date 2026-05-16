"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export function ResultCard() {
  const { steamId } = useAuth();
  const [factsText, setFactsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFacts() {
      if (!steamId) return;
      setLoading(true);
      setError("");
      try {
        const factsRes = await fetch(`/api/facts?steamid=${steamId}`);
        if (!factsRes.ok) throw new Error(`Facts API error: ${factsRes.status}`);

        const facts = await factsRes.json();
        if (facts.error) {
          setError(facts.error);
          return;
        }

        const completionPct = Math.round((facts.playedCount / facts.totalGames) * 100);
        const top = Array.isArray(facts.topGames) ? facts.topGames.join(", ") : "n/a";

        const text =
          `Library facts:\n` +
          `- Total games: ${facts.totalGames}\n` +
          `- Never played: ${facts.neverPlayedCount}\n` +
          `- Completion rate: ${completionPct}%\n` +
          `- Total hours: ${facts.totalHours}\n` +
          `- Estimated sunk cost (0h games): €${facts.estimatedUnplayedSpendEur}\n` +
          `- Top games: ${top}`;

        setFactsText(text);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchFacts();
  }, [steamId]);

  // Typewriter effect
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!factsText) return;
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + factsText[i]);
      i++;
      if (i >= factsText.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [factsText]);

  if (!steamId) return null;
  return (
    <div className="mt-12 bg-[#171a21] border-2 border-[#bfc7ce] rounded-xl p-8 max-w-xl w-full shadow-xl text-lg font-mono min-h-[180px] whitespace-pre-wrap">
      {loading && <span className="text-[#bfc7ce] animate-pulse">Analyzing your gaming shame...</span>}
      {error && <span className="text-red-400">{error}</span>}
      {!loading && !error && displayed}
    </div>
  );
}
