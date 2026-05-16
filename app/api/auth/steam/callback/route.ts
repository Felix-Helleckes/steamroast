import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  // Verify the OpenID assertion with Steam
  const verifyBody = new URLSearchParams({
    ...params,
    "openid.mode": "check_authentication",
  });

  let steamText: string;
  try {
    const steamRes = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyBody.toString(),
    });
    steamText = await steamRes.text();
  } catch {
    return NextResponse.redirect(new URL("/?error=steam_unreachable", req.url));
  }

  if (!steamText.includes("is_valid:true")) {
    return NextResponse.redirect(new URL("/?error=auth_invalid", req.url));
  }

  // Extract SteamID64 from claimed_id URL
  const claimedId = params["openid.claimed_id"] ?? "";
  const match = claimedId.match(/\/openid\/id\/(\d+)$/);
  if (!match) {
    return NextResponse.redirect(new URL("/?error=no_steamid", req.url));
  }
  const steamId = match[1];

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/?error=no_secret", req.url));
  }

  const token = await new SignJWT({ steamId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));

  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("steamroast-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
