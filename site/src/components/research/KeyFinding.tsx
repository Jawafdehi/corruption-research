import type { ReactNode } from "react";

/**
 * A finding worth stopping on, set in a warm panel.
 *
 * Distinct on purpose from both of the other marked blocks. GapCallout is crimson and
 * marks where the record stops answering; DataNote is grey and marks a reading of the
 * chart beside it. This one is amber and marks a result — the thing on the page a
 * reader should carry away even if they read nothing else in the section.
 *
 * Three signals carry that weight and no more: the tint, a heavier left edge and the
 * figures set large. Anything further and it would compete with the gap blocks, which
 * are the loudest thing on every page by design.
 */
export function KeyFinding({
  label,
  stats,
  children,
}: {
  label: string;
  /** The two or three numbers the finding turns on. */
  stats?: readonly { value: string; caption: ReactNode }[];
  children: ReactNode;
}) {
  return (
    <aside className="mt-6 overflow-hidden rounded-xl border border-[hsl(38_92%_50%/0.35)] bg-[hsl(45_93%_58%/0.10)]">
      <div className="border-l-4 border-[hsl(38_92%_45%)] px-5 py-5 md:px-7 md:py-6">
        <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[hsl(32_81%_32%)]">
          {label}
        </p>

        {stats?.length ? (
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i}>
                <dt className="font-mono text-2xl font-semibold leading-none tabular-nums tracking-tight text-[hsl(26_84%_30%)] md:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-xs leading-5 text-foreground/75">{s.caption}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-4 max-w-3xl space-y-3 text-sm leading-6 text-foreground/85">
          {children}
        </div>
      </div>
    </aside>
  );
}
