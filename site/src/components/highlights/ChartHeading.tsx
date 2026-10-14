/**
 * The title above a figure inside a highlight card.
 *
 * Centred and set in bold small caps with a short rule under it, so it reads as a
 * title for the thing below rather than as another line of the paragraph above.
 * Shared, so the charts in the card grid cannot drift apart typographically.
 */
export function ChartHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-center">
      <h4 className="text-[0.7rem] font-bold uppercase leading-4 tracking-[0.1em] text-foreground/75">
        {children}
      </h4>
      <div
        aria-hidden="true"
        className="mx-auto mt-2 h-px w-10 rounded-full bg-accent/50"
      />
    </div>
  );
}
