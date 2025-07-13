"use client";
import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ← stop page reload
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = "/dashboard"; // hard-navigate so cookie is sent
    } else {
      alert("Wrong password");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-xs m-auto mt-20">
      <h1 className="text-2xl font-bold">Login</h1>
      <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className="border p-2" required />
      <button disabled={loading} className="bg-blue-600 text-white p-2 rounded">
        {loading ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
