import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Swords, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTRIBUTES, DEF_TACTICS, DIVISIONS, OFF_TACTICS, OPPONENTS, cardById, divisionFor, type DefTactic, type OffTactic, type Opponent } from "@/lib/data";
import { useStore } from "@/lib/store";
import { MAX_LINEUP, simulateDuel, withCards } from "@/lib/game-logic";
import { Avatar, CardTile, DemoTag, SectionTitle } from "@/components/tfg/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/duel")({
  head: () => seo("The Duel", "Short tactical head-to-head basketball Duels using your avatar, three player cards and tactics."),
  component: Duel,
});

type Phase = "lobby" | "setup" | "match";

function Duel() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [opp, setOpp] = useState<Opponent>(OPPONENTS[0]);
  const [mode, setMode] = useState<"Ranked" | "Friend">("Ranked");
  const [off, setOff] = useState<OffTactic>("balanced");
  const [def, setDef] = useState<DefTactic>("balanced");
  if (phase === "setup") return <Setup opp={opp} mode={mode} off={off} def={def} setOff={setOff} setDef={setDef} back={() => setPhase("lobby")} go={() => setPhase("match")} />;
  if (phase === "match") return <Match opp={opp} off={off} def={def} done={() => setPhase("lobby")} again={() => setPhase("setup")} />;
  return <Lobby start={(o, m) => { setOpp(o); setMode(m); setPhase("setup"); }} />;
}

function Lobby({ start }: { start: (o: Opponent, m: "Ranked" | "Friend") => void }) {
  const { s } = useStore();
  const div = divisionFor(s.rating);
  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden bg-gradient-hero p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-primary">Current division</div>
            <h1 className="text-5xl">{div}</h1>
            <p className="text-sm text-muted-foreground">{s.rating} rating · 5 possessions per side · 3 card slots for every player</p>
            <div className="mt-4 flex gap-1">
              {DIVISIONS.map((d) => <div key={d.name} className={cn("h-1.5 flex-1 rounded-full", s.rating >= d.min ? "bg-gradient-gold" : "bg-surface-3")} title={d.name} />)}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">{DIVISIONS.map((d) => <span key={d.name}>{d.name}</span>)}</div>
          </div>
          <div className="flex flex-col gap-2 md:w-64">
            <Button variant="gold" size="lg" className="h-14 text-xl" onClick={() => start(OPPONENTS[0], "Ranked")}><Swords /> Play Ranked</Button>
            <Button variant="surface" onClick={() => start(OPPONENTS[1], "Friend")}><Users /> Challenge a Friend</Button>
          </div>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle title="Recent results" />
          <div className="panel divide-y divide-border">
            {s.duels.slice(0, 6).map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className={cn("w-6 font-display text-lg", d.won ? "text-success" : "text-destructive")}>{d.won ? "W" : "L"}</span>
                <span className="flex-1">vs {d.opponent}</span>
                <span className="tabular-nums">{d.you}–{d.opp}</span>
                <span className={cn("w-10 text-right text-xs", d.delta > 0 ? "text-success" : "text-destructive")}>{d.delta > 0 ? "+" : ""}{d.delta}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5 text-sm">
          <h3 className="mb-2 text-xl">Fair play</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Every ranked player uses the same 3 card slots.</li>
            <li>Progression never adds slots; purchases never guarantee wins.</li>
            <li>Tactics counter each other — smart choices beat raw ratings.</li>
            <li>Rewards apply to your first 5 Duels per day.</li>
          </ul>
          <DemoTag className="mt-3">Simulated in-browser · production uses a server-validated engine</DemoTag>
        </div>
      </section>
    </div>
  );
}

