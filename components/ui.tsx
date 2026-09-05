export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`glass rounded-2xl shadow-card p-5 ${className}`}>{children}</div>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">{children}</span>;
}

export function Btn({ children, onClick, variant = "primary", type = "button", className = "" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost"; type?: "button" | "submit"; className?: string }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-2";
  const styles = variant === "primary"
    ? "bg-accent-500 hover:bg-accent-400 text-white shadow-soft"
    : "border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200";
  return <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

export function ProgressRing({ pct }: { pct: number }) {
  const r = 44, c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Project completion ${pct} percent`}>
      <svg viewBox="0 0 110 110" className="h-32 w-32 -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#5b7cfa" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{pct}%</span>
        <span className="text-[11px] text-slate-400">complete</span>
      </div>
    </div>
  );
}

export function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-mint" style={{ width: `${pct}%`, transition: "width .6s ease" }} />
    </div>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />;
}
