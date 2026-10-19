import {
  cardById,
  type AttrKey,
  type Challenge,
  type DefTactic,
  type OffTactic,
} from "./data";

export const MAX_LINEUP = 3; // same for every ranked player; never increased by progression or purchase
export const XP_PER_LEVEL = 500;
export const DAILY_DUEL_REWARD_CAP = 5;

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return { level, into, pct: (into / XP_PER_LEVEL) * 100 };
}

export function toggleLineup(lineup: string[], id: string): string[] {
  if (lineup.includes(id)) return lineup.filter((x) => x !== id);
  if (lineup.length >= MAX_LINEUP) return lineup;
  return [...lineup, id];
}

export function challengePoints(ch: Challenge, pick: string | undefined) {
  return pick !== undefined && pick === ch.answer ? ch.points : 0;
}

export function withCards(attrs: Record<AttrKey, number>, cards: string[]) {
  const out = { ...attrs };
  for (const id of cards) {
    const b = cardById(id).boost;
    for (const k of Object.keys(b) as AttrKey[]) out[k] = out[k] + (b[k] ?? 0);
  }
  return out;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MATCHUP: Record<OffTactic, Record<DefTactic, number>> = {
  perimeter: { pressure: -0.14, paint: 0.12, balanced: 0 },
  driving: { pressure: 0.12, paint: -0.14, balanced: 0 },
  balanced: { pressure: 0.03, paint: 0.03, balanced: 0 },
};

export type Side = { attrs: Record<AttrKey, number>; off: OffTactic; def: DefTactic };
export type Possession = {
  side: "you" | "opp";
  made: boolean;
  pts: number;
  text: string;
  why: string;
};

function offenseRating(a: Record<AttrKey, number>, off: OffTactic) {
  if (off === "perimeter") return (a.shooting * 2 + a.playmaking) / 3;
  if (off === "driving") return (a.finishing * 2 + a.handling + a.athleticism) / 4;
  return (a.shooting + a.finishing + a.playmaking + a.handling) / 4;
}
function defenseRating(a: Record<AttrKey, number>, def: DefTactic) {
  if (def === "pressure") return (a.defense * 2 + a.athleticism) / 3;
  if (def === "paint") return (a.defense * 2 + a.rebounding) / 3;
  return (a.defense + a.rebounding + a.athleticism) / 3;
}

const OFF_LABEL: Record<OffTactic, string> = { perimeter: "perimeter shooting", driving: "drives", balanced: "balanced offense" };
const DEF_LABEL: Record<DefTactic, string> = { pressure: "perimeter pressure", paint: "paint protection", balanced: "balanced defense" };

export function simulateDuel(you: Side, opp: Side, seed: number, possessionsPerSide = 5) {
  const r = rng(seed);
  const list: Possession[] = [];
  const run = (side: "you" | "opp", o: Side, d: Side) => {
    const offR = offenseRating(o.attrs, o.off);
    const defR = defenseRating(d.attrs, d.def);
    const mod = MATCHUP[o.off][d.def];
    const p = Math.min(0.8, Math.max(0.2, 0.5 + (offR - defR) / 90 + mod));
    const made = r() < p;
    const three = o.off === "perimeter" || (o.off === "balanced" && r() < 0.35);
    const pts = made ? (three ? 3 : 2) : 0;
    const shot = three ? "three from the wing" : "drive to the rim";
    const text = made ? `${three ? "Splash" : "Bucket"}: ${shot}` : `Miss: contested ${shot}`;
    let why: string;
    if (mod > 0.05) why = `${OFF_LABEL[o.off]} exploited ${DEF_LABEL[d.def]}`;
    else if (mod < -0.05) why = `${DEF_LABEL[d.def]} countered ${OFF_LABEL[o.off]}`;
    else if (offR - defR > 4) why = `Offensive talent edge (${Math.round(offR)} vs ${Math.round(defR)})`;
    else if (defR - offR > 4) why = `Defensive talent edge (${Math.round(defR)} vs ${Math.round(offR)})`;
    else why = "Even matchup, came down to execution";
    list.push({ side, made, pts, text, why });
  };
  for (let i = 0; i < possessionsPerSide; i++) {
    run("you", you, opp);
    run("opp", opp, you);
  }
  const yourScore = list.filter((p) => p.side === "you").reduce((s, p) => s + p.pts, 0);
  const oppScore = list.filter((p) => p.side === "opp").reduce((s, p) => s + p.pts, 0);
  // tie-break: one overtime possession each until decided (bounded)
  let ys = yourScore, os = oppScore, guard = 0;
  while (ys === os && guard < 6) {
    run("you", you, opp);
    run("opp", opp, you);
    ys += list[list.length - 2]!.pts;
    os += list[list.length - 1]!.pts;
    guard++;
  }
  if (ys === os) ys += 1; // final free throw
  return { possessions: list, yourScore: ys, oppScore: os, won: ys > os };
}

export function ratingChange(won: boolean) {
  return won ? 18 : -12;
}
