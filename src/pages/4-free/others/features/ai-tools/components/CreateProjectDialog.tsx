import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/pages/1-HomePage/others/components/ui/dialog';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { Loader2, Building2, MapPin, DollarSign, Calendar, FolderPlus } from 'lucide-react';
import { useProjectStore, type CreateProjectInput } from '../../../stores/useProjectStore';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (project: any) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onSuccess }: CreateProjectDialogProps) {
  const { createProject, isLoading } = useProjectStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: '',
    project_type: 'construction',
    location: '',
    start_date: '',
    end_date: '',
    budget: undefined,
    currency: 'SAR',
    status: 'planning'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newProject = await createProject(formData);
      
      toast({
        title: 'Success!',
        description: `Project "${newProject.name}" created successfully`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        project_type: 'construction',
        location: '',
        start_date: '',
        end_date: '',
        budget: undefined,
        currency: 'SAR',
        status: 'planning'
      });
      setErrors({});

      // Call success callback
      onSuccess?.(newProject);
      
      // Close dialog
      onOpenChange(false);

    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      project_type: 'construction',
      location: '',
      start_date: '',
      end_date: '',
      budget: undefined,
      currency: 'SAR',
      status: 'planning'
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <FolderPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new project to your workspace
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="e.g., Riyadh Office Complex"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`pl-9 ${errors.name ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[80px] resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Project Type & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_type" className="text-xs font-medium">
                  Project Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(value: any) => setFormData({ ...formData, project_type: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="project_type" className="border-input">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="status" className="border-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-medium">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Riyadh, Saudi Arabia"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-xs font-medium">
                  Start Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="pl-9"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-xs font-medium">
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={`pl-9 ${errors.end_date ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.end_date && (
                  <p className="text-xs text-destructive">{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Budget & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-xs font-medium">
                  Budget
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0.00"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className={`pl-9 ${errors.budget ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.budget && (
                  <p className="text-xs text-destructive">{errors.budget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-xs font-medium">
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="currency" className="border-input">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name}
              className="h-8 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

