// This route is no longer used. Steam auth is handled by /api/auth/steam/login and /api/auth/steam/callback
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Use /api/auth/steam/login to sign in with Steam." });
}

export async function POST() {
  return NextResponse.json({ message: "Use /api/auth/steam/login to sign in with Steam." });
}
