import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Megaphone, ShoppingBag } from "lucide-react";
import { PARTNER_PACKAGES, SPONSOR } from "@/lib/data";
import { DemoTag, SectionTitle } from "@/components/tfg/ui";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () => seo("Partner Opportunities", "Sponsorship packages for Lebanese basketball fan engagement: Season, IQ, Collection, Club Wars and Rewards partners."),
  component: Partners,
});

const METRICS = [["Challenge participation", "e.g. 18–30%"], ["Completed engagements", "per active fan / week"], ["Reward redemptions", "approved offers"], ["Unique participants", "per campaign"], ["Repeat participation", "week-over-week"], ["Impressions", "where measurable"]];

function Partners() {
  const [sel, setSel] = useState(PARTNER_PACKAGES[1]!.id);
  const p = PARTNER_PACKAGES.find((x) => x.id === sel)!;
  return (
    <div className="space-y-8">
      <section className="panel bg-gradient-hero p-6 md:p-10">
        <div className="text-xs uppercase tracking-widest text-primary">For sponsors, clubs & federation partners</div>
        <h1 className="mt-1 max-w-3xl text-5xl md:text-6xl">Year-round engagement with Lebanese basketball fans</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">TFG turns every game night — and every day between — into active fan participation. Sponsorship is the primary launch model; brands appear inside moments fans already care about.</p>
        <p className="mt-3 text-xs text-muted-foreground">Prototype only. No federation, club or sponsor agreement is implied. “{SPONSOR.name}” is a neutral sample brand.</p>
      </section>

      <section>
        <SectionTitle title="Partnership formats" />
        <div className="mb-4 flex flex-wrap gap-2">
          {PARTNER_PACKAGES.map((x) => <button key={x.id} onClick={() => setSel(x.id)} className={cn("rounded-full border px-4 py-1.5 text-sm", sel === x.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{x.name}</button>)}
        </div>
        <div className="panel grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4 text-sm">
            <h3 className="text-3xl">{p.name}</h3>
            <Row k="Activation concept" v={p.concept} />
            <Row k="Example placement" v={p.placement} />
            <Row k="Fan interaction" v={p.interaction} />
            <Row k="Value for the sponsor" v={p.value} />
            <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Illustrative metrics</div><div className="mt-1 flex flex-wrap gap-2">{p.metrics.map((m) => <span key={m} className="rounded bg-surface-2 px-2 py-1 text-xs">{m}</span>)}</div></div>
          </div>
          <Preview id={p.id} />
        </div>
      </section>

      <section>
        <SectionTitle title="Campaign reporting" sub="What partners could receive. Actual metrics depend on usage, campaign design and available measurement — no results are guaranteed." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {METRICS.map(([m, n]) => <div key={m} className="panel p-4"><BarChart3 className="h-5 w-5 text-primary" /><div className="mt-2 font-semibold">{m}</div><div className="text-xs text-muted-foreground">{n} · illustrative</div></div>)}
        </div>
      </section>

      <section className="panel border-dashed p-6">
        <div className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /><h2 className="text-2xl">Consumer revenue concept</h2><DemoTag>Future · not implemented</DemoTag></div>
        <p className="mt-1 text-sm text-muted-foreground">Optional, secondary to sponsorship. Cosmetic and non-competitive only — no paid randomized packs, no pay-to-win, no checkout in this prototype.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
          {["Avatar cosmetics", "Uniforms & accessories", "Profile themes", "Premium album presentation", "Physical merch & printable albums", "Optional membership (non-essential perks)"].map((x) => <div key={x} className="rounded-lg bg-surface-2 p-3">{x}</div>)}
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div><p>{v}</p></div>;
}

function Preview({ id }: { id: string }) {
  const tag = <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary"><Megaphone className="h-3 w-3" /> Illustrative Demo Placement</div>;
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      {tag}
      {id === "iq" && <div className="rounded-xl bg-surface-2 p-4"><div className="text-[10px] uppercase text-muted-foreground">Top Scorer Challenge · presented by {SPONSOR.name}</div><p className="mt-1 font-semibold">Who finishes as the game's top scorer?</p><div className="mt-3 grid grid-cols-3 gap-2 text-xs">{["K. Haddad", "R. Khoury", "E. Mansour"].map((n) => <div key={n} className="rounded border border-border p-2 text-center">{n}</div>)}</div></div>}
      {id === "collection" && <div className="rounded-xl bg-surface-2 p-4 text-center"><div className="font-display text-2xl">Cedars Album 2026</div><div className="text-xs text-muted-foreground">Complete 4/4 cards · reward by {SPONSOR.name}</div><div className="mx-auto mt-3 h-2 w-3/4 overflow-hidden rounded-full bg-surface-3"><div className="h-full w-3/4 bg-gradient-gold" /></div></div>}
      {id === "clubwars" && <div className="rounded-xl bg-surface-2 p-4"><div className="font-display text-2xl">Week 6 Club Wars</div><div className="text-xs text-muted-foreground">supported by {SPONSOR.name}</div><div className="mt-2 space-y-1 text-sm">{["Zahle Eagles 51,400", "Beirut Cedars 48,200", "Tripoli Lions 39,800"].map((r, i) => <div key={r} className="flex justify-between"><span>{i + 1}. {r.split(" ").slice(0, 2).join(" ")}</span><span>{r.split(" ")[2]}</span></div>)}</div></div>}
      {id === "rewards" && <div className="rounded-xl bg-surface-2 p-4 text-center"><div className="font-display text-2xl text-gradient-gold">Reward unlocked</div><p className="text-sm">Courtside experience draw entry</p><p className="text-xs text-muted-foreground">Offered by {SPONSOR.name} · non-cash, approved reward</p></div>}
      {id === "season" && <div className="rounded-xl bg-gradient-hero p-4"><div className="text-[10px] uppercase text-muted-foreground">TFG Season 2026 · presented by {SPONSOR.name}</div><div className="font-display text-3xl">Season hub</div><p className="text-xs text-muted-foreground">Season goals, album cover and finals recap carry the partner lockup.</p></div>}
      <p className="mt-3 text-[11px] text-muted-foreground">Brand stays secondary to the fan experience.</p>
    </div>
  );
}
