import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Lock, Radio, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CHALLENGES, SPONSOR, cardById, gameById, teamById, type Challenge, type Game } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DemoTag, TeamDot } from "./ui";

export function useGameView(g: Game) {
  const { s } = useStore();
  const final = s.finalized.includes(g.id);
  const status = final ? "Final" : g.status;
  const home = final ? g.finalHome : g.homeScore;
  const away = final ? g.finalAway : g.awayScore;
  return { status, home, away, final };
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
      status === "Live Demo" ? "bg-crimson/20 text-crimson" : status === "Final" ? "bg-surface-3 text-muted-foreground" : "bg-rare/15 text-rare")}>
      {status === "Live Demo" && <Radio className="h-3 w-3 animate-pulse" />}{status}
    </span>
  );
}

export function GameCard({ game, onOpen, big }: { game: Game; onOpen: () => void; big?: boolean }) {
  const v = useGameView(game);
  const h = teamById(game.homeId), a = teamById(game.awayId);
  return (
    <div className={cn("panel overflow-hidden", big && "bg-gradient-hero")}>
      <div className="flex items-center justify-between px-4 pt-4">
        <StatusPill status={v.status} />
        <DemoTag />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">
        <div className="flex flex-col items-center gap-2 text-center"><TeamDot id={h.id} className={big ? "h-14 w-14 text-lg" : ""} /><span className="text-sm font-semibold">{h.name}</span></div>
        <div className="text-center">
          {v.home !== undefined ? (
            <div className={cn("font-display tabular-nums", big ? "text-5xl" : "text-3xl")}>{v.home}<span className="mx-2 text-muted-foreground">–</span>{v.away}</div>
          ) : (
            <div className="font-display text-2xl text-muted-foreground">VS</div>
          )}
          <div className="text-xs text-muted-foreground">{v.status === "Live Demo" ? game.quarter + " (simulated)" : game.tipoff}</div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center"><TeamDot id={a.id} className={big ? "h-14 w-14 text-lg" : ""} /><span className="text-sm font-semibold">{a.name}</span></div>
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <Button variant="surface" className="flex-1" onClick={onOpen}>Game details</Button>
        <Button variant="gold" className="flex-1" onClick={onOpen}>IQ challenges</Button>
      </div>
    </div>
  );
}

export function ChallengeCard({ ch }: { ch: Challenge }) {
  const { s, submitPrediction } = useStore();
  const g = gameById(ch.gameId);
  const final = s.finalized.includes(g.id);
  const pick = s.predictions[ch.id];
  const correct = final && pick === ch.answer;
  const locked = final && !pick;
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{ch.type} · {ch.points} pts</span>
        <span className="text-[10px] uppercase text-muted-foreground">{ch.period}</span>
        {ch.sponsored && <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground">presented by {SPONSOR.name} · Illustrative Demo Placement</span>}
      </div>
      <p className="mb-3 font-semibold">{ch.question}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {ch.options.map((o) => {
          const chosen = pick === o.id;
          const isAns = final && o.id === ch.answer;
          return (
            <button key={o.id} disabled={!!pick || final} onClick={() => submitPrediction(ch.id, o.id)}
              className={cn("rounded-lg border px-3 py-2 text-sm transition enabled:hover:border-primary",
                chosen ? "border-primary bg-primary/10" : "border-border bg-card", isAns && "border-success text-success", "disabled:cursor-default")}>
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {!final && !pick && <><Clock className="h-3.5 w-3.5" /> {ch.lock} · one answer per challenge</>}
        {!final && pick && <><Lock className="h-3.5 w-3.5 text-primary" /> Locked · pending demo settlement</>}
        {final && pick && (correct
          ? <span className="flex items-center gap-1.5 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Correct · +{ch.points} IQ pts</span>
          : <span className="flex items-center gap-1.5 text-destructive"><XCircle className="h-3.5 w-3.5" /> Incorrect · 0 pts</span>)}
        {locked && <><Lock className="h-3.5 w-3.5" /> Closed · game is final</>}
      </div>
    </div>
  );
}

export function GameDialog({ gameId, onClose }: { gameId: string | null; onClose: () => void }) {
  const { s, finalizeGame } = useStore();
  if (!gameId) return null;
  const g = gameById(gameId);
  return <GameDialogInner g={g} onClose={onClose} final={s.finalized.includes(g.id)} finalize={() => finalizeGame(g.id)} />;
}

function GameDialogInner({ g, onClose, final, finalize }: { g: Game; onClose: () => void; final: boolean; finalize: () => void }) {
  const v = useGameView(g);
  const chs = CHALLENGES.filter((c) => c.gameId === g.id);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogTitle className="font-display text-3xl">{teamById(g.homeId).name} vs {teamById(g.awayId).name}</DialogTitle>
        <DialogDescription className="flex flex-wrap items-center gap-2"><StatusPill status={v.status} /> {g.venue} · <DemoTag>Sample data — not live or official</DemoTag></DialogDescription>
        {v.home !== undefined && <div className="text-center font-display text-5xl tabular-nums">{v.home} – {v.away}</div>}
        <div>
          <h3 className="mb-2 text-lg">Player stats {v.status === "Upcoming" && <span className="text-sm text-muted-foreground">(available after tip-off)</span>}</h3>
          <div className="overflow-hidden rounded-lg border border-border text-sm">
            <div className="grid grid-cols-[1fr_repeat(3,3rem)] bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground"><span>Player</span><span className="text-right">PTS</span><span className="text-right">REB</span><span className="text-right">AST</span></div>
            {g.stats.map((r) => {
              const c = cardById(r.player);
              return (
                <div key={r.player} className="grid grid-cols-[1fr_repeat(3,3rem)] border-t border-border px-3 py-1.5">
                  <span className="truncate">{c.name} <span className="text-xs text-muted-foreground">{teamById(c.teamId).short}</span></span>
                  {[r.pts, r.reb, r.ast].map((n, i) => <span key={i} className="text-right tabular-nums">{v.status === "Upcoming" ? "–" : n}</span>)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg">Basketball IQ challenges</h3>
          {chs.length ? chs.map((c) => <ChallengeCard key={c.id} ch={c} />) : <p className="text-sm text-muted-foreground">This game is final. New challenges open before each tip-off.</p>}
        </div>
        {!final && (
          <div className="rounded-lg border border-dashed border-primary/40 p-3">
            <p className="mb-2 text-xs text-muted-foreground"><span className="font-semibold text-primary">Demo admin control.</span> Simulates the game ending and settles answers against the sample result. In production, settlement uses an authorized data provider, server-side.</p>
            <Button variant="outline" size="sm" onClick={finalize}>Finalize Demo Result</Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Basketball knowledge game — no wagering, odds, deposits or cash prizes. <Link to="/rewards" className="text-primary underline" onClick={onClose}>How rewards work</Link></p>
      </DialogContent>
    </Dialog>
  );
}
