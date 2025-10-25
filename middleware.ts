import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
    id: string;
    role: "admin" | "cashier";
    iat: number;
    exp: number;
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;

        if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (
            req.nextUrl.pathname.startsWith("/cashier") &&
            decoded.role !== "cashier" &&
            decoded.role !== "admin"
        ) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
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
