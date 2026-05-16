import { NextRequest, NextResponse } from "next/server";

type SteamGame = {
  name: string;
  playtime_forever: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const steamId = searchParams.get("steamid");
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return NextResponse.json(
      { error: "Missing steamid or API key" },
      { status: 400 }
    );
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;

  const steamRes = await fetch(url, { cache: "no-store" });
  if (!steamRes.ok) {
    return NextResponse.json(
      { error: `Steam API error: ${steamRes.status}` },
      { status: 502 }
    );
  }

  const data = await steamRes.json();
  const games = (data?.response?.games ?? []) as SteamGame[];

  if (!games.length) {
    return NextResponse.json(
      { error: "Private profile or no games found." },
      { status: 404 }
    );
  }

  const sorted = [...games].sort((a, b) => b.playtime_forever - a.playtime_forever);
  const totalGames = games.length;
  const neverPlayedCount = games.filter((g) => g.playtime_forever === 0).length;
  const playedCount = totalGames - neverPlayedCount;
  const totalHours = Math.round(
    games.reduce((sum, g) => sum + g.playtime_forever, 0) / 60
  );
  const topGames = sorted.slice(0, 5).map((g) => g.name);

  const avgGamePriceEur = Number(process.env.DEFAULT_GAME_PRICE_EUR ?? "20");
  const totalEstimatedCostEur = Math.round(totalGames * avgGamePriceEur);
  const estimatedUnplayedSpendEur = Math.round(neverPlayedCount * avgGamePriceEur);
  const completionPct = totalGames > 0 ? Math.round((playedCount / totalGames) * 100) : 0;

  const topOneHours = Math.round((sorted[0]?.playtime_forever ?? 0) / 60);
  const topOneSharePct = totalHours > 0 ? Math.round((topOneHours / totalHours) * 100) : 0;
  const hoursPerGame = totalGames > 0 ? Number((totalHours / totalGames).toFixed(1)) : 0;

  const fullTimeJobYears = Number((totalHours / 2080).toFixed(2));
  const lifeYearsAt8h = Number((totalHours / (8 * 365)).toFixed(2));
  const weekendDays = Math.round(totalHours / 24);

  // Deterministic roasty index: heavy backlog + low completion + high hours = higher score.
  const shameScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        neverPlayedCount * 0.9 + (100 - completionPct) * 0.5 + Math.min(totalHours / 40, 35)
      )
    )
  );

  return NextResponse.json({
    totalGames,
    neverPlayedCount,
    playedCount,
    totalHours,
    topGames,
    completionPct,
    totalEstimatedCostEur,
    estimatedUnplayedSpendEur,
    topOneHours,
    topOneSharePct,
    hoursPerGame,
    fullTimeJobYears,
    lifeYearsAt8h,
    weekendDays,
    shameScore,
    avgGamePriceEur,
  });
}
