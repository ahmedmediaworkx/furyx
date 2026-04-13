"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Unable to create account");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] border border-border/50 bg-card p-10 shadow-2xl animate-scale-in" style={{ animationDelay: "100ms" }}>
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-3xl font-black text-primary-foreground shadow-lg transition-transform hover:rotate-6 hover:scale-110 duration-300">
            F
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Create Workspace</h2>
          <p className="text-muted-foreground">Get started with fast, visual planning.</p>
        </div>

        <form className="space-y-4 mt-8" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1" htmlFor="name">Name</label>
            <input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Alex Smith"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@team.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>
          
          {error ? <p className="text-sm font-bold text-destructive text-center">{error}</p> : null}
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-ripple mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none duration-200"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-6 animate-scale-in" style={{ animationDelay: '200ms' }}>
          Already have an account? <Link href="/login" className="font-bold text-primary cursor-pointer hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
