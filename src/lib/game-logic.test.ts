import { describe, expect, it } from "vitest";
import { CHALLENGES } from "./data";
import { challengePoints, levelFromXp, simulateDuel, toggleLineup } from "./game-logic";

describe("TFG rules", () => {
  it("lineup is capped at three cards", () => {
    expect(toggleLineup(["a", "b", "c"], "d")).toEqual(["a", "b", "c"]);
    expect(toggleLineup(["a", "b"], "d")).toEqual(["a", "b", "d"]);
  });
  it("standard correct answer scores 100, harder stat question 150, wrong 0", () => {
    const std = CHALLENGES.find((c) => c.points === 100)!;
    const hard = CHALLENGES.find((c) => c.points === 150)!;
    expect(challengePoints(std, std.answer)).toBe(100);
    expect(challengePoints(hard, hard.answer)).toBe(150);
    expect(challengePoints(std, "wrong")).toBe(0);
  });
  it("duel has five possessions per side and a winner", () => {
    const a = { shooting: 60, finishing: 60, handling: 60, playmaking: 60, defense: 60, rebounding: 60, athleticism: 60 };
    const r = simulateDuel({ attrs: a, off: "balanced", def: "balanced" }, { attrs: a, off: "balanced", def: "balanced" }, 42);
    expect(r.possessions.filter((p) => p.side === "you").length).toBeGreaterThanOrEqual(5);
    expect(r.yourScore).not.toBe(r.oppScore);
  });
  it("level increases every 500 XP", () => {
    expect(levelFromXp(1250).level).toBe(3);
  });
});
