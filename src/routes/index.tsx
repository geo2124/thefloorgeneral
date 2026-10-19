import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Check, ChevronRight, Dumbbell, Layers, Shield, Swords, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, DemoTag, SectionTitle } from "@/components/tfg/ui";
import { GameCard, GameDialog } from "@/components/tfg/Games";
import { CARDS, DEMO_USERS, GAMES, TRAINING, divisionFor } from "@/lib/data";
import { MISSIONS, useStore } from "@/lib/store";
import { levelFromXp } from "@/lib/game-logic";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Home", "Follow Lebanese basketball, train your avatar, collect cards and win tactical Duels."),
  component: Home,
});

function Home() {
  const { s, claimMission, trainingRemaining } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const lvl = levelFromXp(s.xp);
  const featured = GAMES[0]!;
  const nextMission = MISSIONS.find((m) => !s.flags[m.flag]);
  const board = [...DEMO_USERS, { name: s.username, rating: s.rating, iq: 0, xp: s.xp, club: s.club ?? "" }].sort((a, b) => b.rating - a.rating);
  const myRank = board.findIndex((u) => u.name === s.username) + 1;
  const activeT = s.training && TRAINING.find((t) => t.id === s.training!.category);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="panel relative overflow-hidden bg-gradient-hero p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={s.username} appearance={s.appearance} size={84} />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Welcome back, General.</p>
            <h1 className="text-4xl sm:text-5xl">{s.username}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-primary">Level {lvl.level}</span>
              <span className="text-muted-foreground">·</span>
              <span>{divisionFor(s.rating)} · {s.rating} rating</span>
            </div>
            <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-surface-3"><div className="h-full bg-gradient-gold transition-all" style={{ width: `${lvl.pct}%` }} /></div>
            <p className="mt-1 text-xs text-muted-foreground">{lvl.into} / 500 XP to Level {lvl.level + 1}</p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-background/40 p-4 sm:w-64">
            <div className="text-[10px] uppercase tracking-widest text-primary">Next objective</div>
            <p className="mt-1 font-semibold">{nextMission ? nextMission.label : "All daily missions done — claim your rewards"}</p>
            <Button asChild variant="gold" size="sm" className="mt-3 w-full"><Link to={nextMission?.to ?? "/rewards"}>Go</Link></Button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionTitle title="Featured game" sub="Lebanese basketball · sample schedule" action={<Link to="/basketball" className="text-sm text-primary">All games</Link>} />
          <GameCard game={featured} big onOpen={() => setOpen(featured.id)} />
        </section>

        <section>
          <SectionTitle title="Daily missions" action={<Link to="/rewards" className="text-sm text-primary">All</Link>} />
          <div className="space-y-2">
            {MISSIONS.map((m) => {
              const done = s.flags[m.flag];
              const claimed = s.claimed.includes(m.id);
              return (
                <div key={m.id} className="panel flex items-center gap-3 p-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-success/20 text-success" : "bg-surface-3 text-muted-foreground"}`}>{done ? <Check className="h-4 w-4" /> : <Target className="h-4 w-4" />}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">+{m.xp} XP · +{m.credits} credits</p>
                  </div>
                  {claimed ? <span className="text-xs text-muted-foreground">Claimed</span>
                    : done ? <Button size="sm" variant="gold" onClick={() => claimMission(m.id)}>Claim</Button>
                    : <Button size="sm" variant="surface" asChild><Link to={m.to}>Start</Link></Button>}
                </div>
              );
            })}
            <p className="px-1 text-xs text-muted-foreground">Claim all three to unlock a bonus card reveal.</p>
          </div>
        </section>
      </div>

      <section>
        <SectionTitle title="Quick actions" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { to: "/duel", label: "Play a Duel", icon: Swords },
            { to: "/basketball", label: "Basketball IQ", icon: Target },
            { to: "/cards", label: "Collection", icon: Layers },
            { to: "/club-wars", label: "Club Wars", icon: Shield },
          ].map((q) => (
            <Link key={q.to} to={q.to} className="panel group flex items-center gap-3 p-4 transition hover:border-primary/50">
              <q.icon className="h-6 w-6 text-primary" />
              <span className="font-display text-xl">{q.label}</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Continue your journey" />
        <div className="grid gap-3 md:grid-cols-3">
          <Link to="/career" className="panel p-4 hover:border-primary/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Dumbbell className="h-4 w-4 text-primary" /> Training</div>
            {activeT ? (
              <p className="mt-2 font-semibold">{activeT.name} in progress · <span className="tabular-nums text-primary">{trainingRemaining}s</span> <span className="text-xs text-muted-foreground">(demo-accelerated)</span></p>
            ) : <p className="mt-2 font-semibold">No active session — start one</p>}
          </Link>
          <Link to="/cards" className="panel p-4 hover:border-primary/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Layers className="h-4 w-4 text-primary" /> Collection</div>
            <p className="mt-2 font-semibold">{s.owned.length} / {CARDS.length} cards · {Math.round((s.owned.length / CARDS.length) * 100)}%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"><div className="h-full bg-primary" style={{ width: `${(s.owned.length / CARDS.length) * 100}%` }} /></div>
          </Link>
          <Link to="/rewards" className="panel p-4 hover:border-primary/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Award className="h-4 w-4 text-primary" /> Next reward milestone</div>
            <p className="mt-2 font-semibold">Level {lvl.level + 1} · {500 - lvl.into} XP away</p>
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <SectionTitle title="Duel leaderboard" action={<Link to="/profile" className="text-sm text-primary">View leaderboard</Link>} />
          <div className="panel divide-y divide-border">
            {board.slice(0, 5).map((u, i) => (
              <div key={u.name} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${u.name === s.username ? "bg-primary/10" : ""}`}>
                <span className="w-5 font-display text-lg text-muted-foreground">{i + 1}</span>
                <span className="flex-1 font-semibold">{u.name}</span>
                <span className="tabular-nums text-muted-foreground">{u.rating}</span>
              </div>
            ))}
            {myRank > 5 && <div className="px-4 py-2.5 text-sm text-primary">You · #{myRank} · {s.rating}</div>}
          </div>
          <DemoTag className="mt-2">Sample users</DemoTag>
        </div>
        <div>
          <SectionTitle title="Recent activity" />
          <div className="panel divide-y divide-border">
            {s.rewards.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm"><Trophy className="h-4 w-4 text-primary" /> {r.label}</div>
            ))}
          </div>
        </div>
      </section>
      <GameDialog gameId={open} onClose={() => setOpen(null)} />
    </div>
  );
}
