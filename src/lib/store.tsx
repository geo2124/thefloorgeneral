import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CHALLENGES,
  INITIAL_OWNED,
  REWARD_CARD_POOL,
  TRAINING,
  cardById,
  type AttrKey,
  type TrainingCategory,
} from "./data";
import { DAILY_DUEL_REWARD_CAP, challengePoints, ratingChange, toggleLineup } from "./game-logic";

export type Appearance = { skin: number; jersey: number; accessory: "none" | "headband" | "headset" | "goggles"; theme: "gold" | "crimson" | "cedar" };

export type DuelRecord = { id: string; opponent: string; you: number; opp: number; won: boolean; delta: number; at: number };

export type State = {
  username: string;
  appearance: Appearance;
  xp: number;
  credits: number;
  rating: number;
  attrs: Record<AttrKey, number>;
  training: { category: TrainingCategory["id"]; endsAt: number } | null;
  trainingHistory: { category: string; at: number; gain: string }[];
  owned: string[];
  lineup: string[];
  recentCards: string[];
  predictions: Record<string, string>;
  finalized: string[];
  iqPoints: number;
  iqCorrect: number;
  iqSettled: number;
  duels: DuelRecord[];
  duelsRewardedToday: number;
  flags: { duel: boolean; iq: boolean; training: boolean };
  claimed: string[];
  pendingReveal: string | null;
  club: string | null;
  squad: string | null;
  rewards: { label: string; at: number }[];
  trainingsDone: number;
};

export const INITIAL: State = {
  username: "Khaled_TFG",
  appearance: { skin: 2, jersey: 0, accessory: "headset", theme: "gold" },
  xp: 1850,
  credits: 80,
  rating: 1218,
  attrs: { shooting: 64, finishing: 61, handling: 66, playmaking: 70, defense: 57, rebounding: 52, athleticism: 63 },
  training: null,
  trainingHistory: [{ category: "Defense", at: Date.now() - 86400000, gain: "+2 Defense, +2 Rebounding" }],
  owned: INITIAL_OWNED,
  lineup: ["c1", "c3", "c7"],
  recentCards: ["c13", "c7"],
  predictions: {},
  finalized: ["g3"],
  iqPoints: 1150,
  iqCorrect: 9,
  iqSettled: 13,
  duels: [
    { id: "d0", opponent: "WaveRider", you: 14, opp: 11, won: true, delta: 18, at: Date.now() - 7200000 },
    { id: "d-1", opponent: "MarinerMaya", you: 10, opp: 15, won: false, delta: -12, at: Date.now() - 90000000 },
  ],
  duelsRewardedToday: 0,
  flags: { duel: false, iq: false, training: false },
  claimed: [],
  pendingReveal: null,
  club: "bcd",
  squad: null,
  rewards: [{ label: "Weekly streak · +50 XP", at: Date.now() - 86400000 }],
  trainingsDone: 1,
};

export const MISSIONS = [
  { id: "m-duel", flag: "duel" as const, label: "Complete one Duel", xp: 50, credits: 15, to: "/duel" as const },
  { id: "m-iq", flag: "iq" as const, label: "Answer a Basketball IQ challenge", xp: 40, credits: 10, to: "/basketball" as const },
  { id: "m-train", flag: "training" as const, label: "Start an avatar training session", xp: 30, credits: 10, to: "/career" as const },
];

export const WEEKLY = [
  { id: "w-wins", label: "Win 3 Duels", target: 3, metric: (s: State) => s.duels.filter((d) => d.won && d.id !== "d0").length, xp: 150, credits: 40, card: true },
  { id: "w-iq", label: "Get 2 IQ challenges right this week", target: 2, metric: (s: State) => s.iqCorrect - INITIAL.iqCorrect, xp: 120, credits: 30, card: false },
  { id: "w-train", label: "Complete 2 training sessions", target: 2, metric: (s: State) => s.trainingsDone - INITIAL.trainingsDone, xp: 100, credits: 25, card: false },
];

