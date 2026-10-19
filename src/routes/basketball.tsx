import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CHALLENGES, CLUB_STANDINGS, DEMO_USERS, GAMES, teamById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ChallengeCard, GameCard, GameDialog } from "@/components/tfg/Games";
import { DemoTag, SectionTitle } from "@/components/tfg/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/basketball")({
  head: () => seo("Basketball IQ", "Predict winners, top scorers and stat lines from Lebanese basketball sample games."),
  component: Basketball,
});

function Basketball() {
  const { s } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const acc = s.iqSettled ? Math.round((s.iqCorrect / s.iqSettled) * 100) : 0;
  const pending = Object.keys(s.predictions).filter((id) => !s.finalized.includes(CHALLENGES.find((c) => c.id === id)!.gameId)).length;
  const board = [...DEMO_USERS.map((u) => ({ name: u.name, iq: u.iq })), { name: s.username, iq: acc }].sort((a, b) => b.iq - a.iq);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["IQ points", s.iqPoints], ["Accuracy", `${acc}%`], ["Settled", s.iqSettled], ["Pending", pending]].map(([l, v]) => (
          <div key={l} className="panel p-4"><div className="text-xs text-muted-foreground">{l}</div><div className="font-display text-3xl">{v}</div></div>
        ))}
      </div>

      <section>
        <SectionTitle title="Games" sub="Sample Lebanese basketball schedule — Upcoming, Live Demo and Final states" action={<DemoTag />} />
        <div className="grid gap-4 md:grid-cols-3">
          {GAMES.map((g) => <GameCard key={g.id} game={g} onOpen={() => setOpen(g.id)} />)}
        </div>
      </section>

      <section>
        <Tabs defaultValue="daily">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-2xl leading-none">Challenges</h2>
            <TabsList><TabsTrigger value="daily">Daily</TabsTrigger><TabsTrigger value="weekly">Weekly</TabsTrigger><TabsTrigger value="board">Leaderboard</TabsTrigger></TabsList>
          </div>
          <TabsContent value="daily" className="space-y-3">{CHALLENGES.filter((c) => c.period === "Daily").map((c) => <ChallengeCard key={c.id} ch={c} />)}</TabsContent>
          <TabsContent value="weekly" className="space-y-3">{CHALLENGES.filter((c) => c.period === "Weekly").map((c) => <ChallengeCard key={c.id} ch={c} />)}</TabsContent>
          <TabsContent value="board">
            <div className="panel divide-y divide-border">
              {board.map((u, i) => (
                <div key={u.name} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${u.name === s.username ? "bg-primary/10" : ""}`}>
                  <span className="w-5 font-display text-lg text-muted-foreground">{i + 1}</span><span className="flex-1">{u.name}</span><span>{u.iq}% accuracy</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="panel p-5 text-sm">
          <h3 className="mb-2 text-xl">Rules & settlement</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Standard question: 100 pts. Harder statistical question: 150 pts. Incorrect: 0.</li>
            <li>Answers lock before the relevant period starts; one answer per challenge.</li>
            <li>Results settle when the game is final. In this demo, a labeled admin control simulates that.</li>
            <li>Completion XP is capped at 60 per game.</li>
            <li>No wagering, odds, deposits, cash-out or paid attempts — this is a knowledge game.</li>
          </ul>
        </div>
        <div className="panel p-5 text-sm">
          <h3 className="mb-2 text-xl">Team form <DemoTag className="ml-1 align-middle" /></h3>
          {CLUB_STANDINGS.slice(0, 4).map((c, i) => (
            <div key={c.clubId} className="flex justify-between border-b border-border py-1.5 last:border-0"><span>{teamById(c.clubId).name}</span><span className="text-muted-foreground">{["W-W-L-W", "W-L-W-W", "L-W-W-L", "L-L-W-W"][i]}</span></div>
          ))}
        </div>
      </section>
      <GameDialog gameId={open} onClose={() => setOpen(null)} />
    </div>
  );
}
