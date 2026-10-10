import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * How a corruption complaint moves from the CIAA to the Special Court and on to
 * appeal.
 *
 * Every stage, branch and branch-condition here is taken from the अख्तियार
 * दुरुपयोग अनुसन्धान आयोग कार्यविधि, २०७८ (approved २०७८।३।७), and the appeal
 * forum from the विशेष अदालत ऐन, २०५९. Section numbers sit on each stage so a
 * reader can check the diagram against the law rather than trust it. Nothing is
 * added for narrative tidiness: the कार्यविधि gives four outcomes at the
 * Commission's decision, and all four are drawn even though only one leads to
 * court.
 *
 * The Nepali term is the heading in both languages, because it is the name the
 * law uses and the one that appears in every CIAA report. The description beside
 * it follows the language toggle.
 */

export type FlowBranch = {
  key: string;
  /** Arrow label: the condition under which this branch is taken. */
  condition: string;
  term: string;
  note: string;
  /** Terminal branches end the complaint's life; only one continues to court. */
  ends?: boolean;
};

export type FlowStage = {
  key: string;
  /** Nepali legal term, used as the heading in both languages. */
  term: string;
  /** English name, shown small under the term when reading in English. */
  roman?: string;
  cite: string;
  body: string;
  branches?: FlowBranch[];
  /** Label on the arrow leading OUT of this stage into the next one. */
  continues?: string;
};

const Arrow = ({ label }: { label?: string }) => (
  <div className="flex items-stretch gap-3 pl-[1.1rem]">
    <div aria-hidden="true" className="flex w-px flex-col items-center bg-border" />
    {label ? (
      <p className="py-2 text-xs font-medium leading-4 text-accent">{label}</p>
    ) : (
      <div className="py-2" />
    )}
  </div>
);

export function ProcessFlow({
  stages,
  labels,
}: {
  stages: readonly FlowStage[];
  labels: { endsHere: string; romanLang: "en" | "ne" };
}) {
  return (
    <ol className="space-y-0">
      {stages.map((stage, i) => (
        <li key={stage.key}>
          <div className="rounded-lg border border-border bg-[hsl(var(--surface))] p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-xs font-semibold text-accent"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h4 lang="ne" className="font-display text-base font-bold leading-snug md:text-lg">
                  {stage.term}
                </h4>
                {stage.roman ? (
                  <p lang="en" className="mt-0.5 text-xs leading-4 text-muted-foreground">
                    {stage.roman}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-foreground/80">{stage.body}</p>
                <p className="mt-2 font-mono text-[0.7rem] leading-4 text-muted-foreground">
                  {stage.cite}
                </p>
              </div>
            </div>

            {stage.branches?.length ? (
              <ul className="mt-4 space-y-2 border-t border-border pt-3">
                {stage.branches.map((b) => (
                  <li key={b.key} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                        b.ends ? "bg-foreground/35" : "bg-accent",
                      )}
                    />
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {b.condition}
                    </span>
                    <span lang="ne" className="font-semibold text-foreground">
                      {b.term}
                    </span>
                    <span className="w-full pl-3.5 text-xs leading-5 text-muted-foreground">
                      {b.note}
                      {b.ends ? (
                        <span className="ml-1.5 whitespace-nowrap rounded border border-border px-1 py-0.5 text-[0.65rem] uppercase tracking-wide">
                          {labels.endsHere}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {i < stages.length - 1 ? <Arrow label={stage.continues} /> : null}
        </li>
      ))}
    </ol>
  );
}

export const FlowNote = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
    {children}
  </p>
);