const KEY = "tfg-demo-state-v1";

function nextRewardCard(s: State) {
  return REWARD_CARD_POOL.find((id) => !s.owned.includes(id)) ?? null;
}

type Ctx = ReturnType<typeof useProvideStore>;
const StoreCtx = createContext<Ctx | null>(null);

function useProvideStore() {
  const [s, setS] = useState<State>(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...INITIAL, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, loaded]);

  const reward = (st: State, label: string): State => ({ ...st, rewards: [{ label, at: Date.now() }, ...st.rewards].slice(0, 30) });

  const actions = {
    setUsername: (username: string) => setS((p) => ({ ...p, username: username.slice(0, 18) || p.username })),
    setAppearance: (a: Partial<Appearance>) => setS((p) => ({ ...p, appearance: { ...p.appearance, ...a } })),
    startTraining: (id: TrainingCategory["id"]) => {
      const cat = TRAINING.find((t) => t.id === id)!;
      if (s.training) return toast.error("A training session is already active.");
      if (s.credits < cat.cost) return toast.error("Not enough Training Credits. Earn more from missions and Duels.");
      setS((p) => ({ ...p, credits: p.credits - cat.cost, training: { category: id, endsAt: Date.now() + cat.demoSeconds * 1000 }, flags: { ...p.flags, training: true } }));
      toast.success(`${cat.name} training started`, { description: `−${cat.cost} credits · demo-accelerated` });
    },
    completeTraining: (force = false) => {
      setS((p) => {
        if (!p.training || (!force && Date.now() < p.training.endsAt)) return p;
        const cat = TRAINING.find((t) => t.id === p.training!.category)!;
        const attrs = { ...p.attrs };
        cat.attrs.forEach((k) => (attrs[k] = Math.min(99, attrs[k] + 2)));
        const gain = cat.attrs.map((k) => `+2 ${k[0].toUpperCase() + k.slice(1)}`).join(", ");
        toast.success("Training complete", { description: `${gain} · +${cat.xp} XP` });
        return reward(
          { ...p, attrs, xp: p.xp + cat.xp, training: null, trainingsDone: p.trainingsDone + 1, trainingHistory: [{ category: cat.name, at: Date.now(), gain }, ...p.trainingHistory].slice(0, 10) },
          `${cat.name} training · +${cat.xp} XP`,
        );
      });
    },
    toggleLineup: (id: string) => {
      if (!s.lineup.includes(id) && s.lineup.length >= 3) return toast.error("Lineup full: remove a card first (3-card limit).");
      setS((p) => ({ ...p, lineup: toggleLineup(p.lineup, id) }));
    },
    submitPrediction: (chId: string, pick: string) => {
      const ch = CHALLENGES.find((c) => c.id === chId)!;
      if (s.finalized.includes(ch.gameId) || s.predictions[chId]) return;
      setS((p) => ({ ...p, predictions: { ...p.predictions, [chId]: pick }, flags: { ...p.flags, iq: true } }));
      toast.success("Prediction locked in", { description: "Pending until the demo game is finalized." });
    },
    finalizeGame: (gameId: string) => {
      setS((p) => {
        if (p.finalized.includes(gameId)) return p;
        let pts = 0, correct = 0, settled = 0;
        CHALLENGES.filter((c) => c.gameId === gameId && p.predictions[c.id]).forEach((c) => {
          settled++;
          const got = challengePoints(c, p.predictions[c.id]);
          pts += got;
          if (got) correct++;
        });
        const xp = Math.min(60, correct * 20); // capped completion reward
        if (settled) toast.success("Demo result settled", { description: `${correct}/${settled} correct · +${pts} IQ pts · +${xp} XP` });
        else toast("Demo game finalized", { description: "No predictions were submitted for this game." });
        const n = { ...p, finalized: [...p.finalized, gameId], iqPoints: p.iqPoints + pts, iqCorrect: p.iqCorrect + correct, iqSettled: p.iqSettled + settled, xp: p.xp + xp };
        return settled ? reward(n, `IQ settlement · +${pts} pts, +${xp} XP`) : n;
      });
    },
    recordDuel: (opponent: string, you: number, opp: number) => {
      const won = you > opp;
      const delta = ratingChange(won);
      const rewarded = s.duelsRewardedToday < DAILY_DUEL_REWARD_CAP;
      const xp = rewarded ? (won ? 60 : 25) : 0;
      const credits = rewarded ? (won ? 20 : 8) : 0;
      setS((p) => {
        const n = {
          ...p, rating: Math.max(0, p.rating + delta), xp: p.xp + xp, credits: p.credits + credits,
          duelsRewardedToday: p.duelsRewardedToday + 1, flags: { ...p.flags, duel: true },
          duels: [{ id: `d${Date.now()}`, opponent, you, opp, won, delta, at: Date.now() }, ...p.duels].slice(0, 15),
        };
        return rewarded ? reward(n, `Duel ${won ? "win" : "loss"} · +${xp} XP, +${credits} credits`) : n;
      });
      return { won, delta, xp, credits, rewarded };
    },
    claimMission: (id: string) => {
      const m = MISSIONS.find((x) => x.id === id)!;
      if (!s.flags[m.flag] || s.claimed.includes(id)) return;
      setS((p) => {
        const claimed = [...p.claimed, id];
        let n: State = reward({ ...p, claimed, xp: p.xp + m.xp, credits: p.credits + m.credits }, `${m.label} · +${m.xp} XP, +${m.credits} credits`);
        const allDone = MISSIONS.every((x) => claimed.includes(x.id));
        if (allDone && !claimed.includes("daily-bonus")) {
          const card = nextRewardCard(n);
          n = { ...n, claimed: [...claimed, "daily-bonus"], pendingReveal: card };
        }
        return n;
      });
      toast.success("Reward claimed", { description: `+${m.xp} XP · +${m.credits} Training Credits` });
    },
    claimWeekly: (id: string) => {
      const w = WEEKLY.find((x) => x.id === id)!;
      if (w.metric(s) < w.target || s.claimed.includes(id)) return;
      setS((p) => {
        const n = reward({ ...p, claimed: [...p.claimed, id], xp: p.xp + w.xp, credits: p.credits + w.credits }, `${w.label} · +${w.xp} XP`);
        return w.card ? { ...n, pendingReveal: nextRewardCard(n) } : n;
      });
      toast.success("Weekly objective claimed");
    },
    ackReveal: () =>
      setS((p) => {
        if (!p.pendingReveal) return p;
        const id = p.pendingReveal;
        return reward({ ...p, owned: [...p.owned, id], recentCards: [id, ...p.recentCards].slice(0, 6), pendingReveal: null }, `New card · ${cardById(id).name}`);
      }),
    joinClub: (club: string | null) => {
      setS((p) => ({ ...p, club, squad: club === p.club ? p.squad : null }));
      toast.success(club ? "Club preference updated" : "Club preference cleared");
    },
    joinSquad: (squad: string | null) => {
      setS((p) => ({ ...p, squad }));
      if (squad) toast.success(`Joined ${squad}`);
    },
    reset: () => {
      localStorage.removeItem(KEY);
      setS({ ...INITIAL, trainingHistory: INITIAL.trainingHistory });
      toast.success("Demo reset to presentation state");
    },
  };

  // auto-complete training when its demo timer elapses
  useEffect(() => {
    if (s.training && now >= s.training.endsAt) actions.completeTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, s.training]);

  const trainingRemaining = s.training ? Math.max(0, Math.ceil((s.training.endsAt - now) / 1000)) : 0;
  return { s, now, trainingRemaining, ...actions };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const v = useProvideStore();
  return <StoreCtx.Provider value={v}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

