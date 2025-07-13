import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import LogoutButton from "@/components/LogoutButton";
import { getVerificationSecrets } from "@/lib/secret";

export default async function Dashboard() {
  const token = (await cookies()).get("authToken")?.value;
  if (!token) redirect("/login");

  const secrets = getVerificationSecrets();

  let payload;
  for (const s of secrets) {
    try {
      payload = jwt.verify(token, s) as {
        sub: string;
        iat: number;
        exp: number;
      };
      break;
    } catch {}
  }
  if (!payload) redirect("/login");

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Protected Dashboard</h1>

      {/* decoded payload */}
      <pre className="bg-slate-100 text-sm p-4 rounded mb-4 overflow-x-auto">{JSON.stringify(payload, null, 2)}</pre>

      <p className="mb-2">
        Logged-in user: <span className="font-semibold">{payload.sub}</span>
      </p>
      <p className="mb-2">Issued at: {new Date(payload.iat * 1000).toLocaleString()}</p>
      <p className="mb-4">Expires at: {new Date(payload.exp * 1000).toLocaleString()}</p>

      <LogoutButton />
    </main>
  );
}
