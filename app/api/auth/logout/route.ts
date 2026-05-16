import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    process.env.NEXTAUTH_URL ?? "/"
  );
  response.cookies.set("steamroast-session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
