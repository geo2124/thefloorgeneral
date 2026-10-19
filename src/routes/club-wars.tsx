import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLUB_STANDINGS, SPONSOR, SQUADS, TEAMS, teamById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { DemoTag, SectionTitle, TeamDot } from "@/components/tfg/ui";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/club-wars")({
  head: () => seo("Club Wars", "Fans earn points for their Lebanese basketball club through Duels, IQ challenges and missions."),
  component: ClubWars,
});

function ClubWars() {
  const { s, joinClub, joinSquad } = useStore();
  const [period, setPeriod] = useState<"weekly" | "season">("weekly");
  const [newSquad, setNewSquad] = useState("");
  const ranked = [...CLUB_STANDINGS].sort((a, b) => b[period] - a[period]);
  const myPos = s.club ? ranked.findIndex((c) => c.clubId === s.club) + 1 : 0;
  const myContribution = s.duels.length * 40 + s.iqCorrect * 25 + s.trainingsDone * 15;

  return (
    <div className="space-y-8">
      <section className="panel bg-gradient-hero p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {s.club ? <TeamDot id={s.club} className="h-16 w-16 text-xl" /> : <Shield className="h-16 w-16 text-muted-foreground" />}
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-primary">Your club</div>
            <h1 className="text-4xl">{s.club ? teamById(s.club).name : "No club selected"}</h1>
            <p className="text-sm text-muted-foreground">{s.club ? `#${myPos} this ${period === "weekly" ? "week" : "season"} · your contribution: ${myContribution} pts` : "Supporting a club is optional — pick one to add your points to Club Wars."}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-4 py-2 text-xs text-muted-foreground">Week 6 Club Wars · supported by <b>{SPONSOR.name}</b><br /><span className="text-primary">Illustrative Demo Placement</span></div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-2xl leading-none">Standings <DemoTag className="ml-1 align-middle">Demo identities</DemoTag></h2>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "weekly" | "season")}><TabsList><TabsTrigger value="weekly">Weekly</TabsTrigger><TabsTrigger value="season">Season</TabsTrigger></TabsList></Tabs>
        </div>
        <div className="panel divide-y divide-border">
          {ranked.map((c, i) => (
            <div key={c.clubId} className={cn("flex items-center gap-3 px-4 py-3", c.clubId === s.club && "bg-primary/10")}>
              <span className="w-6 font-display text-xl text-muted-foreground">{i + 1}</span>
              <TeamDot id={c.clubId} />
              <div className="flex-1"><div className="font-semibold">{teamById(c.clubId).name}</div><div className="text-xs text-muted-foreground">{c.fans.toLocaleString()} fans participating</div></div>
              <span className="font-display text-xl tabular-nums">{c[period].toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <SectionTitle title="Choose your club" sub="Optional — change anytime." />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TEAMS.map((t) => (
              <button key={t.id} onClick={() => joinClub(t.id)} className={cn("flex items-center gap-2 rounded-lg border p-2 text-left text-sm", s.club === t.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                <TeamDot id={t.id} className="h-7 w-7 text-[10px]" />{t.name}
              </button>
            ))}
          </div>
          {s.club && <Button variant="ghost" size="sm" className="mt-3" onClick={() => joinClub(null)}>Don't support a club</Button>}
        </section>

        <section className="panel p-5">
          <SectionTitle title="Squads" sub="Small fan groups that compete together." />
          {s.squad ? (
            <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><b>{s.squad}</b></div>
              <p className="mt-1 text-xs text-muted-foreground">Your Duel wins and IQ points count toward this squad's weekly total.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => joinSquad(null)}>Leave squad</Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {SQUADS.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                    <span><b>{q.name}</b> <span className="text-muted-foreground">· {q.members} members · {teamById(q.clubId).short}</span></span>
                    <Button size="sm" variant="surface" onClick={() => joinSquad(q.name)}>Join</Button>
                  </div>
                ))}
              </div>
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newSquad.trim()) joinSquad(newSquad.trim().slice(0, 24)); }}>
                <Input value={newSquad} onChange={(e) => setNewSquad(e.target.value)} placeholder="Create a demo squad" />
                <Button type="submit" variant="gold" disabled={!newSquad.trim()}>Create</Button>
              </form>
            </>
          )}
        </section>
      </div>

      <section className="panel p-5 text-sm">
        <SectionTitle title="How clubs keep fans engaged all season" />
        <div className="grid gap-3 md:grid-cols-3">
          {[["Game nights", "IQ challenges and predictions add club points around every fixture."], ["Off days", "Duels, training and collection goals keep points flowing between games."], ["Milestones", "Weekly winners unlock approved fan rewards and bragging rights."]].map(([t, d]) => (
            <div key={t} className="rounded-lg bg-surface-2 p-3"><div className="font-semibold">{t}</div><div className="text-muted-foreground">{d}</div></div>
          ))}
        </div>
      </section>
    </div>
  );
}
