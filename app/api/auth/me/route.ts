import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("steamroast-session")?.value;
  if (!token) return NextResponse.json({ steamId: null });

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return NextResponse.json({ steamId: null });

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return NextResponse.json({ steamId: payload.steamId ?? null });
  } catch {
    return NextResponse.json({ steamId: null });
  }
}
