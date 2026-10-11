import { cn } from "@/lib/utils";

/**
 * The route a corruption complaint takes, as a compact diagram.
 *
 * Stages and wording check against the अख्तियार दुरुपयोग अनुसन्धान आयोग
 * कार्यविधि, २०७८ (approved २०७८।३।७); the appeal forum against the विशेष अदालत
 * ऐन, २०५९ दफा १७. Section numbers live in one source note under the diagram
 * rather than on every box, so the boxes stay readable.
 *
 * Conditional language is load-bearing and deliberately kept: stage 4 reads
 * "आधार देखिएमा" and stage 6 "निर्णय भएमा", because neither step follows
 * automatically from the one before it.
 */

export type FlowStage = {
  key: string;
  /** Nepali legal term. Heads the box in both languages. */
  term: string;
  /** English name, small, under the term. */
  roman: string;
  /** One sentence. */
  body: string;
  /** Optional two-way split shown beside this stage. */
  branch?: { ends: string; continues: string };
};

const Connector = () => (
  <div aria-hidden="true" className="flex justify-center py-1.5">
    <svg width="14" height="22" viewBox="0 0 14 22" className="text-border">
      <line x1="7" y1="0" x2="7" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 14 L7 20 L11 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export function ProcessFlow({
  stages,
  endsLabel,
}: {
  stages: readonly FlowStage[];
  endsLabel: string;
}) {
  return (
    <ol className="max-w-xl">
      {stages.map((s, i) => (
        <li key={s.key}>
          <div className="rounded-md border border-border bg-[hsl(var(--surface))] px-4 py-3">
            <div className="flex items-baseline gap-2.5">
              <span
                aria-hidden="true"
                className="font-mono text-xs font-semibold tabular-nums text-accent"
              >
                {i + 1}
              </span>
              <h4 lang="ne" className="font-display text-sm font-bold leading-snug md:text-base">
                {s.term}
              </h4>
              <span className="text-xs text-muted-foreground">{s.roman}</span>
            </div>
            <p className="mt-1.5 pl-6 text-sm leading-6 text-foreground/80">{s.body}</p>
          </div>

          {s.branch ? (
            // The one split worth drawing. Both outcomes are real, so neither is
            // styled as the default path; the terminal one is simply marked.
            <div className="flex flex-wrap items-stretch gap-2 pl-6 pt-2">
              <span className="flex items-center gap-2 rounded border border-border bg-background px-2.5 py-1 text-xs">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground/35" />
                <span lang="ne" className="font-medium">
                  {s.branch.ends}
                </span>
                <span className="text-muted-foreground">{endsLabel}</span>
              </span>
              <span className="flex items-center gap-2 rounded border border-accent/40 bg-accent/5 px-2.5 py-1 text-xs">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span lang="ne" className="font-medium text-accent">
                  {s.branch.continues}
                </span>
              </span>
            </div>
          ) : null}

          {i < stages.length - 1 ? <Connector /> : null}
        </li>
      ))}
    </ol>
  );
}

export const FlowNote = ({ children }: { children: React.ReactNode }) => (
  <p className={cn("mt-4 max-w-xl text-xs leading-5 text-muted-foreground")}>{children}</p>
);
