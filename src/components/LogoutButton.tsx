"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  return (
    <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}
