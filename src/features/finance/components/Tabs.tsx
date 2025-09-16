import { LayoutDashboard, FileText, Shield, BarChart3, Settings as SettingsIcon } from "lucide-react";

export function Tabs({
  value, onChange, items
}:{ value:string; onChange:(v:string)=>void; items:{key:string; label:string}[] }) {
  return (
    <div role="tablist" aria-label="Sections" className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0 w-full shadow-[0_2px_0_0_rgba(0,0,0,0.08)]" style={{ display: "table", minWidth: "100%" }}>
      {items.map(t=>{
        const isActive = value===t.key;
        const Icon = t.key==="overview" ? LayoutDashboard
          : t.key==="invoices" ? FileText
          : t.key==="escrow" ? Shield
          : t.key==="reports" ? BarChart3
          : SettingsIcon;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={()=>onChange(t.key)}
            className={`relative justify-center whitespace-nowrap text-sm ring-offset-background inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? "border-primary text-foreground" : ""}`}
          >
            <Icon className="h-4 w-4" />
            {t.label}
            {isActive && (
              <span aria-hidden className="pointer-events-none absolute left-[14px] right-[14px] -bottom-[4px] h-0.5 rounded-full bg-[var(--color-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

