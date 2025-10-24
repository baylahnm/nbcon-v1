import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogClose 
} from '@/pages/1-HomePage/others/components/ui/dialog';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Switch } from '@/pages/1-HomePage/others/components/ui/switch';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { 
  FileText, 
  Image, 
  Table, 
  Code, 
  BarChart3, 
  Copy, 
  X
} from 'lucide-react';

interface WBSExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onExport: (format: 'pdf' | 'png' | 'csv' | 'json') => void;
  onGenerateGantt?: () => void;
}

/**
 * WBS Export Dialog - Exact translation of Stitch Screen 4
 * Preserves Stitch layout: Close button top-right, 2-column grid, format cards
 */
export function WBSExportDialog({ 
  open, 
  onOpenChange, 
  projectName,
  onExport,
  onGenerateGantt 
}: WBSExportDialogProps) {
  const { toast } = useToast();
  const [publicLinkEnabled, setPublicLinkEnabled] = useState(false);
  const [shareLink] = useState(`https://nbcon.org/share/wbs/${Math.random().toString(36).substring(7)}`);

  const handleExport = (format: 'pdf' | 'png' | 'csv' | 'json') => {
    onExport(format);
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Generating ${projectName}.${format}...`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Match Stitch: Centered modal with close button in corner */}
      <DialogContent className="max-w-4xl p-0 gap-0">
        {/* Close button - Stitch style: absolute top-right */}
        <DialogClose className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-50">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Two-column layout - exact Stitch structure */}
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
          
          {/* Left Column: Export Options */}
          <div className="flex w-full md:w-1/2 flex-col p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold leading-tight tracking-tight">
                Export Project
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Export your Work Breakdown Structure in various formats.
              </p>
            </div>

            {/* Format Grid - Stitch: 2x2 grid with hover states */}
            <div className="grid grid-cols-2 gap-3">
              {/* PDF */}
              <button
                onClick={() => handleExport('pdf')}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-primary/5"
              >
                <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-base font-bold">PDF</h4>
                  <p className="text-sm text-muted-foreground">Document format</p>
                </div>
              </button>

              {/* PNG */}
              <button
                onClick={() => handleExport('png')}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-primary/5"
              >
                <Image className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-base font-bold">PNG</h4>
                  <p className="text-sm text-muted-foreground">Image format</p>
                </div>
              </button>

              {/* CSV */}
              <button
                onClick={() => handleExport('csv')}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-primary/5"
              >
                <Table className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-base font-bold">CSV</h4>
                  <p className="text-sm text-muted-foreground">Spreadsheet format</p>
                </div>
              </button>

              {/* JSON */}
              <button
                onClick={() => handleExport('json')}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-primary/5"
              >
                <Code className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-base font-bold">JSON</h4>
                  <p className="text-sm text-muted-foreground">Data format</p>
                </div>
              </button>
            </div>

            {/* Gantt Chart Button - Stitch: full-width secondary button */}
            <Button
              variant="outline"
              className="w-full h-10 text-sm font-bold"
              onClick={onGenerateGantt}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Gantt Chart View
            </Button>
          </div>

          {/* Right Column: Share Link */}
          <div className="flex w-full md:w-1/2 flex-col p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold leading-tight tracking-tight">
                Share a Link
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a shareable, view-only link to your project.
              </p>
            </div>

            {/* Toggle - Stitch: label + switch */}
            <div className="flex items-center justify-between">
              <label htmlFor="share-toggle" className="font-medium cursor-pointer">
                Enable public link
              </label>
              <Switch
                id="share-toggle"
                checked={publicLinkEnabled}
                onCheckedChange={setPublicLinkEnabled}
              />
            </div>

            {/* Share Link Input - Stitch: input with embedded copy button */}
            <div className="flex flex-col gap-2">
              <div className="relative flex h-10 w-full items-center">
                <Input
                  value={shareLink}
                  readOnly
                  disabled={!publicLinkEnabled}
                  className="h-full w-full rounded-lg border pr-24 bg-muted/50"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-1 h-8 px-3 text-sm font-medium"
                  onClick={handleCopyLink}
                  disabled={!publicLinkEnabled}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

