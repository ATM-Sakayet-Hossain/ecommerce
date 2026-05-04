import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect only /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("X-AS-Token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      // Verify JWT
      const { payload } = await jwtVerify(token, SECRET);
      // Optional: role-based check
      if (!["admin", "editor"].includes(payload.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Token is valid → continue
      return NextResponse.next();
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};