import { getSession } from "./session";

export async function getServerRole() {
    const session = await getSession();
    return (session?.role ?? null) as "admin" | "cashier" | null;
}