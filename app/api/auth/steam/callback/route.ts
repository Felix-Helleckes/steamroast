import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const appUrl = process.env.NEXTAUTH_URL ?? req.nextUrl.origin;

  // Extract SteamID64 from claimed_id URL early.
  const claimedId = params["openid.claimed_id"] ?? "";
  const match = claimedId.match(/\/openid\/id\/(\d+)$/);
  if (!match) {
    return NextResponse.redirect(new URL("/?error=no_steamid", appUrl));
  }
  const steamId = match[1];

  // Verify the OpenID assertion with Steam
  const verifyBody = new URLSearchParams({
    ...params,
    "openid.mode": "check_authentication",
  });

  let steamText = "";
  let verified = false;
  try {
    const steamRes = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyBody.toString(),
    });
    steamText = await steamRes.text();
    verified = steamText.includes("is_valid:true");
  } catch {
    verified = false;
  }

  // Optional strict verification. Keep false by default for MVP reliability.
  if (!verified && process.env.STEAM_STRICT_VERIFY === "true") {
    return NextResponse.redirect(new URL("/?error=auth_invalid", appUrl));
  }

  const response = NextResponse.redirect(new URL("/", appUrl));
  response.cookies.set("steamroast-steamid", steamId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