function Setup({ opp, mode, off, def, setOff, setDef, back, go }: { opp: Opponent; mode: string; off: OffTactic; def: DefTactic; setOff: (t: OffTactic) => void; setDef: (t: DefTactic) => void; back: () => void; go: () => void }) {
  const { s, toggleLineup } = useStore();
  const step = s.lineup.length < MAX_LINEUP ? 2 : 3;
  return (
    <div className="space-y-6">
      <button onClick={back} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Lobby</button>
      <div className="panel flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3"><Avatar name={s.username} appearance={s.appearance} size={52} /><div><div className="font-semibold">{s.username}</div><div className="text-xs text-muted-foreground">{s.rating} · {divisionFor(s.rating)}</div></div></div>
        <div className="text-center"><div className="font-display text-3xl text-primary">VS</div><div className="text-[10px] uppercase text-muted-foreground">{mode}</div></div>
        <div className="flex items-center gap-3 text-right"><div><div className="font-semibold">{opp.name}</div><div className="text-xs text-muted-foreground">{opp.rating} · sample opponent</div></div><div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-crimson font-display text-xl">{opp.initials}</div></div>
      </div>

      <section>
        <SectionTitle title={`1 · Avatar  ·  2 · Cards (${s.lineup.length}/3)`} sub="Your avatar is locked in. Pick up to three collected cards." />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {s.owned.map((id) => <CardTile key={id} size="sm" card={cardById(id)} selected={s.lineup.includes(id)} onClick={() => toggleLineup(id)} />)}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle title="3 · Offense" />
          <div className="space-y-2">{OFF_TACTICS.map((t) => <Tactic key={t.id} active={off === t.id} name={t.name} desc={t.desc} onClick={() => setOff(t.id)} />)}</div>
        </div>
        <div>
          <SectionTitle title="4 · Defense" />
          <div className="space-y-2">{DEF_TACTICS.map((t) => <Tactic key={t.id} active={def === t.id} name={t.name} desc={t.desc} onClick={() => setDef(t.id)} />)}</div>
        </div>
      </section>

      <div className="sticky bottom-20 z-10 lg:bottom-4">
        <Button variant="gold" size="lg" className="h-14 w-full text-xl" disabled={s.lineup.length === 0} onClick={() => { if (step === 2) toast(`Playing with ${s.lineup.length} card(s) — you can use up to 3.`); go(); }}>
          5 · Confirm Lineup & Tip Off
        </Button>
      </div>
    </div>
  );
}

function Tactic({ active, name, desc, onClick }: { active: boolean; name: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex w-full items-start gap-3 rounded-xl border p-3 text-left transition", active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40")}>
      <span className={cn("mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{active && <Check className="h-3 w-3" />}</span>
      <span><span className="block font-semibold">{name}</span><span className="text-xs text-muted-foreground">{desc}</span></span>
    </button>
  );
}

