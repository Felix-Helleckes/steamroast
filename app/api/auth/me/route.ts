import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const steamId = req.cookies.get("steamroast-steamid")?.value ?? null;
  if (!steamId) {
    return NextResponse.json(
      { steamId: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  return NextResponse.json(
    { steamId },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
