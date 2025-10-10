import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../../../../1-HomePage/others/components/ui/dialog";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { Calendar } from "../../../../../1-HomePage/others/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../1-HomePage/others/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../../../../../1-HomePage/others/components/ui/radio-group";
import { Checkbox } from "../../../../../1-HomePage/others/components/ui/checkbox";
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportReportDialog({ open, onOpenChange }: ExportReportDialogProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf");
  const [dateRange, setDateRange] = useState<"week" | "month" | "custom">("week");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(false);
  const [groupBy, setGroupBy] = useState<"date" | "project">("date");

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting report:", {
      format: exportFormat,
      dateRange,
      startDate,
      endDate,
      includePhotos,
      includeNotes,
      includeWeather,
      groupBy
    });

    // In production, this would:
    // 1. Fetch check-in data for the date range
    // 2. Generate PDF/Excel using libraries like jsPDF or xlsx
    // 3. Download the file
    
    alert(`Exporting ${exportFormat.toUpperCase()} report for ${dateRange}...`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Check-in Report
          </DialogTitle>
          <DialogDescription>
            Generate a professional timesheet for your accounting or client billing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Format */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={(value: "pdf" | "excel") => setExportFormat(value)}>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    exportFormat === "pdf" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setExportFormat("pdf")}
                >
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold">PDF Report</div>
                      <div className="text-xs text-muted-foreground">Professional timesheet</div>
                    </div>
                  </Label>
                </div>

                <div 
                  className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    exportFormat === "excel" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setExportFormat("excel")}
                >
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Excel/CSV</div>
                      <div className="text-xs text-muted-foreground">For accounting software</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={(value: "week" | "month" | "custom") => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Group By */}
          <div className="space-y-3">
            <Label>Group By</Label>
            <Select value={groupBy} onValueChange={(value: "date" | "project") => setGroupBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label>Include in Report</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="photos" 
                  checked={includePhotos} 
                  onCheckedChange={(checked) => setIncludePhotos(checked as boolean)}
                />
                <Label htmlFor="photos" className="text-sm font-normal cursor-pointer">
                  Photo documentation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notes" 
                  checked={includeNotes} 
                  onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
                />
                <Label htmlFor="notes" className="text-sm font-normal cursor-pointer">
                  Check-in notes and observations
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weather" 
                  checked={includeWeather} 
                  onCheckedChange={(checked) => setIncludeWeather(checked as boolean)}
                />
                <Label htmlFor="weather" className="text-sm font-normal cursor-pointer">
                  Weather conditions
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

