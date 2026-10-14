export type FigureColumn = {
  key: string;
  label: string;
};

export type FigureTableRow = {
  key: string;
  /** Row label, then one value per numeric column. */
  label: string;
  values: readonly string[];
  /** The line the rows above add up to: heavier type, ruled off. */
  total?: boolean;
  /** An intermediate sum on the way there: ruled off, but not the answer. */
  sub?: boolean;
};

/**
 * A small table of figures, where the figures are the argument.
 *
 * Every number here is quoted — from a judgment, or from a worked example whose whole
 * purpose is that a reader can check the arithmetic. So the values are mono and
 * tabular and right-aligned, which lines the digits up column-wise and makes a wrong
 * sum visible; and the row the others add up to is ruled off rather than merely bolded,
 * because "total" is a structural claim about the rows above it, not emphasis.
 */
export function FigureTable({
  heading,
  rowHeader,
  columns,
  rows,
}: {
  heading?: string;
  /** Header over the label column, e.g. "Financial activity". */
  rowHeader: string;
  columns: readonly FigureColumn[];
  rows: readonly FigureTableRow[];
}) {
  return (
    <div className="mt-4">
      {heading ? (
        <p className="mb-2.5 font-display text-sm font-bold leading-snug text-foreground">
          {heading}
        </p>
      ) : null}

      <div className="chart-scroll overflow-hidden rounded-lg border border-border bg-[hsl(var(--surface))]">
        {/* Narrow enough that a two-column table fits a phone without scrolling; the
            four-column one still scrolls, which is what chart-scroll is for. */}
        <table className="w-full min-w-[248px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="px-2.5 py-2.5 md:px-4 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {rowHeader}
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="px-2.5 py-2.5 md:px-4 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                className={
                  r.total
                    ? "border-t border-foreground/25"
                    : r.sub
                      ? "border-t border-border"
                      : "border-b border-border/60 last:border-0"
                }
              >
                <th
                  scope="row"
                  className={
                    "px-2.5 py-2.5 md:px-4 text-left text-sm " +
                    (r.total
                      ? "font-bold text-foreground"
                      : r.sub
                        ? "font-medium text-foreground/85"
                        : "font-normal text-foreground/85")
                  }
                >
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={columns[i]?.key ?? i}
                    className={
                      "whitespace-nowrap px-2.5 py-2.5 text-right font-mono text-xs tabular-nums md:px-4 md:text-sm " +
                      (r.total
                        ? "font-semibold text-foreground md:text-base"
                        : "text-foreground/80")
                    }
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
