import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cardById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { CardTile } from "./ui";

export function CardRevealDialog() {
  const { s, ackReveal } = useStore();
  const [flipped, setFlipped] = useState(false);
  const id = s.pendingReveal;
  if (!id) return null;
  const card = cardById(id);
  return (
    <Dialog open onOpenChange={(o) => { if (!o) { ackReveal(); setFlipped(false); } }}>
      <DialogContent className="max-w-sm border-primary/30 bg-gradient-hero text-center">
        <DialogTitle className="font-display text-3xl">Card Reward</DialogTitle>
        <DialogDescription>Earned through demo gameplay. Cards are collection items, not currency.</DialogDescription>
        <div className="mx-auto my-4 w-48">
          {flipped ? (
            <div className="animate-pop-in"><CardTile card={card} /></div>
          ) : (
            <button onClick={() => setFlipped(true)} className="flex h-64 w-full items-center justify-center rounded-xl border-2 border-primary/50 bg-court bg-card font-display text-5xl text-gradient-gold shadow-gold transition hover:scale-105">
              TFG
            </button>
          )}
        </div>
        {flipped ? (
          <>
            <p className="text-sm"><span className="font-semibold">{card.name}</span> · {card.rarity}</p>
            <Button variant="gold" className="mt-2 w-full" onClick={() => { ackReveal(); setFlipped(false); }}>Add to Collection</Button>
          </>
        ) : (
          <Button variant="gold" className="w-full" onClick={() => setFlipped(true)}>Reveal Card</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
