import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Coins, Gem, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MISSIONS, WEEKLY, useStore } from "@/lib/store";
import { DemoTag, SectionTitle } from "@/components/tfg/ui";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/rewards")({
  head: () => seo("Rewards & Missions", "Daily missions, weekly objectives and a balanced TFG progression economy."),
  component: Rewards,
});

function Rewards() {
  const { s, claimMission, claimWeekly } = useStore();
  return (
    <div className="space-y-8">
      <section className="grid gap-3 md:grid-cols-3">
        <Econ icon={Star} name="XP" value={s.xp} desc="Earned from gameplay and milestones. Raises your level. Not spendable." />
        <Econ icon={Coins} name="Training Credits" value={s.credits} desc="Earned from missions and Duels. Spent on avatar training. Cannot be purchased." />
        <Econ icon={Gem} name="Premium Tokens" value="—" desc="Future optional currency concept. Cosmetic only, never a competitive advantage. Not implemented." concept />
      </section>

      <section>
        <SectionTitle title="Daily missions" sub="Claim all three for a bonus card reveal (once per day)." />
        <div className="grid gap-3 md:grid-cols-3">
          {MISSIONS.map((m) => {
            const done = s.flags[m.flag], claimed = s.claimed.includes(m.id);
            return (
              <div key={m.id} className="panel p-4">
                <div className="flex items-center justify-between"><span className="font-semibold">{m.label}</span>{done && <Check className="h-4 w-4 text-success" />}</div>
                <p className="mt-1 text-xs text-muted-foreground">+{m.xp} XP · +{m.credits} Training Credits</p>
                <div className="mt-3">
                  {claimed ? <span className="text-xs text-muted-foreground">Claimed</span> : done ? <Button size="sm" variant="gold" onClick={() => claimMission(m.id)}>Claim Reward</Button> : <Button size="sm" variant="surface" asChild><Link to={m.to}>Go</Link></Button>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="Weekly objectives" />
        <div className="space-y-2">
          {WEEKLY.map((w) => {
            const v = Math.max(0, Math.min(w.target, w.metric(s))), claimed = s.claimed.includes(w.id);
            return (
              <div key={w.id} className="panel flex items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold">{w.label}{w.card && <Sparkles className="h-4 w-4 text-legendary" />}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"><div className="h-full bg-primary" style={{ width: `${(v / w.target) * 100}%` }} /></div>
                  <div className="mt-1 text-xs text-muted-foreground">{v}/{w.target} · +{w.xp} XP, +{w.credits} credits{w.card && ", card reveal"}</div>
                </div>
                {claimed ? <span className="text-xs text-muted-foreground">Claimed</span> : <Button size="sm" variant={v >= w.target ? "gold" : "surface"} disabled={v < w.target} onClick={() => claimWeekly(w.id)}>Claim</Button>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionTitle title="Reward history" />
          <div className="panel max-h-80 divide-y divide-border overflow-y-auto">
            {s.rewards.map((r, i) => <div key={i} className="flex justify-between px-4 py-2 text-sm"><span>{r.label}</span><span className="text-xs text-muted-foreground">{new Date(r.at).toLocaleDateString()}</span></div>)}
          </div>
        </section>
        <section className="panel p-5 text-sm">
          <SectionTitle title="How rewards are earned" />
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Duels: +60 XP/+20 credits for a win, +25/+8 for a loss — first 5 per day.</li>
            <li>Basketball IQ: 100 or 150 IQ points per correct answer; completion XP capped at 60 per game.</li>
            <li>Training: +2 to the trained attributes and 30–40 XP.</li>
            <li>Cards come only from mission bonuses and milestones — no paid packs.</li>
            <li>Duel rating and IQ accuracy are metrics, not balances.</li>
          </ul>
          <DemoTag className="mt-3">Prototype economy · values for illustration</DemoTag>
        </section>
      </div>
    </div>
  );
}

function Econ({ icon: Icon, name, value, desc, concept }: { icon: typeof Star; name: string; value: number | string; desc: string; concept?: boolean }) {
  return (
    <div className={cn("panel p-5", concept && "border-dashed opacity-80")}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4 text-primary" />{name}{concept && <DemoTag>Concept</DemoTag>}</div>
      <div className="mt-1 font-display text-4xl tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
