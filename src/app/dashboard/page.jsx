import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  const role = session.user.role;
  redirect(
    role === "seller"
      ? "/dashboard/seller"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/buyer",
  );
}
