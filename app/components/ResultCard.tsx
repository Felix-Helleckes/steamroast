"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type FactsResponse = {
  totalGames: number;
  neverPlayedCount: number;
  playedCount: number;
  totalHours: number;
  topGames: string[];
  completionPct: number;
  totalEstimatedCostEur: number;
  estimatedUnplayedSpendEur: number;
  topOneHours: number;
  topOneSharePct: number;
  hoursPerGame: number;
  fullTimeJobYears: number;
  lifeYearsAt8h: number;
  weekendDays: number;
  shameScore: number;
  error?: string;
};

function getHotTake(facts: FactsResponse) {
  if (facts.shameScore >= 90) {
    return "Your Steam account is less a library and more a financial crime scene.";
  }
  if (facts.shameScore >= 75) {
    return "You are not buying games, you are collecting guilt in 1080p.";
  }
  if (facts.shameScore >= 60) {
    return "Strong backlog. Weak discipline. Elite cope levels.";
  }
  return "Manageable damage. Still enough evidence for poor decision-making.";
}

export function ResultCard() {
  const { steamId } = useAuth();
  const [facts, setFacts] = useState<FactsResponse | null>(null);
  const [factsText, setFactsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

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

        const top = Array.isArray(facts.topGames) ? facts.topGames.join(", ") : "n/a";
        const shameLine = getHotTake(facts as FactsResponse);

        const text =
          `Steam Reality Check:\n` +
          `- Total games: ${facts.totalGames}\n` +
          `- Never played: ${facts.neverPlayedCount}\n` +
          `- Completion rate: ${facts.completionPct}%\n` +
          `- Total hours: ${facts.totalHours}\n` +
          `- Avg hours per game: ${facts.hoursPerGame}\n` +
          `- Estimated total cost: €${facts.totalEstimatedCostEur}\n` +
          `- Sunk cost (0h games): €${facts.estimatedUnplayedSpendEur}\n` +
          `- Time equivalent: ${facts.fullTimeJobYears} full-time work years\n` +
          `- Life burned at 8h/day: ${facts.lifeYearsAt8h} years\n` +
          `- Weekend days gone: ${facts.weekendDays}\n` +
          `- Main character game share: ${facts.topOneSharePct}%\n` +
          `- Top games: ${top}\n\n` +
          `Shame Score: ${facts.shameScore}/100\n` +
          `${shameLine}`;

        setFacts(facts as FactsResponse);
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
      if (i >= factsText.length) {
        setDisplayed(factsText);
        clearInterval(interval);
        return;
      }
      setDisplayed((prev) => prev + factsText.charAt(i));
      i++;
    }, 18);
    return () => clearInterval(interval);
  }, [factsText]);

  const hasFacts = factsText.length > 0;

  async function copyShareText(label = "Copied") {
    if (!factsText) return;
    try {
      await navigator.clipboard.writeText(factsText);
      setCopied(label);
      setTimeout(() => setCopied(""), 1400);
    } catch {
      setCopied("");
    }
  }

  function shareOnX() {
    if (!facts) return;
    const text =
      `Steam Reality Check: Shame Score ${facts.shameScore}/100. ` +
      `${facts.neverPlayedCount} unplayed games. ` +
      `€${facts.estimatedUnplayedSpendEur} sunk in backlog. ` +
      `I need therapy and a discount filter.`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!steamId) return null;
  return (
    <div className="mt-10 md:mt-12 bg-[#171a21] border-2 border-[#bfc7ce] rounded-2xl p-8 md:p-10 max-w-4xl w-full shadow-2xl text-xl leading-relaxed font-mono min-h-[280px] whitespace-pre-wrap">
      {loading && <span className="text-[#bfc7ce] animate-pulse">Analyzing your gaming shame...</span>}
      {error && <span className="text-red-400">{error}</span>}
      {!loading && !error && (
        <>
          {facts && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 not-italic font-sans whitespace-normal">
              <div className="rounded-xl border border-red-700/60 bg-red-950/30 p-4">
                <p className="text-xs uppercase tracking-wide text-red-300">Sunk Cost</p>
                <p className="text-3xl font-extrabold text-red-200">€{facts.estimatedUnplayedSpendEur}</p>
                <p className="text-xs text-red-300/80">for games with 0h playtime</p>
              </div>
              <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-300">Life Burned</p>
                <p className="text-3xl font-extrabold text-amber-200">{facts.lifeYearsAt8h}y</p>
                <p className="text-xs text-amber-300/80">assuming 8h/day gaming</p>
              </div>
              <div className="rounded-xl border border-blue-700/60 bg-blue-950/30 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-300">Shame Score</p>
                <p className="text-3xl font-extrabold text-blue-200">{facts.shameScore}/100</p>
                <p className="text-xs text-blue-300/80">statistically concerning</p>
              </div>
            </div>
          )}

          <span>{displayed}</span>

          {facts && (
            <div className="mt-6 flex flex-wrap items-center gap-3 not-italic font-sans whitespace-normal">
              <button
                onClick={() => copyShareText("Copied")}
                className="px-4 py-2 rounded-lg bg-[#1b2838] hover:bg-[#223a56] text-[#d8ecff] border border-[#36506f] text-sm font-semibold transition-colors"
              >
                {copied || "Copy Share Text"}
              </button>
              <button
                onClick={shareOnX}
                className="px-4 py-2 rounded-lg bg-black hover:bg-zinc-900 text-white border border-zinc-700 text-sm font-semibold transition-colors"
              >
                Share on X
              </button>
            </div>
          )}

          {hasFacts && (
            <p className="mt-6 pt-4 border-t border-[#2d3748] text-[#d7b472] text-base md:text-lg font-sans whitespace-normal">
              You could stop wasting time on Steam and buy me a{" "}
              <a
                href="https://paypal.me/sparky512"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-4 hover:text-[#f0cf8d] transition-colors"
              >
                coffee
              </a>{" "}
              instead.
            </p>
          )}
        </>
      )}
    </div>
  );
}
