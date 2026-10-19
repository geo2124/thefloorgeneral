import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CARDS, TEAMS, cardById, teamById, type Rarity } from "@/lib/data";
import { useStore } from "@/lib/store";
import { CardTile, DemoTag, RARITY_CLASS, SectionTitle, StatBar } from "@/components/tfg/ui";
import { MAX_LINEUP } from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cards")({
  head: () => seo("The Collection", "Collect demo Lebanese basketball player cards, complete team albums and build your Duel lineup."),
  component: Cards,
});

const RARITIES: (Rarity | "All")[] = ["All", "Common", "Rare", "Epic", "Legendary"];

function Cards() {
  const { s, toggleLineup } = useStore();
  const [q, setQ] = useState("");
  const [rar, setRar] = useState<Rarity | "All">("All");
  const [show, setShow] = useState<"all" | "owned">("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => CARDS.filter((c) => {
    const t = teamById(c.teamId).name.toLowerCase();
    return (rar === "All" || c.rarity === rar) && (show === "all" || s.owned.includes(c.id)) && (c.name.toLowerCase().includes(q.toLowerCase()) || t.includes(q.toLowerCase()));
  }), [q, rar, show, s.owned]);
  const pct = Math.round((s.owned.length / CARDS.length) * 100);
  const card = open ? cardById(open) : null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_2fr]">
        <div className="panel p-4"><div className="text-xs text-muted-foreground">Collected</div><div className="font-display text-3xl">{s.owned.length}<span className="text-muted-foreground">/{CARDS.length}</span></div></div>
        <div className="panel p-4"><div className="text-xs text-muted-foreground">Completion</div><div className="font-display text-3xl text-primary">{pct}%</div></div>
        <div className="panel col-span-2 p-4 md:col-span-1">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span>Active Duel lineup ({s.lineup.length}/{MAX_LINEUP})</span><Link to="/duel" className="text-primary">Go to Duel →</Link></div>
          <div className="flex gap-2">
            {Array.from({ length: MAX_LINEUP }).map((_, i) => {
              const id = s.lineup[i];
              return <button key={i} onClick={() => id && setOpen(id)} className={cn("flex-1 truncate rounded-lg border px-2 py-2 text-xs", id ? "border-primary/50 bg-primary/10" : "border-dashed border-border text-muted-foreground")}>{id ? cardById(id).name : "Empty slot"}</button>;
            })}
          </div>
        </div>
      </div>

      <section>
        <SectionTitle title="Team albums" sub="Season 2026 · demo identities" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {TEAMS.map((t) => {
            const all = CARDS.filter((c) => c.teamId === t.id);
            const have = all.filter((c) => s.owned.includes(c.id)).length;
            return (
              <button key={t.id} onClick={() => setQ(t.name)} className="panel p-3 text-left hover:border-primary/50">
                <div className="h-1.5 w-8 rounded-full" style={{ background: t.color }} />
                <div className="mt-2 text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{have}/{all.length} {have === all.length && "· Complete"}</div>
              </button>
            );
          })}
        </div>
      </section>

      {s.recentCards.length > 0 && (
        <section>
          <SectionTitle title="Recently earned" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{s.recentCards.map((id) => <CardTile key={id} size="sm" card={cardById(id)} onClick={() => setOpen(id)} />)}</div>
        </section>
      )}

      <section>
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="flex-1 text-2xl leading-none">All cards</h2>
          <div className="relative md:w-64"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search player or team" className="pl-8" /></div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {RARITIES.map((r) => <button key={r} onClick={() => setRar(r)} className={cn("rounded-full border px-3 py-1 text-xs", rar === r ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>{r}</button>)}
          <span className="mx-1 w-px bg-border" />
          {(["all", "owned"] as const).map((v) => <button key={v} onClick={() => setShow(v)} className={cn("rounded-full border px-3 py-1 text-xs", show === v ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>{v === "all" ? "All cards" : "Collected"}</button>)}
        </div>
        {list.length === 0 ? <div className="panel p-8 text-center text-sm text-muted-foreground">No cards match. <button className="text-primary" onClick={() => { setQ(""); setRar("All"); setShow("all"); }}>Clear filters</button></div> : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.map((c) => <CardTile key={c.id} card={c} owned={s.owned.includes(c.id)} selected={s.lineup.includes(c.id)} onClick={() => setOpen(c.id)} />)}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">Rarity reflects collection scarcity, not real-world player ability. Player names and portraits are demo placeholders. No marketplace, trading or cash value.</p>
      </section>

      <section className="panel p-5">
        <SectionTitle title="Collection milestones" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[[10, "Starter Album badge"], [13, "Rare card reveal"], [16, "Season Completionist frame"]].map(([n, r]) => (
            <div key={n} className={cn("rounded-lg border p-3 text-sm", s.owned.length >= (n as number) ? "border-success/50" : "border-border")}>
              <div className="font-semibold">{n} cards</div><div className="text-xs text-muted-foreground">{r} {s.owned.length >= (n as number) ? "· Reached" : ""}</div>
            </div>
          ))}
        </div>
      </section>

      {card && (
        <Dialog open onOpenChange={(o) => !o && setOpen(null)}>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <DialogTitle className="font-display text-3xl">{card.name}</DialogTitle>
            <DialogDescription>{teamById(card.teamId).name} · {card.position} · Season {card.season} · <DemoTag>Demo identity</DemoTag></DialogDescription>
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
              <CardTile card={card} owned={s.owned.includes(card.id)} />
              <div className="space-y-3">
                <span className={cn("inline-block rounded border px-2 py-0.5 text-xs font-bold", RARITY_CLASS[card.rarity])}>{card.rarity}</span>
                <div><div className="text-xs text-muted-foreground">Gameplay ability</div><p className="text-sm font-semibold">{card.ability}</p></div>
                {Object.entries(card.boost).map(([k, v]) => <StatBar key={k} label={`${k[0]!.toUpperCase() + k.slice(1)} boost`} value={v!} max={10} accent />)}
                <p className="text-xs text-muted-foreground">{s.owned.includes(card.id) ? "In your collection" : "Not yet collected — earn through missions and milestones"}</p>
              </div>
            </div>
            {s.owned.includes(card.id) && (
              <Button variant={s.lineup.includes(card.id) ? "surface" : "gold"} onClick={() => toggleLineup(card.id)}>
                {s.lineup.includes(card.id) ? "Remove from Active Lineup" : s.lineup.length >= MAX_LINEUP ? "Lineup full (3/3)" : "Add to Active Lineup"}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
