import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface SessionPayload {
    id: string;
    role: "admin" | "cashier";
    iat: number;
    exp: number;
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET) as { payload: SessionPayload };
        return payload;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
};