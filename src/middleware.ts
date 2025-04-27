import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered", request.url);

  if (request.method === "POST") {
    return NextResponse.next();
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decodeToken = decodeJwt(token ?? "");
  if (!decodeToken.admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/admin",
    "/dashboard",
    "/profile/:path*",
    "/profile",
  ],
};
