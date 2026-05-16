import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("steamroast-session")?.value;
  if (!token) {
    return NextResponse.json(
      { steamId: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { steamId: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return NextResponse.json(
      { steamId: payload.steamId ?? null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch {
    return NextResponse.json(
      { steamId: null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}
