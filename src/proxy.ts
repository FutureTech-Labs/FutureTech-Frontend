import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dashboardLinks } from "@/lib/dashboardLinks";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JwtPayload {
    id: string;
    role: "admin" | "cashier";
}

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // No token = redirect to login
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const { payload } = (await jwtVerify(token, SECRET)) as { payload: JwtPayload };
        const userRole = payload.role;

        // Flatten dashboard links for all role-based routes
        const allLinks = dashboardLinks.flatMap((group) => group.links);

        // Determine allowed routes for this user's role
        const allowedRoutes = allLinks
            .filter((link) => link.roles.includes(userRole))
            .map((link) => link.href);

        // Determine restricted routes for this user's role
        const restrictedRoutes = allLinks
            .filter((link) => !link.roles.includes(userRole))
            .map((link) => link.href);

        // Block access to restricted routes
        if (restrictedRoutes.some((route) => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Allow if route matches allowed routes or subpaths
        if (allowedRoutes.some((route) => pathname.startsWith(route))) {
            return NextResponse.next();
        }

    } catch (err) {
        console.error("JWT verify error:", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Default: Allow dashboard home
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/unauthorized"],
};
