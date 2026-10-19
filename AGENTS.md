<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## TFG prototype
- All sample data lives in `src/lib/data.ts`; UI reads only those shapes so a licensed data provider can replace it later.
- Pure game rules (lineup cap, IQ scoring, duel sim) live in `src/lib/game-logic.ts` with tests; keep them framework-free.
- Demo state is a single React context in `src/lib/store.tsx` persisted to localStorage — no backend by design for the partner demo.
