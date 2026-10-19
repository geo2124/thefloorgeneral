import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Briefcase, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CLUB_STANDINGS, DEMO_USERS, cardById, divisionFor, teamById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { levelFromXp } from "@/lib/game-logic";
import { Avatar, CardTile, DemoTag, SectionTitle } from "@/components/tfg/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
  head: () => seo("Profile & Leaderboards", "Your TFG profile, match history, seasonal stats and leaderboards."),
  component: Profile,
});

type Board = "global" | "weekly" | "duel" | "iq" | "club";

function Profile() {
  const { s, reset } = useStore();
  const [board, setBoard] = useState<Board>("global");
  const lvl = levelFromXp(s.xp);
  const acc = s.iqSettled ? Math.round((s.iqCorrect / s.iqSettled) * 100) : 0;
  const wins = s.duels.filter((d) => d.won).length;
  const highlights = [...s.owned].map(cardById).sort((a, b) => ["Common", "Rare", "Epic", "Legendary"].indexOf(b.rarity) - ["Common", "Rare", "Epic", "Legendary"].indexOf(a.rarity)).slice(0, 4);
  const me = { name: s.username, rating: s.rating, iq: acc, xp: s.xp, club: s.club ?? "" };
  const users = [...DEMO_USERS, me];
  const rows =
    board === "club" ? CLUB_STANDINGS.map((c) => ({ name: teamById(c.clubId).name, v: c.weekly.toLocaleString() + " pts", me: c.clubId === s.club })).sort((a, b) => parseInt(b.v.replace(/\D/g, "")) - parseInt(a.v.replace(/\D/g, "")))
    : users.map((u) => ({ name: u.name, raw: board === "iq" ? u.iq : board === "duel" ? u.rating : board === "weekly" ? Math.round(u.xp / 9) : u.xp, me: u.name === s.username }))
        .sort((a, b) => b.raw - a.raw).map((u) => ({ name: u.name, v: board === "iq" ? `${u.raw}%` : board === "duel" ? `${u.raw}` : `${u.raw.toLocaleString()} XP`, me: u.me }));

  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden">
        <div className="h-24 bg-gradient-hero bg-court" />
        <div className="-mt-12 flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <Avatar name={s.username} appearance={s.appearance} size={100} />
          <div className="flex-1">
            <h1 className="text-4xl">{s.username}</h1>
            <p className="text-sm text-muted-foreground">Level {lvl.level} · {s.xp} XP · {s.rating} {divisionFor(s.rating)} · {s.club ? teamById(s.club).name : "No club selected"}</p>
          </div>
          <Button variant="surface" asChild><Link to="/career"><Settings /> Customize</Link></Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[["Duel rating", s.rating], ["Record", `${wins}-${s.duels.length - wins}`], ["IQ accuracy", `${acc}%`], ["Cards", s.owned.length], ["Trainings", s.trainingsDone]].map(([l, v]) => (
          <div key={l} className="panel p-4"><div className="text-xs text-muted-foreground">{l}</div><div className="font-display text-3xl">{v}</div></div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionTitle title="Collection highlights" action={<Link to="/cards" className="text-sm text-primary">Collection</Link>} />
          <div className="grid grid-cols-4 gap-2">{highlights.map((c) => <CardTile key={c.id} size="sm" card={c} />)}</div>
          <SectionTitle title="Achievements" />
          <div className="flex flex-wrap gap-2">
            {["Season Opener", "Cedar Loyalist", s.iqCorrect >= 10 ? "IQ Analyst" : null, wins >= 2 ? "Duel Closer" : null].filter(Boolean).map((a) => (
              <span key={a} className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs"><Award className="h-3 w-3 text-primary" />{a}</span>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Match history" action={<Link to="/duel" className="text-sm text-primary">Play</Link>} />
          <div className="panel divide-y divide-border">
            {s.duels.slice(0, 6).map((d) => <div key={d.id} className="flex justify-between px-4 py-2 text-sm"><span className={d.won ? "text-success" : "text-destructive"}>{d.won ? "W" : "L"} vs {d.opponent}</span><span className="tabular-nums text-muted-foreground">{d.you}–{d.opp}</span></div>)}
          </div>
        </section>
      </div>

      <section id="leaderboards">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-2xl leading-none">Leaderboards <DemoTag className="ml-1 align-middle">Sample users</DemoTag></h2>
          <Tabs value={board} onValueChange={(v) => setBoard(v as Board)}>
            <TabsList className="flex-wrap">
              {(["global", "weekly", "duel", "iq", "club"] as Board[]).map((b) => <TabsTrigger key={b} value={b} className="capitalize">{b === "iq" ? "IQ" : b === "club" ? "Club Wars" : b}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </div>
        <div className="panel divide-y divide-border">
          {rows.map((r, i) => <div key={r.name} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${r.me ? "bg-primary/10" : ""}`}><span className="w-6 font-display text-lg text-muted-foreground">{i + 1}</span><span className="flex-1">{r.name}{r.me && " (you)"}</span><span className="tabular-nums">{r.v}</span></div>)}
        </div>
      </section>

      <section className="panel p-5">
        <SectionTitle title="Settings" />
        <div className="flex flex-wrap gap-2">
          <Button variant="gold" asChild><Link to="/partners"><Briefcase /> Partner Opportunities</Link></Button>
          <Button variant="surface" asChild><Link to="/club-wars">Change club</Link></Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline"><RotateCcw /> Reset demo</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Reset demo state?</AlertDialogTitle>
              <AlertDialogDescription>Restores the initial presentation state: progress, cards, predictions and rewards.</AlertDialogDescription>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={reset}>Reset</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  );
}
