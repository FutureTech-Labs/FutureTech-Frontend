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
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const { payload } = (await jwtVerify(token, SECRET)) as { payload: JwtPayload };
        const path = req.nextUrl.pathname;

        // Get all admin-only routes from dashbord links
        const adminOnlyRoutes = dashboardLinks
            .flatMap((group) => group.links)
            .filter((link) => !link.roles.includes("cashier"))
            .map((link) => link.href);

        // Block cashier from admin-only pages
        if (payload.role === "cashier" && adminOnlyRoutes.some((route) => path.startsWith(route))) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

    } catch (err) {
        console.error("JWT verify error:", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};