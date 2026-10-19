import type { ReactNode } from "react";
import { Crown, Glasses, Headphones, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { teamById, type PlayerCard, type Rarity } from "@/lib/data";
import type { Appearance } from "@/lib/store";

export const SKINS = ["oklch(0.86 0.06 70)", "oklch(0.74 0.09 60)", "oklch(0.6 0.1 50)", "oklch(0.45 0.08 45)", "oklch(0.35 0.06 40)"];
export const JERSEYS = ["var(--crimson)", "var(--primary)", "var(--cedar)", "var(--rare)", "var(--foreground)"];
export const THEME_RING: Record<Appearance["theme"], string> = { gold: "var(--primary)", crimson: "var(--crimson)", cedar: "var(--cedar)" };

export function Avatar({ name, appearance, size = 56 }: { name: string; appearance: Appearance; size?: number }) {
  const Acc = appearance.accessory === "headset" ? Headphones : appearance.accessory === "goggles" ? Glasses : appearance.accessory === "headband" ? Crown : null;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-end justify-center overflow-hidden rounded-full"
        style={{ background: `radial-gradient(circle at 50% 38%, ${SKINS[appearance.skin]} 0 30%, transparent 31%), linear-gradient(180deg, var(--surface-3) 0 60%, ${JERSEYS[appearance.jersey]} 60%)`, boxShadow: `0 0 0 2px ${THEME_RING[appearance.theme]}` }}
      >
        <span className="mb-[6%] font-display text-[0.32em] leading-none text-background" style={{ fontSize: size * 0.2 }}>
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      {Acc && (
        <span className="absolute -right-1 -top-1 rounded-full bg-background p-1 text-primary" style={{ boxShadow: `0 0 0 1px ${THEME_RING[appearance.theme]}` }}>
          <Acc style={{ width: size * 0.22, height: size * 0.22 }} />
        </span>
      )}
    </div>
  );
}

export function DemoTag({ children = "Demo Data", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary", className)}>
      {children}
    </span>
  );
}

export function SectionTitle({ title, action, sub }: { title: string; action?: ReactNode; sub?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl leading-none">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatBar({ label, value, max = 99, accent }: { label: string; value: number; max?: number; accent?: boolean | undefined }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className={cn("h-full rounded-full transition-all duration-700", accent ? "bg-gradient-gold" : "bg-primary/70")} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export const RARITY_CLASS: Record<Rarity, string> = {
  Common: "text-muted-foreground border-border",
  Rare: "text-rare border-rare/50",
  Epic: "text-epic border-epic/50",
  Legendary: "text-legendary border-legendary/60",
};
const RARITY_BG: Record<Rarity, string> = {
  Common: "var(--surface-3)",
  Rare: "var(--rare)",
  Epic: "var(--epic)",
  Legendary: "var(--legendary)",
};

export function TeamDot({ id, className }: { id: string; className?: string }) {
  const t = teamById(id);
  return (
    <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm text-background", className)} style={{ background: t.color }}>
      {t.short}
    </span>
  );
}

export function CardTile({ card, owned = true, selected, onClick, size = "md" }: { card: PlayerCard; owned?: boolean; selected?: boolean; onClick?: () => void; size?: "sm" | "md" }) {
  const team = teamById(card.teamId);
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xl border-2 bg-card text-left transition hover:-translate-y-0.5",
        RARITY_CLASS[card.rarity],
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        !owned && "opacity-45 grayscale",
      )}
    >
      <div className={cn("relative bg-court", size === "sm" ? "h-20" : "h-32")} style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${RARITY_BG[card.rarity]} 45%, var(--card)), var(--card))` }}>
        <span className="absolute left-2 top-1 font-display text-3xl opacity-80">{card.number}</span>
        <span className="absolute right-2 top-2 text-[10px] font-bold uppercase">{card.position}</span>
        <div className="absolute bottom-0 left-1/2 h-[70%] w-[55%] -translate-x-1/2 rounded-t-full" style={{ background: `linear-gradient(180deg, var(--surface-3), ${team.color})` }} />
        {card.rarity === "Legendary" && <Sparkles className="absolute bottom-2 right-2 h-4 w-4 text-legendary" />}
        {selected && <span className="absolute left-2 bottom-2 rounded bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">LINEUP</span>}
      </div>
      <div className="p-2">
        <div className="truncate text-sm font-semibold text-foreground">{card.name}</div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">{team.name}</span>
          <span className={cn("font-semibold", RARITY_CLASS[card.rarity])}>{card.rarity}</span>
        </div>
        {!owned && <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Not collected</div>}
      </div>
    </button>
  );
}
