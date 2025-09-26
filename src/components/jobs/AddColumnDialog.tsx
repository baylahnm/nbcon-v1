import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Layout, 
  Info, 
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useKanbanStore, KanbanColumn } from './hooks/useKanbanStore';

interface AddColumnDialogProps {
  trigger?: React.ReactNode;
}

export function AddColumnDialog({ trigger }: AddColumnDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const { toast } = useToast();
  const { columns, addColumn } = useKanbanStore();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setColumnTitle('');
    }
  }, [open]);

  // Validation
  const validateColumnTitle = (title: string): string | null => {
    if (!title.trim()) {
      return 'Column title is required';
    }
    
    if (title.trim().length < 2) {
      return 'Column title must be at least 2 characters';
    }
    
    if (title.trim().length > 50) {
      return 'Column title must be less than 50 characters';
    }

    // Check for duplicates (case-insensitive)
    const existingTitles = columns.map(col => col.title.toLowerCase());
    if (existingTitles.includes(title.trim().toLowerCase())) {
      return 'A column with this name already exists';
    }

    return null;
  };

  const error = validateColumnTitle(columnTitle);
  const isValid = !error && columnTitle.trim().length > 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: error || "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newColumnData: Omit<KanbanColumn, 'id' | 'createdAt' | 'updatedAt'> = {
        title: columnTitle.trim(),
        order: columns.length
      };

      addColumn(newColumnData);
      
      toast({
        title: "Column Created",
        description: `"${columnTitle.trim()}" column has been created successfully`,
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create column. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Default trigger button
  const defaultTrigger = (
    <Button variant="outline" size="sm" className="h-9">
      <Plus className="w-4 h-4 mr-2" />
      Add Column
    </Button>
  );

  // Column naming suggestions
  const namingSuggestions = [
    "Planning",
    "Design Review", 
    "Client Approval",
    "In Development",
    "Testing",
    "Ready for Deploy",
    "On Hold",
    "Blocked"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="fixed right-0 top-0 h-svh w-[50vw] max-w-none translate-x-0 translate-y-0 left-auto grid overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Add New Column
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Column Title Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnTitle">Column Title</Label>
              <Input
                id="columnTitle"
                placeholder="Enter column title..."
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                className={error ? 'border-destructive' : ''}
                maxLength={50}
                autoFocus
              />
              <div className="flex items-center justify-between text-xs">
                <span className={error ? 'text-destructive' : 'text-muted-foreground'}>
                  {error || `${columnTitle.length}/50 characters`}
                </span>
                {isValid && (
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Valid</span>
                  </div>
                )}
              </div>
            </div>

            {/* Naming Suggestions */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4" />
                Suggested Names
              </Label>
              <div className="flex flex-wrap gap-2">
                {namingSuggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setColumnTitle(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Column Preview */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Column Preview
            </Label>
            
            <Card className="border-sidebar-border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">
                        {columnTitle || 'Column Title'}
                      </h3>
                      <span className="text-sm text-muted-foreground">(0)</span>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="min-h-[120px] border-2 border-dashed border-sidebar-border rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Layout className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {columnTitle ? `"${columnTitle}" column` : 'New column will appear here'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tasks can be moved to this column
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Best Practices Tips */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              Best Practices
            </Label>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Use clear, descriptive names that indicate the task status or workflow stage</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Keep column names concise (2-50 characters) for better readability</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Consider your team's workflow when naming columns</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>You can edit column names later by clicking on the column header</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Column'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
