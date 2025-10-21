export function ComplianceCard({ sceStatus, zatcaStatus, kycStatus }:{
  sceStatus:string; zatcaStatus:string; kycStatus:string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
      <div className="rounded-lg border border-[var(--border)] p-4"><div className="opacity-70">SCE</div><div className="font-semibold">{sceStatus}</div></div>
      <div className="rounded-lg border border-[var(--border)] p-4"><div className="opacity-70">ZATCA</div><div className="font-semibold">{zatcaStatus}</div></div>
      <div className="rounded-lg border border-[var(--border)] p-4"><div className="opacity-70">KYC</div><div className="font-semibold">{kycStatus}</div></div>
    </div>
  );
}

