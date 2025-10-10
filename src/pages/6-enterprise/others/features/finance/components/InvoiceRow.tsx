import { ZATCAStatusBadge } from "./ZATCAStatusBadge";
import type { InvoiceRow as Row } from "../store/useFinanceStore";

export function InvoiceRow({ row, onPay, onPdf, onXml, onDetails }:{
  row: Row;
  onPay:(id:string)=>void;
  onPdf:(id:string)=>void;
  onXml:(id:string)=>void;
  onDetails:(id:string)=>void;
}) {
  return (
    <tr>
      <td className="px-3 py-2">{row.code}</td>
      <td className="px-3 py-2">{row.date}</td>
      <td className="px-3 py-2">{row.jobTitle}</td>
      <td className="px-3 py-2 capitalize">{row.type.replace("_"," ")}</td>
      <td className="px-3 py-2">SAR {row.total.toLocaleString()}</td>
      <td className="px-3 py-2">SAR {row.vat.toLocaleString()}</td>
      <td className="px-3 py-2">{row.status}</td>
      <td className="px-3 py-2"><ZATCAStatusBadge state={row.zatcaStatus ?? null}/></td>
      <td className="px-3 py-2">
        {row.status!=="paid" && <button className="mr-2 rounded-lg bg-[var(--color-primary)] px-3 py-1 text-black" onClick={()=>onPay(row.id)}>Pay</button>}
        <button className="mr-2 rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onPdf(row.id)}>PDF</button>
        {row.zatcaStatus==="cleared" && <button className="mr-2 rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onXml(row.id)}>XML</button>}
        <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onDetails(row.id)}>Details</button>
      </td>
    </tr>
  );
}


