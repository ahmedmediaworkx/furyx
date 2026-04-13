"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOut, Moon, Sun, Palette, ChevronDown } from "lucide-react";

export function UserNav() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const changeBrandColor = (hue: string) => {
    document.documentElement.style.setProperty("--brand-hue", hue);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-3 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            U
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[240px] overflow-hidden rounded-2xl border border-white/20 bg-background/60 backdrop-blur-xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:zoom-out-95"
          align="end"
          sideOffset={12}
        >
          <div className="px-2 py-2.5">
            <p className="text-sm font-bold text-foreground">User Settings</p>
            <p className="text-xs text-muted-foreground">Manage your workspace</p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border/40" />

          {/* Theme Toggles */}
          <div className="px-2 py-2">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">Appearance</p>
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sun className="h-4 w-4 dark:hidden" />
                  <Moon className="h-4 w-4 hidden dark:block" />
                </div>
                <span className="dark:hidden">Dark Mode</span>
                <span className="hidden dark:block">Light Mode</span>
              </div>
            </button>
          </div>

          {/* Color Toggles */}
          <div className="px-2 pb-2">
            <p className="mb-3 mt-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">Accent Color</p>
            <div className="flex gap-2.5 px-1 justify-between">
              <button onClick={() => changeBrandColor("270")} className="h-6 w-6 rounded-full bg-[#8b5cf6] ring-2 ring-transparent ring-offset-2 ring-offset-transparent hover:ring-[#8b5cf6]/50 hover:scale-110 transition-all shadow-sm" title="Violet" />
              <button onClick={() => changeBrandColor("330")} className="h-6 w-6 rounded-full bg-[#ec4899] ring-2 ring-transparent ring-offset-2 ring-offset-transparent hover:ring-[#ec4899]/50 hover:scale-110 transition-all shadow-sm" title="Pink" />
              <button onClick={() => changeBrandColor("150")} className="h-6 w-6 rounded-full bg-[#10b981] ring-2 ring-transparent ring-offset-2 ring-offset-transparent hover:ring-[#10b981]/50 hover:scale-110 transition-all shadow-sm" title="Emerald" />
              <button onClick={() => changeBrandColor("45")} className="h-6 w-6 rounded-full bg-[#f59e0b] ring-2 ring-transparent ring-offset-2 ring-offset-transparent hover:ring-[#f59e0b]/50 hover:scale-110 transition-all shadow-sm" title="Amber" />
              <button onClick={() => changeBrandColor("220")} className="h-6 w-6 rounded-full bg-[#3b82f6] ring-2 ring-transparent ring-offset-2 ring-offset-transparent hover:ring-[#3b82f6]/50 hover:scale-110 transition-all shadow-sm" title="Blue" />
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border/40" />

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition-all hover:bg-destructive/10 hover:scale-[1.02] active:scale-[0.98] mt-1 mb-1"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
