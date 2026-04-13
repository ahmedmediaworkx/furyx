import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserNav } from "@/components/app/user-nav";
import type { ReactNode } from "react";

export default async function AppLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background transition-colors">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/50 px-6 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-2xl font-black text-primary-foreground shadow-lg transition-transform group-hover:rotate-6">
              F
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight">FuryX</span>
          </Link>
          <div className="mx-2 hidden h-6 w-[2px] rounded-full bg-border/50 sm:block" />
          <p className="hidden text-sm font-bold text-muted-foreground sm:block">Kanban Workspace</p>
        </div>
        
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
