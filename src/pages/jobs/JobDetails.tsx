import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowLeft, Upload } from "lucide-react";

export default function JobDetails(){
  const { id } = useParams();

  // Placeholder mock; replace with real fetch by id
  const job = useMemo(()=>({
    id: id ?? "",
    title: "Site inspection (Riyadh)",
    location: "Al Olaya, Riyadh",
    postedAgo: "2h",
    budgetSar: 2500,
    status: "open" as const,
    description: "Conduct a site inspection and provide a brief report with photos.",
    milestones: [
      { id: "m1", title: "Site visit", amount: 1000, due: "Today" },
      { id: "m2", title: "Report delivery", amount: 1500, due: "+2 days" },
    ],
  }), [id]);

  return (
    <main className="container mx-auto p-0 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Job Details</h1>
        <Link to={-1 as unknown as string} className="text-sm inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{job.title}</span>
              <Badge variant="secondary">{job.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {job.postedAgo} ago</span>
            </div>
            <p className="opacity-90 text-sm leading-relaxed">{job.description}</p>
            <div>
              <div className="font-semibold mb-2">Milestones</div>
              <ul className="space-y-2">
                {job.milestones.map(m=> (
                  <li key={m.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between shadow-md">
                    <div className="text-sm">{m.title} — due {m.due}</div>
                    <div className="text-sm font-medium">SAR {m.amount.toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm opacity-80">Budget</div>
            <div className="text-xl font-bold">SAR {job.budgetSar.toLocaleString()}</div>
            <div className="h-px bg-[var(--border)] my-2" />
            <Button onClick={()=>location.assign("/job/upload")} className="w-full">
              <Upload className="h-4 w-4" /> Upload Deliverable
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


