export function Card({
  title, right, children, ariaLabel
}:{ title:string; right?:React.ReactNode; children:React.ReactNode; ariaLabel?:string }) {
  return (
    <section role="region" aria-label={ariaLabel ?? title}
      className="rounded-2xl border-0 bg-[var(--surface)] text-[var(--fg)] p-4 shadow-md">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>{right}
      </header>
      {children}
    </section>
  );
}
