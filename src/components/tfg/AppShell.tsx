import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bell, Coins, Home, Layers, Swords, Target, User } from "lucide-react";
import logo from "@/assets/tfg-mark.asset.json";
import { useStore } from "@/lib/store";
import { levelFromXp } from "@/lib/game-logic";
import { Avatar } from "./ui";
import { CardRevealDialog } from "./CardReveal";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/duel", label: "Duel", icon: Swords },
  { to: "/cards", label: "Cards", icon: Layers },
  { to: "/basketball", label: "Basketball", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const TITLES: Record<string, string> = {
  "/": "Home", "/duel": "The Duel", "/cards": "The Collection", "/basketball": "Basketball IQ",
  "/profile": "Profile", "/career": "My Career", "/club-wars": "Club Wars", "/rewards": "Rewards & Missions", "/partners": "Partner Opportunities",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { s } = useStore();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const lvl = levelFromXp(s.xp);
  const unclaimed = s.pendingReveal ? 1 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <img src={logo.url} alt="The Floor Manager (TFG) logo" className="h-12 w-12 rounded-lg object-cover" />
          <div className="leading-tight">
            <div className="font-display text-2xl text-gradient-gold">TFG</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">The Floor Manager</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-primary">
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-sidebar-border pt-4 text-[11px] uppercase tracking-wider text-muted-foreground">More</div>
        <nav className="mt-2 flex flex-col gap-1 text-sm">
          {[{ to: "/career", l: "My Career" }, { to: "/club-wars", l: "Club Wars" }, { to: "/rewards", l: "Rewards" }, { to: "/partners", l: "Partners" }].map((n) => (
            <Link key={n.to} to={n.to} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-[status=active]:text-primary">{n.l}</Link>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Partner Demo</span> · prototype with sample data. Not affiliated with any federation or club.
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
            <Link to="/" className="lg:hidden"><img src={logo.url} alt="TFG" className="h-10 w-10 rounded-lg object-cover" /></Link>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-2xl leading-none">{TITLES[path] ?? "TFG"}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary">Partner Demo</div>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs sm:flex" title="Training Credits">
              <Coins className="h-3.5 w-3.5 text-primary" /> <span className="tabular-nums">{s.credits}</span>
            </div>
            <Link to="/rewards" className="relative rounded-full bg-surface-2 p-2" aria-label="Rewards and activity">
              <Bell className="h-4 w-4" />
              {(unclaimed > 0 || !s.claimed.includes("m-duel")) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-crimson" />}
            </Link>
            <Link to="/profile" className="flex items-center gap-2" aria-label="Profile">
              <Avatar name={s.username} appearance={s.appearance} size={36} />
              <span className="hidden text-xs leading-tight md:block">
                <span className="block font-semibold">{s.username}</span>
                <span className="text-muted-foreground">Lv {lvl.level}</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 lg:pb-12">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground data-[status=active]:text-primary">
            <n.icon className="h-5 w-5" /> {n.label}
          </Link>
        ))}
      </nav>
      <CardRevealDialog />
    </div>
  );
}
