import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

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
        const payload = jwt.verify(token, SECRET) as SessionPayload;
        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}