function Match({ opp, off, def, done, again }: { opp: Opponent; off: OffTactic; def: DefTactic; done: () => void; again: () => void }) {
  const { s, recordDuel } = useStore();
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const result = useMemo(() => simulateDuel({ attrs: withCards(s.attrs, s.lineup), off, def }, { attrs: withCards(opp.attrs, opp.cards), off: opp.off, def: opp.def }, seed), // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]);
  const [shown, setShown] = useState(0);
  const [outcome, setOutcome] = useState<ReturnType<typeof recordDuel> | null>(null);
  const total = result.possessions.length;

  useEffect(() => {
    if (shown >= total) return;
    const t = setTimeout(() => setShown((n) => n + 1), 900);
    return () => clearTimeout(t);
  }, [shown, total]);
  useEffect(() => {
    if (shown === total && !outcome) setOutcome(recordDuel(opp.name, result.yourScore, result.oppScore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const vis = result.possessions.slice(0, shown);
  const ys = vis.filter((p) => p.side === "you").reduce((a, p) => a + p.pts, 0);
  const os = vis.filter((p) => p.side === "opp").reduce((a, p) => a + p.pts, 0);
  const finished = shown === total;
  const yourMade = result.possessions.filter((p) => p.side === "you" && p.made).length;
  const yourTotal = result.possessions.filter((p) => p.side === "you").length;
  const counters = result.possessions.filter((p) => p.side === "you" && p.why.includes("exploited")).length;
  const countered = result.possessions.filter((p) => p.side === "you" && p.why.includes("countered")).length;
  const weakest = [...ATTRIBUTES].sort((a, b) => s.attrs[a.key] - s.attrs[b.key])[0];

  return (
    <div className="space-y-6">
      <div className="panel sticky top-20 z-10 bg-gradient-hero p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-3"><Avatar name={s.username} appearance={s.appearance} size={48} /><span className="hidden font-semibold sm:block">{s.username}</span></div>
          <div className="text-center"><div className="font-display text-6xl tabular-nums">{ys}<span className="mx-3 text-muted-foreground">:</span>{os}</div><div className="text-xs text-muted-foreground">{finished ? "FINAL" : `Possession ${Math.min(shown + 1, total)} of ${total}`} · <span className="text-primary">Simulated</span></div></div>
          <div className="flex items-center justify-end gap-3"><span className="hidden font-semibold sm:block">{opp.name}</span><div className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson font-display text-lg">{opp.initials}</div></div>
        </div>
        <div className="mt-3 flex justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">{s.lineup.map((id) => cardById(id).name).join(" · ")}</span>
          <span className="truncate text-right">{opp.cards.map((id) => cardById(id).name).join(" · ")}</span>
        </div>
      </div>

      <div className="space-y-2">
        {vis.map((p, i) => (
          <div key={i} className={cn("animate-slide-up flex items-center gap-3 rounded-xl border p-3", p.side === "you" ? "border-primary/30 bg-primary/5" : "border-crimson/30 bg-crimson/5 sm:ml-12")}>
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-lg", p.made ? "bg-success/20 text-success" : "bg-surface-3 text-muted-foreground")}>{p.made ? `+${p.pts}` : "0"}</span>
            <div className="min-w-0"><div className="text-sm font-semibold">{p.side === "you" ? "You" : opp.name}: {p.text}</div><div className="text-xs text-muted-foreground">Why: {p.why}</div></div>
          </div>
        ))}
        {!finished && <Button variant="ghost" size="sm" onClick={() => setShown(total)}>Skip to result</Button>}
      </div>

      {finished && outcome && (
        <div className="panel animate-pop-in space-y-4 p-6">
          <div className="flex items-center gap-3"><Trophy className={cn("h-8 w-8", outcome.won ? "text-primary" : "text-muted-foreground")} /><h2 className="text-4xl">{outcome.won ? "Victory" : "Defeat"} {result.yourScore}–{result.oppScore}</h2></div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-surface-2 p-3"><div className={cn("font-display text-3xl", outcome.delta > 0 ? "text-success" : "text-destructive")}>{outcome.delta > 0 ? "+" : ""}{outcome.delta}</div><div className="text-xs text-muted-foreground">Rating → {s.rating}</div></div>
            <div className="rounded-lg bg-surface-2 p-3"><div className="font-display text-3xl text-primary">+{outcome.xp}</div><div className="text-xs text-muted-foreground">XP</div></div>
            <div className="rounded-lg bg-surface-2 p-3"><div className="font-display text-3xl text-primary">+{outcome.credits}</div><div className="text-xs text-muted-foreground">Credits</div></div>
          </div>
          {!outcome.rewarded && <p className="text-xs text-muted-foreground">Daily Duel reward cap reached — rating still updates.</p>}
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Tactical strength</div>{counters > 0 ? `Your ${OFF_TACTICS.find((t) => t.id === off)!.name} beat their defense on ${counters} possession(s).` : `Shot ${yourMade}/${yourTotal} through even matchups.`}</div>
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Notable possession</div>{result.possessions.find((p) => p.side === "you" && p.made)?.text ?? "No made shots — tough night."}</div>
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Improve</div>{countered > 0 ? `They countered you ${countered}×. Try a different offensive tactic.` : `Train ${weakest.label} (${s.attrs[weakest.key]}).`}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="gold" onClick={again}>Play again</Button>
            <Button variant="surface" onClick={done}>Back to lobby</Button>
            <Button variant="ghost" asChild><Link to="/rewards">Claim mission rewards</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
