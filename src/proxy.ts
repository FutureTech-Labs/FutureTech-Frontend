import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JwtPayload {
    id: string;
    role: "admin" | "cashier";
}

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const { payload } = await jwtVerify(token, SECRET) as { payload: JwtPayload };
        const path = req.nextUrl.pathname;

        // Admin routes
        if (path.startsWith("/admin")) {
            if (payload.role !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        // Cashier routes
        if (path.startsWith("/cashier")) {
            if (payload.role !== "cashier") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

    } catch (error) {
        console.error("JWT verify error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/cashier/:path*"],
};
