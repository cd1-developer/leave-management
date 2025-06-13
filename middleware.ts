import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXT_SECRET = process.env.NEXTAUTH_SECRET!;
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: NEXT_SECRET });

  const currentPath = req.nextUrl.pathname;

  // If user is logged in and trying to access login page ("/"), redirect to "/Dashboard"
  if (token && currentPath === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // If user is NOT logged in and trying to access "/Dashboard" or any path starting with "/Organization", redirect to "/Login"
  if (!token && currentPath.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }
  return NextResponse.next();
}
