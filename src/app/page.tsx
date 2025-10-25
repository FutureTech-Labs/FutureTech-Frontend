import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  // ✅ Redirect to login if no token found
  if (!session) {
    redirect("/login");
  }

  // ✅ Redirect user based on role
  if (session.role === "admin") {
    redirect("/admin/dashboard");
  } else if (session.role === "cashier") {
    redirect("/cashier/dashboard");
  }

  // (optional fallback UI)
  return (
    <div className="h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
