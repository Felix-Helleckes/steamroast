import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const steamId = searchParams.get("steamid");
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return NextResponse.json({ error: "Missing steamid or API key" }, { status: 400 });
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.response || !data.response.games) {
    return NextResponse.json({ error: "Private profile or no games found." }, { status: 404 });
  }

  // Sort games by playtime_forever descending
  const sorted = data.response.games.sort((a, b) => b.playtime_forever - a.playtime_forever);
  const topGames = sorted.slice(0, 10).map(game => ({
    name: game.name,
    hours: Math.round(game.playtime_forever / 60),
  }));
  const totalHours = Math.round(sorted.reduce((sum, g) => sum + g.playtime_forever, 0) / 60);

  return NextResponse.json({ games: topGames, totalHours });
}
