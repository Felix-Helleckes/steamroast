import { NextRequest, NextResponse } from "next/server";

type SteamPlayer = {
  personaname?: string;
  avatar?: string;
  avatarmedium?: string;
  avatarfull?: string;
};

export async function GET(req: NextRequest) {
  const steamId = req.cookies.get("steamroast-steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return NextResponse.json(
      { profile: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;

  try {
    const steamRes = await fetch(url, { cache: "no-store" });
    if (!steamRes.ok) {
      return NextResponse.json(
        { profile: null },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    const data = await steamRes.json();
    const player = (data?.response?.players?.[0] ?? null) as SteamPlayer | null;

    if (!player) {
      return NextResponse.json(
        { profile: null },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    return NextResponse.json(
      {
        profile: {
          username: player.personaname ?? "Steam User",
          avatar: player.avatarfull ?? player.avatarmedium ?? player.avatar ?? null,
        },
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch {
    return NextResponse.json(
      { profile: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}
