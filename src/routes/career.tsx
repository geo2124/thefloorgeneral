import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Coins, Dumbbell, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ATTRIBUTES, TRAINING, divisionFor, type TrainingCategory } from "@/lib/data";
import { useStore, type Appearance } from "@/lib/store";
import { levelFromXp } from "@/lib/game-logic";
import { Avatar, JERSEYS, SKINS, SectionTitle, StatBar, THEME_RING } from "@/components/tfg/ui";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/career")({
  head: () => seo("My Career", "Train your TFG avatar across seven basketball attributes and customize your look."),
  component: Career,
});

function Career() {
  const { s, setUsername, setAppearance, startTraining, completeTraining, trainingRemaining } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(s.username);
  const [pick, setPick] = useState<TrainingCategory["id"]>("offense");
  const lvl = levelFromXp(s.xp);
  const cat = TRAINING.find((t) => t.id === pick)!;
  const active = s.training && TRAINING.find((t) => t.id === s.training!.category);
  const ovr = Math.round(ATTRIBUTES.reduce((a, x) => a + s.attrs[x.key], 0) / ATTRIBUTES.length);

  return (
    <div className="space-y-8">
      <section className="panel grid gap-6 bg-gradient-hero p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
        <Avatar name={s.username} appearance={s.appearance} size={120} />
        <div>
          {editing ? (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setUsername(name.trim()); setEditing(false); }}>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={18} className="max-w-xs" autoFocus />
              <Button type="submit" variant="gold">Save</Button>
            </form>
          ) : (
            <h1 className="flex items-center gap-2 text-5xl">{s.username}<button aria-label="Edit username" onClick={() => { setName(s.username); setEditing(true); }} className="text-muted-foreground hover:text-primary"><Pencil className="h-5 w-5" /></button></h1>
          )}
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <span>Level <b className="text-primary">{lvl.level}</b></span><span>{s.xp} XP</span>
            <span className="flex items-center gap-1"><Coins className="h-4 w-4 text-primary" />{s.credits} Training Credits</span>
            <span>{s.rating} · {divisionFor(s.rating)}</span>
          </div>
        </div>
        <div className="text-center"><div className="font-display text-6xl text-gradient-gold">{ovr}</div><div className="text-xs uppercase tracking-widest text-muted-foreground">Overall</div></div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <SectionTitle title="Attributes" />
          <div className="space-y-3">{ATTRIBUTES.map((a) => <StatBar key={a.key} label={a.label} value={s.attrs[a.key]} accent={active?.attrs.includes(a.key)} />)}</div>
        </section>

        <section className="panel p-5">
          <SectionTitle title="Training" sub="Durations are accelerated to seconds for the demo." />
          {active ? (
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm text-primary"><Dumbbell className="h-4 w-4 animate-pulse" /> Active · {active.name}</div>
              <div className="mt-1 font-display text-5xl tabular-nums">{trainingRemaining}s</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3"><div className="h-full bg-gradient-gold transition-all" style={{ width: `${100 - (trainingRemaining / active.demoSeconds) * 100}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Real duration: {active.duration}. Progress continues if you leave this screen.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => completeTraining(true)}>Complete now (demo control)</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {TRAINING.map((t) => (
                  <button key={t.id} onClick={() => setPick(t.id)} className={cn("rounded-xl border p-3 text-left transition", pick === t.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                    <div className="font-display text-xl">{t.name}</div><div className="text-xs text-muted-foreground">{t.cost} credits</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-surface-2 p-4 text-sm">
                <p>{cat.desc}</p>
                <p className="mt-2 text-muted-foreground">Improves: {cat.attrs.map((k) => ATTRIBUTES.find((a) => a.key === k)!.label).join(", ")} (+2 each) · +{cat.xp} XP</p>
                <p className="text-muted-foreground">Duration: {cat.duration} · Cost: {cat.cost} Training Credits (you have {s.credits})</p>
              </div>
              <Button variant="gold" className="mt-4 w-full" disabled={s.credits < cat.cost} onClick={() => startTraining(pick)}>{s.credits < cat.cost ? "Not enough credits" : `Start ${cat.name} Training`}</Button>
            </>
          )}
          <h3 className="mb-2 mt-6 text-lg">Training history</h3>
          <div className="space-y-1 text-sm">{s.trainingHistory.map((h, i) => <div key={i} className="flex justify-between border-b border-border py-1.5 last:border-0"><span>{h.category}</span><span className="text-muted-foreground">{h.gain}</span></div>)}</div>
        </section>
      </div>

      <section className="panel p-5">
        <SectionTitle title="Customize" sub="Changes apply across the app instantly." />
        <div className="grid gap-5 md:grid-cols-4">
          <Picker label="Skin tone">{SKINS.map((c, i) => <Swatch key={i} color={c} active={s.appearance.skin === i} onClick={() => setAppearance({ skin: i })} />)}</Picker>
          <Picker label="Uniform">{JERSEYS.map((c, i) => <Swatch key={i} color={c} active={s.appearance.jersey === i} onClick={() => setAppearance({ jersey: i })} />)}</Picker>
          <Picker label="Accessory">{(["none", "headband", "headset", "goggles"] as Appearance["accessory"][]).map((a) => <button key={a} onClick={() => setAppearance({ accessory: a })} className={cn("rounded-full border px-3 py-1 text-xs capitalize", s.appearance.accessory === a ? "border-primary text-primary" : "border-border text-muted-foreground")}>{a}</button>)}</Picker>
          <Picker label="Profile theme">{(Object.keys(THEME_RING) as Appearance["theme"][]).map((t) => <Swatch key={t} color={THEME_RING[t]} active={s.appearance.theme === t} onClick={() => setAppearance({ theme: t })} />)}</Picker>
        </div>
      </section>

      <section>
        <SectionTitle title="Career milestones" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[["First Duel Win", s.duels.some((d) => d.won)], ["Level 5", lvl.level >= 5], ["IQ 10 Correct", s.iqCorrect >= 10], ["Training x3", s.trainingsDone >= 3]].map(([l, ok]) => (
            <div key={l as string} className={cn("panel flex items-center gap-3 p-4", !ok && "opacity-50")}><Award className={cn("h-6 w-6", ok ? "text-primary" : "text-muted-foreground")} /><span className="text-sm font-semibold">{l}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Picker({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="mb-2 text-xs text-muted-foreground">{label}</div><div className="flex flex-wrap gap-2">{children}</div></div>;
}
function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} aria-label="Select option" className={cn("h-8 w-8 rounded-full border-2", active ? "border-foreground" : "border-transparent")} style={{ background: color }} />;
}
