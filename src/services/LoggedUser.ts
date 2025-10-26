import api from "@/lib/api";
import { cookies } from "next/headers";

export const getLoggedInUser = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    if (!token) return null;

    try {
        const res = await api.get("/auth/me", {
            headers: { cookie: `token=${token}` },
        });
        return res.data.user;
    } catch (error) {
        console.error("Failed to fetch logged-in user:", error);
        return null;
    }
};
